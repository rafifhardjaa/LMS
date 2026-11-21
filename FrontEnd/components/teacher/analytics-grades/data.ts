import type {
  AssessmentFilter,
  ClassFilter,
  GradeStatus,
  StudentGrade,
  SubjectFilter,
} from "./types";

export const kktp = 75;
export const totalStudents = 35;
export const pageSize = 6;

export const classOptions: { value: ClassFilter; label: string }[] = [
  { value: "VII-A", label: "VII - A" },
  { value: "VII-B", label: "VII - B" },
  { value: "VI-A", label: "VI - A" },
  { value: "VI-B", label: "VI - B" },
  { value: "VIII-A", label: "VIII - A" },
];

export const subjectOptions: { value: SubjectFilter; label: string }[] = [
  { value: "Fisika Terapan", label: "Fisika Terapan" },
  { value: "IPA Terpadu", label: "IPA Terpadu" },
  { value: "Sains Rekayasa", label: "Sains Rekayasa" },
];

export const assessmentOptions: { value: AssessmentFilter; label: string }[] = [
  { value: "all", label: "Semua Asesmen" },
  { value: "formatif", label: "Formatif" },
  { value: "sts", label: "Sumatif Tengah Semester" },
  { value: "praktik", label: "Praktikum Lab" },
];

