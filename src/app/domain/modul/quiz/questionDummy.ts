import { IMultipleChoice, IQuestionForm } from "@/app/types/answerForm";

const multipleChoice: IMultipleChoice[] = [
  {
    content: `<p><strong>Perhatikan gambar di bawah ini!</strong></p>
    <p>&nbsp;</p>
    <p style="text-align: center;"><img src="https://idcopy.net/wp-content/uploads/2021/09/contoh-denah-lokasi.webp" alt="" width="400" height="" /></p>
    <p style="text-align: center;">&nbsp;</p>
    <p style="text-align: left;">Bila kamu berada di ujung barat gang sakura, Maka jalan tercepat untuk menuju pabrik gula&nbsp; adalah ?</p>
    <p style="text-align: left;"><br /><strong>Pilih salah satu jawaban yang benar!</strong>&nbsp; &nbsp;</p>`,
    type: "multiple-choice",
    correctAnswer: "a",
    option: [
      { value: "a", content: "Gang Sakura - Jalan Peribaru - Jalan Prabandinii", type: "text" },
      {
        value: "b",
        content:
          "Gang Sakura - Gang Srikandi - Gang Kenanga - Gang Malabar - Jalan Raya Prabandini",
        type: "text",
      },
      {
        value: "c",
        content: "Gang Sakura - Gang Srikandi - Jalan Peribaru - Jalan Raya Prabandini",
        type: "text",
      },
      {
        value: "d",
        content:
          "Gang Sakura - Jalan Peribaru -  Gang Srikandi - Gang Kenanga  - Gang Malabar - Jalan Raya Prabandini",
        type: "text",
      },
    ],
  },
];

const quizDummy: IQuestionForm[] = [...multipleChoice];

export default quizDummy;
