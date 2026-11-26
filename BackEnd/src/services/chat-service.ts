import { eq } from "drizzle-orm";
import { db } from "../db";
import {
  classes,
  jadwalPelajaran,
  subjects,
  users,
} from "../db/schema";
import { ForbiddenError, NotFoundError } from "../utils/response";
import { listStudents } from "./students-service";

export type StudentChatContactRole =
  | "classmate"
  | "teacher"
  | "advisor";

export type StudentChatContact = {
  id: string;
  kind: "student" | "teacher";
  name: string;
  identifier: string | null;
  roles: StudentChatContactRole[];
  className: string;
  subjects?: Array<{
    id: string;
    code: string;
    name: string;
  }>;
};

export type StudentChatContacts = {
  class: {
    id: string;
    name: string;
  };
  contacts: StudentChatContact[];
};

export async function listStudentChatContacts(
  userId: string,
): Promise<StudentChatContacts> {
  const [student] = await db
    .select({ classId: users.classId })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!student?.classId) {
    throw new ForbiddenError("Kelas siswa belum diatur");
  }

  const [classRow] = await db
    .select({
      id: classes.id,
      name: classes.name,
      advisorId: classes.advisorId,
      advisorName: users.fullName,
      advisorIdentifier: users.nomorInduk,
    })
    .from(classes)
    .leftJoin(users, eq(classes.advisorId, users.id))
    .where(eq(classes.id, student.classId))
    .limit(1);

  if (!classRow) throw new NotFoundError("Kelas siswa tidak ditemukan");

  const [students, teacherRows] = await Promise.all([
    listStudents({ classId: classRow.id }),
    db
      .select({
        teacherId: users.id,
        teacherName: users.fullName,
        teacherIdentifier: users.nomorInduk,
        subjectId: subjects.id,
        subjectCode: subjects.code,
        subjectName: subjects.name,
      })
      .from(jadwalPelajaran)
      .innerJoin(users, eq(jadwalPelajaran.teacherId, users.id))
      .innerJoin(subjects, eq(jadwalPelajaran.subjectId, subjects.id))
      .where(eq(jadwalPelajaran.classId, classRow.id)),
  ]);

  const classmates: StudentChatContact[] = students
    .filter((item) => item.id !== userId)
    .map((item) => ({
      id: item.id,
      kind: "student",
      name: item.fullName,
      identifier: item.nisn ?? item.nomorInduk,
      roles: ["classmate"],
      className: classRow.name,
    }));

  const teacherMap = new Map<
    string,
    StudentChatContact & {
      subjectMap: Map<
        string,
        { id: string; code: string; name: string }
      >;
    }
  >();

  for (const row of teacherRows) {
    let teacher = teacherMap.get(row.teacherId);
    if (!teacher) {
      teacher = {
        id: row.teacherId,
        kind: "teacher",
        name: row.teacherName,
        identifier: row.teacherIdentifier,
        roles:
          row.teacherId === classRow.advisorId
            ? ["advisor", "teacher"]
            : ["teacher"],
        className: classRow.name,
        subjects: [],
        subjectMap: new Map(),
      };
      teacherMap.set(row.teacherId, teacher);
    }
    teacher.subjectMap.set(row.subjectId, {
      id: row.subjectId,
      code: row.subjectCode,
      name: row.subjectName,
    });
  }

  if (
    classRow.advisorId &&
    classRow.advisorName &&
    !teacherMap.has(classRow.advisorId)
  ) {
    teacherMap.set(classRow.advisorId, {
      id: classRow.advisorId,
      kind: "teacher",
      name: classRow.advisorName,
      identifier: classRow.advisorIdentifier,
      roles: ["advisor"],
      className: classRow.name,
      subjects: [],
      subjectMap: new Map(),
    });
  }

  const teachers: StudentChatContact[] = [...teacherMap.values()]
    .map(({ subjectMap, ...teacher }) => ({
      ...teacher,
      subjects: [...subjectMap.values()].sort((first, second) =>
        first.name.localeCompare(second.name),
      ),
    }))
    .sort((first, second) => {
      const firstAdvisor = first.roles.includes("advisor") ? 0 : 1;
      const secondAdvisor = second.roles.includes("advisor") ? 0 : 1;
      return firstAdvisor - secondAdvisor || first.name.localeCompare(second.name);
    });

  return {
    class: {
      id: classRow.id,
      name: classRow.name,
    },
    contacts: [...teachers, ...classmates],
  };
}
