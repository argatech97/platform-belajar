export interface IReward {
  id: string;
  name: string;
  url_image: string;
  point: number;
  stock: number;
}

// --- API HELPER ---
export async function fetchRewards(offset: number, limit: number): Promise<IReward[]> {
  const res = await fetch(`/api/rewards?offset=${offset}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token-platform-belajar") || ""}`,
    },
  });
  if (!res.ok) throw new Error("Gagal memuat rewards");
  const result = await res.json();
  return result.data;
}

export async function decrementRewardStock(id: string): Promise<IReward> {
  const res = await fetch(`/api/rewards/${id}/stock/decrement`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token-platform-belajar") || ""}`,
    },
  });

  if (!res.ok) {
    throw new Error("Gagal mengurangi stok reward");
  }

  return res.json();
}
