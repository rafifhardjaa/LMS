import { eq } from "drizzle-orm";
import { db } from "./index";
import {
  roles,
  users,
  userRoles,
  subjects,
  modules,
  enrollments,
  moduleDiscussions,
  moduleDiscussionReplies,
  majors,
  gradeLevels,
  classes,
  teacherSubjects,
  teacherClassrooms,
} from "./schema";
import {
  majorsData,
  gradeLevelsData,
  classesData,
  teachersData,
  subjectsData,
} from "./seed-data";

async function seed() {
  console.log("🌱 Starting database seeding...");

  try {
    console.log("Clearing tables...");
    await db.delete(moduleDiscussionReplies);
    await db.delete(moduleDiscussions);
    await db.delete(enrollments);
    await db.delete(modules);
    await db.delete(teacherSubjects);
    await db.delete(teacherClassrooms);
    await db.delete(subjects);
    await db.delete(userRoles);
    await db.delete(users);
    await db.delete(classes);
    await db.delete(gradeLevels);
    await db.delete(majors);
    await db.delete(roles);

    console.log("Inserting roles...");
    const rolesData = await db
      .insert(roles)
      .values([{ name: "admin" }, { name: "guru" }, { name: "siswa" }])
      .returning({ id: roles.id, name: roles.name });

    const adminRole = rolesData.find((r) => r.name === "admin");
    const guruRole = rolesData.find((r) => r.name === "guru");
    const siswaRole = rolesData.find((r) => r.name === "siswa");

    if (!adminRole || !guruRole || !siswaRole) {
      throw new Error("Failed to create roles");
    }

    console.log("Inserting demo users...");
    const passwordHash = await Bun.password.hash("password123", {
      algorithm: "argon2id",
    });

    const usersData = await db
      .insert(users)
      .values([
        {
          fullName: "Admin SIMANIS",
          email: "admin@simanis.com",
          nomorInduk: "198501152010011001",
          tanggalLahir: "1985-01-15",
          passwordHash,
          passwordChangedAt: new Date(),
          phone: "081234567890",
          isActive: true,
        },
        {
          fullName: "Guru SIMANIS",
          email: "guru@simanis.com",
          nomorInduk: "198703212011012002",
          tanggalLahir: "1987-03-21",
          passwordHash,
          passwordChangedAt: new Date(),
          phone: "081234567891",
          isActive: true,
        },
        {
          fullName: "Guru SIMANIS",
          email: "guru@simanis.com",
          nomorInduk: "198703212011012002",
          tanggalLahir: "1987-03-21",
          passwordHash,
          passwordChangedAt: new Date(),
          phone: "081234567891",
          isActive: true,
        },
        {
          fullName: "Siswa SIMANIS",
          email: "siswa@simanis.com",
          nomorInduk: "1023014587",
          tanggalLahir: "2010-01-15",
          kelas: "X RPL A",
          passwordHash,
          passwordChangedAt: new Date(),
          phone: "081234567892",
          isActive: true,
        },
        {
          fullName: "Siswa SIMANIS 2",
          email: "siswa2@simanis.com",
          nomorInduk: "1023014588",
          tanggalLahir: "2010-02-20",
          kelas: "X RPL A",
          passwordHash,
          passwordChangedAt: new Date(),
          phone: "081234567893",
          isActive: true,
        },
        {
          fullName: "Siswa SIMANIS 3",
          email: "siswa3@simanis.com",
          nomorInduk: "1023014589",
          tanggalLahir: "2010-03-25",
          kelas: "X RPL B",
          passwordHash,
          passwordChangedAt: new Date(),
          phone: "081234567894",
          isActive: true,
        },
        {
          fullName: "Siswa SIMANIS 4",
          email: "siswa4@simanis.com",
          nomorInduk: "1023014590",
          tanggalLahir: "2010-04-30",
          kelas: "X RPL B",
          passwordHash,
          passwordChangedAt: new Date(),
          phone: "081234567895",
          isActive: true,
        },
      ])
      .onConflictDoNothing({ target: users.email })
      .returning({ id: users.id, email: users.email });

    const adminUser = usersData.find((u) => u.email === "admin@simanis.com");
    const guruUser = usersData.find((u) => u.email === "guru@simanis.com");
    const siswaUser = usersData.find((u) => u.email === "siswa@simanis.com");
    const siswa2User = usersData.find((u) => u.email === "siswa2@simanis.com");
    const siswa3User = usersData.find((u) => u.email === "siswa3@simanis.com");
    const siswa4User = usersData.find((u) => u.email === "siswa4@simanis.com");

    if (
      !adminUser ||
      !guruUser ||
      !siswaUser ||
      !siswa2User ||
      !siswa3User ||
      !siswa4User
    ) {
      throw new Error("Failed to create demo users");
    }

    console.log("Assigning demo roles...");
    await db.insert(userRoles).values([
      { userId: adminUser.id, roleId: adminRole.id },
      { userId: guruUser.id, roleId: guruRole.id },
      { userId: siswaUser.id, roleId: siswaRole.id },
      { userId: siswa2User.id, roleId: siswaRole.id },
      { userId: siswa3User.id, roleId: siswaRole.id },
      { userId: siswa4User.id, roleId: siswaRole.id },
    ]);

    console.log("Inserting majors...");
    const majorsInserted = await db
      .insert(majors)
      .values(majorsData)
      .returning({ id: majors.id, code: majors.code });
    const majorByCode = new Map(majorsInserted.map((m) => [m.code, m.id]));

    console.log("Inserting grade levels...");
    const gradesInserted = await db
      .insert(gradeLevels)
      .values(gradeLevelsData)
      .returning({ id: gradeLevels.id, code: gradeLevels.code });
    const gradeByCode = new Map(gradesInserted.map((g) => [g.code, g.id]));

    console.log("Inserting classes...");
    const classesInserted = await db
      .insert(classes)
      .values(
        classesData.map((c) => ({
          name: c.name,
          section: c.section,
          majorId: majorByCode.get(c.majorCode)!,
          gradeLevelId: gradeByCode.get(c.gradeCode)!,
        }))
      )
      .returning({ id: classes.id, name: classes.name });
    const classByName = new Map(classesInserted.map((c) => [c.name, c.id]));
    const classMeta = new Map(classesData.map((c) => [c.name, c]));

    console.log("Linking demo students to classes...");
    await db
      .update(users)
      .set({ classId: classByName.get("X RPL A") ?? null })
      .where(eq(users.id, siswaUser.id));
    await db
      .update(users)
      .set({ classId: classByName.get("X RPL A") ?? null })
      .where(eq(users.id, siswa2User.id));
    await db
      .update(users)
      .set({ classId: classByName.get("X RPL B") ?? null })
      .where(eq(users.id, siswa3User.id));
    await db
      .update(users)
      .set({ classId: classByName.get("X RPL B") ?? null })
      .where(eq(users.id, siswa4User.id));

    console.log(`Inserting ${teachersData.length} teachers...`);
    const teacherUsers = await db
      .insert(users)
      .values(
        teachersData.map((t) => ({
          fullName: t.fullName,
          email: t.email,
          nomorInduk: t.nomorInduk,
          passwordHash,
          passwordChangedAt: new Date(),
          isActive: true,
        }))
      )
      .returning({ id: users.id, email: users.email });
    const teacherByEmail = new Map(teacherUsers.map((u) => [u.email, u.id]));

    if (teacherByEmail.size !== teachersData.length) {
      throw new Error("Failed to create all teacher accounts");
    }

    console.log("Assigning guru role to teachers...");
    await db.insert(userRoles).values(
      teachersData.map((t) => ({
        userId: teacherByEmail.get(t.email)!,
        roleId: guruRole.id,
      }))
    );

    console.log("Assigning teachers to classrooms...");
    const teacherClassroomRows: { teacherId: string; classId: string }[] = [];
    for (const teacher of teachersData) {
      const teacherId = teacherByEmail.get(teacher.email);
      if (!teacherId) continue;
      for (const className of teacher.classNames) {
        const classId = classByName.get(className);
        if (!classId) continue;
        teacherClassroomRows.push({ teacherId, classId });
      }
    }
    await db.insert(teacherClassrooms).values(teacherClassroomRows);

    console.log("Inserting subjects...");
    const subjectData = await db
      .insert(subjects)
      .values(
        subjectsData.map((s) => ({
          name: s.name,
          code: s.code,
          majorId: s.majorCode ? (majorByCode.get(s.majorCode) ?? null) : null,
          gradeLevelId: gradeByCode.get(s.gradeCode)!,
          semester: s.semester,
          createdBy: adminUser.id,
        }))
      )
      .returning({
        id: subjects.id,
        code: subjects.code,
        majorId: subjects.majorId,
        gradeLevelId: subjects.gradeLevelId,
      });

    const subjectIdsByMajorGrade = new Map<string, string[]>();
    for (const s of subjectData) {
      if (!s.majorId || !s.gradeLevelId) continue;
      const key = `${s.majorId}|${s.gradeLevelId}`;
      const list = subjectIdsByMajorGrade.get(key) ?? [];
      list.push(s.id);
      subjectIdsByMajorGrade.set(key, list);
    }

    console.log("Assigning subjects to teachers...");
    const teacherSubjectRows: { teacherId: string; subjectId: string }[] = [];
    const assignedSubjectPairs = new Set<string>();
    for (const teacher of teachersData) {
      const teacherId = teacherByEmail.get(teacher.email);
      if (!teacherId) continue;
      for (const className of teacher.classNames) {
        const meta = classMeta.get(className);
        if (!meta) continue;
        const majorId = majorByCode.get(meta.majorCode);
        const gradeLevelId = gradeByCode.get(meta.gradeCode);
        if (!majorId || !gradeLevelId) continue;
        const subjectIds = subjectIdsByMajorGrade.get(`${majorId}|${gradeLevelId}`) ?? [];
        for (const subjectId of subjectIds) {
          const pairKey = `${teacherId}|${subjectId}`;
          if (assignedSubjectPairs.has(pairKey)) continue;
          assignedSubjectPairs.add(pairKey);
          teacherSubjectRows.push({ teacherId, subjectId });
        }
      }
    }
    await db.insert(teacherSubjects).values(teacherSubjectRows);

    console.log("Inserting demo subjects...");
    const demosubjectData = await db
      .insert(subjects)
      .values([
        {
          name: "Informatika & Sains Komputasi",
          code: "INF101",
          description:
            "Algoritma, struktur data, dan penerapan komputasi untuk kelas XII.",
          gradeLevelId: gradeByCode.get("XII")!,
          semester: "Ganjil",
          createdBy: adminUser.id,
        },
        {
          name: "Matematika Dasar",
          code: "MATH101",
          description: "Pelajaran matematika dasar untuk pemula",
          gradeLevelId: gradeByCode.get("X")!,
          semester: "Ganjil",
          createdBy: adminUser.id,
        },
      ])
      .returning({ id: subjects.id, code: subjects.code });

    const informatikaSubject = demosubjectData.find((s) => s.code === "INF101");
    const mathSubject = demosubjectData.find((s) => s.code === "MATH101");
    if (!informatikaSubject || !mathSubject) {
      throw new Error("Failed to create demo subjects");
    }

    console.log("Inserting modules...");
    const moduleData = await db
      .insert(modules)
      .values([
        {
          subjectId: informatikaSubject.id,
          teacherId: guruUser.id,
          title: "Algoritma Pemrograman & Optimasi Big-O",
          description:
            "Analisis efisiensi algoritma, struktur data graf, dan optimasi kompleksitas Big-O.",
          orderIndex: 0,
        },
        {
          subjectId: mathSubject.id,
          teacherId: guruUser.id,
          title: "Modul 1: Pengenalan Bilangan",
          description: "Pengenalan konsep bilangan dasar",
          orderIndex: 1,
        },
      ])
      .returning({ id: modules.id, title: modules.title });

    const algorithmModule = moduleData.find(
      (m) => m.title === "Algoritma Pemrograman & Optimasi Big-O"
    );
    if (!algorithmModule) {
      throw new Error("Failed to create algorithm module");
    }

    console.log("Enrolling demo students in Informatika...");
    await db.insert(enrollments).values([
      {
        studentId: siswaUser.id,
        subjectId: informatikaSubject.id,
        status: "active",
      },
      {
        studentId: siswa4User.id,
        subjectId: informatikaSubject.id,
        status: "active",
      },
    ]);

    console.log("Inserting sample discussions...");
    const now = Date.now();
    const discussionData = await db
      .insert(moduleDiscussions)
      .values([
        {
          moduleId: algorithmModule.id,
          authorId: siswa4User.id,
          body: "Pak, apakah bobot edge latensi boleh bernilai 0 jika antar switch terhubung direct fiber optic?",
          createdAt: new Date(now - 2 * 60 * 60 * 1000),
        },
        {
          moduleId: algorithmModule.id,
          authorId: siswa4User.id,
          body: "Apakah library NetworkX boleh digunakan untuk visualisasi Matplotlib di tugas lab?",
          createdAt: new Date(now - 26 * 60 * 60 * 1000),
        },
      ])
      .returning({ id: moduleDiscussions.id, body: moduleDiscussions.body });

    const edgeQuestion = discussionData.find((d) =>
      d.body.startsWith("Pak, apakah bobot edge")
    );
    const libraryQuestion = discussionData.find((d) =>
      d.body.startsWith("Apakah library NetworkX")
    );
    if (!edgeQuestion || !libraryQuestion) {
      throw new Error("Failed to create sample discussions");
    }

    await db.insert(moduleDiscussionReplies).values([
      {
        discussionId: edgeQuestion.id,
        authorId: guruUser.id,
        body: "Bisa, namun disarankan diberi bobot minimum 1ms untuk mencegah infinite tie-loop.",
        createdAt: new Date(now - 90 * 60 * 1000),
      },
      {
        discussionId: libraryQuestion.id,
        authorId: guruUser.id,
        body: "Sangat dianjurkan. Lihat referensi Bab 3 video demonstrasi untuk contoh lengkapnya.",
        createdAt: new Date(now - 25 * 60 * 60 * 1000),
      },
    ]);

    console.log(
      `✅ Seeding complete: ${majorsInserted.length} majors, ${gradesInserted.length} grade levels, ${classesInserted.length} classes, ${teacherUsers.length} teachers, ${subjectData.length} subjects.`
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
