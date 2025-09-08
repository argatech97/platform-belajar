import {
  AnswerForm,
  CoupleingValue,
  ICoupleing,
  IMultipleChoice,
  IMultipleSelect,
  IQuestionEntity,
  IQuestionEntityData,
  IQuestioner,
  IQuestionForm,
  IShortAnswer,
  MultipleChoiceValue,
  MultipleSelectValue,
  QuestionerValue,
} from "@/app/types/answerForm";

export async function mapEntitiesToQuestions(
  entities: IQuestionEntity[]
): Promise<IQuestionForm[]> {
  return entities.map((entity) => {
    const parsed = entity.data as IQuestionEntityData;

    // Tentukan type soal dari kolom `question_type`
    const type = entity.question_type_name as AnswerForm;

    switch (type) {
      case "multiple-choice": {
        const soal: IMultipleChoice = {
          id: entity.id,
          question: entity.question, // ← sesuaikan field mana yang menyimpan pertanyaan sebenarnya
          contentId: entity.content_id,
          type,
          correctAnswer: parsed.correctAnswer as MultipleChoiceValue,
          orderNumber: 0, // kalau ada kolom orderNumber tambahkan
          domainId: entity.domain_id,
          domain: entity.domain_name,
          subDomainId: entity.sub_domain_id,
          subDomain: entity.sub_domain_name,
          kompetensiId: entity.kompetensi_id,
          kompetensi: entity.kompetensi_name,
          option: parsed.option ?? [],
        };
        return soal;
      }

      case "multiple-select": {
        const soal: IMultipleSelect = {
          id: entity.id,
          question: entity.question,
          contentId: entity.content_id,
          type,
          correctAnswer: parsed.correctAnswer as MultipleSelectValue,
          orderNumber: 0,
          domainId: entity.domain_id,
          domain: entity.domain_name,
          subDomainId: entity.sub_domain_id,
          subDomain: entity.sub_domain_name,
          kompetensiId: entity.kompetensi_id,
          kompetensi: entity.kompetensi_name,
          option: parsed.option ?? [],
        };
        return soal;
      }

      case "coupleing": {
        const soal: ICoupleing = {
          id: entity.id,
          question: entity.question,
          contentId: entity.content_id,
          type,
          correctAnswer: parsed.correctAnswer as CoupleingValue,
          orderNumber: 0,
          domainId: entity.domain_id,
          domain: entity.domain_name,
          subDomainId: entity.sub_domain_id,
          subDomain: entity.sub_domain_name,
          kompetensiId: entity.kompetensi_id,
          kompetensi: entity.kompetensi_name,
          source: parsed.source ?? [],
          target: parsed.target ?? [],
        };
        return soal;
      }

      case "short-answer": {
        const soal: IShortAnswer = {
          id: entity.id,
          question: entity.question,
          contentId: entity.content_id,
          type,
          correctAnswer: Array.isArray(parsed.correctAnswer)
            ? (parsed.correctAnswer as (string | number)[])
            : [parsed.correctAnswer as string | number],
          orderNumber: 0,
          domainId: entity.domain_id,
          domain: entity.domain_name,
          subDomainId: entity.sub_domain_id,
          subDomain: entity.sub_domain_name,
          kompetensiId: entity.kompetensi_id,
          kompetensi: entity.kompetensi_name,
          typeOfAnswer: parsed.typeOfAnswer ?? "text",
        };
        return soal;
      }

      case "questioner": {
        const soal: IQuestioner = {
          id: entity.id,
          question: entity.question,
          contentId: entity.content_id,
          type,
          correctAnswer: parsed.correctAnswer as QuestionerValue,
          orderNumber: 0,
          domainId: entity.domain_id,
          domain: entity.domain_name,
          subDomainId: entity.sub_domain_id,
          subDomain: entity.sub_domain_name,
          kompetensiId: entity.kompetensi_id,
          kompetensi: entity.kompetensi_name,
          source: parsed.source ?? [],
          target: parsed.target ?? [],
        };
        return soal;
      }

      default:
        throw new Error(`Unknown question type: ${type}`);
    }
  });
}
