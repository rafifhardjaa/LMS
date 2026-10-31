export type ExportCategory = "nilai" | "presensi" | "dapodik";
export type ExportTab = "all" | ExportCategory;
export type ExportFormat = "xlsx" | "pdf" | "csv" | "zip";
export type ExportSemester = "genap" | "ganjil" | "arsip";
export type ExportSubject = "fisika" | "informatika" | "ipas";
export type ExportLevel = "VII" | "VIII" | "IX";
export type ExportIconTone = "red" | "green" | "blue" | "amber" | "purple";
export type ExportChipTone = "green" | "red" | "blue" | "slate";
export type ExportHistoryTone = "green" | "blue" | "slate" | "red";
export type ExportHistoryIcon = "sheet" | "zip" | "pdf";
export type CustomExportFormat = "xlsx" | "pdf" | "csv";

export type ExportDocumentAction = {
  id: string;
  label: string;
  kind: "download" | "import";
  format: ExportFormat;
};

export type ExportDocumentChip = {
  label: string;
  tone: ExportChipTone;
};

export type ExportDocument = {
  id: string;
  title: string;
  description: string;
  category: ExportCategory;
  semester: ExportSemester;
  subjects: ExportSubject[];
  levels: ExportLevel[];
  audience: string;
  audienceNote: string;
  sizeMb: number;
  updatedLabel: string;
  updatedTime: string;
  iconTone: ExportIconTone;
  chips: ExportDocumentChip[];
  actions: ExportDocumentAction[];
};

export type ExportFilters = {
  semester: ExportSemester;
  subject: ExportSubject | "all";
  level: ExportLevel | "all";
  format: ExportFormat | "all";
};

export type ExportHistoryItem = {
  id: string;
  fileName: string;
  meta: string;
  status: string;
  detail: string;
  tone: ExportHistoryTone;
  icon: ExportHistoryIcon;
};

export type CustomExportComponent = {
  id: string;
  label: string;
  description: string;
  defaultChecked: boolean;
};

export type CustomExportRequest = {
  format: CustomExportFormat;
  componentCount: number;
  signature: boolean;
};
