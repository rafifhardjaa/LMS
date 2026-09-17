import { Plus_Jakarta_Sans } from "next/font/google";
import { Sidebar } from "@/components/admin/sidebar";
import { Topbar } from "@/components/admin/topbar";

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
      <Sidebar />
      <Topbar />
      <main className="w-full pl-72 pt-16 pr-8 pb-12 flex-1">{children}</main>
    </div>
  );
}