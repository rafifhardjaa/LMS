## 🌳 GIT WORKFLOW INSTRUCTIONS (PROFESSIONAL FLOW)

Sebagai AI Agent, kamu dilarang melakukan commit langsung ke branch `main`. Ikuti prosedur Git Flow profesional berikut setelah selesai menulis dan memvalidasi kode:

1. **Buat Branch Baru**: Gunakan command `git checkout -b feature/<nama-fitur-relevan>` (contoh: `feature/reviews-notifications`).

2. **Stage Changes**: `git add .`

3. **Commit Messages**: Gunakan standar Conventional Commits:

   - `feat: <deskripsi>` untuk fitur baru.

   - `fix: <deskripsi>` untuk perbaikan bug.

   - `chore: <deskripsi>` untuk update schema/config.

   Contoh: `git commit -m "feat: implement reviews and notifications endpoints"`

4. **Push Branch**: `git push -u origin feature/<nama-fitur-relevan>`

Jangan lakukan merge. Biarkan pengguna (Tech Lead) yang membuat Pull Request (PR) dan melakukan merge ke `main` secara manual.