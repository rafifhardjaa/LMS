import * as XLSX from "xlsx";
import { getStudentStatus } from "@/components/teacher/analytics-grades/data";
import type { StudentGrade } from "@/components/teacher/analytics-grades/types";

type ExportRow = {
  No: number;
  NISN: string;
  "Nama Siswa": string;
  Kelas: string;
  Mapel: string;
  Nilai: number | string;
  "Status KKTP": string;
};

export function exportStudentsToXlsx(
  students: StudentGrade[],
  filename: string,
) {
  const rows: ExportRow[] = students.map((student, index) => {
    const status = getStudentStatus(student);

    return {
      No: index + 1,
      NISN: student.nisn,
      "Nama Siswa": student.name,
      Kelas: student.className,
      Mapel: student.subject,
      Nilai: student.nilai === null ? "Belum dinilai" : student.nilai,
      "Status KKTP": status.label,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Nilai");
  XLSX.writeFile(workbook, filename);
}
