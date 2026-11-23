import { StudentCourseDetail } from "@/components/student/module-course/detail/student-course-detail";

export default async function MuridModuleDetailPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const [classId, subjectId] = moduleId.split("--");

  if (!classId || !subjectId) {
    return (
      <div className="rounded-2xl bg-white px-6 py-10 text-center shadow-sm">
        <p className="text-[14px] font-semibold text-[#1E293B]">
          Course tidak ditemukan
        </p>
        <p className="mt-1 text-[12px] text-[#64748B]">
          Tautan course tidak valid.
        </p>
      </div>
    );
  }

  return <StudentCourseDetail classId={classId} subjectId={subjectId} />;
}
