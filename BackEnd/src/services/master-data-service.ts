import { and, eq, sql, type SQL } from "drizzle-orm";
import { db } from "../db";
import {
  classes,
  gradeLevels,
  majors,
  roles,
  subjects,
  teacherClassrooms,
  teacherSubjects,
  userRoles,
  users,
} from "../db/schema";
import { BadRequestError, NotFoundError } from "../utils/response";
import { normalizeNomorInduk, normalizeTanggalLahir } from "../lib/password";

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

async function countWhere(
  table: "classes" | "subjects" | "users" | "teacher_classrooms",
  column: string,
  value: string
) {
  const result = await db.execute(
    sql.raw(
      `select count(*)::int as count from ${table} where ${column} = '${value.replace(
        /'/g,
        "''"
      )}'`
    )
  );
  const rows = result as unknown as { count: number }[];
  return rows[0]?.count ?? 0;
}

// ── Jurusan ──────────────────────────────────────────────────────────

export type MajorInput = { code: string; name: string; isActive?: boolean };

export async function listMajors(includeInactive = false) {
  return db
    .select({
      id: majors.id,
      code: majors.code,
      name: majors.name,
      isActive: majors.isActive,
      classCount: sql<number>`(select count(*)::int from classes c where c.major_id = ${majors.id})`,
      subjectCount: sql<number>`(select count(*)::int from subjects s where s.major_id = ${majors.id})`,
      createdAt: majors.createdAt,
      updatedAt: majors.updatedAt,
    })
    .from(majors)
    .where(includeInactive ? undefined : eq(majors.isActive, true))
    .orderBy(majors.code);
}

export async function createMajor(input: MajorInput) {
  const code = input.code?.trim().toUpperCase();
  const name = input.name?.trim();
  if (!code) throw new BadRequestError("Kode jurusan wajib diisi");
  if (!name) throw new BadRequestError("Nama jurusan wajib diisi");

  try {
    const rows = await db
      .insert(majors)
      .values({ code, name, isActive: input.isActive ?? true })
      .returning({ id: majors.id });
    const created = rows[0];
    if (!created) throw new BadRequestError("Gagal membuat jurusan");
    return created;
  } catch (err) {
    if (isUniqueViolation(err)) {
      throw new BadRequestError("Kode jurusan sudah digunakan");
    }
    throw err;
  }
}

export async function updateMajor(
  id: string,
  patch: Partial<MajorInput>
) {
  assertUuid(id);
  const values: Record<string, unknown> = { updatedAt: new Date() };
  if (patch.code !== undefined) {
    const code = patch.code.trim().toUpperCase();
    if (!code) throw new BadRequestError("Kode jurusan wajib diisi");
    values.code = code;
  }
  if (patch.name !== undefined) {
    const name = patch.name.trim();
    if (!name) throw new BadRequestError("Nama jurusan wajib diisi");
    values.name = name;
  }
  if (patch.isActive !== undefined) values.isActive = patch.isActive;

  try {
    const rows = await db
      .update(majors)
      .set(values)
      .where(eq(majors.id, id))
      .returning({ id: majors.id });
    if (rows.length === 0) throw new NotFoundError("Jurusan tidak ditemukan");
    return rows[0];
  } catch (err) {
    if (err instanceof NotFoundError) throw err;
    if (isUniqueViolation(err)) {
      throw new BadRequestError("Kode jurusan sudah digunakan");
    }
    throw err;
  }
}

export async function deleteMajor(id: string) {
  assertUuid(id);
  const [classCount, subjectCount] = await Promise.all([
    countWhere("classes", "major_id", id),
    countWhere("subjects", "major_id", id),
  ]);
  if (classCount > 0 || subjectCount > 0) {
    throw new BadRequestError(
      "Jurusan masih memiliki kelas atau mata pelajaran terkait. Nonaktifkan saja."
    );
  }
  const rows = await db
    .delete(majors)
    .where(eq(majors.id, id))
    .returning({ id: majors.id });
  if (rows.length === 0) throw new NotFoundError("Jurusan tidak ditemukan");
}

// ── Tingkatan ────────────────────────────────────────────────────────

export type GradeLevelInput = {
  code: string;
  name: string;
  isActive?: boolean;
};

