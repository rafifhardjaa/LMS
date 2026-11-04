import { eq } from "drizzle-orm";
import { db } from "./index";
import { classes, gradeLevels, roles, userRoles, users } from "./schema";
import { hashPassword } from "../lib/password";

const FIRST_NAMES = [
  "Ahmad","Budi","Citra","Dewi","Eka","Farhan","Gita","Hadi","Intan","Joko",
  "Kartika","Lestari","Maharani","Nugroho","Putri","Rizki","Sari","Tri","Ulfa","Vina",
  "Wawan","Xander","Yuni","Zahra","Aditya","Bayu","Cahya","Dinda","Erwin","Farah",
  "Gilang","Hana","Irfan","Jihan","Kirana","Lukman","Mawar","Nadia","Oka","Pratama",
];

const LAST_NAMES = [
  "Santoso","Wijaya","Putra","Sari","Kusuma","Hartono","Lestari","Permana","Nugroho","Sutanto",
  "Prasetyo","Rahayu","Kartika","Maharani","Lestari","Wijayanti","Suryono","Hidayat","Anggraini","Kusnandar",
  "Pratama","Ramadhan","Safitri","Tanoto","Utama","Vebrianti","Wibowo","Yuliana","Zulkarnain","Amalia",
];

function randomDate(year: number): string {
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

async function seedStudents() {
  console.log("🌱 Seeding 960 students...");

  const classRows = await db
    .select({ id: classes.id, name: classes.name, gradeLevelId: classes.gradeLevelId })
    .from(classes);

  const gradeLevelRows = await db
    .select({ id: gradeLevels.id, code: gradeLevels.code })
    .from(gradeLevels);

  const gradeYearMap = new Map<string, number>();
  for (const gl of gradeLevelRows) {
    const year = gl.code === "X" ? 2010 : gl.code === "XI" ? 2009 : 2008;
    gradeYearMap.set(gl.id, year);
  }

  const siswaRole = await db
    .select({ id: roles.id })
    .from(roles)
    .where(eq(roles.name, "siswa"))
    .limit(1);
  if (!siswaRole[0]) throw new Error("Role siswa tidak ditemukan");
  const roleId = siswaRole[0].id;

  const passwordHash = await hashPassword("password123");
  let studentIndex = 1;
  const values: any[] = [];

  for (const cls of classRows) {
    const gradeYear = cls.gradeLevelId ? gradeYearMap.get(cls.gradeLevelId) ?? 2010 : 2010;
    for (let s = 0; s < 10; s++) {
      const fn = FIRST_NAMES[studentIndex % FIRST_NAMES.length];
      const ln = LAST_NAMES[Math.floor(studentIndex / FIRST_NAMES.length) % LAST_NAMES.length];
      const fullName = `${fn} ${ln}`;
      const nomorInduk = `10${String(studentIndex).padStart(8, "0")}`;
      const email = `siswa${String(studentIndex).padStart(4, "0")}@simanis.com`;
      const tanggalLahir = randomDate(gradeYear);

      values.push({
        fullName,
        nomorInduk,
        email,
        tanggalLahir,
        kelas: cls.name,
        classId: cls.id,
        passwordHash,
        isActive: true,
        passwordChangedAt: new Date(),
      });
      studentIndex++;
    }
  }

  const inserted = await db
    .insert(users)
    .values(values)
    .returning({ id: users.id, nomorInduk: users.nomorInduk });

  const userRolesValues = inserted.map((u) => ({ userId: u.id, roleId }));
  await db.insert(userRoles).values(userRolesValues);

  console.log(`✅ Inserted ${inserted.length} students`);
  return inserted.length;
}

if (import.meta.main) {
  await seedStudents();
  process.exit(0);
}

export { seedStudents };