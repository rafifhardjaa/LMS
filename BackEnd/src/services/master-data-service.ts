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
  jadwalPelajaran,
  users,
} from "../db/schema";
import { BadRequestError, NotFoundError } from "../utils/response";
import {
  buildDefaultPassword,
  hashPassword,
  normalizeNomorInduk,
  normalizeTanggalLahir,
} from "../lib/password";

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
      majorCode: sql<string>`(select m.code from teacher_classrooms tc join classes c on tc.class_id = c.id join majors m on m.id = c.major_id where tc.teacher_id = ${users.id} limit 1)`,
      majorName: sql<string>`(select m.name from teacher_classrooms tc join classes c on tc.class_id = c.id join majors m on m.id = c.major_id where tc.teacher_id = ${users.id} limit 1)`,
      subjects: sql<string>`(select string_agg(s.name, ', ' order by s.name) from teacher_subjects ts join subjects s on s.id = ts.subject_id where ts.teacher_id = ${users.id})`,
    })
    .from(users)
    .innerJoin(userRoles, eq(userRoles.userId, users.id))
    .innerJoin(roles, eq(roles.id, userRoles.roleId))
    .where(and(...conditions))
      .orderBy(users.fullName);
}

// ── Buat sesi jadwal pelajaran ──────────────────────────────────────────
const SESI_JAM: Record<number, { mulai: string; selesai: string }> = {
  1: { mulai: "07:00:00", selesai: "08:00:00" },
  2: { mulai: "08:00:00", selesai: "09:00:00" },
  3: { mulai: "09:15:00", selesai: "10:45:00" },
  4: { mulai: "10:45:00", selesai: "12:00:00" },
  5: { mulai: "12:15:00", selesai: "13:45:00" },
  6: { mulai: "13:45:00", selesai: "15:00:00" },
};
const HARI_VALID = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

export async function createJadwalPelajaran(input: {
  classId: string;
  subjectId: string;
  hari: string;
  sesi: number;
  durasi?: number;
}) {
  assertUuid(input.classId);
  assertUuid(input.subjectId);
  if (!HARI_VALID.includes(input.hari)) throw new BadRequestError("Hari tidak valid");
  const sesi = Number(input.sesi);
  if (!SESI_JAM[sesi]) throw new BadRequestError("Sesi harus 1-6");
  const durasi = input.durasi ? Number(input.durasi) : null;

  const [classRow] = await db
    .select({ id: classes.id, majorId: classes.majorId, gradeLevelId: classes.gradeLevelId, isActive: classes.isActive })
    .from(classes)
    .where(eq(classes.id, input.classId))
    .limit(1);
  if (!classRow) throw new NotFoundError("Kelas tidak ditemukan");
  if (!classRow.isActive) throw new BadRequestError("Kelas sudah tidak aktif");

  const [subjectRow] = await db
    .select({ id: subjects.id, majorId: subjects.majorId, gradeLevelId: subjects.gradeLevelId, isActive: subjects.isActive })
    .from(subjects)
    .where(eq(subjects.id, input.subjectId))
    .limit(1);
  if (!subjectRow) throw new NotFoundError("Mata pelajaran tidak ditemukan");
  if (!subjectRow.isActive) throw new BadRequestError("Mata pelajaran sudah tidak aktif");
  if (subjectRow.gradeLevelId !== classRow.gradeLevelId) throw new BadRequestError("Mata pelajaran tidak sesuai tingkatan kelas");
  if (subjectRow.majorId && subjectRow.majorId !== classRow.majorId) throw new BadRequestError("Mata pelajaran tidak sesuai jurusan kelas");

  const existing = await db
    .select({ id: jadwalPelajaran.id })
    .from(jadwalPelajaran)
    .where(and(eq(jadwalPelajaran.classId, input.classId), eq(jadwalPelajaran.hari, input.hari), eq(jadwalPelajaran.sesi, sesi)))
    .limit(1);
  if (existing[0]) throw new BadRequestError("Slot jadwal sudah terisi untuk kelas, hari, dan sesi tersebut (bentrok kelas).");

  const { mulai, selesai } = SESI_JAM[sesi]!;
  const [hourM = 0, minM = 0] = mulai.split(":").map(Number);
  const [hourS = 0, minS = 0] = selesai.split(":").map(Number);
  const computedDurasi = hourS * 60 + minS - (hourM * 60 + minM);
  const finalDurasi = durasi && [60, 75, 90].includes(durasi) ? durasi : computedDurasi;

  const rows = await db
    .insert(jadwalPelajaran)
    .values({
      classId: input.classId,
      subjectId: input.subjectId,
      gradeLevelId: classRow.gradeLevelId,
      majorId: classRow.majorId,
      hari: input.hari,
      sesi,
      mulai,
      selesai,
      durasi: finalDurasi,
      bentrokKelas: 0,
      durasiLebihDari90: finalDurasi > 90 ? 1 : 0,
      diLuarJamKerja: 0,
      jatuhDiIstirahat: 0,
    })
    .returning({ id: jadwalPelajaran.id });
  const created = rows[0];
  if (!created) throw new BadRequestError("Gagal membuat sesi jadwal");
  return created;
}

