import {
  boolean,
  date,
  index,
  integer,
  pgTable,
  serial,
  text,
  time,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ── Tabel ─────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  // Email & password boleh kosong untuk siswa yang didaftarkan admin lewat
  // roster: keduanya baru terisi saat siswa menyelesaikan aktivasi.
  email: varchar("email", { length: 255 }).unique(),
  passwordHash: text("password_hash"),
  // NIS untuk siswa, NIP untuk guru. Dipakai sebagai identitas login
  // alternatif email dan sebagai bahan password default.
  nomorInduk: varchar("nomor_induk", { length: 50 }).unique(),
  // Kode guru dari data sekolah/import (mis. "G-PJK-01"). Terpisah dari
  // nomor induk agar identitas internal dan kode eksternal tidak tercampur.
  kodeGuru: varchar("kode_guru", { length: 50 }).unique(),
  tanggalLahir: date("tanggal_lahir", { mode: "string" }),
  kelas: varchar("kelas", { length: 50 }),
  classId: uuid("class_id").references(() => classes.id, {
    onDelete: "set null",
  }),
  phone: varchar("phone", { length: 50 }),
  avatarUrl: text("avatar_url"),
  isActive: boolean("is_active").default(true).notNull(),
  // NULL berarti user wajib mengganti password (password default/awal).
  passwordChangedAt: timestamp("password_changed_at"),
  // Dinaikkan setiap password diganti/direset; token JWT dengan versi lama
  // otomatis ditolak.
  tokenVersion: integer("token_version").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const authTokens = pgTable(
  "auth_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // "activation" (aktivasi akun) | "password_reset" (lupa password).
    type: varchar("type", { length: 30 }).notNull(),
    // Hanya hash SHA-256 yang disimpan; token mentah hanya ada di email.
    tokenHash: varchar("token_hash", { length: 64 }).notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    usedAt: timestamp("used_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userTypeIdx: index("auth_token_user_type_idx").on(
      table.userId,
      table.type
    ),
  })
);

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  description: text("description"),
});

export const userRoles = pgTable("user_roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  roleId: integer("role_id")
    .notNull()
    .references(() => roles.id, { onDelete: "cascade" }),
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
});

export const subjects = pgTable(
  "subjects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    code: varchar("code", { length: 100 }).notNull(),
    description: text("description"),
    // Mata pelajaran kejuruan wajib memiliki jurusan; mapel umum harus null.
    majorId: uuid("major_id").references(() => majors.id, {
      onDelete: "set null",
    }),
    gradeLevelId: uuid("grade_level_id").references(() => gradeLevels.id, {
      onDelete: "set null",
    }),
    semester: varchar("semester", { length: 20 }).default("Ganjil").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdBy: uuid("created_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    codeIdx: index("subjects_code_idx").on(
      table.code,
      table.gradeLevelId,
      table.semester
    ),
    codeUnique: uniqueIndex("subjects_code_unique_idx")
      .on(
        table.code,
        table.gradeLevelId,
        table.semester
      ),
    majorIdx: index("subjects_major_idx").on(table.majorId),
    gradeLevelIdx: index("subjects_grade_level_idx").on(table.gradeLevelId),
  })
);

export const modules = pgTable("modules", {
  id: uuid("id").defaultRandom().primaryKey(),
  subjectId: uuid("subject_id")
    .notNull()
    .references(() => subjects.id, { onDelete: "cascade" }),
  teacherId: uuid("teacher_id").references(() => users.id, {
    onDelete: "set null",
  }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  orderIndex: integer("order_index").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const lessons = pgTable("lessons", {
  id: uuid("id").defaultRandom().primaryKey(),
  moduleId: uuid("module_id")
    .notNull()
    .references(() => modules.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 150 }).notNull(),
  content: text("content"),
  videoUrl: text("video_url"),
  attachmentUrl: text("attachment_url"),
  orderIndex: integer("order_index").default(0),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  moduleIdx: index("lesson_module_idx").on(table.moduleId),
  orderIdx: index("lesson_order_idx").on(table.orderIndex),
}));

export const enrollments = pgTable("enrollments", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  subjectId: uuid("subject_id")
    .notNull()
    .references(() => subjects.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 20 }).default("active"),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
}, (table) => ({
  studentIdx: index("enrollment_student_idx").on(table.studentId),
  subjectIdx: index("enrollment_subject_idx").on(table.subjectId),
}));

