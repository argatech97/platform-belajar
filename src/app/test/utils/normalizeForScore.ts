import {
  AnswerFormValue,
  CoupleingValue,
  MultipleChoiceValue,
  MultipleSelectValue,
  QuestionerValue,
} from "@/app/types/answerForm";

export const normalizeUserAnswer = (v?: AnswerFormValue) => {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v.trim().toLowerCase();
  return `${v}`.trim().toLowerCase();
};

export const normalizeCorrectAnswer = (
  v:
    | MultipleChoiceValue
    | MultipleSelectValue
    | CoupleingValue
    | QuestionerValue
    | (string | number)[]
) => {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v.trim().toLowerCase();
  return `${v}`.trim().toLowerCase();
};
