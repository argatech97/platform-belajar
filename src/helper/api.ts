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
  const json = await res.json();
  if (!res.ok && res.status === 401) throw new Error(json.error || "Terjadi kesalahan");
  return json;
};
