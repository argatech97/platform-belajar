"use client";
import { postRequest } from "@/helper/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface TestType {
  id: string;
  name: string;
}

interface ExamForm {
  name: string;
  parent_id?: string;
  live_at?: string;
  live_end?: string;
  test_type_id: string;
  jumlah_soal: number;
  durasi_seconds: number;
  point: number;
}

interface Exam extends ExamForm {
  id: string;
}

const ExamPage: React.FC = () => {
  const [testTypes, setTestTypes] = useState<TestType[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [form, setForm] = useState<ExamForm>({
    name: "",
    parent_id: "",
    live_at: "",
    live_end: "",
    test_type_id: "",
    jumlah_soal: 0,
    durasi_seconds: 0,
    point: 0,
  });
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState<Exam[]>([]);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const [token, setToken] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const token = localStorage.getItem("token-platform-belajar");
    setToken(token || "");
  }, []);

  // Fetch test types
  useEffect(() => {
    if (!token) return;
    fetch("/api/test/type", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok && res.status === 401) {
          router.push("/auth");
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setTestTypes(data.data.filter((el: TestType) => el.name !== "Pre Quiz"));
        const tryOut = data.data.find((t: TestType) => t.name === "Try Out");
        if (tryOut) setSelectedType(tryOut.id);
        else if (data.data.length > 0) setSelectedType(data.data[0].id);
      });
  }, [router, token]);

  // Fetch exams
  useEffect(() => {
    if (!selectedType || !token) return;
    fetch(`/api/test/type/${selectedType}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok && res.status === 401) {
          router.push("/auth");
          return;
        }
        return res.json();
      })
      .then((data) => setExams(data?.data ?? []));
  }, [router, selectedType, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await postRequest(
        "/test/create",
        {
          ...form,
          test_type_id: selectedType,
          jumlah_soal: Number(form.jumlah_soal),
          durasi_seconds: Number(form.durasi_seconds),
          point: Number(form.point), // ✅ tambahkan ini
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm({
        name: "",
        parent_id: "",
        live_at: "",
        live_end: "",
        test_type_id: "",
        jumlah_soal: 0,
        durasi_seconds: 0,
        point: 0,
      });
      setShowModal(false);
    } finally {
      setLoading(false);
      // Refresh exams list
      fetch(`/api/test/type/${selectedType}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setExams(data?.data ?? []));
    }
  };

  const styles = {
    container: { padding: "20px", fontFamily: "Arial, sans-serif", color: "#333" },
    select: {
      padding: "8px 12px",
      borderRadius: "6px",
      border: "1px solid #69CA87",
      outline: "none",
    },
    buttonPrimary: {
      backgroundColor: "#69CA87",
      color: "white",
      border: "none",
      padding: "10px 18px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: 600,
      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    },
    buttonSecondary: {
      backgroundColor: "#E6FFEE",
      border: "1px solid #69CA87",
      color: "#333",
      padding: "8px 14px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: 500,
    },
    table: {
      borderCollapse: "collapse" as const,
      width: "100%",
      marginTop: "16px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    },
    th: {
      backgroundColor: "#E6FFEE",
      padding: "10px",
      border: "1px solid #ccc",
      textAlign: "left" as const,
    },
    td: { padding: "8px", border: "1px solid #ccc" },
    modalOverlay: {
      position: "fixed" as const,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modal: {
      background: "white",
      padding: "24px",
      borderRadius: "10px",
      width: "420px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      animation: "fadeIn 0.3s ease",
    },
    input: {
      width: "100%",
      padding: "8px 10px",
      marginTop: "4px",
      marginBottom: "12px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      outline: "none",
    },
    label: { fontWeight: 600, fontSize: "14px", color: "#444" },
  };

  return (
    <div style={styles.container}>
      <h2 style={{ marginBottom: "16px" }}>Daftar Ujian</h2>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ marginRight: "8px", fontWeight: 600 }}>Jenis Ujian: </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={styles.select}
        >
          {testTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      <button onClick={() => setShowModal(true)} style={styles.buttonPrimary}>
        + Create Ujian
      </button>

      {/* Table Container */}
      <div
        style={{
          marginTop: "20px",
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          overflow: "hidden",
          padding: "16px",
          overflowX: "auto", // ✅ tambahkan ini
        }}
      >
        <table style={styles.table}>
          <thead>
            <tr style={{ backgroundColor: "#E6FFEE" }}>
              <th style={{ textAlign: "left", padding: "14px", fontWeight: 600 }}>Nama</th>
              <th style={{ textAlign: "left", padding: "14px", fontWeight: 600 }}>Parent ID</th>
              <th style={{ textAlign: "left", padding: "14px", fontWeight: 600 }}>Live At</th>
              <th style={{ textAlign: "left", padding: "14px", fontWeight: 600 }}>Live End</th>
              <th style={{ textAlign: "left", padding: "14px", fontWeight: 600 }}>Jenis</th>
              <th style={{ textAlign: "left", padding: "14px", fontWeight: 600 }}>Jumlah Soal</th>
              <th style={{ textAlign: "left", padding: "14px", fontWeight: 600 }}>
                Durasi (detik)
              </th>
              <th style={{ textAlign: "left", padding: "14px", fontWeight: 600 }}>Point</th>

              <th style={{ textAlign: "center", padding: "14px", fontWeight: 600 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {exams.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((exam, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: "14px" }}>{exam.name}</td>
                <td style={{ padding: "14px" }}>{exam.parent_id}</td>
                <td style={{ padding: "14px" }}>
                  {exam.live_at ? new Date(exam.live_at).toLocaleString("id-ID") : "-"}
                </td>
                <td style={{ padding: "14px" }}>
                  {exam.live_end ? new Date(exam.live_end).toLocaleString("id-ID") : "-"}
                </td>
                <td style={{ padding: "14px" }}>{exam.test_type_id}</td>
                <td style={{ padding: "14px" }}>{exam.jumlah_soal}</td>
                <td style={{ padding: "14px" }}>{exam.durasi_seconds}</td>
                <td style={{ padding: "14px" }}>{exam.point}</td>
                <td style={{ padding: "14px", textAlign: "center" }}>
                  <div style={{ display: "flex", flexWrap: "nowrap", gap: "10px" }}>
                    <button
                      style={{
                        backgroundColor: "#25639dff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        cursor: "pointer",
                      }}
                      onClick={() => window.open(`/test-dashboard/soal?id=${exam.id}`, "_blank")}
                    >
                      Edit
                    </button>
                    <button
                      style={{
                        backgroundColor: "#d94444ff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        cursor: "pointer",
                      }}
                      onClick={() => window.open(`/test-dashboard/soal?id=${exam.id}`, "_blank")}
                    >
                      Hapus
                    </button>
                    <button
                      style={{
                        backgroundColor: "#69CA87",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        cursor: "pointer",
                      }}
                      onClick={() => window.open(`/test-dashboard/soal?id=${exam.id}`, "_blank")}
                    >
                      Buat Soal
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {Array.from({ length: Math.ceil(exams.length / pageSize) }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: currentPage === i + 1 ? "1px solid #69CA87" : "1px solid #ccc",
                backgroundColor: currentPage === i + 1 ? "#E6FFEE" : "white",
                cursor: "pointer",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={{ marginBottom: "16px" }}>Buat Ujian</h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label style={styles.label}>Nama Ujian (wajib)</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>

              <div>
                <label style={styles.label}>Parent ID (opsional)</label>
                <input
                  type="text"
                  name="parent_id"
                  value={form.parent_id}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div>
                <label style={styles.label}>Live At (opsional)</label>
                <input
                  type="datetime-local"
                  name="live_at"
                  value={form.live_at}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div>
                <label style={styles.label}>Live End (opsional)</label>
                <input
                  type="datetime-local"
                  name="live_end"
                  value={form.live_end}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div>
                <label style={styles.label}>Jumlah Soal (wajib)</label>
                <input
                  type="number"
                  name="jumlah_soal"
                  value={form.jumlah_soal}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>

              <div>
                <label style={styles.label}>Durasi (detik) (wajib)</label>
                <input
                  type="number"
                  name="durasi_seconds"
                  value={form.durasi_seconds}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>

              <div>
                <label style={styles.label}>Point (optional)</label>
                <input
                  type="number"
                  name="point"
                  value={form.point}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={styles.buttonSecondary}
                >
                  Batal
                </button>
                <button type="submit" disabled={loading} style={styles.buttonPrimary}>
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamPage;