export const lessonProgress = pgTable("lesson_progress", {
  id: uuid("id").defaultRandom().primaryKey(),
  enrollmentId: uuid("enrollment_id")
    .notNull()
    .references(() => enrollments.id, { onDelete: "cascade" }),
  lessonId: uuid("lesson_id")
    .notNull()
    .references(() => lessons.id, { onDelete: "cascade" }),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
}, (table) => ({
  enrollmentIdx: index("lesson_progress_enrollment_idx").on(table.enrollmentId),
  lessonIdx: index("lesson_progress_lesson_idx").on(table.lessonId),
}));

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  subjectId: uuid("subject_id")
    .notNull()
    .references(() => subjects.id, { onDelete: "cascade" }),
  studentId: uuid("student_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  subjectIdx: index("review_subject_idx").on(table.subjectId),
}));

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 150 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  userIdx: index("notification_user_idx").on(table.userId),
}));

export const moduleDiscussions = pgTable(
  "module_discussions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    moduleId: uuid("module_id")
      .notNull()
      .references(() => modules.id, { onDelete: "cascade" }),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    moduleCreatedIdx: index("module_discussion_module_created_idx").on(
      table.moduleId,
      table.createdAt
    ),
  })
);

export const moduleDiscussionReplies = pgTable(
  "module_discussion_replies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    discussionId: uuid("discussion_id")
      .notNull()
      .references(() => moduleDiscussions.id, { onDelete: "cascade" }),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    discussionCreatedIdx: index(
      "module_discussion_reply_discussion_created_idx"
    ).on(table.discussionId, table.createdAt),
  })
);

// ── Master Data SMK (Jurusan, Tingkatan, Kelas, Pengampu) ────────────────

export const majors = pgTable(
  "majors",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: varchar("code", { length: 20 }).notNull().unique(),
    name: varchar("name", { length: 100 }).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    codeIdx: index("majors_code_idx").on(table.code),
  })
);

export const gradeLevels = pgTable(
  "grade_levels",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: varchar("code", { length: 10 }).notNull().unique(),
    name: varchar("name", { length: 50 }).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    codeIdx: index("grade_levels_code_idx").on(table.code),
  })
);

export const classes = pgTable(
  "classes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 50 }).notNull(),
    section: varchar("section", { length: 5 }).notNull(),
    majorId: uuid("major_id")
      .notNull()
      .references(() => majors.id, { onDelete: "cascade" }),
    gradeLevelId: uuid("grade_level_id")
      .notNull()
      .references(() => gradeLevels.id, { onDelete: "cascade" }),
    capacity: integer("capacity").default(10).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    majorIdx: index("classes_major_idx").on(table.majorId),
    gradeLevelIdx: index("classes_grade_level_idx").on(table.gradeLevelId),
    nameIdx: index("classes_name_idx").on(
      table.name,
      table.majorId,
      table.gradeLevelId
    ),
  })
);

export const teacherSubjects = pgTable(
  "teacher_subjects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
  },
  (table) => ({
    teacherIdx: index("teacher_subjects_teacher_idx").on(table.teacherId),
    subjectIdx: index("teacher_subjects_subject_idx").on(table.subjectId),
    uniquePair: uniqueIndex("teacher_subjects_unique_idx")
      .on(table.teacherId, table.subjectId),
  })
);

