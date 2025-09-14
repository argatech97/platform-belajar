import React from "react";

export default function NomerSoal({ currentIndex }: { currentIndex: number | undefined }) {
  return (
    <div style={{ padding: "10px 20px", fontWeight: "bolder" }}>
      No Soal : {currentIndex !== undefined ? currentIndex + 1 : ""}
    </div>
  );
}
