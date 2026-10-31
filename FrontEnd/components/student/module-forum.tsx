"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { MessagesSquare, Send } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { discussionsApi } from "@/lib/api/client";
import type { Discussion } from "@/lib/api/types";
import { formatRelativeTime } from "@/lib/utils";
import {
  StaggerChildren,
  StaggerItem,
} from "@/components/ui/animations";

type ApiRequestError = Error & { status?: number };

function toRequestError(error: {
  message?: string;
  error?: string;
}, status: number): ApiRequestError {
  const requestError = new Error(
    error.message || error.error || "Terjadi kesalahan"
  ) as ApiRequestError;
  requestError.status = status;
  return requestError;
}

export function ModuleForum({ moduleId }: { moduleId: string }) {
  const [question, setQuestion] = useState("");
  const queryClient = useQueryClient();
  const router = useRouter();

  const discussionsQuery = useQuery({
    queryKey: ["module-discussions", moduleId],
    queryFn: async (): Promise<Discussion[]> => {
      const result = await discussionsApi.list(moduleId);
      if (result.error) {
        throw toRequestError(result.error, result.status);
      }
      return result.data?.data ?? [];
    },
  });

  const status = (discussionsQuery.error as ApiRequestError | null)?.status;
  const isForbidden = status === 403;

  useEffect(() => {
    if (status !== 401) return;
    toast.error("Sesi berakhir. Silakan login kembali.");
    router.push("/auth/login");
  }, [router, status]);

  const createMutation = useMutation({
    mutationFn: async (body: string) => {
      const result = await discussionsApi.create(moduleId, { body });
      if (result.error) {
        throw toRequestError(result.error, result.status);
      }
      return result.data?.data;
    },
    onSuccess: () => {
      setQuestion("");
      toast.success("Pertanyaan berhasil dikirim.");
      queryClient.invalidateQueries({
        queryKey: ["module-discussions", moduleId],
      });
    },
    onError: (error: ApiRequestError) => {
      if (error.status === 401) {
        toast.error("Sesi berakhir. Silakan login kembali.");
        router.push("/auth/login");
        return;
      }
      toast.error(error.message || "Gagal mengirim pertanyaan.");
    },
  });

  function sendQuestion() {
    const body = question.trim();
    if (!body || createMutation.isPending || isForbidden) return;
    createMutation.mutate(body);
  }

  const discussions = discussionsQuery.data ?? [];
  const inputDisabled = isForbidden || createMutation.isPending;

  return (
    <div className="bg-white p-4 rounded-2xl shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] border border-[#cee8e1]/60 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessagesSquare className="size-[22px] text-[#0d5c52]" />
          <h3 className="text-[15px] leading-[22px] font-semibold text-[#071f1c]">
            Forum Diskusi Modul
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-[#d4eee7] text-[#0d5c52] text-[11px] font-semibold">
          {discussionsQuery.isLoading
            ? "Memuat..."
            : `${discussions.length} Pertanyaan`}
        </span>
      </div>

      {discussionsQuery.isLoading && (
        <div className="flex flex-col gap-2" aria-label="Memuat diskusi">
          {[0, 1].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-xl bg-[#edf7f4]"
            />
          ))}
        </div>
      )}

      {!discussionsQuery.isLoading && isForbidden && (
        <div className="rounded-xl bg-[#ffdad6] p-3 text-[12px] leading-snug text-[#93000a]">
          Anda belum terdaftar di mata pelajaran ini. Forum hanya dapat
          diakses siswa yang terdaftar.
        </div>
      )}

      {!discussionsQuery.isLoading &&
        !isForbidden &&
        discussionsQuery.isError && (
          <div className="flex flex-col gap-2 rounded-xl bg-[#ffdad6] p-3 text-[12px] text-[#93000a]">
            <span>
              {(discussionsQuery.error as Error)?.message ||
                "Gagal memuat forum diskusi."}
            </span>
            <button
              type="button"
              onClick={() => discussionsQuery.refetch()}
              className="self-start rounded-lg bg-white/70 px-2 py-1 text-[11px] font-semibold text-[#93000a]"
            >
              Coba lagi
            </button>
          </div>
        )}

      {!discussionsQuery.isLoading &&
        !discussionsQuery.isError &&
        discussions.length === 0 && (
          <div className="flex items-center gap-2 rounded-xl bg-[#edf7f4] p-3 text-[12px] text-[#536360]">
            <MessagesSquare className="size-4 text-[#0d5c52]" />
            Belum ada pertanyaan. Jadilah yang pertama bertanya.
          </div>
        )}

      {discussions.length > 0 && (
        <StaggerChildren staggerDelay={0.1} className="flex flex-col gap-2">
          {discussions.map((discussion) => (
            <StaggerItem key={discussion.id}>
              <div className="p-2 rounded-xl bg-[#edf7f4] flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-[#071f1c]">
                    {discussion.author.full_name}
                  </span>
                  <span className="shrink-0 text-[10px] text-[#536360]">
                    {formatRelativeTime(discussion.created_at)}
                  </span>
                </div>
                <p className="text-[12px] text-[#071f1c] leading-snug whitespace-pre-wrap">
                  {discussion.body}
                </p>
                {discussion.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="mt-1 p-2 rounded-lg bg-[#cee8e1] flex items-start gap-2"
                  >
                    <span className="text-[10px] font-bold text-[#0d5c52] uppercase mt-0.5">
                      {reply.author.role === "admin" ? "Admin" : "Guru"}:
                    </span>
                    <span className="text-[12px] text-[#536360] whitespace-pre-wrap">
                      {reply.body}
                    </span>
                  </div>
                ))}
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      )}

      <div className="relative flex items-center pt-1">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              sendQuestion();
            }
          }}
          placeholder={
            isForbidden
              ? "Forum terkunci untuk siswa yang belum terdaftar"
              : "Tulis pertanyaan ke guru / forum..."
          }
          type="text"
          maxLength={2000}
          disabled={inputDisabled}
          className="w-full h-10 pl-3 pr-10 rounded-xl bg-[#edf7f4] text-[12px] text-[#071f1c] placeholder:text-[#536360] outline-none focus:bg-white focus:ring-1 focus:ring-[#0d5c52] transition-all disabled:cursor-not-allowed disabled:opacity-60"
        />
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={sendQuestion}
          disabled={inputDisabled || !question.trim()}
          aria-label="Kirim pertanyaan"
          className="absolute right-2 text-[#0d5c52] hover:text-[#00433b] p-1 rounded-lg disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send className="size-[18px]" />
        </motion.button>
      </div>
    </div>
  );
}
