import QuestionCard from "./QuestionCard";
import { useTest } from "./useTest";

export default function TestPage() {
  const {
    testData,
    answers,
    handleMultipleChoice,
    handleMultipleSelect,
    handleShortAnswer,
    handleQuestioner,
    handleCoupleing,
    submitAnswers,
    isSubmitting,
  } = useTest();

  if (!testData.length) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      {testData.map((q) => (
        <QuestionCard
          key={q.id}
          question={q}
          answer={answers[q.id]}
          onAnswer={(val) => {
            switch (q.type) {
              case "multiple-choice":
                handleMultipleChoice(val);
                break;
              case "multiple-select":
                handleMultipleSelect(val);
                break;
              case "short-answer":
                handleShortAnswer(val);
                break;
              case "questioner":
                handleQuestioner(val);
                break;
              case "coupleing":
                handleCoupleing(val);
                break;
              default:
                break;
            }
          }}
        />
      ))}

      <button
        onClick={submitAnswers}
        disabled={isSubmitting}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#69CA87",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: isSubmitting ? "not-allowed" : "pointer",
        }}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}
