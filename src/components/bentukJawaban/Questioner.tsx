import React, { useCallback, useMemo } from "react";
import { IOption, QuestionerValue } from "../../app/types/answerForm";

export default function Questioner({
  source,
  option,
  value,
  isPembahasan,
  onClick,
  kunciJawaban,
}: {
  kunciJawaban: QuestionerValue;
  isPembahasan?: boolean;
  source: IOption<string>[];
  option: IOption<string>[];
  value: QuestionerValue;
  onClick: (value: QuestionerValue) => void;
}) {
  const optionList = useMemo(() => {
    return source.map((el) => {
      return {
        sourceId: el.value,
        content: el.content,
        value: value.find((v) => v.sourceId === el.value)?.targetId || "",
      };
    });
  }, [source, value]);

  const mapJawabanBenar = useCallback(() => {
    return kunciJawaban.map((jb) => {
      const sourceItem = source.find((s) => s.value === jb.sourceId) || null;
      const optionItem = option.find((o) => o.value === jb.targetId) || null;

      return {
        source: sourceItem,
        target: optionItem,
      };
    });
  }, [kunciJawaban, source, option]);

  const renderKunciJawaban = useMemo(() => {
    if (!isPembahasan) return;

    return (
      <div
        style={{
          padding: "15px",
          borderRadius: "10px",
          background: "#f6f6f6",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        {isPembahasan && (
          <p>
            {" "}
            <b>Kunci Jawaban</b>
          </p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {mapJawabanBenar().map((el, index) => (
            <div key={index}>
              {el.source?.content} ➡️ <b>{el.target?.content}</b>
            </div>
          ))}
        </div>
      </div>
    );
  }, [isPembahasan, mapJawabanBenar]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <p style={{ marginBottom: "5px", color: "black" }}>
        <b>{isPembahasan ? "Jawaban Anda :" : "Berikan tanda centang pada setiap keterangan!"}</b>
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
                if (isPembahasan) return;
                const newValue = optionList.map((item, i) =>
                  i === index ? { ...item, value: opt.value } : item
                );
                onClick(newValue.map((el) => ({ sourceId: el.sourceId, targetId: el.value })));
              }}
              key={idx}
              style={{ padding: "10px", textAlign: "center", width: "100px", flexShrink: "0" }}
            >
              {opt.value === src.value ? "✅" : "⬜"}
            </div>
          ))}
        </div>
      ))}
      {renderKunciJawaban}
    </div>
  );
}
