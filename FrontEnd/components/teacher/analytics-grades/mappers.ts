import type {
  AssignmentGradingRow,
  StudentSummary,
} from "@/lib/api/master-data";
import type { StudentGrade } from "./types";

const avatarPalettes = [
  "bg-[#006398] text-white",
  "bg-[#E0F2FE] text-[#0284C7]",
  "bg-[#DCE9FF] text-[#006398]",
  "bg-[#F3E8FF] text-[#9333EA]",
  "bg-[#FFEBEB] text-[#b71422]",
  "bg-[#DCFCE7] text-[#16A34A]",
  "bg-[#FEF3C7] text-[#D97706]",
];

export function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function mapStudentsWithGrades({
  students,
  gradingRows,
  className,
  subjectLabel,
}: {
  students: StudentSummary[];
  gradingRows: AssignmentGradingRow[];
  className: string;
  subjectLabel: string;
}): StudentGrade[] {
  const scoreByStudent = new Map(
    gradingRows.map((row) => [row.studentId, row.score]),
  );

  return students.map((student, index) => ({
    id: student.id,
    name: student.fullName,
    initials: initialsOf(student.fullName),
    avatarClassName: avatarPalettes[index % avatarPalettes.length]!,
    nisn: student.nisn || student.nomorInduk || "-",
    className,
    subject: subjectLabel,
    nilai: scoreByStudent.get(student.id) ?? null,
  }));
}
