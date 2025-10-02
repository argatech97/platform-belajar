"use client";
import Container from "@/components/Container";
import MainImage from "./components/MainImage";
import TableSingleColumn from "@/components/TableSingleColumn";
import BottomNavigation from "./components/BottomNavigation";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import Loading from "@/components/Loading";
import Box from "@/components/Box";
import { postRequest } from "@/helper/api";

export default function Page() {
  const router = useRouter();
  const params = useSearchParams();
  // state
  const [domain, setDomain] = useState<{ id: string; name: string; description: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>();
  const [userAlias, seteUserAlias] = useState<"Peserta Didik" | "Pendidik">();

  // memo
  const feature: { id: string; name: string; description: string }[] = useMemo(() => {
    if (userAlias === "Peserta Didik") {
      return [
        {
          id: "tryout",
          name: "Try Out",
          description: "Latihan berkala lewat Try Out untuk tingkatkan kompetensimu",
        },
        ...domain,
      ];
    }
    return [...domain];
  }, [domain, userAlias]);

  const tokenIsAvailabel = useMemo(() => {
    return token && token.length > 0 ? true : false;
  }, [token]);

  const loginByPass = useCallback(async () => {
    const x = params.get("byPassId");
    if (x) {
      const res = await postRequest("/auth/login", {
        byPassId: x,
      });
      const roleList = await fetch("/api/reference/role");
      const roleAlias = ((await roleList.json()) as { id: string; name: string }[]).find(
        (el) => el.id === res.user.role
      )?.name;
      localStorage.setItem("bypass", "true");
      localStorage.setItem("token-platform-belajar", res.token);
      localStorage.setItem(
        "user-platform-belajar",
        JSON.stringify({ ...res.user, role_alias: roleAlias })
      );
      return;
    }
    return;
  }, [params]);

  // useEffetct
  useEffect(() => {
    setLoading(true);
    loginByPass()
      .then(() => {
        setToken(localStorage.getItem("token-platform-belajar") || "");
        fetch("/api/learning/domain")
          .then((res) => res.json())
          .then((data) => {
            setDomain(data);
            return;
          })
          .catch(console.error);
      })
      .finally(() => {
        const user = JSON.parse(localStorage.getItem("user-platform-belajar") || "{}");
        seteUserAlias(user.role_alias);
        setLoading(false);
      });
  }, [loginByPass]);

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
              title={"Kesulitan mengerjakan soal ?"}
              items={[
                {
                  title: "Lumera AI",
                  description: "Asisten cerdas berbasis AI, siap menjawab permasalahan soal Anda",
                  action: () => {
                    router.push("/chat");
                  },
                },
              ]}
            />
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

            <Box />
          </div>
          <BottomNavigation />
        </>
      )}
    </Container>
  );
}
