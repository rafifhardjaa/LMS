"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AddTeacherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddTeacherDialog({ open, onOpenChange, onSuccess }: AddTeacherDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    nomor_induk: "",
    tanggal_lahir: "",
    email: "",
  });

  const resetForm = () => {
    setFormData({
      full_name: "",
      nomor_induk: "",
      tanggal_lahir: "",
      email: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/v1/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: "guru",
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message ?? "Gagal menambah guru");
      }

      toast.success("Guru berhasil ditambahkan", {
        description: `${formData.full_name} (${formData.nomor_induk}) telah ditambahkan sebagai guru.`,
      });

      resetForm();
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast.error("Gagal menambah guru", {
        description: error instanceof Error ? error.message : "Terjadi kesalahan",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Guru Baru</DialogTitle>
          <DialogDescription>
            Isi formulir di bawah untuk menambahkan guru baru. Akun akan langsung aktif dengan password default.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="full_name">Nama Lengkap</Label>
              <Input
                id="full_name"
                placeholder="Contoh: Budi Santoso, S.Kom"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nomor_induk">NIP / Nomor Induk</Label>
              <Input
                id="nomor_induk"
                placeholder="Contoh: 199001012020011001"
                value={formData.nomor_induk}
                onChange={(e) => setFormData({ ...formData, nomor_induk: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
              <Input
                id="tanggal_lahir"
                type="date"
                value={formData.tanggal_lahir}
                onChange={(e) => setFormData({ ...formData, tanggal_lahir: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email (Opsional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="Contoh: budi.santoso@smkmataram.sch.id"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Tambah Guru"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
