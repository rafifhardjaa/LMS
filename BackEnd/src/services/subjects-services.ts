import { and, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { db } from "../db";
import {
  enrollments,
  gradeLevels,
  majors,
  modules,
  subjects,
  teacherSubjects,
  users,
} from "../db/schema";
import { canonicalRole } from "./role-service";
import { BadRequestError, NotFoundError } from "../utils/response";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function assertUuid(id: string) {
  if (!UUID_RE.test(id)) {
    throw new BadRequestError("ID tidak valid");
  }
}

function isUniqueViolation(err: unknown) {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: unknown }).code === "23505"
  );
}

function isForeignKeyViolation(err: unknown) {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: unknown }).code === "23503"
  );
}

export type Actor = { id: string; role: string };

export type SubjectFilters = {
  majorId?: string;
  gradeLevelId?: string;
  semester?: string;
  q?: string;
  includeInactive?: boolean;
};

export type SubjectInput = {
  name: string;
  code: string;
  description?: string | null;
  majorId?: string | null;
  gradeLevelId: string;
  semester?: string;
  isActive?: boolean;
};

const subjectColumns = {
  id: subjects.id,
  name: subjects.name,
  code: subjects.code,
  description: subjects.description,
  majorId: subjects.majorId,
  majorCode: majors.code,
  majorName: majors.name,
  gradeLevelId: subjects.gradeLevelId,
  gradeCode: gradeLevels.code,
  gradeName: gradeLevels.name,
  semester: subjects.semester,
  isActive: subjects.isActive,
  createdBy: subjects.createdBy,
  createdByName: users.fullName,
  createdAt: subjects.createdAt,
  updatedAt: subjects.updatedAt,
};

function normalize(input: SubjectInput) {
  const name = input.name?.trim();
  const code = input.code?.trim();
  if (!name) throw new BadRequestError("Nama mata pelajaran wajib diisi");
  if (!code) throw new BadRequestError("Kode mata pelajaran wajib diisi");
  if (!input.gradeLevelId) throw new BadRequestError("Tingkatan wajib dipilih");
  if (input.majorId) assertUuid(input.majorId);
  assertUuid(input.gradeLevelId);

  return {
    name,
    code,
    description: input.description?.trim() || null,
    majorId: input.majorId ?? null,
    gradeLevelId: input.gradeLevelId,
    semester: input.semester?.trim() || "Ganjil",
    isActive: input.isActive ?? true,
  };
}

