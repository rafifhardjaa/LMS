import { apiFetch } from "./client";
import type { ApiSuccess } from "./types";

export interface Major {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  classCount: number;
  subjectCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GradeLevel {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  classCount: number;
  subjectCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  section: string;
  majorId: string;
  majorCode: string | null;
  majorName: string | null;
  gradeLevelId: string;
  gradeCode: string | null;
  gradeName: string | null;
  capacity: number;
  isActive: boolean;
  studentCount: number;
  teacherCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description: string | null;
  majorId: string | null;
  majorCode: string | null;
  majorName: string | null;
  gradeLevelId: string;
  gradeCode: string | null;
  gradeName: string | null;
  semester: string;
  isActive: boolean;
  createdBy: string | null;
  createdByName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherSubjectAssignment {
  id: string;
  teacherId: string;
  teacherName: string | null;
  teacherNip: string | null;
  subjectId: string;
  subjectName: string | null;
  subjectCode: string | null;
  assignedAt: string;
}

export interface TeacherClassroomAssignment {
  id: string;
  teacherId: string;
  teacherName: string | null;
  teacherNip: string | null;
  classId: string;
  className: string | null;
  section: string | null;
  majorCode: string | null;
  gradeCode: string | null;
  assignedAt: string;
}

export interface TeacherSummary {
  id: string;
  fullName: string;
  nomorInduk: string | null;
  email: string | null;
  isActive: boolean;
  subjectCount: number;
  classCount: number;
  majorCode: string | null;
  majorName: string | null;
  subjects: string | null;
}

export interface StudentSummary {
  id: string;
  fullName: string;
  nomorInduk: string | null;
  email: string | null;
  kelas: string | null;
  isActive: boolean;
  className: string | null;
  majorCode: string | null;
  majorName: string | null;
  gradeCode: string | null;
  gradeName: string | null;
}

export interface JadwalPelajaran {
  id: string;
  classId: string;
  className: string;
  classSection: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  gradeLevelId: string;
  gradeCode: string;
  majorId: string;
  majorCode: string;
  majorName: string;
  hari: string;
  sesi: number;
  waktuMulai: string;
  waktuSelesai: string;
  durasi: number;
  bentrokKelas: number | null;
  durasiLebihDari90: number | null;
  diLuarJamKerja: number | null;
  jatuhDiIstirahat: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface JadwalPelajaranFilters {
  classId?: string;
  gradeLevelId?: string;
  majorId?: string;
  hari?: string;
}

export interface MajorInput {
  code: string;
  name: string;
  isActive?: boolean;
}

export interface GradeLevelInput {
  code: string;
  name: string;
  isActive?: boolean;
}

export interface ClassInput {
  name: string;
  section: string;
  majorId: string;
  gradeLevelId: string;
  capacity?: number;
  isActive?: boolean;
}

export interface SubjectInput {
  name: string;
  code: string;
  description?: string | null;
  majorId?: string | null;
  gradeLevelId: string;
  semester?: string;
  isActive?: boolean;
}

export interface SubjectFilters {
  majorId?: string;
  gradeLevelId?: string;
  semester?: string;
  q?: string;
  includeInactive?: boolean;
}

function queryString(params: object) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export const masterDataApi = {
  majors: {
    list: (includeInactive = false) =>
      apiFetch<ApiSuccess<Major[]>>(
        `/api/v1/majors${queryString({ includeInactive })}`
      ),
    create: (body: MajorInput) =>
      apiFetch<ApiSuccess<Major>>("/api/v1/majors", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id: string, body: Partial<MajorInput>) =>
      apiFetch<ApiSuccess<Major>>(`/api/v1/majors/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    remove: (id: string) =>
      apiFetch<ApiSuccess<unknown>>(`/api/v1/majors/${id}`, {
        method: "DELETE",
      }),
  },
  gradeLevels: {
    list: (includeInactive = false) =>
      apiFetch<ApiSuccess<GradeLevel[]>>(
        `/api/v1/grade-levels${queryString({ includeInactive })}`
      ),
    create: (body: GradeLevelInput) =>
      apiFetch<ApiSuccess<GradeLevel>>("/api/v1/grade-levels", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id: string, body: Partial<GradeLevelInput>) =>
      apiFetch<ApiSuccess<GradeLevel>>(`/api/v1/grade-levels/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    remove: (id: string) =>
      apiFetch<ApiSuccess<unknown>>(`/api/v1/grade-levels/${id}`, {
        method: "DELETE",
      }),
  },
  classes: {
    list: (filters: {
      majorId?: string;
      gradeLevelId?: string;
      q?: string;
      includeInactive?: boolean;
    } = {}) =>
      apiFetch<ApiSuccess<SchoolClass[]>>(
        `/api/v1/classes${queryString(filters)}`
      ),
    create: (body: ClassInput) =>
      apiFetch<ApiSuccess<SchoolClass>>("/api/v1/classes", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id: string, body: Partial<ClassInput>) =>
      apiFetch<ApiSuccess<SchoolClass>>(`/api/v1/classes/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    remove: (id: string) =>
      apiFetch<ApiSuccess<unknown>>(`/api/v1/classes/${id}`, {
        method: "DELETE",
      }),
  },
  subjects: {
    list: (filters: SubjectFilters = {}) =>
      apiFetch<ApiSuccess<Subject[]>>(
        `/api/v1/subjects${queryString(filters)}`
      ),
    create: (body: SubjectInput) =>
      apiFetch<ApiSuccess<Subject>>("/api/v1/subjects", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id: string, body: Partial<SubjectInput>) =>
      apiFetch<ApiSuccess<Subject>>(`/api/v1/subjects/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    remove: (id: string) =>
      apiFetch<ApiSuccess<unknown>>(`/api/v1/subjects/${id}`, {
        method: "DELETE",
      }),
  },
  teachers: {
    list: (q?: string, statusFilter?: string) =>
      apiFetch<ApiSuccess<TeacherSummary[]>>(
        `/api/v1/teachers${queryString({ q, statusFilter })}`
      ),
  },
  students: {
    list: (filters: {
      q?: string;
      classId?: string;
      majorId?: string;
      gradeLevelId?: string;
      status?: "active" | "inactive" | "all";
    } = {}) =>
      apiFetch<ApiSuccess<StudentSummary[]>>(
        `/api/v1/students${queryString(filters)}`
      ),
    create: (body: {
      fullName: string;
      nomorInduk?: string;
      tanggalLahir?: string;
      email?: string | null;
      classId?: string | null;
      isActive?: boolean;
    }) =>
      apiFetch<ApiSuccess<StudentSummary>>("/api/v1/students", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id: string, body: Partial<{
      fullName: string;
      nomorInduk?: string;
      tanggalLahir?: string;
      email?: string | null;
      classId?: string | null;
      isActive?: boolean;
    }>) =>
      apiFetch<ApiSuccess<StudentSummary>>(`/api/v1/students/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    remove: (id: string) =>
      apiFetch<ApiSuccess<unknown>>(`/api/v1/students/${id}`, {
        method: "DELETE",
      }),
  },
  jadwalPelajaran: {
    list: (filters: JadwalPelajaranFilters = {}) =>
      apiFetch<ApiSuccess<JadwalPelajaran[]>>(
        `/api/v1/jadwal-pelajaran${queryString(filters)}`
      ),
  },
  teacherAssignments: {
    listSubjects: (filters: { teacherId?: string; subjectId?: string } = {}) =>
      apiFetch<ApiSuccess<TeacherSubjectAssignment[]>>(
        `/api/v1/teacher-assignments/subjects${queryString(filters)}`
      ),
    assignSubject: (body: { teacherId: string; subjectId: string }) =>
      apiFetch<ApiSuccess<{ id: string }>>(
        "/api/v1/teacher-assignments/subjects",
        { method: "POST", body: JSON.stringify(body) }
      ),
    removeSubject: (id: string) =>
      apiFetch<ApiSuccess<unknown>>(
        `/api/v1/teacher-assignments/subjects/${id}`,
        { method: "DELETE" }
      ),
    listClasses: (filters: { teacherId?: string; classId?: string } = {}) =>
      apiFetch<ApiSuccess<TeacherClassroomAssignment[]>>(
        `/api/v1/teacher-assignments/classes${queryString(filters)}`
      ),
    assignClass: (body: { teacherId: string; classId: string }) =>
      apiFetch<ApiSuccess<{ id: string }>>(
        "/api/v1/teacher-assignments/classes",
        { method: "POST", body: JSON.stringify(body) }
      ),
    removeClass: (id: string) =>
      apiFetch<ApiSuccess<unknown>>(
        `/api/v1/teacher-assignments/classes/${id}`,
        { method: "DELETE" }
      ),
  },
  modules: {
    list: () =>
      apiFetch<ApiSuccess<{ id: string; title: string; description?: string }[]>>(
        `/api/v1/modules`
      ),
    byModule: (moduleId: string) =>
      apiFetch<ApiSuccess<{ id: string; title: string; description?: string; progress: number }>>(
        `/api/v1/modules/${moduleId}`
      ),
  },
  progress: {
    byModule: (moduleId: string) =>
      apiFetch<ApiSuccess<{ percentage: number; completed: number; total: number }>>(
        `/api/v1/progress/module/${moduleId}`
      ),
  },
} as const;
