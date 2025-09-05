import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CoupleingValue, IOption } from "../../app/types/answerForm";
import Card from "../Card";

export default function Coupleing({
  source,
  target,
  originalValue,
  onSelectCouple,
}: {
  source: IOption<string>[];
  target: IOption<string>[];
  originalValue: CoupleingValue;
  onSelectCouple: (value: CoupleingValue) => void;
}) {
  const [value, setValue] = useState<{ sourceId: string; targetId: string; bgColor: string }[]>([]);
  const [selectedSource, setSelectedSource] = useState<string | undefined>();
  const [selectedTarget, setSelectedTarget] = useState<string | undefined>();
  const bgColor = useMemo(
    () => ["lightsalmon", "lightseagreen", "teal", "darkgray", "lightpink"] as string[],
    []
  );

  useEffect(() => {
    if (selectedSource && selectedTarget && value.length < source.length) {
      const previousValue = value?.filter((el) => el.sourceId !== selectedSource);
      const bgColorUser = bgColor.find((el) => !value.map((v) => v.bgColor).includes(el));
      const newValue = [
        ...(previousValue || []),
        { sourceId: selectedSource, targetId: selectedTarget, bgColor: bgColorUser || "white" },
      ];
      setSelectedSource(undefined);
      setSelectedTarget(undefined);
      onSelectCouple(newValue.map((el) => ({ sourceId: el.sourceId, targetId: el.targetId })));
    }
  }, [bgColor, onSelectCouple, selectedSource, selectedTarget, source.length, value]);

  useEffect(() => {
    setValue(
      originalValue.map((el, index) => ({
        ...el,
        bgColor: bgColor[index % bgColor.length],
      }))
    );
  }, [bgColor, originalValue]);

  const findBgColor = useCallback(
    (id: string, type: "source" | "target") => {
      if (type === "source") {
        return value?.find((el) => el.sourceId === id)?.bgColor;
      } else if (type === "target") {
        return value?.find((el) => el.targetId === id)?.bgColor;
      } else {
        return "white";
      }
    },
    [value]
  );

  const sourceCard = useCallback(() => {
    return source.map((el, index) => {
      const x = findBgColor(el.value, "source");

      return (
        <Card
          key={index}
          description={el.content}
          onClick={() => {
            setSelectedSource(el.value);
          }}
          color={x ? "white" : "black"}
          backgroundColor={x}
          border={el.value === selectedSource ? "solid 2px red" : undefined}
        ></Card>
      );
    });
  }, [findBgColor, source, selectedSource]);

  const targetCard = useCallback(() => {
    return target.map((el, index) => {
      const x = findBgColor(el.value, "target");
      return (
        <Card
          key={index}
          description={el.content}
          onClick={() => {
            setSelectedTarget(el.value);
          }}
          color={x ? "white" : "black"}
          backgroundColor={x}
        ></Card>
      );
    });
  }, [findBgColor, target]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <p style={{ color: "black" }}>
        <b>
          Klik item pada bagian pertama untuk dijodohkan dengan item yang sesuai pada bagian kedua!
        </b>
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          border: "solid 0.5px #c6c6c6",
          borderRadius: 8,
          padding: 10,
        }}
      >
        <p style={{ color: "black" }}>Bagian Pertama</p>
        {sourceCard()}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          border: "solid 0.5px #c6c6c6",
          borderRadius: 8,
          padding: 10,
        }}
      >
        <p style={{ color: "black" }}>Bagian Kedua</p>
        {targetCard()}
      </div>
      {value && value.length === source.length && (
        <button
          onClick={() => {
            onSelectCouple([]);
            setSelectedSource(undefined);
            setSelectedTarget(undefined);
          }}
          style={{
            padding: "10px",
            border: "none",
            background: "#69CA87",
            color: "white",
            flexGrow: "1",
            borderRadius: "5px",
          }}
        >
          Ubah Jawaban 🔄
        </button>
      )}
    </div>
  );
}
