import { AdminShell } from "@/components/admin/admin-shell";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ fontFamily: plusJakartaSans.style.fontFamily }}
      className="min-h-screen bg-[#f7f9fe] text-[#181c20] antialiased"
    >
      <AdminShell>{children}</AdminShell>
    </div>
  );
}