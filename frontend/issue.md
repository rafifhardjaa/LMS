ATURAN CODING
1. jangan sentuh kode backend
2. jangan integrasi frontend dengan backend
3. jangan sentuh kode di backend
4. fokus pada ruang lingkup frontend saja
5. setelah selesai menambah atau mengubah(ada perubahan) commit dan push satu per satu agar kontribusi dihitung lebih banyak.

---

# Issue: Penerapan Animasi Konsisten pada Halaman Student

## Latar Belakang

Halaman `admin/dashboard` sudah memiliki sistem animasi yang lengkap dan konsisten menggunakan **Framer Motion** (`framer-motion ^13.2.0`) dan **tw-animate-css** (`^1.4.0`). Semua primitive animasi sudah tersedia di `components/ui/animations.tsx` (`FadeIn`, `SlideIn`, `StaggerChildren`, `StaggerItem`, `CountUp`, `PulseDot`, `ScaleIn`).

Namun beberapa komponen di halaman **student** belum memanfaatkan primitif tersebut secara konsisten. Berikut adalah gap yang ditemukan beserta task yang perlu dikerjakan.

---

## Library yang Digunakan

| Library | Versi | Kegunaan |
|---|---|---|
| `framer-motion` | `^13.2.0` | Animasi enter/exit, hover, tap, SVG, spring |
| `tw-animate-css` | `^1.4.0` | CSS utility class `animate-ping`, `animate-pulse` |
| Native `requestAnimationFrame` | — | `CountUp` number ticker (sudah ada di `animations.tsx`) |

Tidak perlu menambah library baru. Semua sudah tersedia.

---

## Gap Animasi yang Ditemukan

### 1. `components/student/learning-modules.tsx` — TIDAK ADA animasi
**Masalah:**
- Komponen tidak mengimport `framer-motion` sama sekali.
- Daftar modul (`modules.map`) dirender secara statis tanpa enter animation.
- Filter button (`All`, `Mathematics`, dst.) tidak ada transisi saat active state berganti.
- Download button tidak ada `whileHover` / `whileTap`.

**Yang perlu ditambahkan:**
- Bungkus seluruh section dengan `FadeIn`.
- Bungkus daftar modul dengan `StaggerChildren` + `StaggerItem` agar masuk secara berurutan.
- Tambah `motion.div` dengan `whileHover={{ x: 3 }}` pada setiap baris modul.
- Tambah `motion.button` dengan `whileHover={{ scale: 1.03 }}` + `whileTap={{ scale: 0.97 }}` pada tombol Download.
- Tambah `motion.button` dengan `whileHover` / active indicator pada filter pill.

---

### 2. `components/student/tasks-quizzes.tsx` — TIDAK ADA animasi
**Masalah:**
- Komponen tidak mengimport `framer-motion` sama sekali.
- Tiga task card dirender statis tanpa enter animation.
- Tombol aksi (`Submit Assignment`, `Start Remedial`, `Resume Quiz`) tidak ada `whileHover` / `whileTap`.
- Badge "Ends in 2h 30m" sudah ada `animate-pulse` dari Tailwind, tapi card-nya tidak beranimasi masuk.

**Yang perlu ditambahkan:**
- Bungkus section dengan `FadeIn`.
- Bungkus list task card dengan `StaggerChildren` + `StaggerItem` (stagger delay `0.1`).
- Tambah `motion.div` dengan `whileHover={{ y: -3 }}` + spring transition pada setiap task card.
- Tambah `motion.button` dengan `whileHover={{ scale: 1.03 }}` + `whileTap={{ scale: 0.97 }}` pada tombol aksi.

---

### 3. `components/student/counseling.tsx` — TIDAK ADA animasi
**Masalah:**
- Komponen tidak mengimport `framer-motion` sama sekali.
- Booking form (date picker, time slot, tombol konfirmasi) tidak memiliki animasi.
- Toast konfirmasi (`showToast`) muncul/hilang secara langsung tanpa transisi.
- Tombol mode toggle (`Online Video` / `Offline`) tidak ada spring animation.
- Tombol Book Consultation tidak ada `whileHover` / `whileTap`.

