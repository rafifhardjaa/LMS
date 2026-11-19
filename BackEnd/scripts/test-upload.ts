import { createHash } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { db } from "../src/db/index";
import { courseMeetings } from "../src/db/schema";
import { storageDb } from "../src/db/storage";
import { guruUploadsMateri } from "../src/db/storage-schema";

const BASE = process.env.API_BASE ?? "http://localhost:3000/api/v1";
const IDENTIFIER = process.env.TEST_IDENTIFIER ?? "guru@simanis.com";
const PASSWORD = process.env.TEST_PASSWORD ?? "password123";

function fail(message: string): never {
  console.error(`GAGAL: ${message}`);
  process.exit(1);
}

const loginResponse = await fetch(`${BASE}/auth/login`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ identifier: IDENTIFIER, password: PASSWORD }),
});

const loginPayload = (await loginResponse.json()) as {
  success: boolean;
  data?: string;
  message?: string;
};

if (!loginResponse.ok || !loginPayload.success || !loginPayload.data) {
  fail(`login gagal (${loginResponse.status}): ${loginPayload.message ?? "tanpa pesan"}`);
}

const token = loginPayload.data;

const currentResponse = await fetch(`${BASE}/users/current`, {
  headers: { Authorization: `Bearer ${token}` },
});
const currentPayload = (await currentResponse.json()) as {
  data?: { id: string; role: string };
};

if (!currentResponse.ok || !currentPayload.data) {
  fail("gagal memuat user aktif");
}

const teacherId = currentPayload.data.id;

const meetingId =
  process.env.MEETING_ID ??
  (await db.select({ id: courseMeetings.id }).from(courseMeetings).limit(1))[0]
    ?.id;

if (!meetingId) {
  fail("tidak ada course_meetings; isi env MEETING_ID atau seed database");
}

const sampleName = process.env.TEST_FILE_NAME ?? "sample.pdf";
const sampleMime = process.env.TEST_FILE_MIME ?? "application/pdf";
const sampleText = `Uji upload storage_simanis ${new Date().toISOString()}\n`;
const sampleBytes = new TextEncoder().encode(sampleText);
const expectedChecksum = createHash("sha256").update(sampleBytes).digest("hex");

const form = new FormData();
form.append("file", new File([sampleBytes], sampleName, { type: sampleMime }));
form.append("meetingId", meetingId);

const uploadResponse = await fetch(`${BASE}/uploads/storage/materi`, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
  body: form,
});

const uploadPayload = (await uploadResponse.json()) as {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    fileUrl: string;
    checksumSha256: string;
    sizeBytes: number;
  };
};

if (!uploadResponse.ok || !uploadPayload.success || !uploadPayload.data) {
  fail(`upload gagal (${uploadResponse.status}): ${uploadPayload.message ?? "tanpa pesan"}`);
}

const uploaded = uploadPayload.data;

const [row] = await storageDb
  .select({
    id: guruUploadsMateri.id,
    filename: guruUploadsMateri.filename,
    sizeBytes: guruUploadsMateri.size,
    checksumSha256: guruUploadsMateri.checksumSha256,
    uploadedBy: guruUploadsMateri.uploadedBy,
    uploaderRole: guruUploadsMateri.uploaderRole,
    meetingId: guruUploadsMateri.meetingId,
    dataLength: sql<number>`octet_length(${guruUploadsMateri.data})`,
  })
  .from(guruUploadsMateri)
  .where(eq(guruUploadsMateri.id, uploaded.id))
  .limit(1);

if (!row) {
  fail(`baris ${uploaded.id} tidak ditemukan di guru.uploads_materi`);
}

if (row.filename !== sampleName) fail(`filename tidak cocok: ${row.filename}`);
if (row.sizeBytes !== sampleBytes.byteLength)
  fail(`size_bytes ${row.sizeBytes} != ${sampleBytes.byteLength}`);
if (row.dataLength !== sampleBytes.byteLength)
  fail(`octet_length(data) ${row.dataLength} != ${sampleBytes.byteLength}`);
if (row.checksumSha256 !== expectedChecksum)
  fail(`checksum db ${row.checksumSha256} != ${expectedChecksum}`);
if (row.uploaderRole !== "guru") fail(`uploader_role ${row.uploaderRole} != guru`);
if (row.uploadedBy !== teacherId) fail(`uploaded_by ${row.uploadedBy} != ${teacherId}`);
if (row.meetingId !== meetingId) fail(`meeting_id ${row.meetingId} != ${meetingId}`);

const downloadResponse = await fetch(
  `${BASE}/uploads/storage/materi/${uploaded.id}`,
  { headers: { Authorization: `Bearer ${token}` } },
);

if (!downloadResponse.ok) fail(`GET file gagal (${downloadResponse.status})`);

const downloadedBytes = new Uint8Array(await downloadResponse.arrayBuffer());
const downloadedChecksum = createHash("sha256")
  .update(downloadedBytes)
  .digest("hex");

if (downloadedChecksum !== expectedChecksum)
  fail(`checksum unduhan ${downloadedChecksum} != ${expectedChecksum}`);

const listResponse = await fetch(
  `${BASE}/uploads/storage/materi?meetingId=${encodeURIComponent(meetingId)}`,
  { headers: { Authorization: `Bearer ${token}` } },
);
const listPayload = (await listResponse.json()) as {
  success: boolean;
  data?: { id: string }[];
};

if (
  !listResponse.ok ||
  !listPayload.success ||
  !listPayload.data?.some((item) => item.id === uploaded.id)
) {
  fail("file tidak muncul di daftar slot");
}

console.log("OK upload tersimpan & terverifikasi");
console.log(JSON.stringify({
  id: uploaded.id,
  fileUrl: uploaded.fileUrl,
  meetingId,
  sizeBytes: row.sizeBytes,
  checksumSha256: row.checksumSha256,
  downloadChecksum: downloadedChecksum,
}, null, 2));

process.exit(0);
