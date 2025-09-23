import React from "react";
import Card from "@/components/Card";

const Materi = React.memo(function Materi({
  materi,
  onClickItem,
}: {
  onClickItem: (id: string, description: string, point: number) => void;
  materi: { isDone: boolean; description: string; id: string; point: number }[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px", padding: "15px" }}>
      <p>Selesaikan semua materi sebelum mengerjakan quiz</p>
      {materi.map((item, index) => (
        <Card
          onClick={() => {
            onClickItem(item.description, item.id, item.point);
          }}
          key={index}
          prefix={<span>{item.isDone ? "✅" : "⬜"}</span>}
          title={item.description}
          description={`🪙 +${item.point} point`}
          suffix={"➡️"}
        ></Card>
      ))}
    </div>
  );
});

export default Materi;
