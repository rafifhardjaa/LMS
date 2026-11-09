// Data dasar jurusan, tingkatan, dan kelas untuk seed development.
// Guru, mapel, dan penugasan diisi lewat `bun run db:import-jadwal`.

export type SeedMajor = { code: string; name: string };
export type SeedGradeLevel = { code: string; name: string };
export type SeedClass = { name: string; majorCode: string; gradeCode: string; section: string };

export const majorsData: SeedMajor[] = [
  {
    "code": "AKL",
    "name": "Akuntansi dan Keuangan Lembaga"
  },
  {
    "code": "BDG",
    "name": "Bisnis Digital"
  },
  {
    "code": "DKV",
    "name": "Desain Komunikasi Visual"
  },
  {
    "code": "HTL",
    "name": "Perhotelan"
  },
  {
    "code": "KUL",
    "name": "Kuliner"
  },
  {
    "code": "PPLG",
    "name": "Pengembangan Perangkat Lunak dan Gim"
  },
  {
    "code": "TJKT",
    "name": "Teknik Jaringan Komputer dan Telekomunikasi"
  },
  {
    "code": "TKI",
    "name": "Teknik Kimia Industri"
  },
  {
    "code": "TKR",
    "name": "Teknik Kendaraan Ringan"
  }
];

export const gradeLevelsData: SeedGradeLevel[] = [
  {
    "code": "X",
    "name": "Kelas X"
  },
  {
    "code": "XI",
    "name": "Kelas XI"
  },
  {
    "code": "XII",
    "name": "Kelas XII"
  }
];

