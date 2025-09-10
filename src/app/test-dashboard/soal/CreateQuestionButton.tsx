"use client";
import React, { useEffect, useState } from "react";

interface Option {
  id: string;
  name: string;
}

const CreateQuestionButton: React.FC<{ testId: string; token: string; onSuccess: () => void }> = ({
  testId,
  token,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [domains, setDomains] = useState<Option[]>([]);
  const [subDomains, setSubDomains] = useState<Option[]>([]);
  const [kompetensis, setKompetensis] = useState<Option[]>([]);
  const [questionTypes, setQuestionTypes] = useState<Option[]>([]);

  const [form, setForm] = useState({
    question: "",
    content_id: "",
    domain_id: "",
    sub_domain_id: "",
    kompetensi_id: "",
    question_type_id: "",
    data: "",
  });

  // fetch options when modal open
  useEffect(() => {
    if (!open) return;

    const headers = { Authorization: `Bearer ${token}` };

    fetch("/api/learning/domain", { headers })
      .then((res) => res.json())
      .then((data) => setDomains(data));

    fetch("/api/learning/sub-domain", { headers })
      .then((res) => res.json())
      .then((data) => setSubDomains(data));

    fetch("/api/learning/kompetensi", { headers })
      .then((res) => res.json())
      .then((data) => setKompetensis(data));

    fetch("/api/question/type", { headers })
      .then((res) => res.json())
      .then((data) => setQuestionTypes(data.data ?? []));
  }, [open, token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/question/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ test_id: testId, ...form }),
      });
      onSuccess();
      setOpen(false);
      setForm({
        question: "",
        content_id: "",
        domain_id: "",
        sub_domain_id: "",
        kompetensi_id: "",
        question_type_id: "",
        data: "",
      });
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
                    height: "100px",
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

export default CreateQuestionButton;
