# TASK SPECIFICATION: Create Database Seeder for Dummy Users

## 🤖 CRITICAL INSTRUCTION FOR AI AGENT

\*\*Context:\*\* The project uses Bun, ElysiaJS, Drizzle ORM, and PostgreSQL. We need a seed script to populate initial dummy users with different roles for local development.

\*\*Current Status:\*\* The database schema has a `users` table with a `password_hash` column that expects an `argon2id` hash.

### Task Checklist:

- \[ \] \*\*1. Create `src/db/seed.ts`\*\*

  - Import the database connection (e.g., from `src/db/index.ts`) and the `users` schema.

  - Create a script to insert at least 3 dummy users representing 3 roles: `admin`, `teacher`, and `student`.

  - \*\*CRITICAL:\*\* The raw password for all dummy users should be `"password123"`. You MUST hash this password using `argon2id` before inserting it into the `password_hash` column. Since this is a Bun environment, use `Bun.password.hash("password123", { algorithm: "argon2id" })` or the project's existing password hashing utility.

  - Ensure the script handles duplicate entries gracefully (e.g., using `.onConflictDoNothing()` based on the email).

  - Add a success `console.log` when the seeding is complete.

- \[ \] \*\*2. Update `package.json`\*\*

  - Add `"seed": "bun run src/db/seed.ts"` to the `scripts` object.

### Execution Target

Generate the `src/db/seed.ts` file, update `package.json`, and commit the changes with the message `feat: add database seeder for dummy users`.