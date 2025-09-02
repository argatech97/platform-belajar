import React from "react";
import Card from "@/components/Card";

const Quiz = React.memo(function Quiz({
  items,
  onClickItem,
}: {
  onClickItem: (title: string, id: string) => void;
  items: {
    title: string;
    countQuestion: number;
    minute: number;
    id: string;
  }[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px", padding: "15px" }}>
      {items.map((item, index) => (
        <Card
          onClick={() => onClickItem(item.title, item.id)}
          key={index}
          title={item.title}
          description={`${item.countQuestion} Soal`}
          suffix={
            <span style={{ display: "flex", flexWrap: "nowrap", color: "black" }}>
              ⏰ {item.minute} Menit
            </span>
          }
        ></Card>
      ))}
    </div>
  );
});

export default Quiz;
