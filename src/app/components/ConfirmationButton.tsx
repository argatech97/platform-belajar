import React, { useState } from "react";

interface ConfirmationButtonProps {
  onConfirm: () => Promise<void>;
  label: string; // label default tombol
  loadingLabel?: string; // label saat request
  confirmLabel?: string; // label tombol konfirmasi di dialog
  cancelLabel?: string; // label tombol batal di dialog
  confirmMessage?: string; // pesan di dalam dialog
}

const ConfirmationButton: React.FC<ConfirmationButtonProps> = ({
  onConfirm,
  label,
  loadingLabel = "Mengirim...",
  confirmLabel = "Ya",
  cancelLabel = "Batal",
  confirmMessage = "Apakah Anda yakin?",
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      await onConfirm();
    } finally {
      setIsSubmitting(false);
      setShowDialog(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowDialog(true)}
        disabled={isSubmitting}
        style={{
          padding: "10px 20px",
          borderRadius: "5px",
          backgroundColor: isSubmitting ? "#aaa" : "rgb(105, 202, 135)",
          color: "white",
          border: "none",
          cursor: isSubmitting ? "not-allowed" : "pointer",
        }}
      >
        {isSubmitting ? loadingLabel : label}
      </button>

      {showDialog && !isSubmitting && (
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
              background: "white",
              padding: "20px",
              borderRadius: "5px",
              textAlign: "center",
              width: "300px",
            }}
          >
            <p>{confirmMessage}</p>
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <button
                onClick={() => setShowDialog(false)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  backgroundColor: "#ccc",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {cancelLabel}
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  backgroundColor: "#28a745",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmationButton;
