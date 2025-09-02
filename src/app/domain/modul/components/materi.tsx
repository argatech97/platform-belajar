import React from "react";
import Card from "@/components/Card";

const Materi = React.memo(function Materi({
  materi,
  onClickItem,
}: {
  onClickItem: (id: string, description: string) => void;
  materi: { isDone: boolean; description: string; id: string }[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px", padding: "15px" }}>
      {materi.map((item, index) => (
        <Card
          onClick={() => {
            onClickItem(item.description, item.id);
          }}
          key={index}
          prefix={<span>{item.isDone ? "✅" : "⬜"}</span>}
          description={item.description}
          suffix={"➡️"}
        ></Card>
      ))}
    </div>
  );
});

export default Materi;
