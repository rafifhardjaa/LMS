import { Inter } from "next/font/google";
import { GuruSidebar } from "@/components/teacher/sidebar";
import { GuruTopbar } from "@/components/teacher/topbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function GuruLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ fontFamily: inter.style.fontFamily }}
      className="min-h-screen bg-[#EBF0F5] text-[#0d1c2e] antialiased relative overflow-x-hidden"
    >
      {/* Decorative ambient blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#DCFCE7]/50 blur-3xl" />
        <div className="absolute top-1/4 -right-24 w-80 h-80 rounded-full bg-[#FFEBEB]/60 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 rounded-full bg-[#F3E8FF]/40 blur-3xl" />
      </div>

      <GuruSidebar />
      <div className="min-h-screen flex flex-col relative z-10 pl-64">
        <GuruTopbar />
        <main className="w-full flex-1 pt-16 px-6 pb-6">{children}</main>
      </div>
    </div>
  );
}