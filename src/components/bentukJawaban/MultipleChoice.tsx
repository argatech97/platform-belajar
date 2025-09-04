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
      {options.map((item, index) => (
        <Card
          onClick={() => {
            onClick(item.value);
          }}
          backgroundColor={item.value === selectedOptions ? "#69CA87" : "none"}
          key={index}
          prefix={<span style={{ color: "black" }}>{item.value}</span>}
          description={item.content}
        />
      ))}
    </div>
  );
}
