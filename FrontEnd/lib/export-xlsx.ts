import * as XLSX from "xlsx";
import {
  getFinalScore,
  getStudentStatus,
} from "@/components/teacher/analytics-grades/data";
import type { StudentGrade } from "@/components/teacher/analytics-grades/types";

type ExportRow = {
  No: number;
  "Nama Siswa": string;
  NISN: string;
  Kelas: string;
  Mapel: string;
  Formatif: number;
  STS: number;
  "Praktik Lab": number;
  "Nilai Akhir": number;
  "Status KKTP": string;
  Keterangan: string;
};

export function exportStudentsToXlsx(
  students: StudentGrade[],
  filename: string,
) {
  const rows: ExportRow[] = students.map((student, index) => {
    const status = getStudentStatus(student);

    return {
      No: index + 1,
      "Nama Siswa": student.name,
      NISN: student.nisn,
      Kelas: student.className,
      Mapel: student.subject,
      Formatif: student.formatif,
      STS: student.sts,
      "Praktik Lab": student.praktik,
      "Nilai Akhir": getFinalScore(student),
      "Status KKTP": status.label,
      Keterangan: status.tone === "danger" ? "Perlu Remidi" : "Tuntas",
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Nilai");
  XLSX.writeFile(workbook, filename);
}
