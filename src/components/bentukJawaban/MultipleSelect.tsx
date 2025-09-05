import React, { useEffect, useState } from "react";
import Card from "../Card";
import { abcd, IOptionWith4type } from "@/app/types/answerForm";

export default function MultipleSelect({
  onClick,
  options,
  selectedOptions,
}: {
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
      <p style={{ color: "black" }}>
        <b>Pilih beberapa jawaban di bawah ini !</b>
      </p>
      {options.map((item, index) => (
        <Card
          onClick={() => {
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
    </div>
  );
}