// ── Daftar jadwal pelajaran ────────────────────────────────────────────────
export async function removeJadwalPelajaran(id: string) {
  assertUuid(id);
  const rows = await db
    .delete(jadwalPelajaran)
    .where(eq(jadwalPelajaran.id, id))
    .returning({ id: jadwalPelajaran.id });
  if (rows.length === 0) throw new NotFoundError("Sesi jadwal pelajaran tidak ditemukan");
}

export async function updateJadwalPelajaran(
  id: string,
  input: { classId?: string; subjectId?: string; hari?: string; sesi?: number; durasi?: number }
) {
  assertUuid(id);
  const [existing] = await db
    .select({ id: jadwalPelajaran.id, classId: jadwalPelajaran.classId, subjectId: jadwalPelajaran.subjectId, hari: jadwalPelajaran.hari, sesi: jadwalPelajaran.sesi, durasi: jadwalPelajaran.durasi })
    .from(jadwalPelajaran)
    .where(eq(jadwalPelajaran.id, id))
    .limit(1);
  if (!existing) throw new NotFoundError("Sesi jadwal pelajaran tidak ditemukan");

  const values: Record<string, unknown> = { updatedAt: new Date() };
  const nextClassId = input.classId ?? existing.classId;
  const nextSubjectId = input.subjectId ?? existing.subjectId;
  const nextHari = input.hari ?? existing.hari;
  const nextSesi = input.sesi ?? existing.sesi;
  if (input.classId) { assertUuid(input.classId); values.classId = input.classId; }
  if (input.subjectId) { assertUuid(input.subjectId); values.subjectId = input.subjectId; }
  if (input.hari !== undefined) {
    if (!HARI_VALID.includes(input.hari)) throw new BadRequestError("Hari tidak valid");
    values.hari = input.hari;
  }
  if (input.sesi !== undefined) {
    const sesi = Number(input.sesi);
    if (!SESI_JAM[sesi]) throw new BadRequestError("Sesi harus 1-6");
    values.sesi = sesi;
    values.mulai = SESI_JAM[sesi]!.mulai;
    values.selesai = SESI_JAM[sesi]!.selesai;
  }
  if (input.classId || input.subjectId || input.hari !== undefined || input.sesi !== undefined) {
    const [classRow] = await db.select({ id: classes.id, majorId: classes.majorId, gradeLevelId: classes.gradeLevelId }).from(classes).where(eq(classes.id, nextClassId)).limit(1);
    if (!classRow) throw new NotFoundError("Kelas tidak ditemukan");
    const [subjectRow] = await db.select({ id: subjects.id, majorId: subjects.majorId, gradeLevelId: subjects.gradeLevelId }).from(subjects).where(eq(subjects.id, nextSubjectId)).limit(1);
    if (!subjectRow) throw new NotFoundError("Mata pelajaran tidak ditemukan");
    if (subjectRow.gradeLevelId !== classRow.gradeLevelId) throw new BadRequestError("Mata pelajaran tidak sesuai tingkatan kelas");
    if (subjectRow.majorId && subjectRow.majorId !== classRow.majorId) throw new BadRequestError("Mata pelajaran tidak sesuai jurusan kelas");
    values.gradeLevelId = classRow.gradeLevelId;
    values.majorId = classRow.majorId;
    const clash = await db
      .select({ id: jadwalPelajaran.id })
      .from(jadwalPelajaran)
      .where(and(eq(jadwalPelajaran.classId, nextClassId), eq(jadwalPelajaran.hari, nextHari), eq(jadwalPelajaran.sesi, nextSesi)))
      .limit(1);
    if (clash[0] && clash[0].id !== id) throw new BadRequestError("Slot jadwal sudah terisi untuk kelas, hari, dan sesi tersebut (bentrok kelas).");
  }
  if (input.durasi !== undefined) {
    const durasi = Number(input.durasi);
    if (![60, 75, 90].includes(durasi)) throw new BadRequestError("Durasi harus 60, 75, atau 90 menit");
    values.durasi = durasi;
    values.durasiLebihDari90 = durasi > 90 ? 1 : 0;
  } else if (input.sesi !== undefined) {
    const { mulai, selesai } = SESI_JAM[Number(input.sesi)]!;
    const [hM = 0, mM = 0] = mulai.split(":").map(Number);
    const [hS = 0, mS = 0] = selesai.split(":").map(Number);
    values.durasi = hS * 60 + mS - (hM * 60 + mM);
  }
  const rows = await db.update(jadwalPelajaran).set(values).where(eq(jadwalPelajaran.id, id)).returning({ id: jadwalPelajaran.id });
  const updated = rows[0];
  if (!updated) throw new BadRequestError("Gagal memperbarui sesi jadwal pelajaran");
  return updated;
}

