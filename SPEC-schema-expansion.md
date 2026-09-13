# Spec: Schema Expansion (schema-expansion)

## Objective
Add 8 missing tables to `src/db/schema.ts` to complete LMS SIMANIS database schema. Tables enable lessons, enrollments, progress tracking, assignments, grading, reviews, and notifications. Success: all 8 tables defined with correct FK constraints, relations, and column specs per issue #23.

## Tech Stack
- Drizzle ORM 0.45.2 with PostgreSQL dialect
- Bun (build/runtime)
- TypeScript 7

## Commands
```
Dev: bun --watch src/index.ts
DB Push: bunx drizzle-kit push
```

## Project Structure
```
src/db/schema.ts       → All table definitions + relations
drizzle/               → Migration artifacts (auto-generated)
```

## Code Style
Existing convention (from schema.ts):
- Table names: `snake_case` in DB, `camelCase` export
- Column names: `snake_case` in DB
- FK: `references(() => table.column, { onDelete: "cascade" })`
- Defaults: `defaultRandom()` for UUID PKs, `defaultNow()` for timestamps

Example:
```typescript
export const lessons = pgTable("lessons", {
  id: uuid("id").defaultRandom().primaryKey(),
  moduleId: uuid("module_id").notNull().references(() => modules.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 150 }).notNull(),
  orderIndex: integer("order_index").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});
```

## Boundaries
- Always: Use `snake_case` for DB columns, `camelCase` for exports; cascade deletes on all FKs per issue spec
- Ask first: Changing existing table structure or FK logic
- Never: Commit without running `bunx drizzle-kit push` to verify no DB errors

## Success Criteria
- [ ] All 8 tables added to `src/db/schema.ts`:
  - lessons, enrollments, lessonProgress, assignments, assignmentAttempts, grades, reviews, notifications
- [ ] Each table has correct PK (uuid, defaultRandom), FK constraints, and column types per issue spec
- [ ] All relations defined (Drizzle `relations()`)
- [ ] `bunx drizzle-kit push` runs without errors
- [ ] No TypeScript errors in schema file

## Open Questions
None — spec matches issue #23 exactly.