export const teacherClassrooms = pgTable(
  "teacher_classrooms",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    classId: uuid("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
  },
  (table) => ({
    teacherIdx: index("teacher_classrooms_teacher_idx").on(table.teacherId),
    classIdx: index("teacher_classrooms_class_idx").on(table.classId),
    uniquePair: uniqueIndex("teacher_classrooms_unique_idx")
      .on(table.teacherId, table.classId),
  })
);

export const teachingAssignments = pgTable(
  "teaching_assignments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    classId: uuid("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
  },
  (table) => ({
    teacherIdx: index("teaching_assignments_teacher_idx").on(table.teacherId),
    subjectIdx: index("teaching_assignments_subject_idx").on(table.subjectId),
    classIdx: index("teaching_assignments_class_idx").on(table.classId),
    uniqueTriple: uniqueIndex("teaching_assignments_unique_idx").on(
      table.teacherId,
      table.subjectId,
      table.classId
    ),
  })
);

export const jadwalPelajaran = pgTable(
  "jadwal_pelajaran",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    classId: uuid("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    teacherId: uuid("teacher_id").references(() => users.id, {
      onDelete: "set null",
    }),
    gradeLevelId: uuid("grade_level_id")
      .notNull()
      .references(() => gradeLevels.id, { onDelete: "cascade" }),
    majorId: uuid("major_id")
      .notNull()
      .references(() => majors.id, { onDelete: "cascade" }),
    hari: varchar("hari", { length: 10 }).notNull(),
    sesi: integer("sesi").notNull(),
    mulai: time("mulai").notNull(),
    selesai: time("selesai").notNull(),
    durasi: integer("durasi").notNull(),
    bentrokKelas: integer("bentrok_kelas").default(0),
    durasiLebihDari90: integer("durasi_lebih_dari_90").default(0),
    diLuarJamKerja: integer("di_luar_jam_kerja").default(0),
    jatuhDiIstirahat: integer("jatuh_di_istirahat").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    classHariSesiIdx: index("jadwal_pelajaran_class_hari_sesi_idx").on(
      table.classId,
      table.hari,
      table.sesi
    ),
    subjectIdx: index("jadwal_pelajaran_subject_idx").on(table.subjectId),
    majorIdx: index("jadwal_pelajaran_major_idx").on(table.majorId),
    teacherHariSesiIdx: index("jadwal_pelajaran_teacher_hari_sesi_idx").on(
      table.teacherId,
      table.hari,
      table.sesi
    ),
  })
);

// ── Relasi (WAJIB: users ↔ roles via user_roles) ───────────────────────

export const usersRelations = relations(users, ({ one, many }) => ({
  userRoles: many(userRoles),
  subjectsCreated: many(subjects),
  modulesTaught: many(modules),
  authTokens: many(authTokens),
  moduleDiscussions: many(moduleDiscussions),
  moduleDiscussionReplies: many(moduleDiscussionReplies),
  class: one(classes, {
    fields: [users.classId],
    references: [classes.id],
  }),
  teacherSubjects: many(teacherSubjects),
  teacherClassrooms: many(teacherClassrooms),
  teachingAssignments: many(teachingAssignments),
  jadwalMengajar: many(jadwalPelajaran),
}));

export const authTokensRelations = relations(authTokens, ({ one }) => ({
  user: one(users, {
    fields: [authTokens.userId],
    references: [users.id],
  }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
  creator: one(users, {
    fields: [subjects.createdBy],
    references: [users.id],
  }),
  major: one(majors, {
    fields: [subjects.majorId],
    references: [majors.id],
  }),
  gradeLevel: one(gradeLevels, {
    fields: [subjects.gradeLevelId],
    references: [gradeLevels.id],
  }),
  modules: many(modules),
  teacherSubjects: many(teacherSubjects),
  teachingAssignments: many(teachingAssignments),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [modules.subjectId],
    references: [subjects.id],
  }),
  teacher: one(users, {
    fields: [modules.teacherId],
    references: [users.id],
  }),
  lessons: many(lessons),
  discussions: many(moduleDiscussions),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  module: one(modules, {
    fields: [lessons.moduleId],
    references: [modules.id],
  }),
  lessonProgress: many(lessonProgress),
}));

