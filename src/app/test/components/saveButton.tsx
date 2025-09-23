import React, { useState, useEffect } from "react";

type SaveButtonProps = {
  pembahasanId: string;
  questionId: string;
  onSuccess?: () => void;
  onError?: (err: Error) => void;
};

const SaveButton: React.FC<SaveButtonProps> = ({
  questionId,
  onSuccess,
  onError,
  pembahasanId,
}) => {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Cek localStorage saat mount atau ketika questionId berubah
  useEffect(() => {
    const savedQuestions = JSON.parse(
      localStorage.getItem(`${pembahasanId}-savedQuestion`) || "[]"
    );
    setSaved(savedQuestions.includes(questionId));
  }, [pembahasanId, questionId]);

  const handleClick = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token-platform-belajar");
      const user = JSON.parse(localStorage.getItem("user-platform-belajar") || "{}");

      if (!token || !user.no_identitas) {
        throw new Error("Token or user ID not found in localStorage");
      }

      const response = await fetch("/api/question/saved", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.no_identitas,
          question_id: questionId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save question");
      }

      const data = await response.json();

      // Ambil array dari localStorage
      let savedQuestions: string[] = JSON.parse(
        localStorage.getItem(`${pembahasanId}-savedQuestion`) || "[]"
      );

      if (data.isDeleted === false) {
        // Tambahkan questionId ke array jika belum ada
        if (!savedQuestions.includes(questionId)) {
          savedQuestions.push(questionId);
        }
        setSaved(true);
      } else if (data.isDeleted === true) {
        // Hapus questionId dari array
        savedQuestions = savedQuestions.filter((id) => id !== questionId);
        setSaved(false);
      }

      // Simpan kembali ke localStorage
      localStorage.setItem(`${pembahasanId}-savedQuestion`, JSON.stringify(savedQuestions));

      if (onSuccess) onSuccess();
    } catch (err) {
      if (onError) onError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        padding: "8px 16px",
        borderRadius: "5px",
        border: "none",
        color: "#fff",
        cursor: loading ? "not-allowed" : "pointer",
        backgroundColor: saved ? "#16a34a" : "#aba7a7ff",
        opacity: loading ? 0.7 : 1,
        transition: "background-color 0.3s ease",
      }}
    >
      {loading ? "Saving..." : saved ? "Pembahasan Disimpan" : "Simpan Pembahasan"}
    </button>
  );
};

export default SaveButton;
