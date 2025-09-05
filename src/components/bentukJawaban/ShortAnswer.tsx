import React, { useEffect } from "react";

export default function ShortAnswer({
  type,
  value,
  onchange,
}: {
  type: "number" | "text";
  value: string | number;
  onchange: (value: string | number) => void;
}) {
  const [valueComponent, setValueComponent] = React.useState<string | number>("");

  useEffect(() => {
    setValueComponent(value);
  }, [value]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <p style={{ color: "black" }}>
        <b>Tulis jawabanmu di bawah ini</b>
      </p>
      <input
        onChange={(e) => onchange(e.target.value)}
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
    </div>
  );
}
