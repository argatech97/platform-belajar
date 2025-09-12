/* eslint-disable @typescript-eslint/no-explicit-any */
export const API_URL = "/api";

export const postRequest = async (endpoint: string, data: any, headers?: any) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401) {
      // kalau login gagal / token invalid, lempar error
      throw new Error(json.error || "Username atau password salah!");
    }
    throw new Error(json.error || "Request gagal!");
  }

  return json;
};
