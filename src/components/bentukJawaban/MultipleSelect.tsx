import React, { useEffect, useMemo, useState } from "react";
import Card from "../Card";
import { abcd, IOptionWith4type, MultipleSelectValue } from "@/app/types/answerForm";

export default function MultipleSelect({
  onClick,
  options,
  selectedOptions,
  isPembahasan,
  kunciJawaban,
}: {
  kunciJawaban: MultipleSelectValue;
  isPembahasan?: boolean;
  options: IOptionWith4type[];
  selectedOptions?: abcd[];
  onClick: (value: abcd[]) => void;
}) {
  const [jawabanTerpilih, setJawabanTerpilih] = useState<abcd[]>([]);

  useEffect(() => {
    if (selectedOptions) {
      setJawabanTerpilih(selectedOptions);
    } else {
      setJawabanTerpilih([]);
    }
  }, [selectedOptions]);

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
          {options
            .filter((el) => kunciJawaban.includes(el.value))
            .map((el, index) => (
              <div key={index}>
                {el.value}. {el.content}
              </div>
            ))}
        </div>
      </div>
    );
  }, [isPembahasan, kunciJawaban, options]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
      <p style={{ color: "black" }}>
        <b>{isPembahasan ? "Jawaban Anda :" : "Pilih beberapa jawaban di bawah ini !"}</b>
      </p>
      {options.map((item, index) => (
        <Card
          onClick={() => {
            if (isPembahasan) return;
            const x = jawabanTerpilih.includes(item.value);
            if (x) {
              const newCValue = jawabanTerpilih.filter((val) => val !== item.value);
              onClick(newCValue);
            } else {
              const newCValue = [...jawabanTerpilih, item.value];
              onClick(newCValue);
            }
          }}
          color={selectedOptions?.includes(item.value) ? "white" : "black"}
          backgroundColor={selectedOptions?.includes(item.value) ? "#69CA87" : "white"}
          key={index}
          prefix={selectedOptions?.includes(item.value) ? "✅️" : "⬜"}
          description={`${item.content}`}
        />
      ))}
      {renderKunciJawaban}
    </div>
  );
}
