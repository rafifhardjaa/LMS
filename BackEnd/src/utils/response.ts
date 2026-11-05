export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

// ─── Custom Error Classes ─────────────────────────────────────────────────────

export class BadRequestError extends Error {
  readonly statusCode = 400 as const;
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends Error {
  readonly statusCode = 401 as const;
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  readonly statusCode = 403 as const;
  constructor(message = "Akses ditolak") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends Error {
  readonly statusCode = 404 as const;
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class TooManyRequestsError extends Error {
  readonly statusCode = 429 as const;
  constructor(message = "Terlalu banyak percobaan") {
    super(message);
    this.name = "TooManyRequestsError";
  }
}

// ─── Central Error Handler ────────────────────────────────────────────────────

export function handleError(error: unknown): {
  status: 400 | 401 | 403 | 404 | 429 | 500;
  message: string;
} {
  if (
    error instanceof BadRequestError ||
    error instanceof UnauthorizedError ||
    error instanceof ForbiddenError ||
    error instanceof NotFoundError ||
    error instanceof TooManyRequestsError
  ) {
    return { status: error.statusCode, message: error.message };
  }

  // Fallback untuk error lama yang belum dimigrasikan ke custom class
  if (error instanceof Error) {
    const msg = error.message;

    if (msg.includes("tidak ditemukan") || msg.includes("tidak ada")) {
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
    if (msg === "Unauthorized") {
      return { status: 401, message: msg };
    }
    if (msg.includes("Akses ditolak")) {
      return { status: 403, message: msg };
    }

    // Selalu expose pesan error asli untuk memudahkan debugging.
    if (msg) {
      return { status: 500, message: msg };
    }
  }

  return { status: 500, message: "Internal Server Error" };
}
