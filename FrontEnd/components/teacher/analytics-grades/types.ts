export type GradeTone = "success" | "danger" | "neutral";

export type StudentGrade = {
  id: string;
  name: string;
  initials: string;
  avatarClassName: string;
  nisn: string;
  className: string;
  subject: string;
  nilai: number | null;
};

export type GradeStatus = {
  label: string;
  className: string;
  tone: GradeTone;
};
