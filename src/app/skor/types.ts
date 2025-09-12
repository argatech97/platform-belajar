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
}

export interface PersentaseBenarBySubDomain {
  subDomainId: string;
  subDomain: string;
  percentage: number;
  totalQuestions: number;
  correctQuestions: number;
}

export interface PersentaseBenarByTypeAnswer {
  type: string;
  label: string;
  percentage: number;
  totalQuestions: number;
  correctQuestions: number;
}

export interface PersentaseBenarByKompetensi {
  kompetensiId: string;
  kompetensi: string;
  percentage: number;
  totalQuestions: number;
  correctQuestions: number;
}

export interface Jawaban {
  "fed34f57-be69-4c8b-bbff-052e2378032d": Fed34f57Be694c8bBbff052e2378032d;
}

export interface Fed34f57Be694c8bBbff052e2378032d {
  type: string;
  value: string;
  score: number;
}
