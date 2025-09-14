import React, { useMemo } from "react";
import Card from "../Card";
import { abcd, IOptionWith4type } from "@/app/types/answerForm";

export default function MultipleChoice({
  onClick,
  options,
  selectedOptions,
  isPembahasan,
  kunciJawaban,
}: {
  kunciJawaban: string;
  isPembahasan?: boolean;
  options: IOptionWith4type[];
  selectedOptions?: abcd;
  onClick: (value: string) => void;
}) {
  const renderKunciJawaban = useMemo(() => {
    const x = options.find((el) => el.value === kunciJawaban);
    return (
      <>
        {" "}
        {x?.value}. {x?.content}
      </>
    );
  }, [kunciJawaban, options]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
      <p style={{ color: "black" }}>
        <b>{isPembahasan ? "Jawaban Anda" : "Pilih salah satu jawaban di bawah ini!"}</b>
      </p>
      {options.map((item, index) => (
        <Card
          onClick={() => {
            if (isPembahasan) return;
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          borderRadius: "10px",
          background: "rgb(246, 246, 246)",
          padding: "15px",
          gap: "10px",
        }}
      >
        <p>
          {" "}
          <b>Kunci Jawaban</b>
        </p>
        {renderKunciJawaban}
      </div>
    </div>
  );
}