export const classesData: SeedClass[] = [
  {
    "name": "X RPL A",
    "majorCode": "PPLG",
    "gradeCode": "X",
    "section": "A"
  },
  {
    "name": "X RPL B",
    "majorCode": "PPLG",
    "gradeCode": "X",
    "section": "B"
  },
  {
    "name": "X RPL C",
    "majorCode": "PPLG",
    "gradeCode": "X",
    "section": "C"
  },
  {
    "name": "X RPL D",
    "majorCode": "PPLG",
    "gradeCode": "X",
    "section": "D"
  },
  {
    "name": "XI RPL A",
    "majorCode": "PPLG",
    "gradeCode": "XI",
    "section": "A"
  },
  {
    "name": "XI RPL B",
    "majorCode": "PPLG",
    "gradeCode": "XI",
    "section": "B"
  },
  {
    "name": "XI RPL C",
    "majorCode": "PPLG",
    "gradeCode": "XI",
    "section": "C"
  },
  {
    "name": "XI RPL D",
    "majorCode": "PPLG",
    "gradeCode": "XI",
    "section": "D"
  },
  {
    "name": "XII RPL A",
    "majorCode": "PPLG",
    "gradeCode": "XII",
    "section": "A"
  },
  {
    "name": "XII RPL B",
    "majorCode": "PPLG",
    "gradeCode": "XII",
    "section": "B"
  },
  {
    "name": "XII RPL C",
    "majorCode": "PPLG",
    "gradeCode": "XII",
    "section": "C"
  },
  {
    "name": "XII RPL D",
    "majorCode": "PPLG",
    "gradeCode": "XII",
    "section": "D"
  },
  {
    "name": "X TKJ A",
    "majorCode": "TJKT",
    "gradeCode": "X",
    "section": "A"
  },
  {
    "name": "X TKJ B",
    "majorCode": "TJKT",
    "gradeCode": "X",
    "section": "B"
  },
  {
    "name": "X TKJ C",
    "majorCode": "TJKT",
    "gradeCode": "X",
    "section": "C"
  },
  {
    "name": "X TKJ D",
    "majorCode": "TJKT",
    "gradeCode": "X",
    "section": "D"
  },
  {
    "name": "XI TKJ A",
    "majorCode": "TJKT",
    "gradeCode": "XI",
    "section": "A"
  },
  {
    "name": "XI TKJ B",
    "majorCode": "TJKT",
    "gradeCode": "XI",
    "section": "B"
  },
  {
    "name": "XI TKJ C",
    "majorCode": "TJKT",
    "gradeCode": "XI",
    "section": "C"
  },
  {
    "name": "XI TKJ D",
    "majorCode": "TJKT",
    "gradeCode": "XI",
    "section": "D"
  },
  {
    "name": "XII TKJ A",
    "majorCode": "TJKT",
    "gradeCode": "XII",
    "section": "A"
  },
  {
    "name": "XII TKJ B",
    "majorCode": "TJKT",
    "gradeCode": "XII",
    "section": "B"
  },
  {
    "name": "XII TKJ C",
    "majorCode": "TJKT",
    "gradeCode": "XII",
    "section": "C"
  },
  {
    "name": "XII TKJ D",
    "majorCode": "TJKT",
    "gradeCode": "XII",
    "section": "D"
  },
  {
    "name": "X TKI A",
    "majorCode": "TKI",
    "gradeCode": "X",
    "section": "A"
  },
  {
    "name": "X TKI B",
    "majorCode": "TKI",
    "gradeCode": "X",
    "section": "B"
  },
  {
    "name": "X TKI C",
    "majorCode": "TKI",
    "gradeCode": "X",
    "section": "C"
  },
  {
    "name": "X TKI D",
    "majorCode": "TKI",
    "gradeCode": "X",
    "section": "D"
  },
  {
    "name": "XI TKI A",
    "majorCode": "TKI",
    "gradeCode": "XI",
    "section": "A"
  },
  {
    "name": "XI TKI B",
    "majorCode": "TKI",
    "gradeCode": "XI",
    "section": "B"
  },
  {
    "name": "XI TKI C",
    "majorCode": "TKI",
    "gradeCode": "XI",
    "section": "C"
  },
  {
    "name": "XI TKI D",
    "majorCode": "TKI",
    "gradeCode": "XI",
    "section": "D"
  },
  {
    "name": "XII TKI A",
    "majorCode": "TKI",
    "gradeCode": "XII",
    "section": "A"
  },
  {
    "name": "XII TKI B",
    "majorCode": "TKI",
    "gradeCode": "XII",
    "section": "B"
  },
  {
    "name": "XII TKI C",
    "majorCode": "TKI",
    "gradeCode": "XII",
    "section": "C"
  },
  {
    "name": "XII TKI D",
    "majorCode": "TKI",
    "gradeCode": "XII",
    "section": "D"
  },
  {
    "name": "X DKV A",
    "majorCode": "DKV",
    "gradeCode": "X",
    "section": "A"
  },
  {
    "name": "X DKV B",
    "majorCode": "DKV",
    "gradeCode": "X",
    "section": "B"
  },
  {
    "name": "X DKV C",
    "majorCode": "DKV",
    "gradeCode": "X",
    "section": "C"
  },
  {
    "name": "X DKV D",
    "majorCode": "DKV",
    "gradeCode": "X",
    "section": "D"
  },
  {
    "name": "XI DKV A",
    "majorCode": "DKV",
    "gradeCode": "XI",
    "section": "A"
  },
  {
    "name": "XI DKV B",
    "majorCode": "DKV",
    "gradeCode": "XI",
    "section": "B"
  },
  {
    "name": "XI DKV C",
    "majorCode": "DKV",
    "gradeCode": "XI",
    "section": "C"
  },
  {
    "name": "XI DKV D",
    "majorCode": "DKV",
    "gradeCode": "XI",
    "section": "D"
  },
  {
    "name": "XII DKV A",
    "majorCode": "DKV",
    "gradeCode": "XII",
    "section": "A"
  },
  {
    "name": "XII DKV B",
    "majorCode": "DKV",
    "gradeCode": "XII",
    "section": "B"
  },
  {
    "name": "XII DKV C",
    "majorCode": "DKV",
    "gradeCode": "XII",
    "section": "C"
  },
  {
    "name": "XII DKV D",
    "majorCode": "DKV",
    "gradeCode": "XII",
    "section": "D"
  },
  {
    "name": "X AKL A",
    "majorCode": "AKL",
    "gradeCode": "X",
    "section": "A"
  },
  {
    "name": "X AKL B",
    "majorCode": "AKL",
    "gradeCode": "X",
    "section": "B"
  },
  {
    "name": "X AKL C",
    "majorCode": "AKL",
    "gradeCode": "X",
    "section": "C"
  },
  {
    "name": "X AKL D",
    "majorCode": "AKL",
    "gradeCode": "X",
    "section": "D"
  },
  {
    "name": "XI AKL A",
    "majorCode": "AKL",
    "gradeCode": "XI",
    "section": "A"
  },
  {
    "name": "XI AKL B",
    "majorCode": "AKL",
    "gradeCode": "XI",
    "section": "B"
  },
  {
    "name": "XI AKL C",
    "majorCode": "AKL",
    "gradeCode": "XI",
    "section": "C"
  },
  {
    "name": "XI AKL D",
    "majorCode": "AKL",
    "gradeCode": "XI",
    "section": "D"
  },
  {
    "name": "XII AKL A",
    "majorCode": "AKL",
    "gradeCode": "XII",
    "section": "A"
  },
  {
    "name": "XII AKL B",
    "majorCode": "AKL",
    "gradeCode": "XII",
    "section": "B"
  },
  {
    "name": "XII AKL C",
    "majorCode": "AKL",
    "gradeCode": "XII",
    "section": "C"
  },
  {
    "name": "XII AKL D",
    "majorCode": "AKL",
    "gradeCode": "XII",
    "section": "D"
  },
  {
    "name": "X BDG A",
    "majorCode": "BDG",
    "gradeCode": "X",
    "section": "A"
  },
  {
    "name": "X BDG B",
    "majorCode": "BDG",
    "gradeCode": "X",
    "section": "B"
  },
  {
    "name": "X BDG C",
    "majorCode": "BDG",
    "gradeCode": "X",
    "section": "C"
  },
  {
    "name": "X BDG D",
    "majorCode": "BDG",
    "gradeCode": "X",
    "section": "D"
  },
  {
    "name": "XI BDG A",
    "majorCode": "BDG",
    "gradeCode": "XI",
    "section": "A"
  },
  {
    "name": "XI BDG B",
    "majorCode": "BDG",
    "gradeCode": "XI",
    "section": "B"
  },
  {
    "name": "XI BDG C",
    "majorCode": "BDG",
    "gradeCode": "XI",
    "section": "C"
  },
  {
    "name": "XI BDG D",
    "majorCode": "BDG",
    "gradeCode": "XI",
    "section": "D"
  },
  {
    "name": "XII BDG A",
    "majorCode": "BDG",
    "gradeCode": "XII",
    "section": "A"
  },
  {
    "name": "XII BDG B",
    "majorCode": "BDG",
    "gradeCode": "XII",
    "section": "B"
  },
  {
    "name": "XII BDG C",
    "majorCode": "BDG",
    "gradeCode": "XII",
    "section": "C"
  },
  {
    "name": "XII BDG D",
    "majorCode": "BDG",
    "gradeCode": "XII",
    "section": "D"
  },
  {
    "name": "X TKR A",
    "majorCode": "TKR",
    "gradeCode": "X",
    "section": "A"
  },
  {
    "name": "X TKR B",
    "majorCode": "TKR",
    "gradeCode": "X",
    "section": "B"
  },
  {
    "name": "X TKR C",
    "majorCode": "TKR",
    "gradeCode": "X",
    "section": "C"
  },
  {
    "name": "X TKR D",
    "majorCode": "TKR",
    "gradeCode": "X",
    "section": "D"
  },
  {
    "name": "XI TKR A",
    "majorCode": "TKR",
    "gradeCode": "XI",
    "section": "A"
  },
  {
    "name": "XI TKR B",
    "majorCode": "TKR",
    "gradeCode": "XI",
    "section": "B"
  },
  {
    "name": "XI TKR C",
    "majorCode": "TKR",
    "gradeCode": "XI",
    "section": "C"
  },
  {
    "name": "XI TKR D",
    "majorCode": "TKR",
    "gradeCode": "XI",
    "section": "D"
  },
  {
    "name": "XII TKR A",
    "majorCode": "TKR",
    "gradeCode": "XII",
    "section": "A"
  },
  {
    "name": "XII TKR B",
    "majorCode": "TKR",
    "gradeCode": "XII",
    "section": "B"
  },
  {
    "name": "XII TKR C",
    "majorCode": "TKR",
    "gradeCode": "XII",
    "section": "C"
  },
  {
    "name": "XII TKR D",
    "majorCode": "TKR",
    "gradeCode": "XII",
    "section": "D"
  },
  {
    "name": "X HTL A",
    "majorCode": "HTL",
    "gradeCode": "X",
    "section": "A"
  },
  {
    "name": "X HTL B",
    "majorCode": "HTL",
    "gradeCode": "X",
    "section": "B"
  },
  {
    "name": "X HTL C",
    "majorCode": "HTL",
    "gradeCode": "X",
    "section": "C"
  },
  {
    "name": "X HTL D",
    "majorCode": "HTL",
    "gradeCode": "X",
    "section": "D"
  },
  {
    "name": "XI HTL A",
    "majorCode": "HTL",
    "gradeCode": "XI",
    "section": "A"
  },
  {
    "name": "XI HTL B",
    "majorCode": "HTL",
    "gradeCode": "XI",
    "section": "B"
  },
  {
    "name": "XI HTL C",
    "majorCode": "HTL",
    "gradeCode": "XI",
    "section": "C"
  },
  {
    "name": "XI HTL D",
    "majorCode": "HTL",
    "gradeCode": "XI",
    "section": "D"
  },
  {
    "name": "XII HTL A",
    "majorCode": "HTL",
    "gradeCode": "XII",
    "section": "A"
  },
  {
    "name": "XII HTL B",
    "majorCode": "HTL",
    "gradeCode": "XII",
    "section": "B"
  },
  {
    "name": "XII HTL C",
    "majorCode": "HTL",
    "gradeCode": "XII",
    "section": "C"
  },
  {
    "name": "XII HTL D",
    "majorCode": "HTL",
    "gradeCode": "XII",
    "section": "D"
  },
  {
    "name": "X KUL A",
    "majorCode": "KUL",
    "gradeCode": "X",
    "section": "A"
  },
  {
    "name": "X KUL B",
    "majorCode": "KUL",
    "gradeCode": "X",
    "section": "B"
  },
  {
    "name": "X KUL C",
    "majorCode": "KUL",
    "gradeCode": "X",
    "section": "C"
  },
  {
    "name": "X KUL D",
    "majorCode": "KUL",
    "gradeCode": "X",
    "section": "D"
  },
  {
    "name": "XI KUL A",
    "majorCode": "KUL",
    "gradeCode": "XI",
    "section": "A"
  },
  {
    "name": "XI KUL B",
    "majorCode": "KUL",
    "gradeCode": "XI",
    "section": "B"
  },
  {
    "name": "XI KUL C",
    "majorCode": "KUL",
    "gradeCode": "XI",
    "section": "C"
  },
  {
    "name": "XI KUL D",
    "majorCode": "KUL",
    "gradeCode": "XI",
    "section": "D"
  },
  {
    "name": "XII KUL A",
    "majorCode": "KUL",
    "gradeCode": "XII",
    "section": "A"
  },
  {
    "name": "XII KUL B",
    "majorCode": "KUL",
    "gradeCode": "XII",
    "section": "B"
  },
  {
    "name": "XII KUL C",
    "majorCode": "KUL",
    "gradeCode": "XII",
    "section": "C"
  },
  {
    "name": "XII KUL D",
    "majorCode": "KUL",
    "gradeCode": "XII",
    "section": "D"
  }
];

