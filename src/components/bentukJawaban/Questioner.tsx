import React, { useMemo } from "react";
import { QuestionerValue } from "../../app/types/answerForm";

export default function Questioner({
  source,
  option,
  value,
  onClick,
}: {
  source: { id: string; content: string }[];
  option: { value: string; content: string }[];
  value: QuestionerValue;
  onClick: (value: QuestionerValue) => void;
}) {
  const optionList = useMemo(() => {
    return source.map((el) => {
      return {
        sourceId: el.id,
        content: el.content,
        value: value.find((v) => v.sourceId === el.id)?.value || "",
      };
    });
  }, [source, value]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <p style={{ marginBottom: "5px", color: "black" }}>
        <b>Berikan tanda centang pada setiap keterangan!</b>
      </p>
      <div style={{ display: "flex", backgroundColor: "#f0f0f0" }}>
        <div style={{ padding: "10px", textAlign: "center", flexGrow: "1", color: "black" }}>
          Keterangan
        </div>
        {option.map((opt, index) => (
          <div
            key={index}
            style={{
              padding: "10px",
              textAlign: "center",
              width: "100px",
              color: "black",
              flexShrink: "0",
            }}
          >
            {opt.content}
          </div>
        ))}
      </div>
      {optionList.map((src, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ padding: "10px", flexGrow: "1", color: "black" }}>{src.content}</div>
          {option.map((opt, idx) => (
            <div
              onClick={() => {
                const newValue = optionList.map((item, i) =>
                  i === index ? { ...item, value: opt.value } : item
                );
                onClick(newValue.map((el) => ({ sourceId: el.sourceId, value: el.value })));
              }}
              key={idx}
              style={{ padding: "10px", textAlign: "center", width: "100px", flexShrink: "0" }}
            >
              {opt.value === src.value ? "✅" : "⬜"}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