export async function listGradeLevels(includeInactive = false) {
  return db
    .select({
      id: gradeLevels.id,
      code: gradeLevels.code,
      name: gradeLevels.name,
      isActive: gradeLevels.isActive,
      classCount: sql<number>`(select count(*)::int from classes c where c.grade_level_id = ${gradeLevels.id})`,
      subjectCount: sql<number>`(select count(*)::int from subjects s where s.grade_level_id = ${gradeLevels.id})`,
      createdAt: gradeLevels.createdAt,
      updatedAt: gradeLevels.updatedAt,
    })
    .from(gradeLevels)
    .where(includeInactive ? undefined : eq(gradeLevels.isActive, true))
    .orderBy(gradeLevels.code);
}

export async function createGradeLevel(input: GradeLevelInput) {
  const code = input.code?.trim().toUpperCase();
  const name = input.name?.trim();
  if (!code) throw new BadRequestError("Kode tingkatan wajib diisi");
  if (!name) throw new BadRequestError("Nama tingkatan wajib diisi");

  try {
    const rows = await db
      .insert(gradeLevels)
      .values({ code, name, isActive: input.isActive ?? true })
      .returning({ id: gradeLevels.id });
    const created = rows[0];
    if (!created) throw new BadRequestError("Gagal membuat tingkatan");
    return created;
  } catch (err) {
    if (isUniqueViolation(err)) {
      throw new BadRequestError("Kode tingkatan sudah digunakan");
    }
    throw err;
  }
}

export async function updateGradeLevel(
  id: string,
  patch: Partial<GradeLevelInput>
) {
  assertUuid(id);
  const values: Record<string, unknown> = { updatedAt: new Date() };
  if (patch.code !== undefined) {
    const code = patch.code.trim().toUpperCase();
    if (!code) throw new BadRequestError("Kode tingkatan wajib diisi");
    values.code = code;
  }
  if (patch.name !== undefined) {
    const name = patch.name.trim();
    if (!name) throw new BadRequestError("Nama tingkatan wajib diisi");
    values.name = name;
  }
  if (patch.isActive !== undefined) values.isActive = patch.isActive;

  try {
    const rows = await db
      .update(gradeLevels)
      .set(values)
      .where(eq(gradeLevels.id, id))
      .returning({ id: gradeLevels.id });
    if (rows.length === 0) {
      throw new NotFoundError("Tingkatan tidak ditemukan");
    }
    return rows[0];
  } catch (err) {
    if (err instanceof NotFoundError) throw err;
    if (isUniqueViolation(err)) {
      throw new BadRequestError("Kode tingkatan sudah digunakan");
    }
    throw err;
  }
}

export async function deleteGradeLevel(id: string) {
  assertUuid(id);
  const [classCount, subjectCount] = await Promise.all([
    countWhere("classes", "grade_level_id", id),
    countWhere("subjects", "grade_level_id", id),
  ]);
  if (classCount > 0 || subjectCount > 0) {
    throw new BadRequestError(
      "Tingkatan masih memiliki kelas atau mata pelajaran terkait. Nonaktifkan saja."
    );
  }
  const rows = await db
    .delete(gradeLevels)
    .where(eq(gradeLevels.id, id))
    .returning({ id: gradeLevels.id });
  if (rows.length === 0) throw new NotFoundError("Tingkatan tidak ditemukan");
}

// ── Kelas ────────────────────────────────────────────────────────────

export type ClassInput = {
  name: string;
  section: string;
  majorId: string;
  gradeLevelId: string;
  capacity?: number;
  isActive?: boolean;
};

const classColumns = {
  id: classes.id,
  name: classes.name,
  section: classes.section,
  majorId: classes.majorId,
  majorCode: majors.code,
  majorName: majors.name,
  gradeLevelId: classes.gradeLevelId,
  gradeCode: gradeLevels.code,
  gradeName: gradeLevels.name,
  capacity: classes.capacity,
  isActive: classes.isActive,
  studentCount: sql<number>`(select count(*)::int from users u where u.class_id = ${classes.id})`,
  teacherCount: sql<number>`(select count(*)::int from teacher_classrooms tc where tc.class_id = ${classes.id})`,
  createdAt: classes.createdAt,
  updatedAt: classes.updatedAt,
};

export type ClassFilters = {
  majorId?: string;
  gradeLevelId?: string;
  q?: string;
  includeInactive?: boolean;
};

