import Image from "next/image";
import React from "react";
import Title from "./Title";

export default function MainImage() {
  return (
    <>
      <div style={{ position: "relative", maxHeight: "240px" }}>
        <Image
          src="/pesertaDidik.jpg"
          alt="Banner"
          width={1200}
          height={600}
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
        <Title />
      </div>
    </>
  );
}