export async function listJadwalPelajaran(filters: {
  classId?: string;
  gradeLevelId?: string;
  majorId?: string;
  hari?: string;
}) {
  const conditions: SQL[] = [];

  if (filters.classId) conditions.push(eq(jadwalPelajaran.classId, filters.classId));
  if (filters.gradeLevelId) conditions.push(eq(jadwalPelajaran.gradeLevelId, filters.gradeLevelId));
  if (filters.majorId) conditions.push(eq(jadwalPelajaran.majorId, filters.majorId));
  if (filters.hari) conditions.push(eq(jadwalPelajaran.hari, filters.hari));

  return db
    .select({
      id: jadwalPelajaran.id,
      classId: jadwalPelajaran.classId,
      className: classes.name,
      classSection: classes.section,
      subjectId: jadwalPelajaran.subjectId,
      subjectName: subjects.name,
      subjectCode: subjects.code,
      gradeLevelId: jadwalPelajaran.gradeLevelId,
      gradeCode: gradeLevels.code,
      majorId: jadwalPelajaran.majorId,
      majorCode: majors.code,
      majorName: majors.name,
      hari: jadwalPelajaran.hari,
      sesi: jadwalPelajaran.sesi,
      waktuMulai: jadwalPelajaran.mulai,
      waktuSelesai: jadwalPelajaran.selesai,
      durasi: jadwalPelajaran.durasi,
      bentrokKelas: jadwalPelajaran.bentrokKelas,
      durasiLebihDari90: jadwalPelajaran.durasiLebihDari90,
      diLuarJamKerja: jadwalPelajaran.diLuarJamKerja,
      jatuhDiIstirahat: jadwalPelajaran.jatuhDiIstirahat,
      createdAt: jadwalPelajaran.createdAt,
      updatedAt: jadwalPelajaran.updatedAt,
    })
    .from(jadwalPelajaran)
    .innerJoin(classes, eq(jadwalPelajaran.classId, classes.id))
    .innerJoin(subjects, eq(jadwalPelajaran.subjectId, subjects.id))
    .innerJoin(gradeLevels, eq(jadwalPelajaran.gradeLevelId, gradeLevels.id))
    .innerJoin(majors, eq(jadwalPelajaran.majorId, majors.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(classes.name, jadwalPelajaran.hari, jadwalPelajaran.sesi);
}

// ── Buat guru baru ───────────────────────────────────────────────────

export async function createTeacher(input: {
  fullName: string;
  nomorInduk: string;
  tanggalLahir: string;
  email?: string | null;
  majorId?: string | null;
  gradeLevelId?: string | null;
  subjectId?: string | null;
}) {
  const fullName = input.fullName?.trim();
  if (!fullName) {
    throw new BadRequestError("Nama lengkap wajib diisi");
  }

  const nomorInduk = normalizeNomorInduk(input.nomorInduk);
  const tanggalLahir = normalizeTanggalLahir(input.tanggalLahir);

  if (!nomorInduk) {
    throw new BadRequestError("Nomor induk wajib diisi");
  }

  if (input.majorId) assertUuid(input.majorId);
  if (input.gradeLevelId) assertUuid(input.gradeLevelId);

  if (input.subjectId) {
    assertUuid(input.subjectId);

    const subjectRows = await db
      .select({
        id: subjects.id,
        majorId: subjects.majorId,
        gradeLevelId: subjects.gradeLevelId,
      })
      .from(subjects)
      .where(and(eq(subjects.id, input.subjectId), eq(subjects.isActive, true)))
      .limit(1);

    const subject = subjectRows[0];
    if (!subject) {
      throw new NotFoundError("Mata pelajaran tidak ditemukan");
    }
    if (input.gradeLevelId && subject.gradeLevelId !== input.gradeLevelId) {
      throw new BadRequestError("Mata pelajaran tidak sesuai tingkatan");
    }
    if (input.majorId && subject.majorId && subject.majorId !== input.majorId) {
      throw new BadRequestError("Mata pelajaran tidak sesuai jurusan");
    }
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
  const defaultPassword = buildDefaultPassword(tanggalLahir, nomorInduk);
  const passwordHash = await hashPassword(defaultPassword);

  const created = await db.transaction(async (tx) => {
    const rows = await tx
      .insert(users)
      .values({
        fullName,
        nomorInduk,
        tanggalLahir,
        email,
        passwordHash,
        passwordChangedAt: null,
        isActive: true,
      })
      .returning({
        id: users.id,
        fullName: users.fullName,
        nomorInduk: users.nomorInduk,
        email: users.email,
      });

    const teacher = rows[0];
    if (!teacher) {
      throw new BadRequestError("Gagal membuat guru");
    }

    const roleId = await tx
      .select({ id: roles.id })
      .from(roles)
      .where(eq(roles.name, "guru"))
      .limit(1)
      .then((roleRows) => roleRows[0]?.id);

    if (!roleId) {
      throw new BadRequestError("Peran guru tidak ditemukan");
    }

    await tx.insert(userRoles).values({
      userId: teacher.id,
      roleId,
      assignedAt: new Date(),
    });

    if (input.subjectId) {
      await tx.insert(teacherSubjects).values({
        teacherId: teacher.id,
        subjectId: input.subjectId,
      });
    }

    return teacher;
  });

  return created;
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

export async function listTeacherSubjects(filters: AssignmentFilters & { section?: string } = {}) {
  const conditions: SQL[] = [];
  if (filters.teacherId) conditions.push(eq(teacherSubjects.teacherId, filters.teacherId));
  if (filters.subjectId) conditions.push(eq(teacherSubjects.subjectId, filters.subjectId));
  const sectionFilter = filters.section?.trim();
  if (sectionFilter) {
    conditions.push(
      sql`exists (select 1 from teacher_classrooms tc join classes c on c.id = tc.class_id where tc.teacher_id = ${teacherSubjects.teacherId} and c.section = ${sectionFilter})`
    );
  }

  return db
    .select({
      id: teacherSubjects.id,
      teacherId: teacherSubjects.teacherId,
      teacherName: users.fullName,
      teacherNip: users.nomorInduk,
      subjectId: teacherSubjects.subjectId,
      subjectName: subjects.name,
      subjectCode: subjects.code,
      gradeLevelId: subjects.gradeLevelId,
      section: sql<string | null>`(select string_agg(distinct c.section, ', ' order by c.section) from teacher_classrooms tc join classes c on c.id = tc.class_id where tc.teacher_id = ${teacherSubjects.teacherId})`,
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

export async function updateTeacherSubject(
  id: string,
  input: { teacherId: string; subjectId: string }
) {
  assertUuid(id);
  await assertTeacher(input.teacherId);
  assertUuid(input.subjectId);
  try {
    const rows = await db
      .update(teacherSubjects)
      .set({ teacherId: input.teacherId, subjectId: input.subjectId })
      .where(eq(teacherSubjects.id, id))
      .returning({ id: teacherSubjects.id });
    if (rows.length === 0) {
      throw new NotFoundError("Penugasan mata pelajaran tidak ditemukan");
    }
    return rows[0];
  } catch (err) {
    if (err instanceof NotFoundError) throw err;
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
