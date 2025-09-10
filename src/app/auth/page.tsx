/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { data, Role } from "./data";
import { LoginForm } from "./components/login";
import { RegisterForm } from "./components/register";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

export default function Page() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isMobile, setIsMobile] = useState(false);
  const { primary, secondary } = data();
  const [role, setRole] = useState<Role>();
  const [identity, setIdentity] = useState("");
  const [school, setSchool] = useState("");
  const [kelas, setKelas] = useState<number | "">("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const handleLoginSuccess = useCallback(
    (user: any) => {
      const previousRoute = localStorage.getItem("platform-belajar-route-before");
      if (previousRoute) window.location.href = previousRoute;
      if (!previousRoute) router.push("/");
      // redirect ke halaman dashboard misalnya
    },
    [router]
  );

  return loading ? (
    <Loading></Loading>
  ) : (
    <div
      style={{
        backgroundColor: secondary,
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          overflow: "hidden",
          backgroundColor: "white",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <div
          style={{
            flex: 1,
            backgroundColor: primary,
            padding: "40px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          <h1 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "8px" }}>
            Platform Belajar
          </h1>
          <p style={{ margin: 0, fontSize: "16px", opacity: 0.9 }}>literasi - numerasi</p>
        </div>

        <div style={{ flex: 1, padding: "40px 30px" }}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <button
              onClick={() => setMode("login")}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "8px",
                fontWeight: 600,
                border: "1px solid #ccc",
                backgroundColor: mode === "login" ? primary : "#fff",
                color: mode === "login" ? "white" : "black",
                cursor: "pointer",
              }}
            >
              Login
            </button>
            <button
              onClick={() => setMode("register")}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "8px",
                fontWeight: 600,
                border: "1px solid #ccc",
                backgroundColor: mode === "register" ? primary : "#fff",
                color: mode === "register" ? "white" : "black",
                cursor: "pointer",
              }}
            >
              Registrasi
            </button>
          </div>

          {mode === "login" ? (
            <LoginForm
              role={role}
              setRole={setRole}
              identity={identity}
              setIdentity={setIdentity}
              password={password}
              setPassword={setPassword}
              onLoginSuccess={handleLoginSuccess}
              onSetLoading={setLoading}
            />
          ) : (
            <RegisterForm
              role={role}
              setRole={setRole}
              identity={identity}
              setIdentity={setIdentity}
              school={school}
              setSchool={setSchool}
              kelas={kelas}
              setKelas={setKelas}
              fullName={fullName}
              setFullName={setFullName}
              password={password}
              setPassword={setPassword}
              setModeLogin={() => {
                setMode("login");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
