import React, { useEffect, useMemo } from "react";

export default function ShortAnswer({
  type,
  value,
  onchange,
  isPembahasan,
  kunciJawaban,
}: {
  kunciJawaban: (number | string)[];
  isPembahasan?: boolean;
  type: "number" | "text";
  value: string | number;
  onchange: (value: string | number) => void;
}) {
  const [valueComponent, setValueComponent] = React.useState<string | number>("");

  useEffect(() => {
    setValueComponent(value);
  }, [value]);

  const renderKunciJawaban = useMemo(() => {
    if (!isPembahasan) return;
    return (
      <div
        style={{
          padding: "15px",
          borderRadius: "10px",
          background: "#f6f6f6",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        {isPembahasan && (
          <p>
            {" "}
            <b>Kunci Jawaban</b>
          </p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <p>{kunciJawaban.join(", ")}</p>
        </div>
      </div>
    );
  }, [isPembahasan, kunciJawaban]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <p style={{ color: "black" }}>
        <b>{isPembahasan ? "Jawaban Anda :" : "Tulis jawabanmu di bawah ini"}</b>
      </p>
      <input
        onChange={(e) => {
          if (isPembahasan) return;
          onchange(e.target.value);
        }}
        type={type}
        value={valueComponent}
        style={{
          padding: "10px",
          border: "solid 0.5px #c6c6c6",
          width: "100%",
          borderRadius: "5px",
          color: "black",
          backgroundColor: "white",
        }}
      />
      {renderKunciJawaban}
    </div>
  );
}
