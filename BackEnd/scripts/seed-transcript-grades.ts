import { createHash, randomUUID } from "node:crypto";
import { and, asc, eq } from "drizzle-orm";
import { db } from "../src/db/index";
import {
  academicPeriods,
  classes,
  courseMeetings,
  subjects,
  teachingAssignments,
  users,
} from "../src/db/schema";
import { storageDb } from "../src/db/storage";
import {
  assignments,
  guruAssignmentKuis,
  guruAssignmentTugas,
  siswaUpAssignmentKuis,
  siswaUpAssignmentTugas,
} from "../src/db/storage-schema";
import { getActiveAcademicPeriod } from "../src/services/attendance-service";
import { createAssignment } from "../src/services/assignments-service";
import { upsertStudentGrades } from "../src/services/grades-service";
import { listStudents } from "../src/services/students-service";

const CLASS_NAME = "XII TJKT D";
const placeholderPdf = Uint8Array.from(
  Buffer.from(
    "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 200]>>endobj\nxref\n0 4\n0000000000 65535 f \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n0\n%%EOF\n",
    "utf8",
  ),
);

type ComponentKind = "tugas" | "kuis" | "uts" | "uas";
type ComponentSpec = {
  kind: ComponentKind;
  type: "tugas" | "kuis";
  title: string;
  meetingNumber: number;
};

const componentSpecs: ComponentSpec[] = [
  { kind: "tugas", type: "tugas", title: "Tugas", meetingNumber: 6 },
  { kind: "kuis", type: "kuis", title: "Kuis", meetingNumber: 7 },
  { kind: "uts", type: "tugas", title: "Ujian Tengah Semester (UTS)", meetingNumber: 8 },
  { kind: "uas", type: "tugas", title: "Ujian Akhir Semester (UAS)", meetingNumber: 16 },
];

function scoreFor(
  studentIndex: number,
  subjectIndex: number,
  kind: ComponentKind,
  existing: number | null,
) {
  if (existing !== null) return existing;
  const componentIndex =
    kind === "tugas" ? 0 : kind === "kuis" ? 1 : kind === "uts" ? 2 : 3;
  return 60 + ((studentIndex * 7 + subjectIndex * 11 + componentIndex * 13) % 40);
}

function fileValues({
  filename,
  meetingId,
  uploadedBy,
}: {
  filename: string;
  meetingId: string;
  uploadedBy: string;
}) {
  return {
    filename,
    mimeType: "application/pdf",
    size: placeholderPdf.length,
    checksumSha256: createHash("sha256").update(placeholderPdf).digest("hex"),
    uploadedBy,
    uploaderRole: "guru" as const,
    meetingId,
    data: placeholderPdf,
  };
}

