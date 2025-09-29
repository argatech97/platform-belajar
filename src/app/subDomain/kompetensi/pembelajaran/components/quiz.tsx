import React from "react";
import Card from "@/components/Card";

const Quiz = React.memo(function Quiz({
  items,
  onClickItem,
}: {
  onClickItem: (
    title: string,
    id: string,
    minute: number,
    countQuestion: number,
    point: number
  ) => void;
  items: {
    isDone: boolean;
    title: string;
    countQuestion: number;
    minute: number;
    id: string;
    point: number;
  }[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px", padding: "15px" }}>
      <p>
        Quiz adalah post test yang menguji kompetensimu setelah membaca dan menyelesaikan semua
        materi
      </p>
      {items.map((item, index) => (
        <Card
          onClick={() => {
            onClickItem(item.title, item.id, item.minute * 60, item.countQuestion, item.point);
          }}
          key={index}
          prefix={<span>{item.isDone ? "✅" : "⬜"}</span>}
          title={item.title}
          description={`${item.countQuestion} Soal | 🪙 +${item.point} point`}
          suffix={
            <span
              style={{ display: "flex", flexWrap: "nowrap", color: "black", whiteSpace: "nowrap" }}
            >
              ⏰ {item.minute} Menit
            </span>
          }
        ></Card>
      ))}
    </div>
  );
});

export default Quiz;