export const enrollmentsRelations = relations(enrollments, ({ one, many }) => ({
  student: one(users, {
    fields: [enrollments.studentId],
    references: [users.id],
  }),
  subject: one(subjects, {
    fields: [enrollments.subjectId],
    references: [subjects.id],
  }),
  lessonProgress: many(lessonProgress),
}));

export const lessonProgressRelations = relations(lessonProgress, ({ one }) => ({
  enrollment: one(enrollments, {
    fields: [lessonProgress.enrollmentId],
    references: [enrollments.id],
  }),
  lesson: one(lessons, {
    fields: [lessonProgress.lessonId],
    references: [lessons.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  subject: one(subjects, {
    fields: [reviews.subjectId],
    references: [subjects.id],
  }),
  student: one(users, {
    fields: [reviews.studentId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const moduleDiscussionsRelations = relations(
  moduleDiscussions,
  ({ one, many }) => ({
    module: one(modules, {
      fields: [moduleDiscussions.moduleId],
      references: [modules.id],
    }),
    author: one(users, {
      fields: [moduleDiscussions.authorId],
      references: [users.id],
    }),
    replies: many(moduleDiscussionReplies),
  })
);

export const moduleDiscussionRepliesRelations = relations(
  moduleDiscussionReplies,
  ({ one }) => ({
    discussion: one(moduleDiscussions, {
      fields: [moduleDiscussionReplies.discussionId],
      references: [moduleDiscussions.id],
    }),
    author: one(users, {
      fields: [moduleDiscussionReplies.authorId],
      references: [users.id],
    }),
  })
);

export const majorsRelations = relations(majors, ({ many }) => ({
  classes: many(classes),
  subjects: many(subjects),
}));

export const gradeLevelsRelations = relations(gradeLevels, ({ many }) => ({
  classes: many(classes),
  subjects: many(subjects),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  major: one(majors, {
    fields: [classes.majorId],
    references: [majors.id],
  }),
  gradeLevel: one(gradeLevels, {
    fields: [classes.gradeLevelId],
    references: [gradeLevels.id],
  }),
  students: many(users),
  teachers: many(teacherClassrooms),
  teachingAssignments: many(teachingAssignments),
  jadwalPelajaran: many(jadwalPelajaran),
}));

export const teacherSubjectsRelations = relations(teacherSubjects, ({ one }) => ({
  teacher: one(users, {
    fields: [teacherSubjects.teacherId],
    references: [users.id],
  }),
  subject: one(subjects, {
    fields: [teacherSubjects.subjectId],
    references: [subjects.id],
  }),
}));

export const teacherClassroomsRelations = relations(teacherClassrooms, ({ one }) => ({
  teacher: one(users, {
    fields: [teacherClassrooms.teacherId],
    references: [users.id],
  }),
  class: one(classes, {
    fields: [teacherClassrooms.classId],
    references: [classes.id],
  }),
}));

export const teachingAssignmentsRelations = relations(
  teachingAssignments,
  ({ one }) => ({
    teacher: one(users, {
      fields: [teachingAssignments.teacherId],
      references: [users.id],
    }),
    subject: one(subjects, {
      fields: [teachingAssignments.subjectId],
      references: [subjects.id],
    }),
    class: one(classes, {
      fields: [teachingAssignments.classId],
      references: [classes.id],
    }),
  })
);

export const jadwalPelajaranRelations = relations(jadwalPelajaran, ({ one }) => ({
  class: one(classes, {
    fields: [jadwalPelajaran.classId],
    references: [classes.id],
  }),
  subject: one(subjects, {
    fields: [jadwalPelajaran.subjectId],
    references: [subjects.id],
  }),
  teacher: one(users, {
    fields: [jadwalPelajaran.teacherId],
    references: [users.id],
  }),
}));
