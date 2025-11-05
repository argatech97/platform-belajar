/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import Title from "./Title";

export default function MainImage() {
  const [roleAlias, setRoleAlias] = useState<string>("");

  useEffect(() => {
    const x = localStorage.getItem("user-platform-belajar") || "";
    const user = x ? JSON.parse(x) : null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (user) {
      setRoleAlias((user as any).role_alias);
    }
  }, []);
  return (
    <>
      <div style={{ position: "relative", maxHeight: "240px" }}>
        <img
          src={
            roleAlias === "Peserta Didik"
              ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxrBzVthmOb0s4fDDV4ew_fYgnAYWVHUv0jQ&s"
              : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyxRk0iKwkRqNG4niB6EYqegOqWNfXscQn4A&s"
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
        <Title role_alias={roleAlias} />
      </div>
    </>
  );
}
