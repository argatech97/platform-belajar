import React from "react";

export default function BottomNavigation({
  handleNext,
  handlePrev,
}: {
  handleNext: () => void;
  handlePrev: () => void;
}) {
  return (
    <div style={{ display: "flex" }}>
      <div
        onClick={handlePrev}
        style={{
          textAlign: "center",
          padding: "20px 10px",
          flexGrow: "1",
          background: "#c6c6c6",
          color: "black",
          cursor: "pointer",
        }}
      >
        Sebelumnya
      </div>
      <div
        onClick={handleNext}
        style={{
          textAlign: "center",
          padding: "20px 10px",
          flexGrow: "1",
          background: "#69CA87",
          color: "white",
          cursor: "pointer",
        }}
      >
        Selanjutnya
      </div>
    </div>
  );
}
