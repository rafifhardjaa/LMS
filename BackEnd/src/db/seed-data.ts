// AUTO-GENERATED from classes.csv, teacher_schedules.csv, and jurusan&mapel.docx
// Regenerate with: python gen_seed.py

export type SeedMajor = { code: string; name: string };
export type SeedGradeLevel = { code: string; name: string };
export type SeedClass = { name: string; majorCode: string; gradeCode: string; section: string };
export type SeedTeacher = { fullName: string; email: string; nomorInduk: string; majors: string[]; classNames: string[] };
export type SeedSubject = { name: string; code: string; majorCode: string | null; gradeCode: string; semester: string; vocational: boolean };

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

export const teachersData: SeedTeacher[] = [
  {
    "fullName": "Adi Fauzi",
    "email": "adi.fauzi@simanis.com",
    "nomorInduk": "G00001",
    "majors": [
      "RPL"
    ],
    "classNames": [
      "X RPL A",
      "X RPL B",
      "X RPL C",
      "X RPL D",
      "XI RPL A",
      "XI RPL B",
      "XI RPL C",
      "XI RPL D"
    ]
  },
  {
    "fullName": "Adi Marlina",
    "email": "adi.marlina@simanis.com",
    "nomorInduk": "G00002",
    "majors": [
      "RPL"
    ],
    "classNames": [
      "X RPL A",
      "X RPL B",
      "X RPL C",
      "X RPL D",
      "XI RPL A",
      "XI RPL B",
      "XI RPL C",
      "XI RPL D"
    ]
  },
  {
    "fullName": "Adi Pratama",
    "email": "adi.pratama@simanis.com",
    "nomorInduk": "G00003",
    "majors": [
      "RPL"
    ],
    "classNames": [
      "X RPL A",
      "X RPL B",
      "X RPL C",
      "X RPL D",
      "XI RPL A",
      "XI RPL B",
      "XI RPL C",
      "XI RPL D"
    ]
  },
  {
    "fullName": "Andi Kusuma",
    "email": "andi.kusuma@simanis.com",
    "nomorInduk": "G00004",
    "majors": [
      "RPL"
    ],
    "classNames": [
      "X RPL A",
      "X RPL B",
      "X RPL C",
      "X RPL D",
      "XI RPL A",
      "XI RPL B",
      "XI RPL C",
      "XI RPL D"
    ]
  },
  {
    "fullName": "Andi Nugroho",
    "email": "andi.nugroho@simanis.com",
    "nomorInduk": "G00005",
    "majors": [
      "RPL"
    ],
    "classNames": [
      "X RPL A",
      "X RPL B",
      "X RPL C",
      "X RPL D",
      "XI RPL A",
      "XI RPL B",
      "XI RPL C",
      "XI RPL D"
    ]
  },
  {
    "fullName": "Bayu Prasetyo",
    "email": "bayu.prasetyo@simanis.com",
    "nomorInduk": "G00006",
    "majors": [
      "RPL",
      "TKJ"
    ],
    "classNames": [
      "X TKJ A",
      "X TKJ B",
      "X TKJ C",
      "X TKJ D",
      "XII RPL A",
      "XII RPL B",
      "XII RPL C",
      "XII RPL D"
    ]
  },
  {
    "fullName": "Bayu Rahayu",
    "email": "bayu.rahayu@simanis.com",
    "nomorInduk": "G00007",
    "majors": [
      "RPL",
      "TKJ"
    ],
    "classNames": [
      "X TKJ A",
      "X TKJ B",
      "X TKJ C",
      "X TKJ D",
      "XII RPL A",
      "XII RPL B",
      "XII RPL C",
      "XII RPL D"
    ]
  },
  {
    "fullName": "Budi Kartika",
    "email": "budi.kartika@simanis.com",
    "nomorInduk": "G00008",
    "majors": [
      "RPL",
      "TKJ"
    ],
    "classNames": [
      "X TKJ A",
      "X TKJ B",
      "X TKJ C",
      "X TKJ D",
      "XII RPL A",
      "XII RPL B",
      "XII RPL C",
      "XII RPL D"
    ]
  },
  {
    "fullName": "Budi Lestari",
    "email": "budi.lestari@simanis.com",
    "nomorInduk": "G00009",
    "majors": [
      "RPL",
      "TKJ"
    ],
    "classNames": [
      "X TKJ A",
      "X TKJ B",
      "X TKJ C",
      "X TKJ D",
      "XII RPL A",
      "XII RPL B",
      "XII RPL C",
      "XII RPL D"
    ]
  },
  {
    "fullName": "Budi Maharani",
    "email": "budi.maharani@simanis.com",
    "nomorInduk": "G00010",
    "majors": [
      "RPL",
      "TKJ"
    ],
    "classNames": [
      "X TKJ A",
      "X TKJ B",
      "X TKJ C",
      "X TKJ D",
      "XII RPL A",
      "XII RPL B",
      "XII RPL C",
      "XII RPL D"
    ]
  },
  {
    "fullName": "Candra Puspita",
    "email": "candra.puspita@simanis.com",
    "nomorInduk": "G00011",
    "majors": [
      "TKJ"
    ],
    "classNames": [
      "XI TKJ A",
      "XI TKJ B",
      "XI TKJ C",
      "XI TKJ D",
      "XII TKJ A",
      "XII TKJ B",
      "XII TKJ C",
      "XII TKJ D"
    ]
  },
  {
    "fullName": "Candra Wijaya",
    "email": "candra.wijaya@simanis.com",
    "nomorInduk": "G00012",
    "majors": [
      "TKJ"
    ],
    "classNames": [
      "XI TKJ A",
      "XI TKJ B",
      "XI TKJ C",
      "XI TKJ D",
      "XII TKJ A",
      "XII TKJ B",
      "XII TKJ C",
      "XII TKJ D"
    ]
  },
  {
    "fullName": "Citra Aini",
    "email": "citra.aini@simanis.com",
    "nomorInduk": "G00013",
    "majors": [
      "TKJ"
    ],
    "classNames": [
      "XI TKJ A",
      "XI TKJ B",
      "XI TKJ C",
      "XI TKJ D",
      "XII TKJ A",
      "XII TKJ B",
      "XII TKJ C",
      "XII TKJ D"
    ]
  },
  {
    "fullName": "Citra Saputra",
    "email": "citra.saputra@simanis.com",
    "nomorInduk": "G00014",
    "majors": [
      "TKJ"
    ],
    "classNames": [
      "XI TKJ A",
      "XI TKJ B",
      "XI TKJ C",
      "XI TKJ D",
      "XII TKJ A",
      "XII TKJ B",
      "XII TKJ C",
      "XII TKJ D"
    ]
  },
  {
    "fullName": "Citra Wibowo",
    "email": "citra.wibowo@simanis.com",
    "nomorInduk": "G00015",
    "majors": [
      "TKJ"
    ],
    "classNames": [
      "XI TKJ A",
      "XI TKJ B",
      "XI TKJ C",
      "XI TKJ D",
      "XII TKJ A",
      "XII TKJ B",
      "XII TKJ C",
      "XII TKJ D"
    ]
  },
  {
    "fullName": "Dewi Hartono",
    "email": "dewi.hartono@simanis.com",
    "nomorInduk": "G00016",
    "majors": [
      "DKV"
    ],
    "classNames": [
      "X DKV A",
      "X DKV B",
      "X DKV C",
      "X DKV D",
      "XI DKV A",
      "XI DKV B",
      "XI DKV C",
      "XI DKV D"
    ]
  },
  {
    "fullName": "Dewi Santoso",
    "email": "dewi.santoso@simanis.com",
    "nomorInduk": "G00017",
    "majors": [
      "DKV"
    ],
    "classNames": [
      "X DKV A",
      "X DKV B",
      "X DKV C",
      "X DKV D",
      "XI DKV A",
      "XI DKV B",
      "XI DKV C",
      "XI DKV D"
    ]
  },
  {
    "fullName": "Dewi Setiawan",
    "email": "dewi.setiawan@simanis.com",
    "nomorInduk": "G00018",
    "majors": [
      "DKV"
    ],
    "classNames": [
      "X DKV A",
      "X DKV B",
      "X DKV C",
      "X DKV D",
      "XI DKV A",
      "XI DKV B",
      "XI DKV C",
      "XI DKV D"
    ]
  },
  {
    "fullName": "Dian Hidayat",
    "email": "dian.hidayat@simanis.com",
    "nomorInduk": "G00019",
    "majors": [
      "DKV"
    ],
    "classNames": [
      "X DKV A",
      "X DKV B",
      "X DKV C",
      "X DKV D",
      "XI DKV A",
      "XI DKV B",
      "XI DKV C",
      "XI DKV D"
    ]
  },
  {
    "fullName": "Dian Ramadhan",
    "email": "dian.ramadhan@simanis.com",
    "nomorInduk": "G00020",
    "majors": [
      "DKV"
    ],
    "classNames": [
      "X DKV A",
      "X DKV B",
      "X DKV C",
      "X DKV D",
      "XI DKV A",
      "XI DKV B",
      "XI DKV C",
      "XI DKV D"
    ]
  },
  {
    "fullName": "Eka Fauzi",
    "email": "eka.fauzi@simanis.com",
    "nomorInduk": "G00021",
    "majors": [
      "AKL",
      "DKV"
    ],
    "classNames": [
      "X AKL A",
      "X AKL B",
      "X AKL C",
      "X AKL D",
      "XII DKV A",
      "XII DKV B",
      "XII DKV C",
      "XII DKV D"
    ]
  },
  {
    "fullName": "Eka Marlina",
    "email": "eka.marlina@simanis.com",
    "nomorInduk": "G00022",
    "majors": [
      "AKL",
      "DKV"
    ],
    "classNames": [
      "X AKL A",
      "X AKL B",
      "X AKL C",
      "X AKL D",
      "XII DKV A",
      "XII DKV B",
      "XII DKV C",
      "XII DKV D"
    ]
  },
  {
    "fullName": "Eko Kusuma",
    "email": "eko.kusuma@simanis.com",
    "nomorInduk": "G00023",
    "majors": [
      "AKL",
      "DKV"
    ],
    "classNames": [
      "X AKL A",
      "X AKL B",
      "X AKL C",
      "X AKL D",
      "XII DKV A",
      "XII DKV B",
      "XII DKV C",
      "XII DKV D"
    ]
  },
  {
    "fullName": "Eko Nugroho",
    "email": "eko.nugroho@simanis.com",
    "nomorInduk": "G00024",
    "majors": [
      "AKL",
      "DKV"
    ],
    "classNames": [
      "X AKL A",
      "X AKL B",
      "X AKL C",
      "X AKL D",
      "XII DKV A",
      "XII DKV B",
      "XII DKV C",
      "XII DKV D"
    ]
  },
  {
    "fullName": "Eko Pratama",
    "email": "eko.pratama@simanis.com",
    "nomorInduk": "G00025",
    "majors": [
      "AKL",
      "DKV"
    ],
    "classNames": [
      "X AKL A",
      "X AKL B",
      "X AKL C",
      "X AKL D",
      "XII DKV A",
      "XII DKV B",
      "XII DKV C",
      "XII DKV D"
    ]
  },
  {
    "fullName": "Fajar Maharani",
    "email": "fajar.maharani@simanis.com",
    "nomorInduk": "G00026",
    "majors": [
      "AKL"
    ],
    "classNames": [
      "XI AKL A",
      "XI AKL B",
      "XI AKL C",
      "XI AKL D",
      "XII AKL A",
      "XII AKL B",
      "XII AKL C",
      "XII AKL D"
    ]
  },
  {
    "fullName": "Fajar Prasetyo",
    "email": "fajar.prasetyo@simanis.com",
    "nomorInduk": "G00027",
    "majors": [
      "AKL"
    ],
    "classNames": [
      "XI AKL A",
      "XI AKL B",
      "XI AKL C",
      "XI AKL D",
      "XII AKL A",
      "XII AKL B",
      "XII AKL C",
      "XII AKL D"
    ]
  },
  {
    "fullName": "Fajar Rahayu",
    "email": "fajar.rahayu@simanis.com",
    "nomorInduk": "G00028",
    "majors": [
      "AKL"
    ],
    "classNames": [
      "XI AKL A",
      "XI AKL B",
      "XI AKL C",
      "XI AKL D",
      "XII AKL A",
      "XII AKL B",
      "XII AKL C",
      "XII AKL D"
    ]
  },
  {
    "fullName": "Fani Kartika",
    "email": "fani.kartika@simanis.com",
    "nomorInduk": "G00029",
    "majors": [
      "AKL"
    ],
    "classNames": [
      "XI AKL A",
      "XI AKL B",
      "XI AKL C",
      "XI AKL D",
      "XII AKL A",
      "XII AKL B",
      "XII AKL C",
      "XII AKL D"
    ]
  },
  {
    "fullName": "Fani Lestari",
    "email": "fani.lestari@simanis.com",
    "nomorInduk": "G00030",
    "majors": [
      "AKL"
    ],
    "classNames": [
      "XI AKL A",
      "XI AKL B",
      "XI AKL C",
      "XI AKL D",
      "XII AKL A",
      "XII AKL B",
      "XII AKL C",
      "XII AKL D"
    ]
  },
  {
    "fullName": "Galih Saputra",
    "email": "galih.saputra@simanis.com",
    "nomorInduk": "G00031",
    "majors": [
      "BDG"
    ],
    "classNames": [
      "X BDG A",
      "X BDG B",
      "X BDG C",
      "X BDG D",
      "XI BDG A",
      "XI BDG B",
      "XI BDG C",
      "XI BDG D"
    ]
  },
  {
    "fullName": "Galih Wibowo",
    "email": "galih.wibowo@simanis.com",
    "nomorInduk": "G00032",
    "majors": [
      "BDG"
    ],
    "classNames": [
      "X BDG A",
      "X BDG B",
      "X BDG C",
      "X BDG D",
      "XI BDG A",
      "XI BDG B",
      "XI BDG C",
      "XI BDG D"
    ]
  },
  {
    "fullName": "Gita Aini",
    "email": "gita.aini@simanis.com",
    "nomorInduk": "G00033",
    "majors": [
      "BDG"
    ],
    "classNames": [
      "X BDG A",
      "X BDG B",
      "X BDG C",
      "X BDG D",
      "XI BDG A",
      "XI BDG B",
      "XI BDG C",
      "XI BDG D"
    ]
  },
  {
    "fullName": "Gita Puspita",
    "email": "gita.puspita@simanis.com",
    "nomorInduk": "G00034",
    "majors": [
      "BDG"
    ],
    "classNames": [
      "X BDG A",
      "X BDG B",
      "X BDG C",
      "X BDG D",
      "XI BDG A",
      "XI BDG B",
      "XI BDG C",
      "XI BDG D"
    ]
  },
  {
    "fullName": "Gita Wijaya",
    "email": "gita.wijaya@simanis.com",
    "nomorInduk": "G00035",
    "majors": [
      "BDG"
    ],
    "classNames": [
      "X BDG A",
      "X BDG B",
      "X BDG C",
      "X BDG D",
      "XI BDG A",
      "XI BDG B",
      "XI BDG C",
      "XI BDG D"
    ]
  },
  {
    "fullName": "Hana Hidayat",
    "email": "hana.hidayat@simanis.com",
    "nomorInduk": "G00036",
    "majors": [
      "BDG",
      "TKR"
    ],
    "classNames": [
      "X TKR A",
      "X TKR B",
      "X TKR C",
      "X TKR D",
      "XII BDG A",
      "XII BDG B",
      "XII BDG C",
      "XII BDG D"
    ]
  },
  {
    "fullName": "Hana Ramadhan",
    "email": "hana.ramadhan@simanis.com",
    "nomorInduk": "G00037",
    "majors": [
      "BDG",
      "TKR"
    ],
    "classNames": [
      "X TKR A",
      "X TKR B",
      "X TKR C",
      "X TKR D",
      "XII BDG A",
      "XII BDG B",
      "XII BDG C",
      "XII BDG D"
    ]
  },
  {
    "fullName": "Hana Santoso",
    "email": "hana.santoso@simanis.com",
    "nomorInduk": "G00038",
    "majors": [
      "BDG",
      "TKR"
    ],
    "classNames": [
      "X TKR A",
      "X TKR B",
      "X TKR C",
      "X TKR D",
      "XII BDG A",
      "XII BDG B",
      "XII BDG C",
      "XII BDG D"
    ]
  },
  {
    "fullName": "Hesti Hartono",
    "email": "hesti.hartono@simanis.com",
    "nomorInduk": "G00039",
    "majors": [
      "BDG",
      "TKR"
    ],
    "classNames": [
      "X TKR A",
      "X TKR B",
      "X TKR C",
      "X TKR D",
      "XII BDG A",
      "XII BDG B",
      "XII BDG C",
      "XII BDG D"
    ]
  },
  {
    "fullName": "Hesti Setiawan",
    "email": "hesti.setiawan@simanis.com",
    "nomorInduk": "G00040",
    "majors": [
      "BDG",
      "TKR"
    ],
    "classNames": [
      "X TKR A",
      "X TKR B",
      "X TKR C",
      "X TKR D",
      "XII BDG A",
      "XII BDG B",
      "XII BDG C",
      "XII BDG D"
    ]
  },
  {
    "fullName": "Ilham Nugroho",
    "email": "ilham.nugroho@simanis.com",
    "nomorInduk": "G00041",
    "majors": [
      "TKR"
    ],
    "classNames": [
      "XI TKR A",
      "XI TKR B",
      "XI TKR C",
      "XI TKR D",
      "XII TKR A",
      "XII TKR B",
      "XII TKR C",
      "XII TKR D"
    ]
  },
  {
    "fullName": "Ilham Pratama",
    "email": "ilham.pratama@simanis.com",
    "nomorInduk": "G00042",
    "majors": [
      "TKR"
    ],
    "classNames": [
      "XI TKR A",
      "XI TKR B",
      "XI TKR C",
      "XI TKR D",
      "XII TKR A",
      "XII TKR B",
      "XII TKR C",
      "XII TKR D"
    ]
  },
  {
    "fullName": "Indra Fauzi",
    "email": "indra.fauzi@simanis.com",
    "nomorInduk": "G00043",
    "majors": [
      "TKR"
    ],
    "classNames": [
      "XI TKR A",
      "XI TKR B",
      "XI TKR C",
      "XI TKR D",
      "XII TKR A",
      "XII TKR B",
      "XII TKR C",
      "XII TKR D"
    ]
  },
  {
    "fullName": "Indra Kusuma",
    "email": "indra.kusuma@simanis.com",
    "nomorInduk": "G00044",
    "majors": [
      "TKR"
    ],
    "classNames": [
      "XI TKR A",
      "XI TKR B",
      "XI TKR C",
      "XI TKR D",
      "XII TKR A",
      "XII TKR B",
      "XII TKR C",
      "XII TKR D"
    ]
  },
  {
    "fullName": "Indra Marlina",
    "email": "indra.marlina@simanis.com",
    "nomorInduk": "G00045",
    "majors": [
      "TKR"
    ],
    "classNames": [
      "XI TKR A",
      "XI TKR B",
      "XI TKR C",
      "XI TKR D",
      "XII TKR A",
      "XII TKR B",
      "XII TKR C",
      "XII TKR D"
    ]
  },
  {
    "fullName": "Jihan Maharani",
    "email": "jihan.maharani@simanis.com",
    "nomorInduk": "G00046",
    "majors": [
      "HTL"
    ],
    "classNames": [
      "X HTL A",
      "X HTL B",
      "X HTL C",
      "X HTL D",
      "XI HTL A",
      "XI HTL B",
      "XI HTL C",
      "XI HTL D"
    ]
  },
  {
    "fullName": "Jihan Rahayu",
    "email": "jihan.rahayu@simanis.com",
    "nomorInduk": "G00047",
    "majors": [
      "HTL"
    ],
    "classNames": [
      "X HTL A",
      "X HTL B",
      "X HTL C",
      "X HTL D",
      "XI HTL A",
      "XI HTL B",
      "XI HTL C",
      "XI HTL D"
    ]
  },
  {
    "fullName": "Joko Kartika",
    "email": "joko.kartika@simanis.com",
    "nomorInduk": "G00048",
    "majors": [
      "HTL"
    ],
    "classNames": [
      "X HTL A",
      "X HTL B",
      "X HTL C",
      "X HTL D",
      "XI HTL A",
      "XI HTL B",
      "XI HTL C",
      "XI HTL D"
    ]
  },
  {
    "fullName": "Joko Lestari",
    "email": "joko.lestari@simanis.com",
    "nomorInduk": "G00049",
    "majors": [
      "HTL"
    ],
    "classNames": [
      "X HTL A",
      "X HTL B",
      "X HTL C",
      "X HTL D",
      "XI HTL A",
      "XI HTL B",
      "XI HTL C",
      "XI HTL D"
    ]
  },
  {
    "fullName": "Joko Prasetyo",
    "email": "joko.prasetyo@simanis.com",
    "nomorInduk": "G00050",
    "majors": [
      "HTL"
    ],
    "classNames": [
      "X HTL A",
      "X HTL B",
      "X HTL C",
      "X HTL D",
      "XI HTL A",
      "XI HTL B",
      "XI HTL C",
      "XI HTL D"
    ]
  },
  {
    "fullName": "Kartika Saputra",
    "email": "kartika.saputra@simanis.com",
    "nomorInduk": "G00051",
    "majors": [
      "HTL",
      "KUL"
    ],
    "classNames": [
      "X KUL A",
      "X KUL B",
      "X KUL C",
      "X KUL D",
      "XII HTL A",
      "XII HTL B",
      "XII HTL C",
      "XII HTL D"
    ]
  },
  {
    "fullName": "Kartika Wibowo",
    "email": "kartika.wibowo@simanis.com",
    "nomorInduk": "G00052",
    "majors": [
      "HTL",
      "KUL"
    ],
    "classNames": [
      "X KUL A",
      "X KUL B",
      "X KUL C",
      "X KUL D",
      "XII HTL A",
      "XII HTL B",
      "XII HTL C",
      "XII HTL D"
    ]
  },
  {
    "fullName": "Kartika Wijaya",
    "email": "kartika.wijaya@simanis.com",
    "nomorInduk": "G00053",
    "majors": [
      "HTL",
      "KUL"
    ],
    "classNames": [
      "X KUL A",
      "X KUL B",
      "X KUL C",
      "X KUL D",
      "XII HTL A",
      "XII HTL B",
      "XII HTL C",
      "XII HTL D"
    ]
  },
  {
    "fullName": "Kiki Aini",
    "email": "kiki.aini@simanis.com",
    "nomorInduk": "G00054",
    "majors": [
      "HTL",
      "KUL"
    ],
    "classNames": [
      "X KUL A",
      "X KUL B",
      "X KUL C",
      "X KUL D",
      "XII HTL A",
      "XII HTL B",
      "XII HTL C",
      "XII HTL D"
    ]
  },
  {
    "fullName": "Kiki Puspita",
    "email": "kiki.puspita@simanis.com",
    "nomorInduk": "G00055",
    "majors": [
      "HTL",
      "KUL"
    ],
    "classNames": [
      "X KUL A",
      "X KUL B",
      "X KUL C",
      "X KUL D",
      "XII HTL A",
      "XII HTL B",
      "XII HTL C",
      "XII HTL D"
    ]
  },
  {
    "fullName": "Laila Ramadhan",
    "email": "laila.ramadhan@simanis.com",
    "nomorInduk": "G00056",
    "majors": [
      "KUL"
    ],
    "classNames": [
      "XI KUL A",
      "XI KUL B",
      "XI KUL C",
      "XI KUL D",
      "XII KUL A",
      "XII KUL B",
      "XII KUL C",
      "XII KUL D"
    ]
  },
  {
    "fullName": "Laila Santoso",
    "email": "laila.santoso@simanis.com",
    "nomorInduk": "G00057",
    "majors": [
      "KUL"
    ],
    "classNames": [
      "XI KUL A",
      "XI KUL B",
      "XI KUL C",
      "XI KUL D",
      "XII KUL A",
      "XII KUL B",
      "XII KUL C",
      "XII KUL D"
    ]
  },
  {
    "fullName": "Lina Hartono",
    "email": "lina.hartono@simanis.com",
    "nomorInduk": "G00058",
    "majors": [
      "KUL"
    ],
    "classNames": [
      "XI KUL A",
      "XI KUL B",
      "XI KUL C",
      "XI KUL D",
      "XII KUL A",
      "XII KUL B",
      "XII KUL C",
      "XII KUL D"
    ]
  },
  {
    "fullName": "Lina Hidayat",
    "email": "lina.hidayat@simanis.com",
    "nomorInduk": "G00059",
    "majors": [
      "KUL"
    ],
    "classNames": [
      "XI KUL A",
      "XI KUL B",
      "XI KUL C",
      "XI KUL D",
      "XII KUL A",
      "XII KUL B",
      "XII KUL C",
      "XII KUL D"
    ]
  },
  {
    "fullName": "Lina Setiawan",
    "email": "lina.setiawan@simanis.com",
    "nomorInduk": "G00060",
    "majors": [
      "KUL"
    ],
    "classNames": [
      "XI KUL A",
      "XI KUL B",
      "XI KUL C",
      "XI KUL D",
      "XII KUL A",
      "XII KUL B",
      "XII KUL C",
      "XII KUL D"
    ]
  },
  {
    "fullName": "Maya Marlina",
    "email": "maya.marlina@simanis.com",
    "nomorInduk": "G00061",
    "majors": [
      "RPL"
    ],
    "classNames": [
      "X RPL A",
      "X RPL B",
      "X RPL C",
      "X RPL D",
      "XI RPL A",
      "XI RPL B",
      "XI RPL C",
      "XI RPL D"
    ]
  },
  {
    "fullName": "Maya Nugroho",
    "email": "maya.nugroho@simanis.com",
    "nomorInduk": "G00062",
    "majors": [
      "RPL"
    ],
    "classNames": [
      "X RPL A",
      "X RPL B",
      "X RPL C",
      "X RPL D",
      "XI RPL A",
      "XI RPL B",
      "XI RPL C",
      "XI RPL D"
    ]
  },
  {
    "fullName": "Maya Pratama",
    "email": "maya.pratama@simanis.com",
    "nomorInduk": "G00063",
    "majors": [
      "RPL"
    ],
    "classNames": [
      "X RPL A",
      "X RPL B",
      "X RPL C",
      "X RPL D",
      "XI RPL A",
      "XI RPL B",
      "XI RPL C",
      "XI RPL D"
    ]
  },
  {
    "fullName": "Miko Fauzi",
    "email": "miko.fauzi@simanis.com",
    "nomorInduk": "G00064",
    "majors": [
      "RPL"
    ],
    "classNames": [
      "X RPL A",
      "X RPL B",
      "X RPL C",
      "X RPL D",
      "XI RPL A",
      "XI RPL B",
      "XI RPL C",
      "XI RPL D"
    ]
  },
  {
    "fullName": "Miko Kusuma",
    "email": "miko.kusuma@simanis.com",
    "nomorInduk": "G00065",
    "majors": [
      "RPL"
    ],
    "classNames": [
      "X RPL A",
      "X RPL B",
      "X RPL C",
      "X RPL D",
      "XI RPL A",
      "XI RPL B",
      "XI RPL C",
      "XI RPL D"
    ]
  },
  {
    "fullName": "Nadia Kartika",
    "email": "nadia.kartika@simanis.com",
    "nomorInduk": "G00066",
    "majors": [
      "RPL",
      "TKJ"
    ],
    "classNames": [
      "X TKJ A",
      "X TKJ B",
      "X TKJ C",
      "X TKJ D",
      "XII RPL A",
      "XII RPL B",
      "XII RPL C",
      "XII RPL D"
    ]
  },
  {
    "fullName": "Nadia Prasetyo",
    "email": "nadia.prasetyo@simanis.com",
    "nomorInduk": "G00067",
    "majors": [
      "RPL",
      "TKJ"
    ],
    "classNames": [
      "X TKJ A",
      "X TKJ B",
      "X TKJ C",
      "X TKJ D",
      "XII RPL A",
      "XII RPL B",
      "XII RPL C",
      "XII RPL D"
    ]
  },
  {
    "fullName": "Nanda Lestari",
    "email": "nanda.lestari@simanis.com",
    "nomorInduk": "G00068",
    "majors": [
      "RPL",
      "TKJ"
    ],
    "classNames": [
      "X TKJ A",
      "X TKJ B",
      "X TKJ C",
      "X TKJ D",
      "XII RPL A",
      "XII RPL B",
      "XII RPL C",
      "XII RPL D"
    ]
  },
  {
    "fullName": "Nanda Maharani",
    "email": "nanda.maharani@simanis.com",
    "nomorInduk": "G00069",
    "majors": [
      "RPL",
      "TKJ"
    ],
    "classNames": [
      "X TKJ A",
      "X TKJ B",
      "X TKJ C",
      "X TKJ D",
      "XII RPL A",
      "XII RPL B",
      "XII RPL C",
      "XII RPL D"
    ]
  },
  {
    "fullName": "Nanda Rahayu",
    "email": "nanda.rahayu@simanis.com",
    "nomorInduk": "G00070",
    "majors": [
      "RPL",
      "TKJ"
    ],
    "classNames": [
      "X TKJ A",
      "X TKJ B",
      "X TKJ C",
      "X TKJ D",
      "XII RPL A",
      "XII RPL B",
      "XII RPL C",
      "XII RPL D"
    ]
  },
  {
    "fullName": "Oka Aini",
    "email": "oka.aini@simanis.com",
    "nomorInduk": "G00071",
    "majors": [
      "TKJ"
    ],
    "classNames": [
      "XI TKJ A",
      "XI TKJ B",
      "XI TKJ C",
      "XI TKJ D",
      "XII TKJ A",
      "XII TKJ B",
      "XII TKJ C",
      "XII TKJ D"
    ]
  },
  {
    "fullName": "Oka Puspita",
    "email": "oka.puspita@simanis.com",
    "nomorInduk": "G00072",
    "majors": [
      "TKJ"
    ],
    "classNames": [
      "XI TKJ A",
      "XI TKJ B",
      "XI TKJ C",
      "XI TKJ D",
      "XII TKJ A",
      "XII TKJ B",
      "XII TKJ C",
      "XII TKJ D"
    ]
  },
  {
    "fullName": "Oka Wibowo",
    "email": "oka.wibowo@simanis.com",
    "nomorInduk": "G00073",
    "majors": [
      "TKJ"
    ],
    "classNames": [
      "XI TKJ A",
      "XI TKJ B",
      "XI TKJ C",
      "XI TKJ D",
      "XII TKJ A",
      "XII TKJ B",
      "XII TKJ C",
      "XII TKJ D"
    ]
  },
  {
    "fullName": "Ovi Saputra",
    "email": "ovi.saputra@simanis.com",
    "nomorInduk": "G00074",
    "majors": [
      "TKJ"
    ],
    "classNames": [
      "XI TKJ A",
      "XI TKJ B",
      "XI TKJ C",
      "XI TKJ D",
      "XII TKJ A",
      "XII TKJ B",
      "XII TKJ C",
      "XII TKJ D"
    ]
  },
  {
    "fullName": "Ovi Wijaya",
    "email": "ovi.wijaya@simanis.com",
    "nomorInduk": "G00075",
    "majors": [
      "TKJ"
    ],
    "classNames": [
      "XI TKJ A",
      "XI TKJ B",
      "XI TKJ C",
      "XI TKJ D",
      "XII TKJ A",
      "XII TKJ B",
      "XII TKJ C",
      "XII TKJ D"
    ]
  },
  {
    "fullName": "Panji Hartono",
    "email": "panji.hartono@simanis.com",
    "nomorInduk": "G00076",
    "majors": [
      "DKV"
    ],
    "classNames": [
      "X DKV A",
      "X DKV B",
      "X DKV C",
      "X DKV D",
      "XI DKV A",
      "XI DKV B",
      "XI DKV C",
      "XI DKV D"
    ]
  },
  {
    "fullName": "Panji Hidayat",
    "email": "panji.hidayat@simanis.com",
    "nomorInduk": "G00077",
    "majors": [
      "DKV"
    ],
    "classNames": [
      "X DKV A",
      "X DKV B",
      "X DKV C",
      "X DKV D",
      "XI DKV A",
      "XI DKV B",
      "XI DKV C",
      "XI DKV D"
    ]
  },
  {
    "fullName": "Putri Ramadhan",
    "email": "putri.ramadhan@simanis.com",
    "nomorInduk": "G00078",
    "majors": [
      "DKV"
    ],
    "classNames": [
      "X DKV A",
      "X DKV B",
      "X DKV C",
      "X DKV D",
      "XI DKV A",
      "XI DKV B",
      "XI DKV C",
      "XI DKV D"
    ]
  },
  {
    "fullName": "Putri Santoso",
    "email": "putri.santoso@simanis.com",
    "nomorInduk": "G00079",
    "majors": [
      "DKV"
    ],
    "classNames": [
      "X DKV A",
      "X DKV B",
      "X DKV C",
      "X DKV D",
      "XI DKV A",
      "XI DKV B",
      "XI DKV C",
      "XI DKV D"
    ]
  },
  {
    "fullName": "Putri Setiawan",
    "email": "putri.setiawan@simanis.com",
    "nomorInduk": "G00080",
    "majors": [
      "DKV"
    ],
    "classNames": [
      "X DKV A",
      "X DKV B",
      "X DKV C",
      "X DKV D",
      "XI DKV A",
      "XI DKV B",
      "XI DKV C",
      "XI DKV D"
    ]
  },
  {
    "fullName": "Qori Marlina",
    "email": "qori.marlina@simanis.com",
    "nomorInduk": "G00081",
    "majors": [
      "AKL",
      "DKV"
    ],
    "classNames": [
      "X AKL A",
      "X AKL B",
      "X AKL C",
      "X AKL D",
      "XII DKV A",
      "XII DKV B",
      "XII DKV C",
      "XII DKV D"
    ]
  },
  {
    "fullName": "Qori Pratama",
    "email": "qori.pratama@simanis.com",
    "nomorInduk": "G00082",
    "majors": [
      "AKL",
      "DKV"
    ],
    "classNames": [
      "X AKL A",
      "X AKL B",
      "X AKL C",
      "X AKL D",
      "XII DKV A",
      "XII DKV B",
      "XII DKV C",
      "XII DKV D"
    ]
  },
  {
    "fullName": "Rara Lestari",
    "email": "rara.lestari@simanis.com",
    "nomorInduk": "G00083",
    "majors": [
      "AKL"
    ],
    "classNames": [
      "XI AKL A",
      "XI AKL B",
      "XI AKL C",
      "XI AKL D",
      "XII AKL A",
      "XII AKL B",
      "XII AKL C",
      "XII AKL D"
    ]
  },
  {
    "fullName": "Rara Maharani",
    "email": "rara.maharani@simanis.com",
    "nomorInduk": "G00084",
    "majors": [
      "AKL"
    ],
    "classNames": [
      "XI AKL A",
      "XI AKL B",
      "XI AKL C",
      "XI AKL D",
      "XII AKL A",
      "XII AKL B",
      "XII AKL C",
      "XII AKL D"
    ]
  },
  {
    "fullName": "Rizky Fauzi",
    "email": "rizky.fauzi@simanis.com",
    "nomorInduk": "G00085",
    "majors": [
      "AKL",
      "DKV"
    ],
    "classNames": [
      "X AKL A",
      "X AKL B",
      "X AKL C",
      "X AKL D",
      "XII DKV A",
      "XII DKV B",
      "XII DKV C",
      "XII DKV D"
    ]
  },
  {
    "fullName": "Rizky Kusuma",
    "email": "rizky.kusuma@simanis.com",
    "nomorInduk": "G00086",
    "majors": [
      "AKL",
      "DKV"
    ],
    "classNames": [
      "X AKL A",
      "X AKL B",
      "X AKL C",
      "X AKL D",
      "XII DKV A",
      "XII DKV B",
      "XII DKV C",
      "XII DKV D"
    ]
  },
  {
    "fullName": "Rizky Nugroho",
    "email": "rizky.nugroho@simanis.com",
    "nomorInduk": "G00087",
    "majors": [
      "AKL",
      "DKV"
    ],
    "classNames": [
      "X AKL A",
      "X AKL B",
      "X AKL C",
      "X AKL D",
      "XII DKV A",
      "XII DKV B",
      "XII DKV C",
      "XII DKV D"
    ]
  },
  {
    "fullName": "Sari Kartika",
    "email": "sari.kartika@simanis.com",
    "nomorInduk": "G00088",
    "majors": [
      "AKL"
    ],
    "classNames": [
      "XI AKL A",
      "XI AKL B",
      "XI AKL C",
      "XI AKL D",
      "XII AKL A",
      "XII AKL B",
      "XII AKL C",
      "XII AKL D"
    ]
  },
  {
    "fullName": "Sari Prasetyo",
    "email": "sari.prasetyo@simanis.com",
    "nomorInduk": "G00089",
    "majors": [
      "AKL"
    ],
    "classNames": [
      "XI AKL A",
      "XI AKL B",
      "XI AKL C",
      "XI AKL D",
      "XII AKL A",
      "XII AKL B",
      "XII AKL C",
      "XII AKL D"
    ]
  },
  {
    "fullName": "Sari Rahayu",
    "email": "sari.rahayu@simanis.com",
    "nomorInduk": "G00090",
    "majors": [
      "AKL"
    ],
    "classNames": [
      "XI AKL A",
      "XI AKL B",
      "XI AKL C",
      "XI AKL D",
      "XII AKL A",
      "XII AKL B",
      "XII AKL C",
      "XII AKL D"
    ]
  },
  {
    "fullName": "Sinta Aini",
    "email": "sinta.aini@simanis.com",
    "nomorInduk": "G00091",
    "majors": [
      "BDG"
    ],
    "classNames": [
      "X BDG A",
      "X BDG B",
      "X BDG C",
      "X BDG D",
      "XI BDG A",
      "XI BDG B",
      "XI BDG C",
      "XI BDG D"
    ]
  },
  {
    "fullName": "Sinta Wibowo",
    "email": "sinta.wibowo@simanis.com",
    "nomorInduk": "G00092",
    "majors": [
      "BDG"
    ],
    "classNames": [
      "X BDG A",
      "X BDG B",
      "X BDG C",
      "X BDG D",
      "XI BDG A",
      "XI BDG B",
      "XI BDG C",
      "XI BDG D"
    ]
  },
  {
    "fullName": "Taufik Santoso",
    "email": "taufik.santoso@simanis.com",
    "nomorInduk": "G00093",
    "majors": [
      "BDG",
      "TKR"
    ],
    "classNames": [
      "X TKR A",
      "X TKR B",
      "X TKR C",
      "X TKR D",
      "XII BDG A",
      "XII BDG B",
      "XII BDG C",
      "XII BDG D"
    ]
  },
  {
    "fullName": "Taufik Setiawan",
    "email": "taufik.setiawan@simanis.com",
    "nomorInduk": "G00094",
    "majors": [
      "BDG",
      "TKR"
    ],
    "classNames": [
      "X TKR A",
      "X TKR B",
      "X TKR C",
      "X TKR D",
      "XII BDG A",
      "XII BDG B",
      "XII BDG C",
      "XII BDG D"
    ]
  },
  {
    "fullName": "Toni Puspita",
    "email": "toni.puspita@simanis.com",
    "nomorInduk": "G00095",
    "majors": [
      "BDG"
    ],
    "classNames": [
      "X BDG A",
      "X BDG B",
      "X BDG C",
      "X BDG D",
      "XI BDG A",
      "XI BDG B",
      "XI BDG C",
      "XI BDG D"
    ]
  },
  {
    "fullName": "Toni Saputra",
    "email": "toni.saputra@simanis.com",
    "nomorInduk": "G00096",
    "majors": [
      "BDG"
    ],
    "classNames": [
      "X BDG A",
      "X BDG B",
      "X BDG C",
      "X BDG D",
      "XI BDG A",
      "XI BDG B",
      "XI BDG C",
      "XI BDG D"
    ]
  },
  {
    "fullName": "Toni Wijaya",
    "email": "toni.wijaya@simanis.com",
    "nomorInduk": "G00097",
    "majors": [
      "BDG"
    ],
    "classNames": [
      "X BDG A",
      "X BDG B",
      "X BDG C",
      "X BDG D",
      "XI BDG A",
      "XI BDG B",
      "XI BDG C",
      "XI BDG D"
    ]
  },
  {
    "fullName": "Umar Kusuma",
    "email": "umar.kusuma@simanis.com",
    "nomorInduk": "G00098",
    "majors": [
      "TKR"
    ],
    "classNames": [
      "XI TKR A",
      "XI TKR B",
      "XI TKR C",
      "XI TKR D",
      "XII TKR A",
      "XII TKR B",
      "XII TKR C",
      "XII TKR D"
    ]
  },
  {
    "fullName": "Umar Nugroho",
    "email": "umar.nugroho@simanis.com",
    "nomorInduk": "G00099",
    "majors": [
      "TKR"
    ],
    "classNames": [
      "XI TKR A",
      "XI TKR B",
      "XI TKR C",
      "XI TKR D",
      "XII TKR A",
      "XII TKR B",
      "XII TKR C",
      "XII TKR D"
    ]
  },
  {
    "fullName": "Umi Hartono",
    "email": "umi.hartono@simanis.com",
    "nomorInduk": "G00100",
    "majors": [
      "BDG",
      "TKR"
    ],
    "classNames": [
      "X TKR A",
      "X TKR B",
      "X TKR C",
      "X TKR D",
      "XII BDG A",
      "XII BDG B",
      "XII BDG C",
      "XII BDG D"
    ]
  },
  {
    "fullName": "Umi Hidayat",
    "email": "umi.hidayat@simanis.com",
    "nomorInduk": "G00101",
    "majors": [
      "BDG",
      "TKR"
    ],
    "classNames": [
      "X TKR A",
      "X TKR B",
      "X TKR C",
      "X TKR D",
      "XII BDG A",
      "XII BDG B",
      "XII BDG C",
      "XII BDG D"
    ]
  },
  {
    "fullName": "Umi Ramadhan",
    "email": "umi.ramadhan@simanis.com",
    "nomorInduk": "G00102",
    "majors": [
      "BDG",
      "TKR"
    ],
    "classNames": [
      "X TKR A",
      "X TKR B",
      "X TKR C",
      "X TKR D",
      "XII BDG A",
      "XII BDG B",
      "XII BDG C",
      "XII BDG D"
    ]
  },
  {
    "fullName": "Vera Prasetyo",
    "email": "vera.prasetyo@simanis.com",
    "nomorInduk": "G00103",
    "majors": [
      "HTL"
    ],
    "classNames": [
      "X HTL A",
      "X HTL B",
      "X HTL C",
      "X HTL D",
      "XI HTL A",
      "XI HTL B",
      "XI HTL C",
      "XI HTL D"
    ]
  },
  {
    "fullName": "Vera Rahayu",
    "email": "vera.rahayu@simanis.com",
    "nomorInduk": "G00104",
    "majors": [
      "HTL"
    ],
    "classNames": [
      "X HTL A",
      "X HTL B",
      "X HTL C",
      "X HTL D",
      "XI HTL A",
      "XI HTL B",
      "XI HTL C",
      "XI HTL D"
    ]
  },
  {
    "fullName": "Vina Fauzi",
    "email": "vina.fauzi@simanis.com",
    "nomorInduk": "G00105",
    "majors": [
      "TKR"
    ],
    "classNames": [
      "XI TKR A",
      "XI TKR B",
      "XI TKR C",
      "XI TKR D",
      "XII TKR A",
      "XII TKR B",
      "XII TKR C",
      "XII TKR D"
    ]
  },
  {
    "fullName": "Vina Marlina",
    "email": "vina.marlina@simanis.com",
    "nomorInduk": "G00106",
    "majors": [
      "TKR"
    ],
    "classNames": [
      "XI TKR A",
      "XI TKR B",
      "XI TKR C",
      "XI TKR D",
      "XII TKR A",
      "XII TKR B",
      "XII TKR C",
      "XII TKR D"
    ]
  },
  {
    "fullName": "Vina Pratama",
    "email": "vina.pratama@simanis.com",
    "nomorInduk": "G00107",
    "majors": [
      "TKR"
    ],
    "classNames": [
      "XI TKR A",
      "XI TKR B",
      "XI TKR C",
      "XI TKR D",
      "XII TKR A",
      "XII TKR B",
      "XII TKR C",
      "XII TKR D"
    ]
  },
  {
    "fullName": "Wahyu Kartika",
    "email": "wahyu.kartika@simanis.com",
    "nomorInduk": "G00108",
    "majors": [
      "HTL"
    ],
    "classNames": [
      "X HTL A",
      "X HTL B",
      "X HTL C",
      "X HTL D",
      "XI HTL A",
      "XI HTL B",
      "XI HTL C",
      "XI HTL D"
    ]
  },
  {
    "fullName": "Wahyu Lestari",
    "email": "wahyu.lestari@simanis.com",
    "nomorInduk": "G00109",
    "majors": [
      "HTL"
    ],
    "classNames": [
      "X HTL A",
      "X HTL B",
      "X HTL C",
      "X HTL D",
      "XI HTL A",
      "XI HTL B",
      "XI HTL C",
      "XI HTL D"
    ]
  },
  {
    "fullName": "Wahyu Maharani",
    "email": "wahyu.maharani@simanis.com",
    "nomorInduk": "G00110",
    "majors": [
      "HTL"
    ],
    "classNames": [
      "X HTL A",
      "X HTL B",
      "X HTL C",
      "X HTL D",
      "XI HTL A",
      "XI HTL B",
      "XI HTL C",
      "XI HTL D"
    ]
  },
  {
    "fullName": "Wulan Puspita",
    "email": "wulan.puspita@simanis.com",
    "nomorInduk": "G00111",
    "majors": [
      "HTL",
      "KUL"
    ],
    "classNames": [
      "X KUL A",
      "X KUL B",
      "X KUL C",
      "X KUL D",
      "XII HTL A",
      "XII HTL B",
      "XII HTL C",
      "XII HTL D"
    ]
  },
  {
    "fullName": "Wulan Wijaya",
    "email": "wulan.wijaya@simanis.com",
    "nomorInduk": "G00112",
    "majors": [
      "HTL",
      "KUL"
    ],
    "classNames": [
      "X KUL A",
      "X KUL B",
      "X KUL C",
      "X KUL D",
      "XII HTL A",
      "XII HTL B",
      "XII HTL C",
      "XII HTL D"
    ]
  },
  {
    "fullName": "Yoga Aini",
    "email": "yoga.aini@simanis.com",
    "nomorInduk": "G00113",
    "majors": [
      "HTL",
      "KUL"
    ],
    "classNames": [
      "X KUL A",
      "X KUL B",
      "X KUL C",
      "X KUL D",
      "XII HTL A",
      "XII HTL B",
      "XII HTL C",
      "XII HTL D"
    ]
  },
  {
    "fullName": "Yoga Saputra",
    "email": "yoga.saputra@simanis.com",
    "nomorInduk": "G00114",
    "majors": [
      "HTL",
      "KUL"
    ],
    "classNames": [
      "X KUL A",
      "X KUL B",
      "X KUL C",
      "X KUL D",
      "XII HTL A",
      "XII HTL B",
      "XII HTL C",
      "XII HTL D"
    ]
  },
  {
    "fullName": "Yoga Wibowo",
    "email": "yoga.wibowo@simanis.com",
    "nomorInduk": "G00115",
    "majors": [
      "HTL",
      "KUL"
    ],
    "classNames": [
      "X KUL A",
      "X KUL B",
      "X KUL C",
      "X KUL D",
      "XII HTL A",
      "XII HTL B",
      "XII HTL C",
      "XII HTL D"
    ]
  },
  {
    "fullName": "Yuni Hidayat",
    "email": "yuni.hidayat@simanis.com",
    "nomorInduk": "G00116",
    "majors": [
      "KUL"
    ],
    "classNames": [
      "XI KUL A",
      "XI KUL B",
      "XI KUL C",
      "XI KUL D",
      "XII KUL A",
      "XII KUL B",
      "XII KUL C",
      "XII KUL D"
    ]
  },
  {
    "fullName": "Yuni Ramadhan",
    "email": "yuni.ramadhan@simanis.com",
    "nomorInduk": "G00117",
    "majors": [
      "KUL"
    ],
    "classNames": [
      "XI KUL A",
      "XI KUL B",
      "XI KUL C",
      "XI KUL D",
      "XII KUL A",
      "XII KUL B",
      "XII KUL C",
      "XII KUL D"
    ]
  },
  {
    "fullName": "Zahra Hartono",
    "email": "zahra.hartono@simanis.com",
    "nomorInduk": "G00118",
    "majors": [
      "KUL"
    ],
    "classNames": [
      "XI KUL A",
      "XI KUL B",
      "XI KUL C",
      "XI KUL D",
      "XII KUL A",
      "XII KUL B",
      "XII KUL C",
      "XII KUL D"
    ]
  },
  {
    "fullName": "Zahra Santoso",
    "email": "zahra.santoso@simanis.com",
    "nomorInduk": "G00119",
    "majors": [
      "KUL"
    ],
    "classNames": [
      "XI KUL A",
      "XI KUL B",
      "XI KUL C",
      "XI KUL D",
      "XII KUL A",
      "XII KUL B",
      "XII KUL C",
      "XII KUL D"
    ]
  },
  {
    "fullName": "Zahra Setiawan",
    "email": "zahra.setiawan@simanis.com",
    "nomorInduk": "G00120",
    "majors": [
      "KUL"
    ],
    "classNames": [
      "XI KUL A",
      "XI KUL B",
      "XI KUL C",
      "XI KUL D",
      "XII KUL A",
      "XII KUL B",
      "XII KUL C",
      "XII KUL D"
    ]
  }
];

