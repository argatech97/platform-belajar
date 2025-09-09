/* eslint-disable @typescript-eslint/no-explicit-any */
import { IQuestionForm } from "@/app/types/answerForm";
import Coupleing from "@/components/bentukJawaban/Coupleing";
import MultipleChoice from "@/components/bentukJawaban/MultipleChoice";
import MultipleSelect from "@/components/bentukJawaban/MultipleSelect";
import Questioner from "@/components/bentukJawaban/Questioner";
import ShortAnswer from "@/components/bentukJawaban/ShortAnswer";

interface QuestionCardProps {
  question: IQuestionForm;
  answer?: any;
  onAnswer: (val: any) => void;
}

export default function QuestionCard({ question, answer, onAnswer }: QuestionCardProps) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "16px",
        backgroundColor: "white",
      }}
    >
      <h3 style={{ marginBottom: "12px", color: "black" }}>
        {question.orderNumber}. {question.question}
      </h3>

      {question.type === "multiple-choice" && (
        <MultipleChoice
          options={question.option}
          selectedOptions={answer?.value}
          onClick={(val) => onAnswer(val)}
        />
      )}

      {question.type === "multiple-select" && (
        <MultipleSelect
          options={question.option}
          selectedOptions={answer?.value}
          onClick={(val) => onAnswer(val)}
        />
      )}

      {question.type === "short-answer" && (
        <ShortAnswer
          type={question.typeOfAnswer}
          value={answer?.value || ""}
          onchange={(val) => onAnswer(val)}
        />
      )}

      {question.type === "coupleing" && (
        <Coupleing
          source={question.source}
          target={question.target}
          originalValue={answer?.value || []}
          onSelectCouple={(val) => onAnswer(val)}
        />
      )}

      {question.type === "questioner" && (
        <Questioner
          source={question.source}
          option={question.target}
          value={answer?.value || []}
          onClick={(val) => onAnswer(val)}
        />
      )}
    </div>
  );
}
