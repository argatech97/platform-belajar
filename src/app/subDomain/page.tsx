"use client";

import BackNavigation from "@/components/BackNavigation";
import Card from "@/components/Card";
import Container from "@/components/Container";
import ErrorComponent from "@/components/Error";
import Loading from "@/components/Loading";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type SubDomain = {
  id: string;
  name: string;
  jumlahModul: number; // asumsi API kasih field ini (kalau tidak ada bisa diset 0 / dummy)
  itemColor?: string; // opsional kalau API tidak kasih warna
};

export default function Page() {
  const router = useRouter();
  const params = useSearchParams();
  const navBarTitle = params.get("navbarTitle");
  const domainId = params.get("id"); // ambil domainId dari query params
  const [subDomains, setSubDomains] = useState<SubDomain[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSubDomains = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/learning/sub-domain/${domainId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token-platform-belajar") || ""}`,
        },
      });
      if (!res.ok && res.status === 401) throw new Error("Gagal mengambil data sub domain");
      const data = await res.json();

      // Map hasil API ke bentuk yang Card butuhkan
      const mapped = data.map((item: { id: string; name: string }, index: number) => ({
        id: item.id,
        name: item.name,
        itemColor: ["#DC7777", "#73CCED", "#E375E1"][index % 3], // kasih warna rotasi
      }));

      setSubDomains(mapped);

      return res;
    } catch (err) {
      console.error(err);
    }
  }, [domainId]);

  useEffect(() => {
    if (!domainId) return;
    setLoading(true);
    fetchSubDomains()
      .then((res) => {
        if (res && !res.ok && res.status === 401) {
          if (res.status === 401) {
            router.replace("/auth");
            return;
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [domainId, fetchSubDomains, router]);

  return (
    <Container>
      {loading ? (
        <Loading></Loading>
      ) : (
        <>
          <BackNavigation label={navBarTitle || ""} />
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexDirection: "column",
              padding: "20px 15px",
            }}
          >
            {subDomains.map((item) => (
              <Card
                onClick={() => {
                  router.push(`/subDomain/kompetensi?navbarTitle=${item.name}&id=${item.id}`);
                }}
                key={item.id}
                prefix={
                  <svg
                    width="35"
                    height="35"
                    viewBox="0 0 35 35"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="35" height="35" rx="10" fill={item.itemColor} />
                  </svg>
                }
                description={item.name}
                suffix={"➡️"}
              />
            ))}
          </div>
        </>
      )}
    </Container>
  );
}
