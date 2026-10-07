# Task List: LMS Schema & Learning Core

## Phase 1: Schema Expansion

### Task 1: Add lessons, enrollments, lessonProgress tables
- [x] Acceptance:
  - [x] lessons table added with id, moduleId (FK), title, content, videoUrl, attachmentUrl, orderIndex, createdAt
  - [x] enrollments table added with id, studentId (FK), subjectId (FK), status (default 'active'), enrolledAt
  - [x] lessonProgress table added with id, enrollmentId (FK), lessonId (FK), isCompleted, completedAt
- [x] Verify: TypeScript compiles, no errors in schema.ts
- [x] Files: src/db/schema.ts

### Task 2: Add assignments, assignmentAttempts, grades tables
- [x] Acceptance:
  - [x] assignments table added with id, moduleId (FK), createdBy (FK), title, description, dueDate, maxScore (default 100), createdAt
  - [x] assignmentAttempts table added with id, assignmentId (FK), studentId (FK), fileUrl, attemptNumber (default 1), submittedAt
  - [x] grades table added with id, attemptId (FK), score, feedback, gradedBy (FK), gradedAt
- [x] Verify: TypeScript compiles, no errors
- [x] Files: src/db/schema.ts

### Task 3: Add reviews, notifications tables
- [x] Acceptance:
  - [x] reviews table added with id, subjectId (FK), studentId (FK), rating (1-5), comment, createdAt
  - [x] notifications table added with id, userId (FK), title, message, type, isRead (default false), createdAt
- [x] Verify: TypeScript compiles, no errors
- [x] Files: src/db/schema.ts

### Task 4: Define all relations
- [x] Acceptance:
  - [x] All 8 new tables have Drizzle relations() exports
  - [x] Relations follow existing pattern (one/many, fields/references)
- [x] Verify: TypeScript compiles, exports are correct
- [x] Files: src/db/schema.ts

### Task 5: Run drizzle-kit push
- [x] Acceptance:
  - [x] `bunx drizzle-kit push` runs without errors
  - [x] Migrations created in drizzle/
- [x] Verify: Command output shows success
- [x] Files: drizzle/ (auto-generated)

### Checkpoint: Schema Complete
- [x] All 8 tables in schema.ts
- [x] drizzle-kit push succeeded
- [x] No TypeScript errors

---

## Phase 2: Learning Core Endpoints

### Task 6: Create lessons route
- [x] Acceptance:
  - [x] POST /api/v1/lessons (Auth: ADMIN, GURU) inserts lesson, returns { success: true, data: lesson }
  - [x] GET /api/v1/lessons/module/:moduleId (Auth: All) returns lessons ordered by orderIndex
- [x] Verify: Run dev server, test both endpoints with curl/Postman
- [x] Files: src/routes/lessons.ts

### Task 7: Create enrollments route
- [x] Acceptance:
  - [x] POST /api/v1/enrollments (Auth: SISWA) checks duplicate, inserts with status 'active'
  - [x] GET /api/v1/enrollments/my-courses (Auth: SISWA) returns enrolled subjects
  - [x] PATCH /api/v1/enrollments/:id/status (Auth: ADMIN, GURU) updates status
- [x] Verify: Run dev server, test all 3 endpoints
- [x] Files: src/routes/enrollments.ts

### Task 8: Mount routes in src/index.ts
- [x] Acceptance:
  - [x] lessonsRoute imported and mounted
  - [x] enrollmentsRoute imported and mounted
- [x] Verify: Application starts without errors
- [x] Files: src/index.ts

### Task 9: Verify response format
- [x] Acceptance:
  - [x] All endpoints return { success: boolean, message: string, data?: any }
  - [x] Error responses return { success: false, message: string }
- [x] Verify: Test endpoints, inspect response bodies
- [x] Files: src/routes/lessons.ts, src/routes/enrollments.ts

### Checkpoint: Complete
- [x] 5 endpoints implemented (2 lessons, 3 enrollments)
- [x] All routes mounted
- [x] App builds and starts
