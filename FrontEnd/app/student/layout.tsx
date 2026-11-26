import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { MuridSidebar } from "@/components/student/sidebar";
import { MuridTopbar } from "@/components/student/topbar";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function MuridLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ fontFamily: plusJakartaSans.style.fontFamily }}
      className={`${inter.variable} student-scrollbar-hide min-h-screen bg-[#f2f9f7] text-[#071f1c] antialiased`}
    >
      <MuridSidebar />
      <div className="min-h-screen flex flex-col relative z-10 pl-64 min-w-0">
        <MuridTopbar />
        <main className="w-full flex-1 min-w-0 pt-28 px-8 pb-10">{children}</main>
      </div>
    </div>
  );
}