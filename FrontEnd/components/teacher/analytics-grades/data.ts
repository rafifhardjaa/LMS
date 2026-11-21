import type { GradeStatus, StudentGrade } from "./types";

export const kktp = 75;
export const pageSize = 6;

export function getStudentStatus(student: StudentGrade): GradeStatus {
  if (student.nilai === null) {
    return {
      label: "Belum dinilai",
      className: "text-[#94A3B8]",
      tone: "neutral",
    };
  }

  if (student.nilai < kktp) {
    return {
      label: "Remedial",
      className: "text-[#b71422]",
      tone: "danger",
    };
  }

  if (student.nilai >= 90) {
    return {
      label: "Tuntas (Unggulan)",
      className: "text-[#16A34A]",
      tone: "success",
    };
  }

  if (student.nilai >= 85) {
    return {
      label: "Tuntas (Sangat Mahir)",
      className: "text-[#16A34A]",
      tone: "success",
    };
  }

  if (student.nilai >= 80) {
    return {
      label: "Tuntas (Mahir)",
      className: "text-[#16A34A]",
      tone: "success",
    };
  }

  return {
    label: "Tuntas (Cukup)",
    className: "text-[#16A34A]",
    tone: "success",
  };
}