**Yang perlu ditambahkan:**
- Bungkus section dengan `FadeIn`.
- Tambah `motion.button` dengan `whileHover={{ scale: 1.03 }}` + `whileTap={{ scale: 0.97 }}` pada tombol `Book Consultation Schedule`.
- Tambah `motion.button` dengan `whileHover={{ scale: 1.02 }}` pada tombol mode toggle (Online Video / Offline).
- Bungkus date button dan time slot button masing-masing dengan `StaggerChildren` + `StaggerItem`.
- Toast konfirmasi: gunakan `AnimatePresence` + `motion.div` dengan `initial={{ opacity: 0, y: 8 }}` → `animate={{ opacity: 1, y: 0 }}` → `exit={{ opacity: 0, y: -8 }}` agar transisi halus.

---

### 4. `components/student/schedule.tsx` — TIDAK ADA animasi
**Masalah:**
- Komponen tidak mengimport `framer-motion`.
- Card "Next Live Session" dan item jadwal berikutnya dirender statis.
- Tombol `Connect to Class` tidak ada `whileHover` / `whileTap`.
- Badge "Live in 15m" sudah ada `animate-ping` CSS tapi card tidak beranimasi masuk.

**Yang perlu ditambahkan:**
- Bungkus seluruh card dengan `FadeIn delay={0.2}`.
- Tambah `motion.div` dengan `whileHover={{ scale: 1.01 }}` pada card utama (dark green session card).
- Tambah `motion.button` dengan `whileHover={{ scale: 1.04 }}` + `whileTap={{ scale: 0.96 }}` pada tombol `Connect to Class`.
- Tambah `motion.div` dengan `whileHover={{ x: 3 }}` pada item jadwal bawah (Calculus Problem Lab).

---

### 5. `components/student/sidebar.tsx` — Animasi kurang
**Masalah:**
- Nav links tidak memiliki enter animation saat sidebar pertama kali dimuat.
- Active state berganti secara instan tanpa transisi warna yang diperkuat motion.
- Logo/brand area tidak memiliki animasi masuk.

**Yang perlu ditambahkan:**
- Bungkus brand logo dengan `motion.div` `initial={{ opacity: 0, x: -16 }}` → `animate={{ opacity: 1, x: 0 }}`.
- Bungkus `nav` dengan `StaggerChildren` agar menu item masuk berurutan saat load.
- Bungkus setiap `<a>` nav item dengan `StaggerItem`.
- Profile section di bawah: tambah `motion.div` dengan `whileHover={{ x: 2 }}`.

---

### 6. `components/student/topbar.tsx` — Animasi kurang
**Masalah:**
- Tombol `+ Ask AI Tutor` tidak ada `whileHover` / `whileTap`.
- Avatar user di kanan tidak ada animasi hover.
- Notification bell button tidak ada `whileHover`.

**Yang perlu ditambahkan:**
- Tambah `motion.button` dengan `whileHover={{ scale: 1.04 }}` + `whileTap={{ scale: 0.96 }}` pada tombol `+ Ask AI Tutor`.
- Tambah `motion.button` dengan `whileHover={{ scale: 1.08 }}` pada notification bell.
- Tambah `motion.div` dengan `whileHover={{ scale: 1.08 }}` pada avatar user.

---

## Komponen yang Sudah Baik (Tidak Perlu Diubah)

| Komponen | Status |
|---|---|
| `components/student/profile-widget.tsx` | ✅ Lengkap — FadeIn, StaggerChildren, CountUp, PulseDot, whileHover, AnimatePresence |
| `components/student/academic-metrics.tsx` | ✅ Lengkap — FadeIn, StaggerChildren, CountUp, SVG pathLength, whileHover |
| `components/student/trajectory.tsx` | ✅ Lengkap — FadeIn, StaggerChildren, StaggerItem, whileHover, progress bar motion |
| `app/student/dashboard/page.tsx` | ✅ Sudah pakai FadeIn + SlideIn left/right |

---

## Urutan Pengerjaan (Priority)

1. `tasks-quizzes.tsx` — komponen paling visible, banyak interaksi tombol
2. `counseling.tsx` — toast AnimatePresence penting untuk UX
3. `learning-modules.tsx` — stagger list + hover row
4. `schedule.tsx` — animasi sederhana, cepat dikerjakan
5. `sidebar.tsx` — stagger nav item saat load
6. `topbar.tsx` — whileHover tombol utama

---

## Referensi Implementasi

Lihat `components/admin/metric-cards.tsx` untuk contoh `StaggerChildren` + `whileHover` pada card.
Lihat `components/admin/audit-log.tsx` untuk contoh `whileHover={{ x: 4 }}` pada list row.
Lihat `components/admin/quiz-status-chart.tsx` untuk contoh `AnimatePresence` tooltip.
Semua animation primitive ada di `components/ui/animations.tsx`.
