import { StudentModuleDetail } from "@/components/student/module-detail";

export default async function MuridModuleDetailPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  return <StudentModuleDetail moduleId={moduleId} />;
}
