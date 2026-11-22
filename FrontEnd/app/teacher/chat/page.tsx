import type { Metadata } from "next";
import { MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Chat | SIMANIS",
  description: "Halaman chat guru yang sedang dalam tahap pengembangan.",
};

export default function TeacherChatPage() {
  return (
    <div className="flex w-full flex-col bg-[#EBF0F5] text-[#1E293B]">
      <section className="rounded-[20px] border border-[#E2E8F0] bg-white p-8 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-[#FFEBEB] text-[#b71422]">
            <MessageSquare className="size-7" />
          </span>
          <h1 className="mt-4 text-xl font-bold text-[#1E293B]">Chat</h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-[#64748B]">
            Fitur chat sedang dalam tahap pengembangan. Halaman ini akan tersedia segera.
          </p>
          <span className="mt-4 rounded-full bg-[#FEF3C7] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#D97706]">
            Segera Hadir
          </span>
        </div>
      </section>
    </div>
  );
}
