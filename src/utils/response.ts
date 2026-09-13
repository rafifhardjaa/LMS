export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export function handleError(error: unknown): {
  status: 400 | 403 | 404 | 500;
  message: string;
} {
  if (error instanceof Error) {
    const msg = error.message;

    if (
      msg.includes("tidak ditemukan") ||
      msg.includes("tidak ada") ||
      msg === "Unauthorized"
    ) {
      return { status: 404, message: msg };
    }

    if (
      msg.includes("tidak valid") ||
      msg.includes("sudah") ||
      msg.includes("melebihi") ||
      msg.includes("duplikasi")
    ) {
      return { status: 400, message: msg };
    }

    if (msg.includes("Akses ditolak")) {
      return { status: 403, message: msg };
    }
  }

  return { status: 500, message: "Internal Server Error" };
}
