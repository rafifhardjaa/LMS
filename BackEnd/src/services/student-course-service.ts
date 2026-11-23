import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { users } from "../db/schema";
import { ForbiddenError } from "../utils/response";
import { listCourseMeetings } from "./course-detail-service";
import { listStudents } from "./students-service";

async function assertStudentOwnsClass(userId: string, classId: string) {
  const [student] = await db
    .select({ id: users.id, classId: users.classId })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!student || !student.classId || student.classId !== classId) {
    throw new ForbiddenError("Anda tidak terdaftar pada kelas ini");
  }
}

export async function listStudentCourseMeetings({
  userId,
  subjectId,
  classId,
}: {
  userId: string;
  subjectId: string;
  classId: string;
}) {
  await assertStudentOwnsClass(userId, classId);

  return listCourseMeetings({
    subjectId,
    classId,
    teacherId: null,
  });
}

export async function listStudentCourseParticipants({
  userId,
  classId,
}: {
  userId: string;
  classId: string;
}) {
  await assertStudentOwnsClass(userId, classId);

  return listStudents(
    { classId },
    { id: userId, role: "siswa" },
  );
}
