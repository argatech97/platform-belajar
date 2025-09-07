import React from "react";

export default function Error({ message }: { message: string }) {
  return (
    <div
      style={{
        height: "100dvh",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        color: "black",
        background: "#E6FFEE",
        fontWeight: "bold",
      }}
    >
      <p>
        <b>Internal Server Error</b>
      </p>
      <p>{message}</p>
    </div>
  );
}
