import { IQuestionForm } from "@/app/types/answerForm";
import CircleButton from "@/components/ButtonCircle";
import React from "react";

export default function BottomNumberNav({
  testData,
  onClick,
  currentIndex,
  isAnsweredSet,
}: {
  testData: IQuestionForm[];
  onClick(index: number): void;
  currentIndex: number | undefined;
  isAnsweredSet: Set<string>;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "white",
        borderTop: "0.5px solid #c6c6c6",
        padding: "15px 10px",
        gap: "10px",
        flexWrap: "nowrap",
        whiteSpace: "nowrap",
        overflowX: "auto",
        overflowY: "hidden",
      }}
    >
      {testData.map((item, index) => (
        <CircleButton
          key={item.id}
          onClick={() => {
            onClick(index);
          }}
          isAnswered={isAnsweredSet.has(item.id)}
          isActive={index === currentIndex}
          number={index + 1}
          width={30}
          height={30}
          fontSize={12}
        />
      ))}
    </div>
  );
}
