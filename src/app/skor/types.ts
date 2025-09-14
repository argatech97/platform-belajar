import { AnswerForm, AnswerFormValue } from "../types/answerForm";

export interface Root {
  id: string;
  test_id: string;
  test_name: string;
  test_type_id: string;
  test_type_name: string;
  skor: string;
  time_spent: string;
  persentase_benar_by_domain: PersentaseBenarByDomain[];
  persentase_benar_by_sub_domain: PersentaseBenarBySubDomain[];
  persentase_benar_by_type_answer: PersentaseBenarByTypeAnswer[];
  persentase_benar_by_kompetensi: PersentaseBenarByKompetensi[];
  jawaban: Jawaban;
  user_id: string;
  user_name: string;
  created_at: string;
}

export interface PersentaseBenarByDomain {
  domainId: string;
  domain: string;
  percentage: number;
  totalQuestions: number;
  correctQuestions: number;
  duration?: number;
}

export interface PersentaseBenarBySubDomain {
  subDomainId: string;
  subDomain: string;
  percentage: number;
  totalQuestions: number;
  correctQuestions: number;
  duration?: number;
}

export interface PersentaseBenarByTypeAnswer {
  type: string;
  label: string;
  percentage: number;
  totalQuestions: number;
  correctQuestions: number;
  duration?: number;
}

export interface PersentaseBenarByKompetensi {
  kompetensiId: string;
  kompetensi: string;
  percentage: number;
  totalQuestions: number;
  correctQuestions: number;
  duration?: number;
}

export type Jawaban = Record<
  string,
  {
    type: AnswerForm;
    value?: AnswerFormValue;
    score: number;
    duration?: number;
  }
>;

export type SliceOfPercentage =
  | PersentaseBenarByDomain
  | PersentaseBenarByKompetensi
  | PersentaseBenarBySubDomain
  | PersentaseBenarByTypeAnswer;

type SliceKeys =
  | keyof PersentaseBenarByDomain
  | keyof PersentaseBenarByKompetensi
  | keyof PersentaseBenarBySubDomain
  | keyof PersentaseBenarByTypeAnswer;

export type AllowedKeyValueFromSliceOfPercentage = Extract<
  SliceKeys,
  "domainId" | "subDomainId" | "kompetensiId" | "type"
>;

export type AllowedKeyFromSliceOfPercentage = Extract<
  SliceKeys,
  "domain" | "subDomain" | "kompetensi" | "label"
>;

export interface ISection {
  title: string;
  data: SliceOfPercentage[];
  key: AllowedKeyFromSliceOfPercentage;
  keyValue: AllowedKeyValueFromSliceOfPercentage;
  colors: string[];
  onClick: (data: string) => void;
}
