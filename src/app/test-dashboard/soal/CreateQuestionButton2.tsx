/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";

interface Option {
  id: string;
  name: string;
}

interface Props {
  testId: string;
  token: string;
  domains: Option[];
  subDomains: Option[];
  kompetensis: Option[];
  questionTypes: Option[];
  onSuccess: () => void;
}

const CreateQuestionButton2: React.FC<Props> = ({
  testId,
  token,
  domains,
  subDomains,
  kompetensis,
  questionTypes,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    question: "",
    pembahasan: "", // ✅ tambahkan field pembahasan
    content_id: "",
    domain_id: "",
    sub_domain_id: "",
    kompetensi_id: "",
    question_type_id: "",
    data: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "question_type_id") {
      // cari nama question type dari props
      const qType = questionTypes.find((qt) => qt.id === value);

      let defaultData: any = "";

      switch (qType?.name.toLowerCase()) {
        case "multiple-choice":
          defaultData = {
            correctAnswer: "",
            option: [
              { value: "a", content: "", type: "text" },
              { value: "b", content: "", type: "text" },
              { value: "c", content: "", type: "text" },
              { value: "d", content: "", type: "text" },
            ],
          };
          break;

        case "multiple-select":
          defaultData = {
            correctAnswer: [],
            option: [
              { value: "a", content: "", type: "text" },
              { value: "b", content: "", type: "text" },
              { value: "c", content: "", type: "text" },
              { value: "d", content: "", type: "text" },
            ],
          };
          break;

        case "short-answer":
          defaultData = {
            typeOfAnswer: "",
            correctAnswer: [],
          };
          break;

        case "coupleing":
          defaultData = {
            source: [
              { value: "", content: "" },
              { value: "", content: "" },
              { value: "", content: "" },
            ],
            target: [
              { value: "", content: "" },
              { value: "", content: "" },
              { value: "", content: "" },
              { value: "", content: "" },
            ],
            correctAnswer: [
              { sourceId: "", targetId: "" },
              { sourceId: "", targetId: "" },
              { sourceId: "", targetId: "" },
            ],
          };
          break;

        case "questioner":
          defaultData = {
            source: [
              { value: "a", content: "" },
              { value: "b", content: "" },
            ],
            target: [
              { value: "1", content: "Benar" },
              { value: "0", content: "Salah" },
            ],
            correctAnswer: [
              { sourceId: "a", targetId: "" },
              { sourceId: "b", targetId: "" },
            ],
          };
          break;
      }

      setForm((prev) => ({
        ...prev,
        [name]: value,
        data: JSON.stringify(defaultData, null, 2), // biar tampil lebih rapi di textarea
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ambil label berdasarkan id
      const domain = domains.find((d) => d.id === form.domain_id);
      const subDomain = subDomains.find((sd) => sd.id === form.sub_domain_id);
      const kompetensi = kompetensis.find((k) => k.id === form.kompetensi_id);
      const qType = questionTypes.find((qt) => qt.id === form.question_type_id);

      const payload = {
        test_id: testId,
        ...form,
        domain_name: domain?.name || "",
        sub_domain_name: subDomain?.name || "",
        kompetensi_name: kompetensi?.name || "",
        question_type_name: qType?.name || "",
      };

      const res = await fetch("/api/question/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert(`${res.status}: ${res.statusText}`);
        return;
      }

      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          backgroundColor: "#69CA87",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "8px 14px",
          cursor: "pointer",
          marginBottom: "12px",
        }}
      >
        + Create Question
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "700px",
              maxHeight: "90%",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <h3 style={{ margin: 0 }}>Buat Soal</h3>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div>
                <label>Pertanyaan</label>
                <textarea
                  name="question"
                  value={form.question}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    height: "100px",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    resize: "vertical",
                  }}
                  required
                />
              </div>

              <div>
                <label>Content ID</label>
                <input
                  type="text"
                  name="content_id"
                  value={form.content_id}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              <div>
                <label>Domain</label>
                <select
                  name="domain_id"
                  value={form.domain_id}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                  required
                >
                  <option value="">Pilih Domain</option>
                  {domains.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Sub Domain</label>
                <select
                  name="sub_domain_id"
                  value={form.sub_domain_id}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                  required
                >
                  <option value="">Pilih Sub Domain</option>
                  {subDomains.map((sd) => (
                    <option key={sd.id} value={sd.id}>
                      {sd.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Kompetensi</label>
                <select
                  name="kompetensi_id"
                  value={form.kompetensi_id}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                  required
                >
                  <option value="">Pilih Kompetensi</option>
                  {kompetensis.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Jenis Soal</label>
                <select
                  name="question_type_id"
                  value={form.question_type_id}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                  required
                >
                  <option value="">Pilih Jenis Soal</option>
                  {questionTypes.map((qt) => (
                    <option key={qt.id} value={qt.id}>
                      {qt.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Data</label>
                <textarea
                  name="data"
                  value={form.data}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    height: "200px",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* ✅ Field Pembahasan */}
              <div>
                <label>Pembahasan</label>
                <textarea
                  name="pembahasan"
                  value={form.pembahasan}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    height: "200px",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    resize: "vertical",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  style={{
                    backgroundColor: "#E6FFEE",
                    border: "1px solid #69CA87",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: "#69CA87",
                    color: "white",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateQuestionButton2;