export const students: StudentGrade[] = [
  {
    id: "sarah-azzahra",
    name: "Sarah Azzahra",
    initials: "SA",
    avatarClassName: "bg-[#006398] text-white",
    nisn: "NISN: 00792014",
    rollNo: "No. 24",
    className: "VII-A",
    subject: "Fisika Terapan",
    formatif: 95,
    sts: 94,
    praktik: 96,
  },
  {
    id: "jack-huntsman",
    name: "Jack Huntsman",
    initials: "JH",
    avatarClassName: "bg-[#E0F2FE] text-[#0284C7]",
    nisn: "NISN: 00748291",
    rollNo: "No. 12",
    className: "VII-A",
    subject: "Fisika Terapan",
    formatif: 92,
    sts: 90,
    praktik: 88,
  },
  {
    id: "peter-quill",
    name: "Peter Quill",
    initials: "PQ",
    avatarClassName: "bg-[#DCE9FF] text-[#006398]",
    nisn: "NISN: 00681923",
    rollNo: "No. 19",
    className: "VII-A",
    subject: "Fisika Terapan",
    formatif: 84,
    sts: 82,
    praktik: 85,
  },
  {
    id: "natasha-hughes",
    name: "Natasha Hughes",
    initials: "NH",
    avatarClassName: "bg-[#F3E8FF] text-[#9333EA]",
    nisn: "NISN: 00982341",
    rollNo: "No. 17",
    className: "VII-A",
    subject: "Fisika Terapan",
    formatif: 80,
    sts: 78,
    praktik: 82,
  },
  {
    id: "jim-anderson",
    name: "Jim Anderson",
    initials: "JA",
    avatarClassName: "bg-[#FFEBEB] text-[#b71422]",
    nisn: "NISN: 00982342",
    rollNo: "No. 08",
    className: "VII-A",
    subject: "Fisika Terapan",
    formatif: 70,
    sts: 74,
    praktik: 76,
    remedialReason: "Remedial STS (Kalor)",
  },
  {
    id: "john-kurt",
    name: "John Kurt",
    initials: "JK",
    avatarClassName: "bg-[#FFEBEB] text-[#b71422]",
    nisn: "NISN: 00982341",
    rollNo: "No. 10",
    className: "VII-A",
    subject: "Fisika Terapan",
    formatif: 72,
    sts: 68,
    praktik: 75,
    remedialReason: "Remedial TP 2 & STS",
  },
  {
    id: "lisa-hilton",
    name: "Lisa Hilton",
    initials: "LH",
    avatarClassName: "bg-[#DCFCE7] text-[#16A34A]",
    nisn: "NISN: 00982344",
    rollNo: "No. 22",
    className: "VII-A",
    subject: "Fisika Terapan",
    formatif: 86,
    sts: 84,
    praktik: 88,
  },
  {
    id: "bagus-wicaksono",
    name: "Bagus Wicaksono",
    initials: "BW",
    avatarClassName: "bg-[#FEF3C7] text-[#D97706]",
    nisn: "NISN: 00982347",
    rollNo: "No. 05",
    className: "VII-A",
    subject: "Fisika Terapan",
    formatif: 76,
    sts: 70,
    praktik: 72,
    remedialReason: "Remedial Kalor",
  },
  {
    id: "nadia-putri",
    name: "Nadia Putri",
    initials: "NP",
    avatarClassName: "bg-[#F3E8FF] text-[#9333EA]",
    nisn: "NISN: 00982351",
    rollNo: "No. 28",
    className: "VII-A",
    subject: "Fisika Terapan",
    formatif: 88,
    sts: 86,
    praktik: 90,
  },
  {
    id: "raka-pratama",
    name: "Raka Pratama",
    initials: "RP",
    avatarClassName: "bg-[#E0F2FE] text-[#0284C7]",
    nisn: "NISN: 00982355",
    rollNo: "No. 30",
    className: "VII-A",
    subject: "Fisika Terapan",
    formatif: 82,
    sts: 80,
    praktik: 84,
  },
  {
    id: "siti-rahma",
    name: "Siti Rahma",
    initials: "SR",
    avatarClassName: "bg-[#DCFCE7] text-[#16A34A]",
    nisn: "NISN: 00982358",
    rollNo: "No. 31",
    className: "VII-A",
    subject: "Fisika Terapan",
    formatif: 91,
    sts: 89,
    praktik: 92,
  },
  {
    id: "dimas-saputra",
    name: "Dimas Saputra",
    initials: "DS",
    avatarClassName: "bg-[#FFEDD5] text-[#C2410C]",
    nisn: "NISN: 00982361",
    rollNo: "No. 32",
    className: "VII-A",
    subject: "Fisika Terapan",
    formatif: 78,
    sts: 76,
    praktik: 80,
  },
  {
    id: "ayu-lestari",
    name: "Ayu Lestari",
    initials: "AL",
    avatarClassName: "bg-[#FCE7F3] text-[#BE185D]",
    nisn: "NISN: 00982364",
    rollNo: "No. 33",
    className: "VII-A",
    subject: "Fisika Terapan",
    formatif: 87,
    sts: 85,
    praktik: 89,
  },
  {
    id: "fajar-nugroho",
    name: "Fajar Nugroho",
    initials: "FN",
    avatarClassName: "bg-[#FFEBEB] text-[#b71422]",
    nisn: "NISN: 00982367",
    rollNo: "No. 34",
    className: "VII-A",
    subject: "Fisika Terapan",
    formatif: 74,
    sts: 72,
    praktik: 73,
    remedialReason: "Remedial Kalor",
  },
  {
    id: "citra-dewi",
    name: "Citra Dewi",
    initials: "CD",
    avatarClassName: "bg-[#EDE9FE] text-[#7C3AED]",
    nisn: "NISN: 00982370",
    rollNo: "No. 35",
    className: "VII-A",
    subject: "Fisika Terapan",
    formatif: 90,
    sts: 88,
    praktik: 91,
  },
];

export function getFinalScore(student: StudentGrade) {
  return Number(
    (student.formatif * 0.3 + student.sts * 0.3 + student.praktik * 0.4).toFixed(
      1,
    ),
  );
}

export function getStudentStatus(student: StudentGrade): GradeStatus {
  const finalScore = getFinalScore(student);

  if (finalScore < kktp) {
    return {
      label: student.remedialReason ?? "Remedial",
      className: "bg-[#FEE2E2] text-[#b71422]",
      tone: "danger",
    };
  }

  if (finalScore >= 90) {
    return {
      label: "Tuntas (Unggulan)",
      className: "bg-[#DCFCE7] text-[#16A34A]",
      tone: "success",
    };
  }

  if (finalScore >= 85) {
    return {
      label: "Tuntas (Sangat Mahir)",
      className: "bg-[#DCFCE7] text-[#16A34A]",
      tone: "success",
    };
  }

  if (finalScore >= 80) {
    return {
      label: "Tuntas (Mahir)",
      className: "bg-[#DCFCE7] text-[#16A34A]",
      tone: "success",
    };
  }

  return {
    label: "Tuntas (Cukup)",
    className: "bg-[#DCFCE7] text-[#16A34A]",
    tone: "success",
  };
}
