import {
  ICoupleing,
  IMultipleChoice,
  IMultipleSelect,
  IQuestioner,
  IQuestionForm,
  IShortAnswer,
} from "@/app/types/answerForm";

const content: { id: string; value: string }[] = [
  {
    id: "1",
    value: `<p><strong>Perhatikan denah berikut ini !</strong></p>
<p><img src="https://citraiasha.wordpress.com/wp-content/uploads/2019/01/Denah-1.png?w=700" alt="" width="100%" /></p>`,
  },
];

const multipleChoice: IMultipleChoice[] = [
  {
    id: "1",
    question: "<p>Bangunan umum yang terletak paling timur adalah ?</p>",
    contentId: "1",
    type: "multiple-choice",
    correctAnswer: "a",
    option: [
      { value: "a", content: "SD Brilian dan Rumah Bagas", type: "text" },
      { value: "b", content: "Masjid dan Rumah Sari", type: "text" },
      { value: "c", content: "Rumah Sari dan Rumah Bagas", type: "text" },
      { value: "d", content: "SD Brilian dan Masjid", type: "text" },
    ],
    orderNumber: 1,
    domainId: "1",
    domain: "Literasi",
    subDomain: "Mengakses dan Menemukan Informasi",
    subDomainId: "1",
    kompetensi: "",
    kompetensiId: "",
  },
];

const multipleSelect: IMultipleSelect[] = [
  {
    id: "2",
    contentId: "1",
    option: [
      { value: "a", content: "Rumah Sari berada di selatan Masjid", type: "text" },
      { value: "b", content: "KUA bersebrangan dengan Rumah Sinta", type: "text" },
      { value: "c", content: "Rumah Bayu bersebelahan dengan  Rumah Anita", type: "text" },
      { value: "d", content: "Kantor Polisi bersebrangan dengan Gedung Serba Guna", type: "text" },
    ],
    question: "<p>Berikut ini pernyataan yang benar adalah ?</p>",
    type: "multiple-select",
    correctAnswer: ["b", "c", "d"],
    orderNumber: 2,
    domainId: "1",
    domain: "Literasi",
    subDomain: "Menginterpretasi dan Mengintegrasi",
    subDomainId: "2",
    kompetensi: "",
    kompetensiId: "",
  },
];

const questioner: IQuestioner[] = [
  {
    contentId: "1",
    source: [
      {
        value: "a",
        content: "Bangunan yang berada di paling utara adalah KUA, Rumah Sinta dan Rumah Sari ",
      },
      {
        value: "b",
        content:
          "Masjid bersebrangan dengan Lapangan di sisi barat dan bersebrangan dengan SD Brilian Jaya di sisi utara",
      },
    ],
    target: [
      { content: "Benar", value: "1" },
      { content: "Tidak Benar", value: "0" },
    ],
    id: "3",
    question: "<p>Di bawah ini tentukan keterangan yang benar  dan tidak benar </p>",
    type: "questioner",
    correctAnswer: [
      { sourceId: "a", targetId: "1" },
      { sourceId: "b", targetId: "1" },
    ],
    orderNumber: 3,
    domainId: "1",
    domain: "Literasi",
    subDomain: "Mengevaluasi dan Merefleksi",
    subDomainId: "3",
    kompetensi: "",
    kompetensiId: "",
  },
];

const shortAnswer: IShortAnswer[] = [
  {
    contentId: "1",
    typeOfAnswer: "number",
    id: "4",
    question: "Ada berapa jumlah tempat umum pada denah tersebut? ",
    type: "short-answer",
    correctAnswer: [8],
    orderNumber: 4,
    domainId: "1",
    domain: "Literasi",
    subDomain: "Mengevaluasi dan Merefleksi",
    subDomainId: "3",
    kompetensi: "",
    kompetensiId: "",
  },
];

const coupleing: ICoupleing[] = [
  {
    contentId: "1",
    source: [
      { value: "a", content: "Di sisi timur, KUA bersebrangan dengan ?" },
      { value: "b", content: "Di sisi selatan, Kantor Polisi bersebrangan dengan ?" },
    ],
    target: [
      {
        value: "1",
        content: "Rumah Ahmad",
      },
      {
        value: "2",
        content: "Gedung Serbaguna",
      },
      {
        value: "3",
        content: "KUD",
      },
      {
        value: "4",
        content: "Rumah Sinta",
      },
    ],
    id: "5",
    question: "<p>Berdasarkan denah di atas, maka tentukan pasangan tiap item di bawah ini!</p>",
    type: "coupleing",
    correctAnswer: [
      { sourceId: "a", targetId: "4" },
      { sourceId: "b", targetId: "2" },
    ],
    orderNumber: 5,
    domainId: "1",
    domain: "Literasi",
    subDomain: "Mengakses dan Menemukan Informasi",
    subDomainId: "1",
    kompetensi: "",
    kompetensiId: "",
  },
];

const quizDummy: IQuestionForm[] = [
  ...multipleChoice,
  ...multipleSelect,
  ...questioner,
  ...shortAnswer,
  ...coupleing,
];

export { quizDummy };
export { content };
