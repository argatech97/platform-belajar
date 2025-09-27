import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

type Message = {
  id: string; // unique id tiap message
  role: "user" | "assistant"; // siapa yang mengirim: user atau AI
  text: string; // isi pesan / jawaban
};

export const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const green = "rgb(105, 202, 135)";

  // Cek apakah teks mengandung LaTeX
  const isLatex = /\\\[|\\\]|\\\(|\\\)/.test(message.text);

  // Jika ada campuran teks biasa + LaTeX (\[...\] atau \( ... \)), split supaya render rapi
  const renderMessage = () => {
    if (!isLatex) return message.text;

    // Split teks menjadi bagian rumus dan teks biasa
    const parts = message.text.split(/(\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\))/g);
    return parts.map((part, idx) => {
      if (part.startsWith("\\[") && part.endsWith("\\]")) {
        return <BlockMath key={idx} math={part.replace(/\\\[|\\\]/g, "").trim()} />;
      } else if (part.startsWith("\\(") && part.endsWith("\\)")) {
        return <InlineMath key={idx} math={part.replace(/\\\(|\\\)/g, "").trim()} />;
      } else {
        return <span key={idx}>{part}</span>; // teks biasa tetap tampil
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: message.role === "user" ? "flex-end" : "flex-start",
        marginBottom: "0.8rem",
      }}
    >
      <div
        style={{
          background: message.role === "user" ? green : "#f0fdf4",
          color: message.role === "user" ? "white" : "#1b4332",
          padding: "10px 14px",
          borderRadius: 16,
          maxWidth: "75%",
          whiteSpace: "pre-wrap",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {renderMessage()}
      </div>
    </div>
  );
};
