import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ── Tabel ─────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  phone: varchar("phone", { length: 50 }),
  avatarUrl: text("avatar_url"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

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

export const subjects = pgTable("subjects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdBy: uuid("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

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

export const assignments = pgTable("assignments", {
  id: uuid("id").defaultRandom().primaryKey(),
  moduleId: uuid("module_id")
    .notNull()
    .references(() => modules.id, { onDelete: "cascade" }),
  createdBy: uuid("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  title: varchar("title", { length: 150 }).notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  maxScore: integer("max_score").default(100),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  moduleIdx: index("assignment_module_idx").on(table.moduleId),
}));

export const assignmentAttempts = pgTable("assignment_attempts", {
  id: uuid("id").defaultRandom().primaryKey(),
  assignmentId: uuid("assignment_id")
    .notNull()
    .references(() => assignments.id, { onDelete: "cascade" }),
  studentId: uuid("student_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  fileUrl: text("file_url").notNull(),
  attemptNumber: integer("attempt_number").default(1),
  submittedAt: timestamp("submitted_at").defaultNow(),
}, (table) => ({
  assignmentIdx: index("assignment_attempts_assignment_idx").on(table.assignmentId),
  studentIdx: index("assignment_attempts_student_idx").on(table.studentId),
}));

export const grades = pgTable("grades", {
  id: uuid("id").defaultRandom().primaryKey(),
  attemptId: uuid("attempt_id")
    .notNull()
    .references(() => assignmentAttempts.id, { onDelete: "cascade" }),
  score: integer("score").notNull(),
  feedback: text("feedback"),
  gradedBy: uuid("graded_by").references(() => users.id, {
    onDelete: "set null",
  }),
  gradedAt: timestamp("graded_at").defaultNow(),
}, (table) => ({
  attemptIdx: index("grade_attempt_idx").on(table.attemptId),
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

// ── Relasi (WAJIB: users ↔ roles via user_roles) ───────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  userRoles: many(userRoles),
  subjectsCreated: many(subjects),
  modulesTaught: many(modules),
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
  modules: many(modules),
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
  assignments: many(assignments),
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

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
  module: one(modules, {
    fields: [assignments.moduleId],
    references: [modules.id],
  }),
  creator: one(users, {
    fields: [assignments.createdBy],
    references: [users.id],
  }),
  attempts: many(assignmentAttempts),
}));

export const assignmentAttemptsRelations = relations(
  assignmentAttempts,
  ({ one, many }) => ({
    assignment: one(assignments, {
      fields: [assignmentAttempts.assignmentId],
      references: [assignments.id],
    }),
    student: one(users, {
      fields: [assignmentAttempts.studentId],
      references: [users.id],
    }),
    grades: many(grades),
  })
);

export const gradesRelations = relations(grades, ({ one }) => ({
  attempt: one(assignmentAttempts, {
    fields: [grades.attemptId],
    references: [assignmentAttempts.id],
  }),
  grader: one(users, {
    fields: [grades.gradedBy],
    references: [users.id],
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
