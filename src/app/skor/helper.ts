import { IQuestionForm } from "../types/answerForm";
import { AllowedKeyValueFromSliceOfPercentage, SliceOfPercentage } from "./types";

// asumsikan IQuestionForm sudah didefinisikan seperti yang kamu berikan
type AllowedKey = "domainId" | "subDomainId" | "kompetensiId" | "type";
type FilterableKey =
  | AllowedKey
  | "selectedDomainId"
  | "selectedSubDomainId"
  | "selectedKompetensiId"
  | "selectedType";

/**
 * Normalize key names like "selectedDomainId" -> "domainId"
 */
function normalizeFilterKey(key: FilterableKey): AllowedKey {
  if (key.startsWith("selected")) {
    const raw = key.slice("selected".length); // "DomainId" | "Type" | ...
    const normalized = (raw.charAt(0).toLowerCase() + raw.slice(1)) as AllowedKey;
    return normalized;
  }
  return key as AllowedKey;
}

/**
 * Generic filter function:
 * - key: salah satu dari domainId | subDomainId | kompetensiId | type
 * - supports also nama dengan prefix "selected" (selectedDomainId, dll)
 * - jika value falsy (undefined | ""), akan mengembalikan array kosong
 */
function filterQuestionsBy(
  questions: IQuestionForm[],
  key: FilterableKey,
  value?: string
): IQuestionForm[] {
  if (!value) return [];
  return questions.filter((q) => q[key as keyof IQuestionForm] === value);
}

/* --- Convenience wrappers (opsional) --- */

export function getQuestionsByDomainId(questions: IQuestionForm[], selectedDomainId?: string) {
  console.log(selectedDomainId);
  return filterQuestionsBy(questions, "domainId", selectedDomainId);
}
export function getQuestionsByKompetensiId(
  questions: IQuestionForm[],
  selectedKompetensiId?: string
) {
  return filterQuestionsBy(questions, "kompetensiId", selectedKompetensiId);
}
export function getQuestionsBySubDomainId(
  questions: IQuestionForm[],
  selectedSubDomainId?: string
) {
  return filterQuestionsBy(questions, "subDomainId", selectedSubDomainId);
}
export function getQuestionsByType(questions: IQuestionForm[], selectedType?: string) {
  return filterQuestionsBy(questions, "type", selectedType);
}

export function handleGroupBy(item: SliceOfPercentage, key: AllowedKeyValueFromSliceOfPercentage) {
  if (key === "domainId" && "domainId" in item) {
    return item.domainId;
  }
  if (key === "subDomainId" && "subDomainId" in item) {
    return item.subDomainId;
  }
  if (key === "kompetensiId" && "kompetensiId" in item) {
    return item.kompetensiId;
  }
  if (key === "type" && "type" in item) {
    return item.type;
  }
  return "";
}
