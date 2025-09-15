"use client";
import Container from "@/components/Container";
import MainImage from "./components/MainImage";
import TableSingleColumn from "@/components/TableSingleColumn";
import BottomNavigation from "./components/BottomNavigation";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import Loading from "@/components/Loading";

export default function Page() {
  const router = useRouter();

  // state
  const [domain, setDomain] = useState<{ id: string; name: string; description: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>();
  const [userAlias, seteUserAlias] = useState<"Peserta Didik" | "Pendidik">();

  // memo
  const feature: { id: string; name: string; description: string }[] = useMemo(() => {
    if (userAlias === "Peserta Didik") {
      return [
        ...domain,
        {
          id: "tryout",
          name: "Try Out",
          description: "Latihan berkala lewat Try Out untuk tingkatkan kompetensimu",
        },
      ];
    }
    return [...domain];
  }, [domain, userAlias]);

  const tokenIsAvailabel = useMemo(() => {
    return token && token.length > 0 ? true : false;
  }, [token]);

  // useEffetct
  useEffect(() => {
    setLoading(true);
    setToken(localStorage.getItem("token-platform-belajar") || "");
    fetch("/api/learning/domain")
      .then((res) => res.json())
      .then(setDomain)
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
    const user = JSON.parse(localStorage.getItem("user-platform-belajar") || "{}");
    seteUserAlias(user.role_alias);
  }, []);

  const renderAdditionalFeature = useMemo(() => {
    return userAlias === "Peserta Didik" ? (
      <TableSingleColumn
        title={"Ada tugas hari ini ?"}
        items={[
          {
            title: "Segera hadir",
            description: "Fitur ini masih dalam pengembangan",
            action: () => {
              // router.push("/tugas");
            },
          },
        ]}
      />
    ) : (
      <></>
    );
  }, [userAlias]);

  //handler
  const handleFeatureClick = useCallback(
    (name: string, id: string) => {
      if (!tokenIsAvailabel) {
        router.replace("/auth");
        return;
      }
      if (name !== "Try Out") {
        router.push(`/subDomain?id=${id}&navbarTitle=${name}`);
      } else {
        router.push("/tryout");
      }
    },
    [router, tokenIsAvailabel]
  );
  return (
    <Container>
      {loading ? (
        <Loading></Loading>
      ) : (
        <>
          <MainImage />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "50px 20px 20px",
              gap: "20px",
              height: "100%",
            }}
          >
            <TableSingleColumn
              title={"Belajar apa hari ini ?"}
              items={feature.map((el) => ({
                description: el.description,
                action: () => {
                  handleFeatureClick(el.name, el.id);
                },
                title: el.name,
              }))}
            />
            {renderAdditionalFeature}
          </div>
          <BottomNavigation />
        </>
      )}
    </Container>
  );
}