export const subjectsData: SeedSubject[] = [
  {
    "name": "Akuntansi Dasar",
    "code": "AKL-X-1",
    "majorCode": "AKL",
    "gradeCode": "X",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Ekonomi",
    "code": "AKL-X-2",
    "majorCode": "AKL",
    "gradeCode": "X",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Akuntansi Keuangan",
    "code": "AKL-XI-1",
    "majorCode": "AKL",
    "gradeCode": "XI",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Komputer Akuntansi",
    "code": "AKL-XI-2",
    "majorCode": "AKL",
    "gradeCode": "XI",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Akuntansi Pajak",
    "code": "AKL-XII-1",
    "majorCode": "AKL",
    "gradeCode": "XII",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Audit",
    "code": "AKL-XII-2",
    "majorCode": "AKL",
    "gradeCode": "XII",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Dasar Bisnis Digital",
    "code": "BDG-X-1",
    "majorCode": "BDG",
    "gradeCode": "X",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Kewirausahaan",
    "code": "BDG-X-2",
    "majorCode": "BDG",
    "gradeCode": "X",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Pemasaran Digital",
    "code": "BDG-XI-1",
    "majorCode": "BDG",
    "gradeCode": "XI",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "E-Commerce",
    "code": "BDG-XI-2",
    "majorCode": "BDG",
    "gradeCode": "XI",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Analisis Data Bisnis",
    "code": "BDG-XII-1",
    "majorCode": "BDG",
    "gradeCode": "XII",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Manajemen Media Sosial",
    "code": "BDG-XII-2",
    "majorCode": "BDG",
    "gradeCode": "XII",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Desain Grafis",
    "code": "DKV-X-1",
    "majorCode": "DKV",
    "gradeCode": "X",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Fotografi",
    "code": "DKV-X-2",
    "majorCode": "DKV",
    "gradeCode": "X",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Ilustrasi Digital",
    "code": "DKV-XI-1",
    "majorCode": "DKV",
    "gradeCode": "XI",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Videografi",
    "code": "DKV-XI-2",
    "majorCode": "DKV",
    "gradeCode": "XI",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Desain UI/UX",
    "code": "DKV-XII-1",
    "majorCode": "DKV",
    "gradeCode": "XII",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Branding dan Identitas Visual",
    "code": "DKV-XII-2",
    "majorCode": "DKV",
    "gradeCode": "XII",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Dasar Perhotelan",
    "code": "HTL-X-1",
    "majorCode": "HTL",
    "gradeCode": "X",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Bahasa Inggris Pariwisata",
    "code": "HTL-X-2",
    "majorCode": "HTL",
    "gradeCode": "X",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Front Office",
    "code": "HTL-XI-1",
    "majorCode": "HTL",
    "gradeCode": "XI",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Housekeeping",
    "code": "HTL-XI-2",
    "majorCode": "HTL",
    "gradeCode": "XI",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Food and Beverage Service",
    "code": "HTL-XII-1",
    "majorCode": "HTL",
    "gradeCode": "XII",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Manajemen Perhotelan",
    "code": "HTL-XII-2",
    "majorCode": "HTL",
    "gradeCode": "XII",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Boga Dasar",
    "code": "KUL-X-1",
    "majorCode": "KUL",
    "gradeCode": "X",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "K3 Dapur",
    "code": "KUL-X-2",
    "majorCode": "KUL",
    "gradeCode": "X",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Pengolahan Makanan Kontinental",
    "code": "KUL-XI-1",
    "majorCode": "KUL",
    "gradeCode": "XI",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Pastry dan Bakery",
    "code": "KUL-XI-2",
    "majorCode": "KUL",
    "gradeCode": "XI",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Pengolahan Makanan Oriental",
    "code": "KUL-XII-1",
    "majorCode": "KUL",
    "gradeCode": "XII",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Food Cost Control",
    "code": "KUL-XII-2",
    "majorCode": "KUL",
    "gradeCode": "XII",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Algoritma dan Pemrograman",
    "code": "RPL-X-1",
    "majorCode": "PPLG",
    "gradeCode": "X",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Basis Data Dasar",
    "code": "RPL-X-2",
    "majorCode": "PPLG",
    "gradeCode": "X",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Pemrograman Web",
    "code": "RPL-XI-1",
    "majorCode": "PPLG",
    "gradeCode": "XI",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Pemrograman Berorientasi Objek",
    "code": "RPL-XI-2",
    "majorCode": "PPLG",
    "gradeCode": "XI",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Pemrograman Mobile",
    "code": "RPL-XII-1",
    "majorCode": "PPLG",
    "gradeCode": "XII",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Proyek Kreatif dan Kewirausahaan",
    "code": "RPL-XII-2",
    "majorCode": "PPLG",
    "gradeCode": "XII",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Jaringan Komputer",
    "code": "TKJ-X-1",
    "majorCode": "TJKT",
    "gradeCode": "X",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Pemrograman Dasar",
    "code": "TKJ-X-2",
    "majorCode": "TJKT",
    "gradeCode": "X",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Administrasi Sistem Jaringan",
    "code": "TKJ-XI-1",
    "majorCode": "TJKT",
    "gradeCode": "XI",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Keamanan Jaringan",
    "code": "TKJ-XI-2",
    "majorCode": "TJKT",
    "gradeCode": "XI",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Cloud Computing",
    "code": "TKJ-XII-1",
    "majorCode": "TJKT",
    "gradeCode": "XII",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Server dan Virtualisasi",
    "code": "TKJ-XII-2",
    "majorCode": "TJKT",
    "gradeCode": "XII",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Dasar Otomotif",
    "code": "TKR-X-1",
    "majorCode": "TKR",
    "gradeCode": "X",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "K3 Otomotif",
    "code": "TKR-X-2",
    "majorCode": "TKR",
    "gradeCode": "X",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Sistem Kelistrikan Otomotif",
    "code": "TKR-XI-1",
    "majorCode": "TKR",
    "gradeCode": "XI",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Perawatan Mesin",
    "code": "TKR-XI-2",
    "majorCode": "TKR",
    "gradeCode": "XI",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Chassis dan Sistem Kemudi",
    "code": "TKR-XII-1",
    "majorCode": "TKR",
    "gradeCode": "XII",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Diagnosa Kerusakan",
    "code": "TKR-XII-2",
    "majorCode": "TKR",
    "gradeCode": "XII",
    "semester": "Ganjil",
    
    "vocational": true
  },
  {
    "name": "Pendidikan Agama",
    "code": "PAI-X",
    "majorCode": null,
    "gradeCode": "X",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "Pendidikan Agama",
    "code": "PAI-XI",
    "majorCode": null,
    "gradeCode": "XI",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "Pendidikan Agama",
    "code": "PAI-XII",
    "majorCode": null,
    "gradeCode": "XII",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "Pendidikan Pancasila",
    "code": "PPK-X",
    "majorCode": null,
    "gradeCode": "X",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "Pendidikan Pancasila",
    "code": "PPK-XI",
    "majorCode": null,
    "gradeCode": "XI",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "Pendidikan Pancasila",
    "code": "PPK-XII",
    "majorCode": null,
    "gradeCode": "XII",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "Bahasa Indonesia",
    "code": "BIN-X",
    "majorCode": null,
    "gradeCode": "X",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "Bahasa Indonesia",
    "code": "BIN-XI",
    "majorCode": null,
    "gradeCode": "XI",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "Bahasa Indonesia",
    "code": "BIN-XII",
    "majorCode": null,
    "gradeCode": "XII",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "Bahasa Inggris",
    "code": "BING-X",
    "majorCode": null,
    "gradeCode": "X",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "Bahasa Inggris",
    "code": "BING-XI",
    "majorCode": null,
    "gradeCode": "XI",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "Bahasa Inggris",
    "code": "BING-XII",
    "majorCode": null,
    "gradeCode": "XII",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "Matematika",
    "code": "MTK-X",
    "majorCode": null,
    "gradeCode": "X",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "Matematika",
    "code": "MTK-XI",
    "majorCode": null,
    "gradeCode": "XI",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "Matematika",
    "code": "MTK-XII",
    "majorCode": null,
    "gradeCode": "XII",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "Informatika",
    "code": "INF-X",
    "majorCode": null,
    "gradeCode": "X",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "Informatika",
    "code": "INF-XI",
    "majorCode": null,
    "gradeCode": "XI",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "Informatika",
    "code": "INF-XII",
    "majorCode": null,
    "gradeCode": "XII",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "Sejarah",
    "code": "SEJ-X",
    "majorCode": null,
    "gradeCode": "X",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "Sejarah",
    "code": "SEJ-XI",
    "majorCode": null,
    "gradeCode": "XI",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "Sejarah",
    "code": "SEJ-XII",
    "majorCode": null,
    "gradeCode": "XII",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "PJOK",
    "code": "PJOK-X",
    "majorCode": null,
    "gradeCode": "X",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "PJOK",
    "code": "PJOK-XI",
    "majorCode": null,
    "gradeCode": "XI",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "PJOK",
    "code": "PJOK-XII",
    "majorCode": null,
    "gradeCode": "XII",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "Seni Budaya",
    "code": "SBD-X",
    "majorCode": null,
    "gradeCode": "X",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "Seni Budaya",
    "code": "SBD-XI",
    "majorCode": null,
    "gradeCode": "XI",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "Seni Budaya",
    "code": "SBD-XII",
    "majorCode": null,
    "gradeCode": "XII",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "Prakarya dan Kewirausahaan",
    "code": "PKWU-X",
    "majorCode": null,
    "gradeCode": "X",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "Prakarya dan Kewirausahaan",
    "code": "PKWU-XI",
    "majorCode": null,
    "gradeCode": "XI",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "Prakarya dan Kewirausahaan",
    "code": "PKWU-XII",
    "majorCode": null,
    "gradeCode": "XII",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "Projek P5",
    "code": "P5-X",
    "majorCode": null,
    "gradeCode": "X",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "Projek P5",
    "code": "P5-XI",
    "majorCode": null,
    "gradeCode": "XI",
    "semester": "Ganjil",
    
    "vocational": false
  },
  {
    "name": "Projek P5",
    "code": "P5-XII",
    "majorCode": null,
    "gradeCode": "XII",
    "semester": "Ganjil",
    
    "vocational": false
  }
];
