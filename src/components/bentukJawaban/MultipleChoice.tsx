import React from "react";
import Card from "../Card";
import { abcd, IOptionWith4type } from "@/app/types/answerForm";

export default function MultipleChoice({
  onClick,
  options,
  selectedOptions,
}: {
  options: IOptionWith4type[];
  selectedOptions?: abcd;
  onClick: (value: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
      <p style={{ color: "black" }}>
        <b>Pilih salah satu jawaban di bawah ini!</b>
      </p>
      {options.map((item, index) => (
        <Card
          onClick={() => {
            onClick(item.value);
          }}
          color={item.value === selectedOptions ? "white" : "black"}
          backgroundColor={item.value === selectedOptions ? "#69CA87" : "white"}
          key={index}
          prefix={
            <span style={{ color: item.value === selectedOptions ? "white" : "black" }}>
              {item.value}
            </span>
          }
          description={`${item.content}`}
        />
      ))}
    </div>
  );
}
