/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";

const UploadImageDialog: React.FC<{ testId: string; onSuccess: () => void }> = ({
  testId,
  onSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Pilih file terlebih dahulu");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token-platform-belajar");
      const formData = new FormData();
      formData.append("name", name);
      formData.append("parent_id", testId);
      formData.append("image", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Upload gagal");

      alert("Upload berhasil 🎉");
      onSuccess();
      setIsOpen(false);
      setName("");
      setFile(null);
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Tombol buka modal */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Upload Image
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Upload Image</h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label>Nama Gambar</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: "5px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label>Pilih File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const selectedFile = e.target.files ? e.target.files[0] : null;
                    if (selectedFile) {
                      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
                      const maxSize = 100 * 1024; // 50KB

                      if (!allowedTypes.includes(selectedFile.type)) {
                        alert("Hanya file JPG, JPEG, atau PNG yang diperbolehkan");
                        e.target.value = ""; // reset input
                        setFile(null);
                        return;
                      }

                      if (selectedFile.size > maxSize) {
                        alert("Ukuran file maksimal 50KB");
                        e.target.value = ""; // reset input
                        setFile(null);
                        return;
                      }

                      setFile(selectedFile);
                    } else {
                      setFile(null);
                    }
                  }}
                  style={{ display: "block", marginTop: "5px" }}
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    marginRight: "10px",
                    padding: "8px 15px",
                    backgroundColor: "#6c757d",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "8px 15px",
                    backgroundColor: loading ? "#ccc" : "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadImageDialog;
