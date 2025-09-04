import Card from "@/components/Card";
import React from "react";

export default function TryoutKelas() {
  const data = [
    {
      id: "1",
      name: "Tryout 1",
      participant: [{ icon: "👫", label: "Peserta: 32" }],
      highestScore: 450,
    },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {data.map((item, index) => (
        <Card
          title={item.name}
          items={item.participant}
          key={index}
          suffix={
            <div
              style={{
                display: "flex",
                gap: "8px",
              }}
            >
              <span>📊</span>
              <span style={{ color: "black", transform: "translatey(4px)" }}>450</span>
            </div>
          }
        ></Card>
      ))}
    </div>
  );
}
