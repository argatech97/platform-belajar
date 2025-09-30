/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import Title from "./Title";

export default function MainImage() {
  const [roleAlias, setRoleAlias] = useState<string>("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user-platform-belajar") || "");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setRoleAlias((user as any).role_alias);
  }, []);
  return (
    <>
      <div style={{ position: "relative", maxHeight: "240px" }}>
        <img
          src={
            roleAlias === "Peserta Didik"
              ? "https://mtsn2bandaaceh.sch.id/wp-content/uploads/2019/08/murid-sekolah-20151112-104930-5d5538fe097f363fd8556c12.jpg"
              : "https://www.tanotofoundation.org/wp-content/uploads/2019/01/Pembalajaran-aktif-dan-kreatif.jpg"
          }
          alt="Banner"
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "240px",
            objectFit: "cover",
          }}
          loading="lazy"
        />
        <div
          style={{
            height: "100%",
            width: "100%",
            top: 0,
            left: 0,
            background: "#373737ff",
            position: "absolute",
            zIndex: 1,
            opacity: 0.3,
          }}
        ></div>
        {roleAlias}
        <Title role_alias={roleAlias} />
      </div>
    </>
  );
}
