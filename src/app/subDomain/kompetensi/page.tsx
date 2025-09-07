"use client";
import BackNavigation from "@/components/BackNavigation";
import Card from "@/components/Card";
import Container from "@/components/Container";
import Loading from "@/components/Loading";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type Kompetensi = {
  id: string;
  name: string;
};

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [kompetensiList, setKompetensiList] = useState<Kompetensi[]>([]);
  const params = useSearchParams();
  const navBarTitle = params.get("navbarTitle");
  const subDomainId = params.get("id"); // ambil dari query string ?id=...
  const router = useRouter();

  useEffect(() => {
    const fetchKompetensi = async () => {
      if (!subDomainId) return;

      try {
        setLoading(true);

        // ambil user dari localStorage
        const userStr = localStorage.getItem("user-platform-belajar");
        if (!userStr) {
          router.replace("/auth");
          return;
        }
        const user = JSON.parse(userStr);

        const res = await fetch(`/api/learning/kompetensi/${subDomainId}/${user.kelas}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token-platform-belajar") || ""}`,
          },
        });

        if (!res.ok && res.status === 401) {
          router.replace("/auth");
          return;
        }

        const data = await res.json();
        setKompetensiList(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchKompetensi();
  }, [router, subDomainId]);

  return (
    <Container>
      {loading ? (
        <Loading />
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
            {kompetensiList.map((item, index) => (
              <Card
                onClick={() =>
                  router.push(
                    `/subDomain/kompetensi/pembelajaran?navbarTitle=${item.name}&id=${item.id}`
                  )
                }
                key={item.id}
                prefix={
                  <svg
                    width="35"
                    height="35"
                    viewBox="0 0 35 35"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      width="35"
                      height="35"
                      rx="10"
                      fill={["#DC7777", "#73CCED", "#E375E1"][index % 3]}
                    />
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
