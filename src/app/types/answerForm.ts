interface ISoal<X, Y> {
  content: string;
  type: X;
  correctAnswer: Y;
}

export type MultipleChoice = "multiple-choice";

export type MultipleSelect = "multiple-select";

export type Coupleing = "coupleing";

export type ShortAnswer = "short-answer";

export type Questioner = "questioner";

export type AnswerForm = MultipleChoice | MultipleSelect | Coupleing | ShortAnswer | Questioner;

export interface IOption<T> {
  value: T;
  content: string;
}

export type abcd = "a" | "b" | "c" | "d";

export type IOptionWith4type = IOption<abcd>;

export interface IOptionWithType extends IOptionWith4type {
  type: "text" | "image";
}

export interface IMultipleChoice extends ISoal<MultipleChoice, string> {
  option: IOptionWithType[];
}

export interface IMultipleSelect extends ISoal<MultipleSelect, string[]> {
  option: IOptionWithType[];
}

export interface ICoupleing extends ISoal<Coupleing, { sourceId: string; targetId: string }[]> {
  source: IOption<string>[];
  target: IOption<string>[];
}

export type IShortAnswer = ISoal<ShortAnswer, string[]>;

export interface IQuestioner extends ISoal<Questioner, { sourceId: string; value: boolean }[]> {
  source: IOption<string>[];
}

export type IQuestionForm =
  | IQuestioner
  | IShortAnswer
  | ICoupleing
  | IMultipleSelect
  | IMultipleChoice;
