/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, memo, useMemo, useState, useEffect } from "react";
import { TogglePasswordInput } from "./togglePassword";
import { data } from "../data";
import { postRequest } from "@/helper/api";
import { RoleOption } from "@/app/types/reference";

export const LoginForm = memo(function LoginForm({
  role,
  setRole,
  identity,
  setIdentity,
  password,
  setPassword,
  onLoginSuccess,
  onSetLoading,
}: any) {
  const { primary } = data();
  const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);

  const getIdentityLabel = useMemo(() => {
    const x = roleOptions.find((x) => x.id === role);
    if (x?.name === "Administrator") return "NPSN";
    if (x?.name === "Pendidik") return "NIK";
    return "NISN";
  }, [role, roleOptions]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!role || !identity || !password) {
        alert("Semua field wajib diisi!");
        return;
      }

      try {
        onSetLoading(true);
        const res = await postRequest("/auth/login", {
          role,
          no_identitas: identity,
          password,
        });

        const roleList = await fetch("/api/reference/role");
        const roleAlias = ((await roleList.json()) as { id: string; name: string }[]).find(
          (el) => el.id === res.user.role
        )?.name;
        localStorage.setItem("token-platform-belajar", res.token);
        localStorage.setItem(
          "user-platform-belajar",
          JSON.stringify({ ...res.user, role_alias: roleAlias })
        );
        onSetLoading(false);

        onLoginSuccess(res.user);
      } catch (err: any) {
        onSetLoading(false);
        alert(err.message || "Terjadi kesalahan saat login!");
      }
    },
    [role, identity, password, onSetLoading, onLoginSuccess]
  );

  useEffect(() => {
    fetch("/api/reference/role")
      .then((res) => res.json())
      .then(setRoleOptions)
      .catch(console.error);
  }, []);

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Login sebagai</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
        >
          <option value="">Pilih role</option>
          {roleOptions.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>{getIdentityLabel}</label>
        <input
          value={identity}
          onChange={(e) => setIdentity(e.target.value)}
          placeholder={getIdentityLabel}
          style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Password</label>
        <TogglePasswordInput value={password} onChange={setPassword} placeholder="••••••••" />
      </div>

      <button
        type="submit"
        style={{
          padding: "12px",
          borderRadius: "8px",
          fontWeight: 600,
          backgroundColor: primary,
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Masuk
      </button>
    </form>
  );
});