export async function listSubjects(
  filters: SubjectFilters = {},
  actor?: Actor
) {
  const conditions: SQL[] = [];

  if (!filters.includeInactive) {
    conditions.push(eq(subjects.isActive, true));
  }
  if (filters.majorId) {
    assertUuid(filters.majorId);
    conditions.push(eq(subjects.majorId, filters.majorId));
  }
  if (filters.gradeLevelId) {
    assertUuid(filters.gradeLevelId);
    conditions.push(eq(subjects.gradeLevelId, filters.gradeLevelId));
  }
  if (filters.semester) {
    conditions.push(eq(subjects.semester, filters.semester));
  }
  if (filters.q?.trim()) {
    const pattern = `%${filters.q.trim()}%`;
    const search = or(
      ilike(subjects.name, pattern),
      ilike(subjects.code, pattern)
    );
    if (search) conditions.push(search);
  }

  if (actor) {
    const role = canonicalRole(actor.role);
    if (role === "guru") {
      conditions.push(
        sql`exists (select 1 from teacher_subjects ts where ts.subject_id = ${subjects.id} and ts.teacher_id = ${actor.id})`
      );
    } else if (role === "siswa") {
      conditions.push(
        sql`exists (
          select 1 from users u
          join classes c on c.id = u.class_id
          where u.id = ${actor.id}
            and c.grade_level_id = ${subjects.gradeLevelId}
            and (${subjects.majorId} is null or ${subjects.majorId} = c.major_id)
        )`
      );
    }
  }

  return db
    .select(subjectColumns)
    .from(subjects)
    .leftJoin(majors, eq(subjects.majorId, majors.id))
    .leftJoin(gradeLevels, eq(subjects.gradeLevelId, gradeLevels.id))
    .leftJoin(users, eq(subjects.createdBy, users.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(gradeLevels.code, majors.code, subjects.name);
}

export async function getSubject(id: string) {
  assertUuid(id);
  const rows = await db
    .select(subjectColumns)
    .from(subjects)
    .leftJoin(majors, eq(subjects.majorId, majors.id))
    .leftJoin(gradeLevels, eq(subjects.gradeLevelId, gradeLevels.id))
    .leftJoin(users, eq(subjects.createdBy, users.id))
    .where(eq(subjects.id, id))
    .limit(1);

  const subject = rows[0];
  if (!subject) throw new NotFoundError("Mata pelajaran tidak ditemukan");
  return subject;
}

export async function createSubject(
  input: SubjectInput & { createdBy: string }
) {
  const values = normalize(input);
  try {
    const rows = await db
      .insert(subjects)
      .values({ ...values, createdBy: input.createdBy })
      .returning({ id: subjects.id });
    const created = rows[0];
    if (!created) throw new BadRequestError("Gagal membuat mata pelajaran");
    return getSubject(created.id);
  } catch (err) {
    if (isUniqueViolation(err)) {
      throw new BadRequestError(
        "Kode mapel sudah digunakan untuk kombinasi tingkatan, semester, dan tahun ajaran tersebut"
      );
    }
    if (isForeignKeyViolation(err)) {
      throw new BadRequestError("Jurusan atau tingkatan tidak ditemukan");
    }
    throw err;
  }
}

export async function updateSubject(
  id: string,
  patch: Partial<SubjectInput>
) {
  assertUuid(id);

  const values: Record<string, unknown> = { updatedAt: new Date() };
  if (patch.name !== undefined) {
    const name = patch.name.trim();
    if (!name) throw new BadRequestError("Nama mata pelajaran wajib diisi");
    values.name = name;
  }
  if (patch.code !== undefined) {
    const code = patch.code.trim();
    if (!code) throw new BadRequestError("Kode mata pelajaran wajib diisi");
    values.code = code;
  }
  if (patch.description !== undefined) {
    values.description = patch.description?.trim() || null;
  }
  if (patch.majorId !== undefined) {
    if (patch.majorId) assertUuid(patch.majorId);
    values.majorId = patch.majorId ?? null;
  }
  if (patch.gradeLevelId !== undefined) {
    assertUuid(patch.gradeLevelId);
    values.gradeLevelId = patch.gradeLevelId;
  }
  if (patch.semester !== undefined) {
    values.semester = patch.semester.trim() || "Ganjil";
  }
  if (patch.isActive !== undefined) {
    values.isActive = patch.isActive;
  }

  try {
    const rows = await db
      .update(subjects)
      .set(values)
      .where(eq(subjects.id, id))
      .returning({ id: subjects.id });
    if (rows.length === 0) {
      throw new NotFoundError("Mata pelajaran tidak ditemukan");
    }
    return getSubject(id);
  } catch (err) {
    if (err instanceof NotFoundError) throw err;
    if (isUniqueViolation(err)) {
      throw new BadRequestError(
        "Kode mapel sudah digunakan untuk kombinasi tingkatan, semester, dan tahun ajaran tersebut"
      );
    }
    if (isForeignKeyViolation(err)) {
      throw new BadRequestError("Jurusan atau tingkatan tidak ditemukan");
    }
    throw err;
  }
}

export async function deleteSubject(id: string) {
  assertUuid(id);

  const [moduleCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(modules)
    .where(eq(modules.subjectId, id));
  const [enrollmentCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(enrollments)
    .where(eq(enrollments.subjectId, id));
  const [teacherCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(teacherSubjects)
    .where(eq(teacherSubjects.subjectId, id));

  if (
    (moduleCount?.count ?? 0) > 0 ||
    (enrollmentCount?.count ?? 0) > 0 ||
    (teacherCount?.count ?? 0) > 0
  ) {
    throw new BadRequestError(
      "Mata pelajaran masih memiliki data terkait (modul, enrollment, atau pengajar). Nonaktifkan saja."
    );
  }

  const rows = await db
    .delete(subjects)
    .where(eq(subjects.id, id))
    .returning({ id: subjects.id });
  if (rows.length === 0) {
    throw new NotFoundError("Mata pelajaran tidak ditemukan");
  }
}
