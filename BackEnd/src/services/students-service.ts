import { and, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { db } from "../db";
import {
  classes,
  enrollments,
  gradeLevels,
  majors,
  roles,
  userRoles,
  users,
} from "../db/schema";
import {
  buildDefaultPassword,
  hashPassword,
  normalizeNomorInduk,
  normalizeTanggalLahir,
} from "../lib/password";
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

export type StudentFilters = {
  q?: string;
  classId?: string;
  majorId?: string;
  gradeLevelId?: string;
  status?: "active" | "inactive" | "all";
};

export type StudentInput = {
  fullName: string;
  nomorInduk?: string;
  tanggalLahir?: string;
  email?: string | null;
  classId?: string | null;
  isActive?: boolean;
  password?: string;
};

export type Actor = { id: string; role: string };

const studentColumns = {
  id: users.id,
  fullName: users.fullName,
  nomorInduk: users.nomorInduk,
  email: users.email,
  tanggalLahir: users.tanggalLahir,
  kelas: users.kelas,
  classId: users.classId,
  className: classes.name,
  section: classes.section,
  majorId: classes.majorId,
  majorCode: majors.code,
  majorName: majors.name,
  gradeLevelId: classes.gradeLevelId,
  gradeCode: gradeLevels.code,
  gradeName: gradeLevels.name,
  isActive: users.isActive,
  passwordChangedAt: users.passwordChangedAt,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
};

export async function listStudents(
  filters: StudentFilters = {},
  actor?: Actor
) {
  const conditions: SQL[] = [eq(roles.name, "siswa")];

  if (filters.classId) {
    assertUuid(filters.classId);
    conditions.push(eq(users.classId, filters.classId));
  }
  if (filters.majorId) {
    assertUuid(filters.majorId);
    conditions.push(eq(classes.majorId, filters.majorId));
  }
  if (filters.gradeLevelId) {
    assertUuid(filters.gradeLevelId);
    conditions.push(eq(classes.gradeLevelId, filters.gradeLevelId));
  }
  if (filters.status === "active") {
    conditions.push(eq(users.isActive, true));
  } else if (filters.status === "inactive") {
    conditions.push(eq(users.isActive, false));
  }
  if (filters.q?.trim()) {
    const pattern = `%${filters.q.trim()}%`;
    const search = or(
      ilike(users.fullName, pattern),
      ilike(users.nomorInduk, pattern),
      ilike(users.email, pattern)
    );
    if (search) conditions.push(search);
  }

  if (actor && canonicalRole(actor.role) === "guru") {
    conditions.push(
      sql`exists (
        select 1 from teacher_classrooms tc
        where tc.teacher_id = ${actor.id} and tc.class_id = ${users.classId}
      )`
    );
  }

  return db
    .select(studentColumns)
    .from(users)
    .innerJoin(userRoles, eq(userRoles.userId, users.id))
    .innerJoin(roles, eq(roles.id, userRoles.roleId))
    .leftJoin(classes, eq(users.classId, classes.id))
    .leftJoin(majors, eq(classes.majorId, majors.id))
    .leftJoin(gradeLevels, eq(classes.gradeLevelId, gradeLevels.id))
    .where(and(...conditions))
    .orderBy(gradeLevels.code, classes.name, users.fullName);
}

export async function getStudent(id: string) {
  assertUuid(id);
  const rows = await db
    .select(studentColumns)
    .from(users)
    .innerJoin(userRoles, eq(userRoles.userId, users.id))
    .innerJoin(roles, eq(roles.id, userRoles.roleId))
    .leftJoin(classes, eq(users.classId, classes.id))
    .leftJoin(majors, eq(classes.majorId, majors.id))
    .leftJoin(gradeLevels, eq(classes.gradeLevelId, gradeLevels.id))
    .where(and(eq(users.id, id), eq(roles.name, "siswa")))
    .limit(1);

  const student = rows[0];
  if (!student) throw new NotFoundError("Siswa tidak ditemukan");
  return student;
}

async function resolveClass(classId?: string | null) {
  if (!classId) return null;
  assertUuid(classId);
  const rows = await db
    .select({ id: classes.id, name: classes.name })
    .from(classes)
    .where(eq(classes.id, classId))
    .limit(1);
  const row = rows[0];
  if (!row) throw new BadRequestError("Kelas tidak ditemukan");
  return row;
}

export async function createStudent(input: StudentInput) {
  const fullName = input.fullName?.trim();
  const nomorInduk = normalizeNomorInduk(input.nomorInduk ?? "");
  if (!fullName) throw new BadRequestError("Nama siswa wajib diisi");
  if (!nomorInduk) throw new BadRequestError("Nomor induk wajib diisi");
  if (!input.tanggalLahir) throw new BadRequestError("Tanggal lahir wajib diisi");

  const tanggalLahir = normalizeTanggalLahir(input.tanggalLahir);
  const email = input.email?.trim().toLowerCase() || null;
  const classRow = await resolveClass(input.classId);
  const plainPassword =
    input.password?.trim() ||
    buildDefaultPassword(tanggalLahir, nomorInduk);
  const passwordHash = await hashPassword(plainPassword);

  const siswaRole = await db
    .select({ id: roles.id })
    .from(roles)
    .where(eq(roles.name, "siswa"))
    .limit(1);
  const roleId = siswaRole[0]?.id;
  if (!roleId) throw new BadRequestError("Role siswa belum tersedia");

  try {
    const created = await db.transaction(async (tx) => {
      const inserted = await tx
        .insert(users)
        .values({
          fullName,
          nomorInduk,
          email,
          tanggalLahir,
          kelas: classRow?.name ?? null,
          classId: classRow?.id ?? null,
          passwordHash,
          isActive: input.isActive ?? true,
          passwordChangedAt: new Date(),
        })
        .returning({ id: users.id });

      const user = inserted[0];
      if (!user) throw new BadRequestError("Gagal membuat siswa");

      await tx.insert(userRoles).values({ userId: user.id, roleId });
      return user;
    });

    return getStudent(created.id);
  } catch (err) {
    if (isUniqueViolation(err)) {
      throw new BadRequestError("Nomor induk atau email sudah terdaftar");
    }
    throw err;
  }
}

export async function updateStudent(id: string, patch: StudentInput) {
  assertUuid(id);
  const existing = await getStudent(id);

  const values: Record<string, unknown> = { updatedAt: new Date() };

  if (patch.fullName !== undefined) {
    const fullName = patch.fullName.trim();
    if (!fullName) throw new BadRequestError("Nama siswa wajib diisi");
    values.fullName = fullName;
  }
  if (patch.email !== undefined) {
    values.email = patch.email?.trim().toLowerCase() || null;
  }
  if (patch.tanggalLahir !== undefined && patch.tanggalLahir !== null) {
    values.tanggalLahir = normalizeTanggalLahir(patch.tanggalLahir);
  }
  if (patch.classId !== undefined) {
    const classRow = await resolveClass(patch.classId);
    values.classId = classRow?.id ?? null;
    values.kelas = classRow?.name ?? null;
  }
  if (patch.isActive !== undefined) {
    values.isActive = patch.isActive;
  }

  try {
    const rows = await db
      .update(users)
      .set(values)
      .where(eq(users.id, id))
      .returning({ id: users.id });
    if (rows.length === 0) throw new NotFoundError("Siswa tidak ditemukan");
    return getStudent(existing.id);
  } catch (err) {
    if (err instanceof NotFoundError) throw err;
    if (isUniqueViolation(err)) {
      throw new BadRequestError("Email sudah terdaftar");
    }
    throw err;
  }
}

export async function deleteStudent(id: string) {
  assertUuid(id);
  await getStudent(id);

  const [enrollmentCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(enrollments)
    .where(eq(enrollments.studentId, id));
  if ((enrollmentCount?.count ?? 0) > 0) {
    throw new BadRequestError(
      "Siswa masih memiliki enrollment. Nonaktifkan saja."
    );
  }

  const rows = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning({ id: users.id });
  if (rows.length === 0) throw new NotFoundError("Siswa tidak ditemukan");
}

export async function getStudentStats(actor?: Actor) {
  const students = await listStudents({ status: "all" }, actor);
  const active = students.filter((s) => s.isActive).length;
  const needActivation = students.filter((s) => s.passwordChangedAt === null)
    .length;
  const classIds = new Set(students.map((s) => s.classId).filter(Boolean));
  return {
    total: students.length,
    active,
    inactive: students.length - active,
    needActivation,
    filledClasses: classIds.size,
  };
}
