import { db } from "./index";
import { roles, users, userRoles, subjects, modules } from "./schema";

async function seed() {
  console.log("🌱 Starting database seeding...");

  try {
    console.log("Clearing tables...");
    await db.delete(modules);
    await db.delete(subjects);
    await db.delete(userRoles);
    await db.delete(users);
    await db.delete(roles);

    console.log("Inserting roles...");
    const rolesData = await db
      .insert(roles)
      .values([
        { name: "admin" },
        { name: "guru" },
        { name: "siswa" },
      ])
      .returning({ id: roles.id, name: roles.name });

    const adminRole = rolesData.find((r) => r.name === "admin");
    const guruRole = rolesData.find((r) => r.name === "guru");
    const siswaRole = rolesData.find((r) => r.name === "siswa");

    if (!adminRole || !guruRole || !siswaRole) {
      throw new Error("Failed to create roles");
    }

    console.log("Inserting users...");
    const passwordHash = await Bun.password.hash("password123");

    const usersData = await db
      .insert(users)
      .values([
        {
          fullName: "Admin SIMANIS",
          email: "admin@simanis.com",
          passwordHash,
          phone: "081234567890",
          isActive: true,
        },
        {
          fullName: "Guru SIMANIS",
          email: "guru@simanis.com",
          passwordHash,
          phone: "081234567891",
          isActive: true,
        },
        {
          fullName: "Siswa SIMANIS",
          email: "siswa@simanis.com",
          passwordHash,
          phone: "081234567892",
          isActive: true,
        },
      ])
      .returning({ id: users.id, email: users.email });

    const adminUser = usersData.find((u) => u.email === "admin@simanis.com");
    const guruUser = usersData.find((u) => u.email === "guru@simanis.com");
    const siswaUser = usersData.find((u) => u.email === "siswa@simanis.com");

    if (!adminUser || !guruUser || !siswaUser) {
      throw new Error("Failed to create users");
    }

    console.log("Assigning roles to users...");
    await db.insert(userRoles).values([
      { userId: adminUser.id, roleId: adminRole.id },
      { userId: guruUser.id, roleId: guruRole.id },
      { userId: siswaUser.id, roleId: siswaRole.id },
    ]);

    console.log("Inserting subject...");
    const subjectData = await db
      .insert(subjects)
      .values({
        name: "Matematika Dasar",
        code: "MATH101",
        description: "Pelajaran matematika dasar untuk pemula",
        createdBy: adminUser.id,
      })
      .returning({ id: subjects.id });

    const subject = subjectData[0];
    if (!subject) {
      throw new Error("Failed to create subject");
    }

    console.log("Inserting module...");
    await db.insert(modules).values({
      subjectId: subject.id,
      teacherId: guruUser.id,
      title: "Modul 1: Pengenalan Bilangan",
      description: "Pengenalan konsep bilangan dasar",
      orderIndex: 0,
    });

    console.log("✅ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
