"use client";

import { AdminTopbar } from "@/components/admin/admin-topbar";
import { Sidebar } from "@/components/admin/sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <AdminTopbar />
      <main className="w-full flex-1 pb-8 pl-72 pr-4 pt-16 sm:pr-6 sm:pb-12">{children}</main>
    </>
  );
}