async function main() {
  const classRows = await db
    .select()
    .from(classes)
    .where(eq(classes.name, CLASS_NAME))
    .limit(1);
  const itemClass = classRows[0];
  if (!itemClass) throw new Error(`Kelas ${CLASS_NAME} tidak ditemukan`);

  const period = await getActiveAcademicPeriod();
  const students = await listStudents({ classId: itemClass.id });
  if (!students.length) throw new Error("Tidak ada siswa pada kelas ini");

  const teachingRows = await db
    .select({
      subjectId: subjects.id,
      subjectCode: subjects.code,
      subjectName: subjects.name,
      teacherId: teachingAssignments.teacherId,
      teacherName: users.fullName,
    })
    .from(teachingAssignments)
    .innerJoin(users, eq(teachingAssignments.teacherId, users.id))
    .innerJoin(subjects, eq(teachingAssignments.subjectId, subjects.id))
    .where(eq(teachingAssignments.classId, itemClass.id));

  const subjectMap = new Map<
    string,
    {
      subjectId: string;
      subjectCode: string | null;
      subjectName: string;
      teacherId: string;
      teacherName: string;
    }
  >();
  for (const row of teachingRows) {
    if (!subjectMap.has(row.subjectId)) subjectMap.set(row.subjectId, row);
  }
  const subjectList = [...subjectMap.values()].sort((first, second) =>
    first.subjectName.localeCompare(second.subjectName),
  );

  let createdAssignments = 0;
  let skippedAssignments = 0;
  let createdSubmissions = 0;
  let skippedSubmissions = 0;
  const gradeRecords: Record<string, Array<{ studentId: string; utsScore: number; uasScore: number }>> = {};

  for (const [subjectIndex, subject] of subjectList.entries()) {
    const meetingRows = await db
      .select()
      .from(courseMeetings)
      .where(
        and(
          eq(courseMeetings.subjectId, subject.subjectId),
          eq(courseMeetings.classId, itemClass.id),
        ),
      )
      .orderBy(asc(courseMeetings.meetingNumber));
    const meetingByNumber = new Map(
      meetingRows.map((row) => [row.meetingNumber, row.id]),
    );
    const fallbackMeeting =
      meetingByNumber.get(1) ?? meetingRows[0]?.id ?? null;

    const existingAssignments = await storageDb
      .select()
      .from(assignments)
      .where(
        and(
          eq(assignments.subjectId, subject.subjectId),
          eq(assignments.classId, itemClass.id),
        ),
      );

    const utsScores = new Map<string, number>();
    const uasScores = new Map<string, number>();

    for (const spec of componentSpecs) {
      const meetingId =
        meetingByNumber.get(spec.meetingNumber) ?? fallbackMeeting;
      if (!meetingId) {
        throw new Error(
          `Meeting tidak ditemukan untuk ${subject.subjectName} komponen ${spec.kind}`,
        );
      }

      let assignmentId =
        existingAssignments.find(
          (row) => row.type === spec.type && row.title === spec.title,
        )?.id ?? null;

      if (!assignmentId) {
        const created = await createAssignment({
          subjectId: subject.subjectId,
          classId: itemClass.id,
          teacherId: subject.teacherId,
          data: {
            type: spec.type,
            title: spec.title,
            description: `${spec.title} - ${subject.subjectName}`,
            startAt: `${period.startDate}T00:00:00.000Z`,
            deadlineAt: `${period.endDate}T23:59:00.000Z`,
            meetingId,
          },
        });
        assignmentId = created.id;
        createdAssignments++;
      } else {
        skippedAssignments++;
      }

      const currentAssignmentId = assignmentId;
      const isKuis = spec.type === "kuis";
      const table = isKuis ? guruAssignmentKuis : guruAssignmentTugas;
      const submissionTable = isKuis
        ? siswaUpAssignmentKuis
        : siswaUpAssignmentTugas;

      const existingGrading = await storageDb
        .select({
          studentId: table.studentId,
          score: table.score,
        })
        .from(table)
        .where(
          and(
            eq(table.assignmentId, currentAssignmentId),
            eq(table.isDeleted, false),
          ),
        );
      const gradingByStudent = new Map(
        existingGrading.map((row) => [row.studentId, row.score]),
      );

      const studentValues: any[] = [];
      const gradingValues: any[] = [];

      for (const [studentIndex, student] of students.entries()) {
        const existingScoreRaw = gradingByStudent.get(student.id);
        const existingScore =
          existingScoreRaw === null || existingScoreRaw === undefined
            ? null
            : Number(existingScoreRaw);
        const score = scoreFor(
          studentIndex,
          subjectIndex,
          spec.kind,
          existingScore,
        );

        if (spec.kind === "uts") utsScores.set(student.id, score);
        if (spec.kind === "uas") uasScores.set(student.id, score);

        if (gradingByStudent.has(student.id)) {
          skippedSubmissions++;
          continue;
        }

        const submissionId = randomUUID();
        const filename = `${spec.title}-${student.nomorInduk ?? student.id}.pdf`;
        studentValues.push({
          ...fileValues({
            filename,
            meetingId,
            uploadedBy: subject.teacherId,
          }),
          studentId: student.id,
          submissionId,
          submittedAt: new Date(`${period.startDate}T08:00:00.000Z`),
          assignmentId: currentAssignmentId,
        });
        gradingValues.push({
          ...fileValues({
            filename,
            meetingId,
            uploadedBy: subject.teacherId,
          }),
          studentId: student.id,
          submissionId,
          submittedAt: new Date(`${period.startDate}T08:00:00.000Z`),
          assignmentId: currentAssignmentId,
          studentFileId: null,
          score: score.toFixed(2),
          gradingStatus: "graded",
          gradedAt: new Date(),
        });
      }

      if (studentValues.length) {
        const inserted = await storageDb
          .insert(submissionTable)
          .values(studentValues)
          .returning({ id: submissionTable.id });
        for (let index = 0; index < inserted.length; index++) {
          gradingValues[index].studentFileId = inserted[index]!.id;
        }
        await storageDb.insert(table).values(gradingValues);
        createdSubmissions += inserted.length;
      }
    }

    gradeRecords[subject.subjectId] = students.map((student) => ({
      studentId: student.id,
      utsScore: utsScores.get(student.id) ?? 0,
      uasScore: uasScores.get(student.id) ?? 0,
    }));
  }

  let savedGrades = 0;
  for (const subject of subjectList) {
    const result = await upsertStudentGrades({
      classId: itemClass.id,
      subjectId: subject.subjectId,
      periodId: period.id,
      teacherId: subject.teacherId,
      records: gradeRecords[subject.subjectId]!,
    });
    savedGrades += result.saved;
  }

  console.log(
    JSON.stringify(
      {
        subjects: subjectList.length,
        students: students.length,
        createdAssignments,
        skippedAssignments,
        createdSubmissions,
        skippedSubmissions,
        savedGrades,
      },
      null,
      2,
    ),
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
