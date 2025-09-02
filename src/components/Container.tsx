import React from "react";

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#f0f0f0ff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100dvh",
          maxWidth: "500px",
          width: "100%",
          background: "white",
          position: "relative",
          overflowY: "scroll",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}
