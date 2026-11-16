// Isi capaian_pembelajaran untuk semua mata pelajaran yang masih NULL.
//
// Teks capaian diklasifikasikan berdasarkan keyword nama mapel (case-insensitive),
// dengan fallback generik untuk mapel yang belum dikenali.
//
// Run (from BackEnd):
//   bun run scripts/fill-capaian.ts
// Dry run:
//   bun run scripts/fill-capaian.ts --dry-run

import { eq, isNull } from "drizzle-orm";
import { db } from "../src/db/index";
import { subjects } from "../src/db/schema";

type CapaianRule = {
  keywords: string[];
  capaian: string;
};

const rules: CapaianRule[] = [
  {
    keywords: ["administrasi infrastruktur jaringan", "administrasi sistem jaringan", "lanjutan administrasi"],
    capaian:
      "1. Merancang, memasang, dan mengelola infrastruktur jaringan komputer di lingkungan kantor/industri.\n2. Mengonfigurasi perangkat jaringan (router, switch, server) sesuai standar dan kebutuhan layanan.\n3. Menganalisis gangguan jaringan serta melakukan perawatan dan perbaikan sistem jaringan.",
  },
  {
    keywords: ["administrasi pajak"],
    capaian:
      "1. Memahami administrasi perpajakan dan jenis-jenis pajak yang berlaku di Indonesia.\n2. Melakukan pendaftaran, penghitungan, dan pelaporan pajak secara administratif yang benar.\n3. Mengelola arsip dan dokumen perpajakan sesuai ketentuan yang berlaku.",
  },
  {
    keywords: ["akuntansi keuangan", "dasar-dasar akl", "lanjutan akuntansi"],
    capaian:
      "1. Mencatat transaksi keuangan dan menyusun laporan keuangan sederhana sesuai siklus akuntansi.\n2. Mengelola administrasi keuangan lembaga/instansi dengan tertib dan akurat.\n3. Menganalisis informasi keuangan untuk pengambilan keputusan bisnis.",
  },
  {
    keywords: ["akuntansi lembaga"],
    capaian:
      "1. Memahami administrasi keuangan lembaga/instansi pemerintah dan akuntansi pemerintahan.\n2. Mencatat dan melaporkan transaksi keuangan lembaga secara tertib administrasi.\n3. Menyusun pertanggungjawaban keuangan sesuai ketentuan yang berlaku.",
  },
  {
    keywords: ["animasi"],
    capaian:
      "1. Memahami prinsip animasi dan alur produksi animasi 2D/3D.\n2. Membuat aset dan gerakan animasi sederhana menggunakan perangkat lunak animasi.\n3. Menyusun storyboard dan memproduksi karya animasi pendek yang layak pantau.",
  },
  {
    keywords: ["bahasa indonesia"],
    capaian:
      "1. Menganalisis dan menanggapi teks lisan/tulis sesuai konteks dan tujuan komunikasi.\n2. Menyajikan gagasan secara lisan dan tulisan dengan bahasa Indonesia yang baik dan benar.\n3. Menghargai dan memanfaatkan bahasa Indonesia sebagai bahasa persatuan dan pengungkap budaya.",
  },
  {
    keywords: ["bahasa inggris"],
    capaian:
      "1. Memahami dan merespons teks lisan/tulis dalam bahasa Inggris untuk keperluan sehari-hari dan dunia kerja.\n2. Menyusun teks fungsional pendek dan presentasi sederhana dalam bahasa Inggris.\n3. Mengembangkan kemampuan komunikasi interpersonal dan transaksional dalam bahasa Inggris.",
  },
  {
    keywords: ["basis data"],
    capaian:
      "1. Merancang basis data relasional sesuai kebutuhan dan normalisasi.\n2. Mengimplementasikan basis data menggunakan perangkat lunak database.\n3. Memanipulasi dan mengolah data melalui kueri yang efisien dan aman.",
  },
  {
    keywords: ["bisnis online", "digital marketing", "lanjutan digital marketing"],
    capaian:
      "1. Memahami konsep pemasaran digital dan peluang bisnis daring.\n2. Menyusun strategi pemasaran digital sederhana untuk produk/jasa.\n3. Mengelola toko/akun bisnis daring serta menganalisis performanya.",
  },
  {
    keywords: ["dasar-dasar bisnis digital"],
    capaian:
      "1. Memahami ekosistem dan model bisnis digital.\n2. Menyusun rencana bisnis digital sederhana berbasis kebutuhan pasar.\n3. Mengelola operasional bisnis digital secara bertanggung jawab.",
  },
  {
    keywords: ["dasar-dasar dkv"],
    capaian:
      "1. Memahami dasar-dasar desain komunikasi visual dan elemen-elemen desain.\n2. Membuat karya desain grafis sederhana dengan perangkat lunak desain.\n3. Mengomunikasikan ide secara visual yang efektif dan estetis.",
  },
  {
    keywords: ["dasar-dasar kuliner"],
    capaian:
      "1. Memahami ilmu dasar kuliner dan higienitas pengolahan makanan.\n2. Mengolah bahan makanan menjadi hidangan sesuai standar mutu.\n3. Mengelola usaha kuliner sederhana secara kreatif dan bermartabat.",
  },
  {
    keywords: ["dasar-dasar perhotelan"],
    capaian:
      "1. Memahami operasional dasar industri perhotelan dan pelayanan tamu.\n2. Menerapkan standar kerapihan, keramahan, dan keselamatan kerja di lingkungan hotel.\n3. Menyajikan pelayanan akomodasi yang profesional.",
  },
  {
    keywords: ["dasar-dasar pplg"],
    capaian:
      "1. Memahami dasar-dasar rekayasa perangkat lunak dan alur pengembangan aplikasi.\n2. Membuat program/aplikasi sederhana menggunakan bahasa pemrograman.\n3. Menerapkan logika dan struktur program yang baik serta terdokumentasi.",
  },
  {
    keywords: ["dasar-dasar teknik kimia industri"],
    capaian:
      "1. Memahami proses dasar industri kimia dan keselamatan kerja di lingkungan pabrik.\n2. Mengoperasikan peralatan proses kimia sederhana sesuai prosedur.\n3. Menganalisis parameter proses untuk menjaga mutu dan efisiensi produksi.",
  },
  {
    keywords: ["dasar-dasar teknik otomotif"],
    capaian:
      "1. Memahami sistem kendaraan bermotor dan keselamatan kerja bengkel.\n2. Mengidentifikasi dan memeriksa komponen utama kendaraan ringan.\n3. Melakukan perawatan dan perbaikan dasar kendaraan bermotor.",
  },
  {
    keywords: ["dasar-dasar tjkt"],
    capaian:
      "1. Memahami arsitektur komputer dan jaringan serta perangkat TIK dasar.\n2. Menginstal dan mengonfigurasi sistem operasi dan perangkat jaringan.\n3. Mengelola infrastruktur TIK sederhana secara aman dan bertanggung jawab.",
  },
  {
    keywords: ["desain grafis percetakan"],
    capaian:
      "1. Memahami proses produksi cetak dan persiapan files cetak.\n2. Membuat desain grafis sesuai standar teknis percetakan.\n3. Mengontrol mutu hasil cetak sesuai ketentuan yang ditetapkan.",
  },
  {
    keywords: ["desain media interaktif"],
    capaian:
      "1. Memahami konsep media interaktif dan pengalaman pengguna.\n2. Membuat prototype dan aset media interaktif sederhana.\n3. Menyusun produk media interaktif yang komunikatif dan fungsional.",
  },
  {
    keywords: ["food and beverage service", "lanjutan food and beverage"],
    capaian:
      "1. Memahami jenis layanan makanan dan minuman serta standar pelayanannya.\n2. Menerapkan teknik penyajian dan pelayanan F&B yang ramah dan profesional.\n3. Menganalisis kepuasan tamu dan kualitas layanan F&B.",
  },
  {
    keywords: ["fotografi"],
    capaian:
      "1. Memahami teknik dasar fotografi dan penggunaan kamera.\n2. Menghasilkan foto sesuai komposisi dan pencahayaan yang tepat.\n3. Mengedit dan mempresentasikan karya fotografi secara kreatif.",
  },
  {
    keywords: ["front office"],
    capaian:
      "1. Memahami tugas front office dan sistem reservasi hotel.\n2. Melayani proses check-in/check-out serta keluhan tamu secara profesional.\n3. Mengelola administrasi front office secara tertib dan akurat.",
  },
  {
    keywords: ["housekeeping"],
    capaian:
      "1. Memahami standar kebersihan dan kerapian area kamar hotel.\n2. Melakukan pembersihan dan perawatan kamar sesuai prosedur housekeeping.\n3. Menjaga kelancaran operasional housekeeping dan kenyamanan tamu.",
  },
  {
    keywords: ["informatika"],
    capaian:
      "1. Memahami konsep algoritma, struktur data, dan pemrograman untuk pemecahan masalah komputasional.\n2. Mengembangkan program sederhana berbasis logika pemrograman dan struktur data.\n3. Menerapkan literasi digital dan keamanan siber dalam aktivitas sehari-hari.",
  },
  {
    keywords: ["keamanan jaringan"],
    capaian:
      "1. Memahami ancaman keamanan siber dan prinsip keamanan jaringan.\n2. Menerapkan langkah-langkah pengamanan jaringan sederhana.\n3. Mendeteksi dan menanggapi gangguan keamanan jaringan secara tepat.",
  },
  {
    keywords: ["kimia analisis"],
    capaian:
      "1. Memahami metode analisis kimia dan keselamatan laboratorium.\n2. Melakukan pengujian sampel dengan teknik analisis kualitatif/kuantitatif.\n3. Mengolah dan menafsirkan data hasil analisis secara bertanggung jawab.",
  },
  {
    keywords: ["komputer akuntansi", "lanjutan komputer akuntansi"],
    capaian:
      "1. Mengoperasikan aplikasi akuntansi komputer dengan benar.\n2. Membuat dan memproses laporan keuangan berbasis sistem informasi akuntansi.\n3. Menganalisis kesesuaian data akuntansi dengan prinsip yang berlaku.",
  },
  {
    keywords: ["komunikasi bisnis"],
    capaian:
      "1. Memahami etika dan teknik komunikasi bisnis yang efektif.\n2. Menyusun dokumen dan presentasi bisnis yang komunikatif.\n3. Melakukan negosiasi dan komunikasi interpersonal dalam konteks bisnis.",
  },
  {
    keywords: ["layanan akomodasi", "lanjutan layanan akomodasi"],
    capaian:
      "1. Memahami operasional layanan akomodasi dan fasilitas pendukungnya.\n2. Menerapkan standar pelayanan akomodasi yang aman dan nyaman.\n3. Menganalisis kinerja layanan akomodasi untuk kepuasan tamu.",
  },
  {
    keywords: ["mesin dan sasis", "lanjutan mesin dan sasis"],
    capaian:
      "1. Memahami konstruksi dan kerja sistem mesin serta sasis kendaraan.\n2. Melakukan perawatan dan perbaikan mesin dan sasis sesuai prosedur.\n3. Mendiagnosis gangguan dan memastikan kelaikan kendaraan.",
  },
  {
    keywords: ["matematika"],
    capaian:
      "1. Menganalisis dan menyelesaikan masalah matematika yang berkaitan dengan aljabar, geometri, dan statistika.\n2. Menginterpretasikan penyelesaian masalah dalam konteks dunia nyata.\n3. Mengkomunikasikan hasil pemecahan masalah secara logis dan sistematis.",
  },
  {
    keywords: ["muatan lokal"],
    capaian:
      "1. Memahami dan melestarikan kearifan lokal serta budaya daerah.\n2. Menganalisis permasalahan sosial-budaya di lingkungan sekitar.\n3. Mengaplikasikan nilai-nilai luhur budaya dalam kehidupan sehari-hari.",
  },
  {
    keywords: ["pemasaran"],
    capaian:
      "1. Memahami konsep pemasaran dan perilaku konsumen.\n2. Menyusun bauran pemasaran sederhana untuk produk/jasa.\n3. Melakukan kegiatan penjualan dan pelayanan pelanggan yang baik.",
  },
  {
    keywords: ["pemeliharaan kelistrikan"],
    capaian:
      "1. Memahami sistem kelistrikan kendaraan ringan dan keselamatan kerjanya.\n2. Memeriksa dan memelihara komponen kelistrikan kendaraan.\n3. Menganalisis gangguan kelistrikan dan melakukan perbaikan yang tepat.",
  },
  {
    keywords: ["pemeliharaan mesin kendaraan"],
    capaian:
      "1. Memahami komponen dan fungsi sistem mesin kendaraan ringan.\n2. Melakukan perawatan berkala dan penyetelan mesin sesuai standar.\n3. Mengidentifikasi kerusakan mesin dan melakukan perbaikan dasar.",
  },
  {
    keywords: ["pemeliharaan sasis"],
    capaian:
      "1. Memahami sistem sasis dan pemindah tenaga kendaraan.\n2. Memeriksa dan memelihara komponen sasis serta sistem kemudi/rem.\n3. Menjaga keseimbangan, stabilitas, dan kelaikan sasis kendaraan.",
  },
  {
    keywords: ["pemrograman berorientasi objek"],
    capaian:
      "1. Memahami konsep berorientasi objek (class, object, inheritance, polymorphism).\n2. Mengembangkan program sederhana berbasis OOP yang terstruktur.\n3. Menganalisis permasalahan dan merancang solusi dengan pendekatan OOP.",
  },
  {
    keywords: ["pemrograman gim"],
    capaian:
      "1. Memahami alur produksi dan elemen dasar game.\n2. Mengembangkan game sederhana menggunakan mesin game.\n3. Menguji dan menyempurnakan gameplay agar menyenangkan dan fungsional.",
  },
  {
    keywords: ["pemrograman web"],
    capaian:
      "1. Memahami teknologi web dan struktur halaman dinamis.\n2. Mengembangkan aplikasi web sederhana yang responsif dan interaktif.\n3. Menguji dan menyebarkan aplikasi web dengan aman.",
  },
  {
    keywords: ["pendidikan agama"],
    capaian:
      "1. Memahami ajaran agama dan budi pekerti sebagai landasan berperilaku.\n2. Mengamalkan nilai-nilai keagamaan dalam kehidupan sehari-hari.\n3. Menunjukkan sikap toleransi dan saling menghormati antar umat beragama.",
  },
  {
    keywords: ["pendidikan pancasila"],
    capaian:
      "1. Memahami nilai-nilai Pancasila dan hak/kewajiban warga negara.\n2. Menganalisis permasalahan sosial dengan perspektif Pancasila.\n3. Mengamalkan perilaku demokratis dan berkeadaban dalam kehidupan berbangsa.",
  },
  {
    keywords: ["pengelolaan bisnis ritel"],
    capaian:
      "1. Memahami operasional bisnis ritel dan manajemen toko.\n2. Mengelola stok, display, dan pelayanan pelanggan ritel.\n3. Menganalisis kinerja penjualan untuk pengembangan bisnis.",
  },
  {
    keywords: ["pengendalian proses industri"],
    capaian:
      "1. Memahami parameter proses industri dan instrumen kendali.\n2. Mengendalikan proses produksi agar stabil dan sesuai target.\n3. Menganalisis penyimpangan proses dan mengambil tindakan korektif.",
  },
  {
    keywords: ["pengolahan kue"],
    capaian:
      "1. Memahami bahan, alat, dan teknik pengolahan kue dan roti.\n2. Mengolah kue/roti sesuai resep dan standar mutu.\n3. Mengemas dan mengelola usaha pengolahan kue secara kreatif.",
  },
  {
    keywords: ["pengolahan makanan indonesia"],
    capaian:
      "1. Memahami kekayaan kuliner Indonesia dan teknik pengolahannya.\n2. Menghidangkan masakan Indonesia sesuai resep dan standar kebersihan.\n3. Mengembangkan kreasi hidangan nusantara yang mutu terjaga.",
  },
  {
    keywords: ["pengolahan makanan kontinental"],
    capaian:
      "1. Memahami teknik dasar pengolahan masakan kontinental.\n2. Menghidangkan hidangan kontinental sesuai standar mutu dan penyajian.\n3. Menganalisis kebutuhan bahan dan biaya produksi hidangan.",
  },
  {
    keywords: ["pengujian dan analisis mutu"],
    capaian:
      "1. Memahami standar mutu dan metode pengujian bahan/produk.\n2. Melakukan pengujian mutu dengan peralatan yang sesuai prosedur.\n3. Menyusun laporan hasil pengujian dan rekomendasi perbaikan mutu.",
  },
  {
    keywords: ["penyajian makanan dan minuman"],
    capaian:
      "1. Memahami teknik dan standar penyajian makanan dan minuman.\n2. Menyajikan hidangan dengan tata cara yang benar dan estetis.\n3. Menjaga higienitas dan kenyamanan penyajian bagi tamu.",
  },
  {
    keywords: ["persiapan ukk"],
    capaian:
      "1. Menguasai standar kompetensi keahlian yang diujikan dalam UKK.\n2. Melakukan latihan/praktik sesuai rubrik penilaian UKK.\n3. Menunjukkan kesiapan dan kepercayaan diri menghadapi UKK.",
  },
  {
    keywords: ["pjok"],
    capaian:
      "1. Memahami konsep pendidikan jasmani, olahraga, dan kesehatan.\n2. Melakukan berbagai gerakan/aktivitas fisik dengan teknik yang benar.\n3. Menunjukkan gaya hidup sehat dan sportivitas dalam berolahraga.",
  },
  {
    keywords: ["pkl (bimbingan)"],
    capaian:
      "1. Memahami tata tertib dan tanggung jawab saat melaksanakan PKL.\n2. Melaporkan kegiatan PKL secara tertib dan objektif.\n3. Menganalisis pengalaman kerja untuk pengembangan kompetensi diri.",
  },
  {
    keywords: ["projek ipas"],
    capaian:
      "1. Memahami pendekatan terpadu ilmu pengetahuan alam dan sosial (IPAS).\n2. Menganalisis fenomena alam dan sosial secara sistematis dan ilmiah.\n3. Menyajikan karya projek IPAS yang relevan dengan permasalahan sekitar.",
  },
  {
    keywords: ["projek kreatif", "pkk"],
    capaian:
      "1. Memahami proses kreatif dan peluang wirausaha berbasis kompetensi keahlian.\n2. Menyusun proposal dan menghasilkan produk/karya kreatif yang bernilai jual.\n3. Mengemas dan memasarkan karya kreatif secara bertanggung jawab.",
  },
  {
    keywords: ["proses kimia industri"],
    capaian:
      "1. Memahami prinsip proses kimia industri dan keselamatan kerja.\n2. Mengoperasikan peralatan proses kimia industri sederhana.\n3. Menganalisis parameter proses untuk efisiensi dan mutu produksi.",
  },
  {
    keywords: ["sejarah"],
    capaian:
      "1. Memahami kronologi dan peristiwa penting dalam sejarah Indonesia dan dunia.\n2. Menganalisis penyebab dan dampak peristiwa sejarah secara kritis.\n3. Menghargai warisan sejarah sebagai landasan identitas bangsa.",
  },
  {
    keywords: ["seni budaya"],
    capaian:
      "1. Memahami ragam seni dan budaya Indonesia beserta nilai-nilainya.\n2. Mengapresiasi dan mengekspresikan diri melalui karya seni/budaya.\n3. Melestarikan warisan budaya dengan cara yang kreatif dan bertanggung jawab.",
  },
  {
    keywords: ["teknologi jaringan berbasis luas"],
    capaian:
      "1. Memahami konsep wide area network (WAN) dan teknologinya.\n2. Mengonfigurasi koneksi WAN sederhana dan aman.\n3. Menganalisis kinerja jaringan luas dan solusi permasalahannya.",
  },
  {
    keywords: ["teknologi layanan jaringan"],
    capaian:
      "1. Memahami layanan jaringan (DNS, DHCP, web, email) dan konfigurasinya.\n2. Menginstal dan mengonfigurasi server layanan jaringan sederhana.\n3. Menjamin ketersediaan dan keamanan layanan jaringan.",
  },
  {
    keywords: ["videografi"],
    capaian:
      "1. Memahami teknik pengambilan gambar video dan peralatan videografi.\n2. Menghasilkan video sesuai storyboard dan teknik sinematik.\n3. Mengedit dan mempresentasikan karya video yang komunikatif.",
  },
];

