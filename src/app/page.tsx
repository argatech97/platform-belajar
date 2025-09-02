"use client";
import Container from "@/components/Container";
import MainImage from "./components/MainImage";
import TableSingleColumn from "@/components/TableSingleColumn";
import BottomNavigation from "./components/BottomNavigation";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <Container>
      <MainImage />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          marginTop: "50px",
          gap: "20px",
        }}
      >
        <TableSingleColumn
          title={"Belajar apa hari ini ?"}
          items={[
            {
              title: "Literasi",
              description: "Kuasi keterampilan membaca dan memahami teks ",
              action: () => {
                router.push("/domain?navbarTitle=Literasi");
              },
            },
            {
              title: "Numerasi",
              description: "Asah kemampuan berhitung dan pemecahan masalah",
              action: () => {
                router.push("/domain?navbarTitle=Numerasi");
              },
            },
            {
              title: "Try Out",
              description: "Latihan berkala lewat Try Out untuk tingkatkan kompetensimu",
              action: () => {
                router.push("/try-out");
              },
            },
          ]}
        />
        <TableSingleColumn
          title={"Ada tugas hari ini ?"}
          items={[
            {
              title: "Tugas Literasi",
              description: "Mengerjakan soal literasi tentang 5w + 1h",
              action: () => {
                router.push("/tugas");
              },
            },
          ]}
        />
      </div>
      <BottomNavigation />
    </Container>
  );
}
