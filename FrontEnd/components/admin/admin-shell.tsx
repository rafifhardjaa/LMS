"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/admin/sidebar";
import { Topbar } from "@/components/admin/topbar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <>
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <button
        type="button"
        aria-label="Tutup menu navigasi"
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-[60] bg-[#181c20]/30 lg:hidden ${menuOpen ? "block" : "hidden"}`}
      />
      <Topbar onMenuOpen={() => setMenuOpen(true)} />
      <main className="w-full flex-1 px-4 pb-8 pt-16 sm:px-6 lg:px-0 lg:pl-72 lg:pr-8 lg:pb-12 lg:pt-16">{children}</main>
    </>
  );
}
