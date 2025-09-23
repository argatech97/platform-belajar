"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import BottomNavigation from "../components/BottomNavigation";

interface IUserPlatform {
  nama_lengkap: string;
  nama_sekolah: string;
  tingkat: number;
  nama_role: string;
  no_identitas: string;
}

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState<IUserPlatform | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSaved = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token-platform-belajar");
      if (!token) throw new Error("Token not found");
      const user = JSON.parse(localStorage.getItem("user-platform-belajar") || "{}");
      const res = await fetch(`/api/auth/profile/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(true);
      if (!res.ok) throw new Error("Failed to fetch saved questions");
      const data: IUserPlatform = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const data = localStorage.getItem("token-platform-belajar");
    if (!data) {
      router.replace("/auth");
      return;
    }
    try {
      fetchSaved();
    } catch {
      router.replace("/auth");
    }
  }, [fetchSaved, router]);

  const handleLogout = () => {
    localStorage.clear();
    router.replace("/auth");
  };

  if (!user || loading) {
    return (
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
          fontWeight: "bold",
          background: "linear-gradient(135deg, #e0f2fe, #f1f5f9)",
          color: "#1f2937",
        }}
      >
        ⏳ Loading profile...
      </div>
    );
  }

  return (
    <Container>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #e0f2fe, #f9fafb)",
          padding: "20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "480px",
            background: "white",
            borderRadius: "16px",
            padding: "28px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            animation: "fadeIn 0.6s ease",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                background: "#69CA87",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.2rem",
                color: "white",
                marginBottom: "12px",
              }}
            >
              👨🏻‍💻
            </div>
            <h1
              style={{
                fontSize: "1.6rem",
                fontWeight: "bold",
                marginBottom: "4px",
                color: "#1f2937",
              }}
            >
              {user.nama_lengkap}
            </h1>
            {/* <p style={{ fontSize: "1rem", color: "#6b7280" }}>{user.role_alias}</p> */}
          </div>

          {/* Info (rapih tabel style) */}
          <div style={{ marginBottom: "24px" }}>
            {[
              { label: "No Identitas", value: user.no_identitas },
              { label: "Sekolah", value: user.nama_sekolah },
              { label: "Kelas", value: user.tingkat },
              { label: "Role", value: user.nama_role },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: idx < 4 ? "1px solid #f3f4f6" : "none",
                  fontSize: "0.95rem",
                }}
              >
                <span style={{ color: "#6b7280", fontWeight: 500 }}>{item.label}</span>
                <span style={{ color: "#1f2937" }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "1rem",
              fontWeight: "bold",
              background: "#69CA87",
              border: "none",
              borderRadius: "8px",
              color: "white",
              cursor: "pointer",
              transition: "background 0.2s ease",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#69CA87";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#69CA87";
            }}
          >
            Logout
          </button>
        </div>

        {/* Animasi Keyframes */}
        <style>
          {`
          @keyframes fadeIn {
            0% { transform: translateY(10px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
        `}
        </style>
      </div>
      <BottomNavigation />
    </Container>
  );
}
