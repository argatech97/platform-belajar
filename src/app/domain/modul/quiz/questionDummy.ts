import { IQuestionForm } from "@/app/types/answerForm";

const multipleChoice: IQuestionForm[] = [
  {
    content: `<p><strong>Perhatikan gambar di bawah ini!</strong></p>
    <p>&nbsp;</p>
    <p style="text-align: center;"><img src="https://idcopy.net/wp-content/uploads/2021/09/contoh-denah-lokasi.webp" alt="" width="400" height="" /></p>
    <p style="text-align: center;">&nbsp;</p>
    <p style="text-align: left;">Bila kamu berada di ujung barat gang sakura, Maka jalan tercepat untuk menuju pabrik gula&nbsp; adalah ?</p>
    `,
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
  {
    content: `<p><strong>Perhatikan gambar di bawah ini!</strong></p>
    <p>&nbsp;</p>
    <p style="text-align: center;"><img src="https://idcopy.net/wp-content/uploads/2021/09/contoh-denah-lokasi.webp" alt="" width="400" height="" /></p>
    <p style="text-align: center;">&nbsp;</p>
    <p style="text-align: left;">Bila kamu berada di ujung barat gang sakura, Maka jalan tercepat untuk menuju pabrik gula&nbsp; adalah ?</p>
    `,
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
  {
    content: `<p><strong>Perhatikan gambar di bawah ini!</strong></p>
    <p>&nbsp;</p>
    <p style="text-align: center;"><img src="https://idcopy.net/wp-content/uploads/2021/09/contoh-denah-lokasi.webp" alt="" width="400" height="" /></p>
    <p style="text-align: center;">&nbsp;</p>
    <p style="text-align: left;">Bangunan yang berada di paling utara adalah ?</p>`,
    type: "multiple-select",
    correctAnswer: ["a"],
    option: [
      { value: "a", content: "Kantor A dan Kantor B", type: "text" },
      {
        value: "b",
        content: "Kantor C dan Kantor D",
        type: "text",
      },
      {
        value: "c",
        content: "Kantor A saja",
        type: "text",
      },
      {
        value: "d",
        content: "Kantor B saja",
        type: "text",
      },
    ],
  },
  {
    content: `<p><strong>Perhatikan gambar di bawah ini!</strong></p>
    <p>&nbsp;</p>
    <p style="text-align: center;"><img src="https://idcopy.net/wp-content/uploads/2021/09/contoh-denah-lokasi.webp" alt="" width="400" height="" /></p>
    <p style="text-align: center;">&nbsp;</p>
    <p style="text-align: left;">Pernyataan di bawah ini yang termasuk benar adalah ?</p>`,
    type: "multiple-select",
    correctAnswer: ["a", "b", "d"],
    option: [
      { value: "a", content: "Pabrik gula ada di jalana raya prabandhini", type: "text" },
      {
        value: "b",
        content: "Bangunan yang ditunjuk pada tanda anak panah berada di jalan sakura ",
        type: "text",
      },
      {
        value: "c",
        content: "Di jalan sakura hanya terdapat satu bangunan yang terlihat di peta",
        type: "text",
      },
      {
        value: "d",
        content: "Ada dua bangunan yang berada di paling utara peta",
        type: "text",
      },
    ],
  },
  {
    content: `<p><strong>Perhatikan gambar di bawah ini!</strong></p>
    <p>&nbsp;</p>
    <p style="text-align: center;"><img src="https://idcopy.net/wp-content/uploads/2021/09/contoh-denah-lokasi.webp" alt="" width="400" height="" /></p>
    <p style="text-align: center;">&nbsp;</p>
    <p style="text-align: left;">Bangunan yang berada di paling utara adalah ?</p>`,
    type: "questioner",
    correctAnswer: [
      { sourceId: "1", value: "Setuju" },
      { sourceId: "2", value: "Tidak Setuju" },
    ],
    source: [
      {
        id: "1",
        content: "Pernyataan Pertama",
      },
      {
        id: "2",
        content: "Pernyataan Kedua",
      },
    ],
    option: [
      { value: "true", content: "Setuju" },
      {
        value: "false",
        content: "Tidak Setuju",
      },
    ],
  },
  {
    content: `<p><strong>Perhatikan gambar di bawah ini!</strong></p>
    <p>&nbsp;</p>
    <p style="text-align: center;"><img src="https://idcopy.net/wp-content/uploads/2021/09/contoh-denah-lokasi.webp" alt="" width="400" height="" /></p>
    <p style="text-align: center;">&nbsp;</p>
    <p style="text-align: left;">Bangunan yang berada di paling utara adalah ?</p>`,
    type: "questioner",
    correctAnswer: [
      { sourceId: "1", value: "Setuju" },
      { sourceId: "2", value: "Tidak Setuju" },
    ],
    source: [
      {
        id: "1",
        content: "Pernyataan Pertama",
      },
      {
        id: "2",
        content: "Pernyataan Kedua",
      },
    ],
    option: [
      { value: "true", content: "Setuju" },
      {
        value: "false",
        content: "Tidak Setuju",
      },
    ],
  },
  {
    content: `<p><strong>Perhatikan gambar di bawah ini!</strong></p>
    <p>&nbsp;</p>
    <p style="text-align: center;"><img src="https://idcopy.net/wp-content/uploads/2021/09/contoh-denah-lokasi.webp" alt="" width="400" height="" /></p>
    <p style="text-align: center;">&nbsp;</p>
    <p style="text-align: left;">Dari denah tersebut, coba pasangkan antara bangunan dengan jalannya masing-masing ?</p>`,
    type: "coupleing",
    correctAnswer: [
      { sourceId: "1", targetId: "1" },
      { sourceId: "2", targetId: "2" },
    ],
    source: [
      { value: "1", content: "Bangunan A" },
      { value: "2", content: "Bangunan B" },
    ],
    target: [
      { value: "1", content: "Jalan Peribaru" },
      { value: "2", content: "Jalan Prabandini" },
    ],
  },
  {
    content: `<p><strong>Perhatikan gambar di bawah ini!</strong></p>
    <p>&nbsp;</p>
    <p style="text-align: center;"><img src="https://idcopy.net/wp-content/uploads/2021/09/contoh-denah-lokasi.webp" alt="" width="400" height="" /></p>
    <p style="text-align: center;">&nbsp;</p>
    <p style="text-align: left;">Dari denah tersebut, coba pasangkan antara bangunan dengan jalannya masing-masing ?</p>`,
    type: "coupleing",
    correctAnswer: [
      { sourceId: "1", targetId: "1" },
      { sourceId: "2", targetId: "2" },
    ],
    source: [
      { value: "1", content: "Bangunan A" },
      { value: "2", content: "Bangunan B" },
    ],
    target: [
      { value: "1", content: "Jalan Peribaru" },
      { value: "2", content: "Jalan Prabandini" },
    ],
  },
  {
    content: `<p><strong>Perhatikan gambar di bawah ini!</strong></p>
    <p>&nbsp;</p>
    <p style="text-align: center;"><img src="https://idcopy.net/wp-content/uploads/2021/09/contoh-denah-lokasi.webp" alt="" width="400" height="" /></p>
    <p style="text-align: center;">&nbsp;</p>
    <p style="text-align: left;">Bangunan yang berada di bagian paling timur di jalan Raya Prabandini adalah ?</p>`,
    type: "short-answer",
    typeOfAnswer: "text",
    correctAnswer: ["Pabrik Gula"],
  },
  {
    content: `<p><strong>Perhatikan gambar di bawah ini!</strong></p>
    <p>&nbsp;</p>
    <p style="text-align: center;"><img src="https://idcopy.net/wp-content/uploads/2021/09/contoh-denah-lokasi.webp" alt="" width="400" height="" /></p>
    <p style="text-align: center;">&nbsp;</p>
    <p style="text-align: left;">Bangunan yang berada di bagian paling timur di jalan Raya Prabandini adalah ?</p>`,
    type: "short-answer",
    typeOfAnswer: "number",
    correctAnswer: [20],
  },
];

const quizDummy: IQuestionForm[] = [...multipleChoice];

export default quizDummy;
