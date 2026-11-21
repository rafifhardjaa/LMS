export type ClassFilter = "VII-A" | "VII-B" | "VI-A" | "VI-B" | "VIII-A";
export type SubjectFilter = "Fisika Terapan" | "IPA Terpadu" | "Sains Rekayasa";
export type AssessmentFilter = "all" | "formatif" | "sts" | "praktik";
export type GradeTone = "success" | "danger";

export type StudentGrade = {
  id: string;
  name: string;
  initials: string;
  avatarClassName: string;
  nisn: string;
  rollNo: string;
  className: ClassFilter;
  subject: SubjectFilter;
  formatif: number;
  sts: number;
  praktik: number;
  remedialReason?: string;
};

export type GradeStatus = {
  label: string;
  className: string;
  tone: GradeTone;
};