export async function listClasses(filters: ClassFilters = {}) {
  const conditions: SQL[] = [];
  if (!filters.includeInactive) conditions.push(eq(classes.isActive, true));
  if (filters.majorId) conditions.push(eq(classes.majorId, filters.majorId));
  if (filters.gradeLevelId) {
    conditions.push(eq(classes.gradeLevelId, filters.gradeLevelId));
  }
  if (filters.q?.trim()) {
    conditions.push(
      sql`(${classes.name} ilike ${`%${filters.q.trim()}%`} or ${classes.section} ilike ${`%${filters.q.trim()}%`})`
    );
  }

  return db
    .select(classColumns)
    .from(classes)
    .leftJoin(majors, eq(classes.majorId, majors.id))
    .leftJoin(gradeLevels, eq(classes.gradeLevelId, gradeLevels.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(gradeLevels.code, majors.code, classes.name);
}

export async function getClass(id: string) {
  assertUuid(id);
  const rows = await db
    .select(classColumns)
    .from(classes)
    .leftJoin(majors, eq(classes.majorId, majors.id))
    .leftJoin(gradeLevels, eq(classes.gradeLevelId, gradeLevels.id))
    .where(eq(classes.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) throw new NotFoundError("Kelas tidak ditemukan");
  return row;
}

async function assertClassNameAvailable(
  name: string,
  majorId: string,
  gradeLevelId: string,
  excludeId?: string
) {
  const conditions: SQL[] = [
    eq(classes.name, name),
    eq(classes.majorId, majorId),
    eq(classes.gradeLevelId, gradeLevelId),
  ];
  if (excludeId) conditions.push(sql`${classes.id} <> ${excludeId}`);
  const rows = await db
    .select({ id: classes.id })
    .from(classes)
    .where(and(...conditions))
    .limit(1);
  if (rows.length > 0) {
    throw new BadRequestError(
      "Nama kelas sudah ada pada jurusan dan tingkatan yang sama"
    );
  }
}

export async function createClass(input: ClassInput) {
  const name = input.name?.trim();
  const section = input.section?.trim();
  if (!name) throw new BadRequestError("Nama kelas wajib diisi");
  if (!section) throw new BadRequestError("Section kelas wajib diisi");
  if (!input.majorId) throw new BadRequestError("Jurusan wajib dipilih");
  if (!input.gradeLevelId) throw new BadRequestError("Tingkatan wajib dipilih");
  assertUuid(input.majorId);
  assertUuid(input.gradeLevelId);

  const capacity = Math.max(1, Math.floor(input.capacity ?? 10));
  await assertClassNameAvailable(name, input.majorId, input.gradeLevelId);

  try {
    const rows = await db
      .insert(classes)
      .values({
        name,
        section,
        majorId: input.majorId,
        gradeLevelId: input.gradeLevelId,
        capacity,
        isActive: input.isActive ?? true,
      })
      .returning({ id: classes.id });
    const created = rows[0];
    if (!created) throw new BadRequestError("Gagal membuat kelas");
    return getClass(created.id);
  } catch (err) {
    if (isForeignKeyViolation(err)) {
      throw new BadRequestError("Jurusan atau tingkatan tidak ditemukan");
    }
    throw err;
  }
}

export async function updateClass(id: string, patch: Partial<ClassInput>) {
  assertUuid(id);
  const current = await db
    .select({
      name: classes.name,
      section: classes.section,
      majorId: classes.majorId,
      gradeLevelId: classes.gradeLevelId,
    })
    .from(classes)
    .where(eq(classes.id, id))
    .limit(1);
  const existing = current[0];
  if (!existing) throw new NotFoundError("Kelas tidak ditemukan");

  const values: Record<string, unknown> = { updatedAt: new Date() };
  if (patch.name !== undefined) {
    const name = patch.name.trim();
    if (!name) throw new BadRequestError("Nama kelas wajib diisi");
    values.name = name;
  }
  if (patch.section !== undefined) {
    const section = patch.section.trim();
    if (!section) throw new BadRequestError("Section kelas wajib diisi");
    values.section = section;
  }
  if (patch.majorId !== undefined) {
    assertUuid(patch.majorId);
    values.majorId = patch.majorId;
  }
  if (patch.gradeLevelId !== undefined) {
    assertUuid(patch.gradeLevelId);
    values.gradeLevelId = patch.gradeLevelId;
  }
  if (patch.capacity !== undefined) {
    values.capacity = Math.max(1, Math.floor(patch.capacity));
  }
  if (patch.isActive !== undefined) values.isActive = patch.isActive;

  const nextName = (values.name as string | undefined) ?? existing.name;
  const nextMajor = (values.majorId as string | undefined) ?? existing.majorId;
  const nextGrade =
    (values.gradeLevelId as string | undefined) ?? existing.gradeLevelId;
  await assertClassNameAvailable(nextName, nextMajor, nextGrade, id);

  try {
    const rows = await db
      .update(classes)
      .set(values)
      .where(eq(classes.id, id))
      .returning({ id: classes.id });
    if (rows.length === 0) throw new NotFoundError("Kelas tidak ditemukan");
    return getClass(id);
  } catch (err) {
    if (err instanceof NotFoundError) throw err;
    if (isForeignKeyViolation(err)) {
      throw new BadRequestError("Jurusan atau tingkatan tidak ditemukan");
    }
    throw err;
  }
}

export async function deleteClass(id: string) {
  assertUuid(id);
  const [studentCount, teacherCount] = await Promise.all([
    countWhere("users", "class_id", id),
    countWhere("teacher_classrooms", "class_id", id),
  ]);
  if (studentCount > 0 || teacherCount > 0) {
    throw new BadRequestError(
      "Kelas masih memiliki siswa atau guru terkait. Nonaktifkan saja."
    );
  }
  const rows = await db
    .delete(classes)
    .where(eq(classes.id, id))
    .returning({ id: classes.id });
  if (rows.length === 0) throw new NotFoundError("Kelas tidak ditemukan");
}

// ── Daftar guru ──────────────────────────────────────────────────────

export async function listTeachers(
  q?: string,
  isActive?: string
) {
  const conditions: SQL[] = [eq(roles.name, "guru")];

  // Filter berdasarkan query pencarian
  if (q?.trim()) {
    const pattern = `%${q.trim()}%`;
    const search = sql`(${users.fullName} ilike ${pattern} or ${users.nomorInduk} ilike ${pattern})`;
    conditions.push(search);
  }

  // Filter berdasarkan status aktif
  if (isActive && isActive !== "Semua Status") {
    const activeVal = isActive === "Aktif" ? true : false;
    conditions.push(eq(users.isActive, activeVal));
  }

  return db
    .select({
      id: users.id,
      fullName: users.fullName,
      nomorInduk: users.nomorInduk,
      email: users.email,
      isActive: users.isActive,
      subjectCount: sql<number>`(select count(*)::int from teacher_subjects ts where ts.teacher_id = ${users.id})`,
      classCount: sql<number>`(select count(*)::int from teacher_classrooms tc where tc.teacher_id = ${users.id})`,
    })
    .from(users)
    .innerJoin(userRoles, eq(userRoles.userId, users.id))
    .innerJoin(roles, eq(roles.id, userRoles.roleId))
    .where(and(...conditions))
    .orderBy(users.fullName);
}

// ── Buat guru baru ───────────────────────────────────────────────────

export async function createTeacher(input: {
  fullName: string;
  nomorInduk: string;
  tanggalLahir: string;
  email?: string | null;
  major?: string | null;
  gradeLevelId?: string | null;
  semester?: string;
}) {
  const nomorInduk = normalizeNomorInduk(input.nomorInduk);
  const tanggalLahir = normalizeTanggalLahir(input.tanggalLahir);

  if (!nomorInduk) {
    throw new BadRequestError("Nomor induk wajib diisi");
  }

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.nomorInduk, nomorInduk))
    .limit(1);

  if (existing[0]) {
    throw new BadRequestError("Nomor induk sudah terdaftar di sekolah.");
  }

  if (input.email) {
    const emailTaken = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, input.email.toLowerCase()))
      .limit(1);
    if (emailTaken[0]) {
      throw new BadRequestError("Email sudah terdaftar");
    }
  }

  const email = input.email?.toLowerCase() || null;

  const created = await db
    .insert(users)
    .values({
      id: crypto.randomUUID(),
      fullName: input.fullName.trim(),
      nomorInduk,
      tanggalLahir,
      email,
      passwordHash: null,
      isActive: true,
      createdBy: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({ id: users.id, fullName: users.fullName, nomorInduk: users.nomorInduk, email: users.email });

  const roleId = await db
    .select({ id: roles.id })
    .from(roles)
    .where(eq(roles.name, "guru"))
    .limit(1)
    .then((rows) => rows[0]?.id);

  if (roleId) {
    await db.insert(userRoles).values({
      userId: created[0].id,
      roleId,
      assignedBy: "admin",
      assignedAt: new Date(),
    });
  }

  return {
    id: created[0].id,
    fullName: created[0].fullName,
    nomorInduk: created[0].nomorInduk,
    email: created[0].email,
  };
}

// ── Penugasan Guru (mapel & kelas) ───────────────────────────────────

async function assertTeacher(userId: string) {
  assertUuid(userId);
  const rows = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (rows.length === 0) throw new NotFoundError("Guru tidak ditemukan");
}

export type AssignmentFilters = {
  teacherId?: string;
  subjectId?: string;
  classId?: string;
};

export async function listTeacherSubjects(filters: AssignmentFilters = {}) {
  const conditions: SQL[] = [];
  if (filters.teacherId) conditions.push(eq(teacherSubjects.teacherId, filters.teacherId));
  if (filters.subjectId) conditions.push(eq(teacherSubjects.subjectId, filters.subjectId));

  return db
    .select({
      id: teacherSubjects.id,
      teacherId: teacherSubjects.teacherId,
      teacherName: users.fullName,
      teacherNip: users.nomorInduk,
      subjectId: teacherSubjects.subjectId,
      subjectName: subjects.name,
      subjectCode: subjects.code,
      assignedAt: teacherSubjects.assignedAt,
    })
    .from(teacherSubjects)
    .leftJoin(users, eq(teacherSubjects.teacherId, users.id))
    .leftJoin(subjects, eq(teacherSubjects.subjectId, subjects.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(users.fullName, subjects.name);
}

export async function assignTeacherSubject(input: {
  teacherId: string;
  subjectId: string;
}) {
  await assertTeacher(input.teacherId);
  assertUuid(input.subjectId);
  try {
    const rows = await db
      .insert(teacherSubjects)
      .values({ teacherId: input.teacherId, subjectId: input.subjectId })
      .returning({ id: teacherSubjects.id });
    return rows[0];
  } catch (err) {
    if (isUniqueViolation(err)) {
      throw new BadRequestError("Guru sudah ditugaskan pada mata pelajaran ini");
    }
    if (isForeignKeyViolation(err)) {
      throw new BadRequestError("Guru atau mata pelajaran tidak ditemukan");
    }
    throw err;
  }
}

export async function removeTeacherSubject(id: string) {
  assertUuid(id);
  const rows = await db
    .delete(teacherSubjects)
    .where(eq(teacherSubjects.id, id))
    .returning({ id: teacherSubjects.id });
  if (rows.length === 0) {
    throw new NotFoundError("Penugasan mata pelajaran tidak ditemukan");
  }
}

export async function listTeacherClassrooms(filters: AssignmentFilters = {}) {
  const conditions: SQL[] = [];
  if (filters.teacherId) {
    conditions.push(eq(teacherClassrooms.teacherId, filters.teacherId));
  }
  if (filters.classId) {
    conditions.push(eq(teacherClassrooms.classId, filters.classId));
  }

  return db
    .select({
      id: teacherClassrooms.id,
      teacherId: teacherClassrooms.teacherId,
      teacherName: users.fullName,
      teacherNip: users.nomorInduk,
      classId: teacherClassrooms.classId,
      className: classes.name,
      section: classes.section,
      majorCode: majors.code,
      gradeCode: gradeLevels.code,
      assignedAt: teacherClassrooms.assignedAt,
    })
    .from(teacherClassrooms)
    .leftJoin(users, eq(teacherClassrooms.teacherId, users.id))
    .leftJoin(classes, eq(teacherClassrooms.classId, classes.id))
    .leftJoin(majors, eq(classes.majorId, majors.id))
    .leftJoin(gradeLevels, eq(classes.gradeLevelId, gradeLevels.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(users.fullName, classes.name);
}

export async function assignTeacherClassroom(input: {
  teacherId: string;
  classId: string;
}) {
  await assertTeacher(input.teacherId);
  assertUuid(input.classId);
  try {
    const rows = await db
      .insert(teacherClassrooms)
      .values({ teacherId: input.teacherId, classId: input.classId })
      .returning({ id: teacherClassrooms.id });
    return rows[0];
  } catch (err) {
    if (isUniqueViolation(err)) {
      throw new BadRequestError("Guru sudah ditugaskan pada kelas ini");
    }
    if (isForeignKeyViolation(err)) {
      throw new BadRequestError("Guru atau kelas tidak ditemukan");
    }
    throw err;
  }
}

export async function removeTeacherClassroom(id: string) {
  assertUuid(id);
  const rows = await db
    .delete(teacherClassrooms)
    .where(eq(teacherClassrooms.id, id))
    .returning({ id: teacherClassrooms.id });
  if (rows.length === 0) {
    throw new NotFoundError("Penugasan kelas tidak ditemukan");
  }
}
