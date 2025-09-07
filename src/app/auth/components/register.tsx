/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useMemo, memo, useState, useEffect } from "react";
import { TogglePasswordInput } from "./togglePassword";
import { data } from "../data";
import { postRequest } from "@/helper/api";
import { KelasOption, RoleOption, SekolahOption } from "@/app/types/reference";

export const RegisterForm = memo(function RegisterForm({
  role,
  setRole,
  identity,
  setIdentity,
  school,
  setSchool,
  kelas,
  setKelas,
  fullName,
  setFullName,
  password,
  setPassword,
  setModeLogin,
}: any) {
  const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);
  const [sekolahOptions, setSekolahOptions] = useState<SekolahOption[]>([]);
  const [kelasOptions, setKelasOptions] = useState<KelasOption[]>([]);
  const { primary } = data();
  // fetch roles
  useEffect(() => {
    fetch("/api/reference/role")
      .then((res) => res.json())
      .then(setRoleOptions)
      .catch(console.error);
  }, []);

  // fetch sekolah
  useEffect(() => {
    fetch("/api/reference/sekolah")
      .then((res) => res.json())
      .then(setSekolahOptions)
      .catch(console.error);
  }, []);

  // fetch kelas
  useEffect(() => {
    fetch("/api/reference/kelas")
      .then((res) => res.json())
      .then(setKelasOptions)
      .catch(console.error);
  }, []);

  const getIdentityLabel = useMemo(() => {
    const x = roleOptions.find((x) => x.id === role);
    if (x?.name === "Administrator") return "NPSN";
    if (x?.name === "Pendidik") return "NIK";
    return "NISN";
  }, [role, roleOptions]);

  const getKelasLabel = useMemo(() => {
    const x = roleOptions.find((x) => x.id === role);
    if (x?.name === "Pendidik") return "Mengajar di kelas";
    if (x?.name === "Peserta Didik") return "Kelas";
    return "";
  }, [role, roleOptions]);

  const isAdmin = useMemo(() => {
    return roleOptions.find((r) => r.id === role)?.name === "Administrator" ? true : false;
  }, [role, roleOptions]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // cari role administrator

      // validasi field wajib
      if (!role || !identity || !school || !fullName || !password) {
        alert("Semua field wajib diisi!");
        return;
      }

      // kelas wajib kalau bukan administrator
      if (!isAdmin && !kelas) {
        alert("Kelas wajib dipilih untuk pendidik dan peserta didik!");
        return;
      }

      try {
        const res = await postRequest("/auth/register", {
          role,
          no_identitas: identity,
          sekolah: school,
          kelas: isAdmin ? null : kelas,
          nama_lengkap: fullName,
          password,
        });
        alert("Registrasi berhasil, silahkan login terlebih dahulu");
        setModeLogin();
      } catch (err: any) {
        alert(err.message);
      }
    },
    [role, identity, school, fullName, password, isAdmin, kelas, setModeLogin]
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Registrasi sebagai</label>
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
        <label>Pilihan Sekolah</label>
        <select
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
        >
          <option value="">Pilih sekolah</option>
          {sekolahOptions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {role !== "administrator" && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>{getKelasLabel}</label>
          <select
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          >
            <option value="">Pilih kelas</option>
            {kelasOptions.map((k) => (
              <option key={k.id} value={k.id}>
                {k.tingkat}
              </option>
            ))}
          </select>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Nama Lengkap</label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Nama Lengkap"
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
        Daftar
      </button>
    </form>
  );
});
