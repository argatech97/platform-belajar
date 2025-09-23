/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/usePointApi.ts
import { useCallback } from "react";

export type UUID = string;

/* DTOs */
export interface CreatePointHistoryDto {
  relationd_id?: UUID | null;
  point: number;
  user_id: UUID;
  is_earned?: boolean;
  activity_name?: string;
}

export interface MyPointDto {
  id?: UUID;
  point: number;
  user_id: UUID;
}

export interface UsePointDto {
  relationd_id?: UUID | null;
  point: number; // positive number to spend
  user_id: UUID;
  activity_name?: string;
}

/* Generic fetch helper used inside hooks.
   Note: token and baseUrl are passed from the caller (not read from localStorage).
*/
async function doRequest<TBody = any, TRes = any>(
  baseUrl: string,
  token: string,
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: TBody
): Promise<TRes> {
  const url = `${baseUrl.replace(/\/$/, "")}${path}`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };
  const options: RequestInit = {
    method,
    headers,
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  // try parse json safely
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    // try to surface sensible message
    const msg = data?.message ?? data ?? res.statusText;
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }

  return data as TRes;
}

/* -------------------------
   Hooks (useCallback wrappers)
   All hooks accept { baseUrl, token } as parameter.
   ------------------------- */

/** Earn points (POST /earn) */
export function useEarnPoints(params: { baseUrl: string }) {
  const { baseUrl } = params;
  return useCallback(
    async (dto: CreatePointHistoryDto, token: string) => {
      return await doRequest<CreatePointHistoryDto, any>(baseUrl, token, `/earn`, "POST", dto);
    },
    [baseUrl]
  );
}

/** Use / spend points (POST /use) */
export function useUsePoints(params: { baseUrl: string; token: string }) {
  const { baseUrl, token } = params;
  return useCallback(
    async (dto: UsePointDto) => {
      return await doRequest<UsePointDto, any>(baseUrl, token, `/use`, "POST", dto);
    },
    [baseUrl, token]
  );
}

/** Create point_history only (POST /history) */
export function useCreatePointHistoryOnly(params: { baseUrl: string; token: string }) {
  const { baseUrl, token } = params;
  return useCallback(
    async (dto: CreatePointHistoryDto) => {
      return await doRequest<CreatePointHistoryDto, any>(baseUrl, token, `/history`, "POST", dto);
    },
    [baseUrl, token]
  );
}

/** List point_history by user (GET /history/user/:userId?limit=&offset=) */
export function useListPointHistoryByUser(params: { baseUrl: string; token: string }) {
  const { baseUrl, token } = params;
  return useCallback(
    async (userId: UUID, opts?: { limit?: number; offset?: number }) => {
      const q = new URLSearchParams();
      if (opts?.limit !== undefined) q.set("limit", String(opts.limit));
      if (opts?.offset !== undefined) q.set("offset", String(opts.offset));
      const path = `/history/user/${encodeURIComponent(userId)}${q.toString() ? `?${q.toString()}` : ""}`;
      return await doRequest<undefined, any>(baseUrl, token, path, "GET");
    },
    [baseUrl, token]
  );
}

/** Get my_point by user (GET /my-point/user/:userId) */
export function useGetMyPointByUser(params: { baseUrl: string; token: string }) {
  const { baseUrl, token } = params;
  return useCallback(
    async (userId: UUID) => {
      return await doRequest<undefined, any>(
        baseUrl,
        token,
        `/my-point/user/${encodeURIComponent(userId)}`,
        "GET"
      );
    },
    [baseUrl, token]
  );
}

/** Create my_point (POST /my-point) */
export function useCreateMyPoint(params: { baseUrl: string; token: string }) {
  const { baseUrl, token } = params;
  return useCallback(
    async (dto: MyPointDto) => {
      return await doRequest<MyPointDto, any>(baseUrl, token, `/my-point`, "POST", dto);
    },
    [baseUrl, token]
  );
}

/** Update my_point by id (PUT /my-point/:id) */
export function useUpdateMyPoint(params: { baseUrl: string; token: string }) {
  const { baseUrl, token } = params;
  return useCallback(
    async (id: UUID, dto: { point: number }) => {
      return await doRequest<{ point: number }, any>(
        baseUrl,
        token,
        `/my-point/${encodeURIComponent(id)}`,
        "PUT",
        dto
      );
    },
    [baseUrl, token]
  );
}
