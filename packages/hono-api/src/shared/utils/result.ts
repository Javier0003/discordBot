import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";

export type ApiSuccess<T> = {
  ok: true;
  data: T;
};

export type ApiError<C extends string = string> = {
  ok: false;
  error: {
    code: C;
    message: string;
  };
};

export type ApiResult<T, C extends string = string> = ApiSuccess<T> | ApiError<C>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const isApiError = (value: unknown): value is ApiError =>
  isRecord(value) &&
  value.ok === false &&
  isRecord(value.error) &&
  typeof value.error.code === "string" &&
  typeof value.error.message === "string";

export const Result = {
  /**
   * Creates a successful API payload.
   *
   * Usage:
   * - `return c.json(Result.ok(data), 200)`
   * - Prefer using `jsonOk(c, data)` for standard 200 responses.
   */
  ok: <T>(data: T): ApiSuccess<T> => ({
    ok: true,
    data,
  }),

  /**
   * Creates an error API payload (does not set HTTP status by itself).
   *
   * Usage:
   * - `return c.json(Result.err("BAD_REQUEST", "Missing field"), 400)`
   * - Prefer using `jsonErr(...)` / `httpError(...)` to consistently set status + body.
   */
  err: <C extends string>(code: C, message: string): ApiError<C> => ({
    ok: false,
    error: { code, message },
  }),
};

/**
 * Sends a standard `{ ok: true, data }` JSON response with HTTP 200.
 */
export function jsonOk<T>(c: Context, data: T) {
  return c.json(Result.ok(data), 200);
}

type ErrorStatus = 400 | 401 | 403 | 404 | 409 | 500;

const DEFAULT_ERRORS = {
  BAD_REQUEST: { message: "Bad request", status: 400 },
  UNAUTHORIZED: { message: "Unauthorized", status: 401 },
  FORBIDDEN: { message: "Forbidden", status: 403 },
  NOT_FOUND: { message: "Not found", status: 404 },
  INTERNAL_ERROR: { message: "Internal server error", status: 500 },
} as const;

type DefaultErrorCode = keyof typeof DEFAULT_ERRORS;

type ResolvedError = {
  finalMessage: string;
  finalStatus: ErrorStatus;
};

const resolveError = <C extends DefaultErrorCode | (string & {})>(
  code: C,
  message?: string,
  status?: ErrorStatus,
): ResolvedError => {
  const defaults = DEFAULT_ERRORS[code as DefaultErrorCode];
  const finalMessage = message ?? defaults?.message ?? "An error occurred";
  const finalStatus = status ?? (defaults?.status as ErrorStatus) ?? 400;

  return { finalMessage, finalStatus };
};

/**
 * Sends a standard `{ ok: false, error: { code, message } }` JSON response.
 *
 * Examples:
 * - `return jsonErr(c, "UNAUTHORIZED", "Invalid token")`
 * - `return jsonErr(c, "BRANCH_NOT_FOUND", "Branch not found", 404)`
 */
export function jsonErr<C extends DefaultErrorCode | (string & {})>(
  c: Context,
  code: C,
  message?: string,
  status?: ErrorStatus,
) {
  const defaults = DEFAULT_ERRORS[code as DefaultErrorCode];
  const finalMessage = message ?? defaults?.message ?? "An error occurred";
  const finalStatus = status ?? (defaults?.status as ErrorStatus) ?? 400;

  return c.json(Result.err(code, finalMessage), finalStatus);
}

/**
 * Creates an `HTTPException` with a consistent JSON error body.
 *
 * Overload rules:
 * - If `code` is a `DefaultErrorCode`, you can omit `status`.
 * - If `code` is a custom `string`, you **must** pass `status`.
 *
 * Examples:
 * - `throw httpError("FORBIDDEN", "Not allowed")`
 * - `throw httpError("BRANCH_NOT_FOUND", "Branch not found", 404)`
 */

export function httpError<C extends DefaultErrorCode | (string & {})>(
  code: C,
  message?: string,
  status?: ErrorStatus,
) {
  const { finalMessage, finalStatus } = resolveError(code, message, status);

  return new HTTPException(finalStatus, {
    res: new Response(JSON.stringify(Result.err(code, finalMessage)), {
      status: finalStatus,
      headers: { "Content-Type": "application/json" },
    }),
  });
}
