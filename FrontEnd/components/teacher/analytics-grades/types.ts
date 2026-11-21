export type ClassFilter = "VII-A" | "VII-B" | "VI-A" | "VI-B" | "VIII-A";
export type GradeTone = "success" | "danger";

export type StudentGrade = {
  id: string;
  name: string;
  initials: string;
  avatarClassName: string;
  nisn: string;
  rollNo: string;
  className: ClassFilter;
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

export type RemedialGroup = {
  id: string;
  students: string;
  status: string;
  statusClassName: string;
  schedule: string;
  room?: string;
  waiting?: boolean;
};
