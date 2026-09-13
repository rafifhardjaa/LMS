# TASK SPECIFICATION: Database Indexing for Query Optimization

## 🤖 CRITICAL INSTRUCTION FOR AI AGENT

**USE INSTALLED SKILLS:** You are running via Orca automation.

1. **GIT FLOW:** Buat branch `chore/db-indexing` SEBELUM mengubah kode.

2. Buka dan modifikasi file `src/db/schema.ts`.

3. Tambahkan implementasi Drizzle indexes pada tabel-tabel yang memiliki relasi (Foreign Key).

4. Gunakan terminal untuk menjalankan `bunx drizzle-kit push` agar index diterapkan ke Supabase.

5. Stage dan commit `git add .` dan `git commit -m "chore: add database indexes for query optimization"`).

6. **FINAL PUSH:** Pindah ke `main` `git checkout main`), merge `git merge chore/db-indexing`), dan push `git push origin main`).

---

## Context &amp; Objective

Laporan Observability Supabase mendeteksi kemunculan lambatnya performa pembacaan database (slow queries). Untuk menambal isu ini sebelum masuk masa production, kita harus menerapkan metode Indexing pada kolom-kolom yang sering digunakan dalam query pencarian `WHERE`) dan relasi antar tabel `JOIN`).

---

## Task Checklist: Schema Indexing `src/db/schema.ts`)

Tambahkan block `(table) => ({ ... })` di akhir definisi setiap tabel berikut menggunakan fungsi `index()` dari `drizzle-orm/pg-core`:

- [ ] *`enrollments`**: Tambahkan index untuk `studentId` dan `subjectId`.

- [ ] *`lessons`**: Tambahkan index untuk `moduleId` dan `orderIndex`.

- [ ] *`lessonProgress`**: Tambahkan index untuk `enrollmentId` dan `lessonId`.

- [ ] *`assignments`**: Tambahkan index untuk `moduleId`.

- [ ] *`assignmentAttempts`**: Tambahkan index untuk `assignmentId` dan `studentId`.

- [ ] *`grades`**: Tambahkan index untuk `attemptId`.

- [ ] *`reviews`**: Tambahkan index untuk `subjectId`.

- [ ] *`notifications`**: Tambahkan index untuk `userId`.

*Referensi Syntax Drizzle untuk Agen:*

```typescript

export const enrollments = pgTable('enrollments', {

  // ... kolom-kolom ...

}, (table) =&gt; ({

  studentIdx: index('enrollment_student_idx').on(table.studentId),

  subjectIdx: index('enrollment_subject_idx').on(table.subjectId),

}));