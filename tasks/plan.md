# Implementation Plan: LMS Schema & Learning Core

## Overview
Complete LMS SIMANIS database schema by adding 8 missing tables (lessons, enrollments, lessonProgress, assignments, assignmentAttempts, grades, reviews, notifications), then implement lessons & enrollments CRUD endpoints with auth and standard response format. Deployed in two independent phases: schema first, then learning-core endpoints.

## Architecture Decisions
- All tables use UUID PKs with `defaultRandom()` and cascade deletes (Drizzle standard)
- Lessons ordered by `orderIndex` ascending; enrollments default to `active` status
- Auth via JWT role checks (ADMIN/GURU for lessons/enrollment status, SISWA for self-enrollment)
- All responses standardized: `{ success, message, data? }`

## Task List

### Phase 1: Schema Expansion
- [ ] Task 1: Add lessons, enrollments, lessonProgress tables to schema.ts
- [ ] Task 2: Add assignments, assignmentAttempts, grades tables to schema.ts
- [ ] Task 3: Add reviews, notifications tables to schema.ts
- [ ] Task 4: Define all relations (Drizzle relations() exports)
- [ ] Task 5: Run drizzle-kit push and verify no errors

### Checkpoint: Schema
- [ ] All 8 tables present in schema.ts
- [ ] `bunx drizzle-kit push` succeeds
- [ ] No TypeScript errors

### Phase 2: Learning Core Endpoints
- [ ] Task 6: Create lessons route (POST, GET /module/:moduleId)
- [ ] Task 7: Create enrollments route (POST, GET /my-courses, PATCH /:id/status)
- [ ] Task 8: Mount routes in src/index.ts
- [ ] Task 9: Verify all endpoints return standard response format

### Checkpoint: Complete
- [ ] All 5 endpoints implemented with auth checks
- [ ] Routes mounted in index.ts
- [ ] Application builds without errors

## Risks and Mitigations
| Risk | Impact | Mitigation |
|---|---|---|
| FK cascade deletes corrupt data if misconfigured | High | Verify each FK constraint matches issue spec before drizzle-kit push |
| Auth checks missing or inconsistent | High | Copy pattern from existing routes (users, subjects, modules) |
| Response format inconsistency | Medium | Standardize all responses with `{ success, message, data? }` wrapper |
| Duplicate enrollments allowed | Medium | Query existing enrollment before insert; reject if found |

## Open Questions
None.