const fallbackCapaian =
  "1. Menguasai kompetensi dasar mata pelajaran sesuai kurikulum yang berlaku.\n2. Menerapkan pengetahuan dan keterampilan dalam tugas/praktik yang relevan.\n3. Mengembangkan sikap tanggung jawab dan kerja sama dalam pembelajaran.";

function normalize(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchCapaian(name: string): string {
  const key = normalize(name);
  for (const rule of rules) {
    if (rule.keywords.some((keyword) => key.includes(normalize(keyword)))) {
      return rule.capaian;
    }
  }
  return fallbackCapaian;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  const rows = await db
    .select({ id: subjects.id, name: subjects.name })
    .from(subjects)
    .where(isNull(subjects.capaianPembelajaran));

  let updated = 0;
  for (const row of rows) {
    const capaian = matchCapaian(row.name);
    console.log(`- ${row.name} (${row.id}):`);
    console.log(`    ${capaian.replace(/\n/g, "\n    ")}`);
    if (!dryRun) {
      await db
        .update(subjects)
        .set({ capaianPembelajaran: capaian })
        .where(eq(subjects.id, row.id));
    }
    updated += 1;
  }

  console.log(`\n${dryRun ? "[dry-run] " : ""}Mapel diproses: ${updated}`);
  process.exit(0);
}

await main();
