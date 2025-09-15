export interface ISoal<X, Y> {
  id: string;
  question: string;
  contentId?: string;
  type: X;
  correctAnswer: Y;
  orderNumber: number;
  domainId: string;
  domain: string;
  subDomain: string;
  subDomainId: string;
  kompetensi: string;
  kompetensiId: string;
  pembahasan?: string;
}

export type MultipleChoice = "multiple-choice";

export type MultipleSelect = "multiple-select";

export type Coupleing = "coupleing";

export type ShortAnswer = "short-answer";

export type Questioner = "questioner";

export type AnswerForm = MultipleChoice | MultipleSelect | Coupleing | ShortAnswer | Questioner;

export type MultipleChoiceValue = string;

export type MultipleSelectValue = abcd[];

export type CoupleingValue = { sourceId: string; targetId: string }[];

export type ShortAnswerValue = string | number;

export type QuestionerValue = { sourceId: string; targetId: string }[];

export type AnswerFormValue =
  | MultipleChoiceValue
  | MultipleSelectValue
  | CoupleingValue
  | ShortAnswerValue
  | QuestionerValue;

export interface IOption<T> {
  value: T;
  content: string;
}

export type abcd = "a" | "b" | "c" | "d";

export type IOptionWith4type = IOption<abcd>;

export interface IOptionWithType extends IOptionWith4type {
  type: "text" | "image";
}

export interface IMultipleChoice extends ISoal<MultipleChoice, MultipleChoiceValue> {
  option: IOptionWithType[];
}

export interface IMultipleSelect extends ISoal<MultipleSelect, MultipleSelectValue> {
  option: IOptionWithType[];
}

export interface ICoupleing extends ISoal<Coupleing, CoupleingValue> {
  source: IOption<string>[];
  target: IOption<string>[];
}

export interface IShortAnswer extends ISoal<ShortAnswer, (string | number)[]> {
  typeOfAnswer: "number" | "text";
}
export interface IQuestioner extends ISoal<Questioner, QuestionerValue> {
  source: IOption<string>[];
  target: IOption<string>[];
}

export type IQuestionForm =
  | IQuestioner
  | IShortAnswer
  | ICoupleing
  | IMultipleSelect
  | IMultipleChoice;

export interface IQuestionEntityData {
  option?: IOptionWithType[];
  source?: IOption<string>[];
  target?: IOption<string>[];
  typeOfAnswer?: "number" | "text";
  correctAnswer: AnswerFormValue;
}
export interface IQuestionEntity {
  id: string; // uuid
  content_id: string; // uuid
  domain_id: string; // uuid
  domain_name: string; // varchar(50)
  sub_domain_id: string; // uuid
  sub_domain_name: string; // varchar(100)
  kompetensi_id: string; // uuid
  kompetensi_name: string; // text
  question_type_id: string; // uuid
  question_type_name: string; // varchar(100)
  data: IQuestionEntityData; // json (disimpan sebagai stringified JSON)
  test_id: string; // uuid
  question: string;
  pembahasan?: string;
}
