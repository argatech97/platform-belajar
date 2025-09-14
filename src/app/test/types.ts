import { Jawaban } from "../skor/types";
import { AnswerForm, AnswerFormValue } from "../types/answerForm";

export type AnswersMap = Jawaban;

export type ActiveAnswer = {
  type: AnswerForm;
  value?: AnswerFormValue;
  score: number;
  duration?: number;
};

export type TypePercentage = {
  type: "multiple-choice" | "multiple-select" | "questioner" | "short-answer" | "coupleing";
  label: string;
  percentage: number; // 0..100
  totalQuestions: number;
  correctQuestions: number;
  duration?: number;
};

export type DomainPercentage = {
  domainId: string;
  domain: string;
  percentage: number;
  totalQuestions: number;
  correctQuestions: number;
  duration?: number;
};

export type SubDomainPercentage = {
  subDomainId: string;
  subDomain: string;
  percentage: number;
  totalQuestions: number;
  correctQuestions: number;
  duration?: number;
};

export type KompetensiPercentage = {
  kompetensiId: string;
  kompetensi: string;
  percentage: number;
  totalQuestions: number;
  correctQuestions: number;
  duration?: number;
};

export interface TestResult {
  maximumScore: number;
  score: number;
  testName: string;
  testTime: string;
}
