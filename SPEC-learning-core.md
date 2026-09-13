# Spec: Learning Core (learning-core)

## Objective
Implement lessons & enrollments CRUD endpoints (`src/routes/lessons.ts`, `src/routes/enrollments.ts`) with auth checks and response standardization. Enable students to enroll in subjects and access lesson content. Success: 5 endpoints passing auth checks, returning standard response format, and registered in `src/index.ts`.

## Tech Stack
- Elysia 1.4.30 (routing framework)
- Drizzle ORM 0.45.2 (queries)
- JWT auth via `@elysiajs/jwt`
- PostgreSQL

## Commands
```
Dev: bun --watch src/index.ts
DB Push: bunx drizzle-kit push
```

## Project Structure
```
src/routes/lessons.ts      → Lessons endpoints (POST, GET)
src/routes/enrollments.ts  → Enrollments endpoints (POST, GET, PATCH)
src/index.ts               → Import & mount routes
```

## Code Style
From existing routes (users, subjects, modules):
- Endpoint handler: async function returning `{ success, message, data? }`
- Auth: Guard via `context.jwt` or role checks
- Query: Use Drizzle `eq()`, `and()` from `drizzle-orm`
- Response: `{ success: true, message: "...", data: ... }` or `{ success: false, message: "..." }`

Example pattern:
```typescript
export const lessonsRoute = new Elysia({ prefix: "/api/v1" })
  .post("/lessons", async ({ body, jwt }) => {
    if (!jwt) return { success: false, message: "Unauthorized" };
    // insert & return
    return { success: true, message: "Lesson created", data: lesson };
  });
```

## Boundaries
- Always: Validate `moduleId`, `subjectId`, `studentId` exist before insert; check auth roles (ADMIN/GURU for lessons, SISWA for enrollments)
- Ask first: Changing enrollment status flow or authorization rules
- Never: Bypass FK constraints or auth checks

## Success Criteria
- [ ] `POST /api/v1/lessons` (Auth: ADMIN, GURU) — inserts lesson, returns 201 + lesson data
- [ ] `GET /api/v1/lessons/module/:moduleId` (Auth: All) — returns lessons ordered by orderIndex
- [ ] `POST /api/v1/enrollments` (Auth: SISWA) — checks duplicate, inserts with status 'active', returns 201 + enrollment
- [ ] `GET /api/v1/enrollments/my-courses` (Auth: SISWA) — returns enrolled subjects for current user
- [ ] `PATCH /api/v1/enrollments/:id/status` (Auth: ADMIN, GURU) — updates enrollment status, returns 200 + updated record
- [ ] Both routes mounted in `src/index.ts`
- [ ] All endpoints return standard response format
- [ ] No TypeScript errors

## Open Questions
None — spec matches issue #23 Phase 2 exactly.
