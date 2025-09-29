"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import { MessageBubble } from "./components/MessageBubble";
import Container from "@/components/Container";
import BackNavigation from "@/components/BackNavigation";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: String(Date.now()) + "-u",
      role: "user",
      text: trimmed,
    };

    setInput("");

    // Tambahkan placeholder loading
    const loadingMessage: Message = {
      id: String(Date.now()) + "-loading",
      role: "assistant",
      text: "Menulis jawaban...",
    };
    setMessages((m) => [...m, userMessage, loadingMessage]);
    setLoading(true);

    try {
      const res = await fetch("/next-api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "OpenAI request failed");
      }

      const data = await res.json();
      const assistantMessage: Message = {
        id: String(Date.now()) + "-a",
        role: "assistant",
        text: data.reply || "(tidak ada balasan)",
      };

      // Ganti message loading dengan jawaban asli
      setMessages((m) => m.map((msg) => (msg.id === loadingMessage.id ? assistantMessage : msg)));
    } catch (e: any) {
      const errMessage: Message = {
        id: String(Date.now()) + "-err",
        role: "assistant",
        text: `⚠️ Terjadi kesalahan: ${e.message ?? e}`,
      };
      setMessages((m) => m.map((msg) => (msg.id === loadingMessage.id ? errMessage : msg)));
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const green = "rgb(105, 202, 135)";

  return (
    <Container>
      {/* Header */}
      <BackNavigation label={"Tanya Jawab Soal"} />

      {/* Chat Area */}
      <div
        ref={chatRef}
        style={{
          flex: 1,
          padding: "1rem",
          backgroundColor: "white",
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {
              <p style={{ color: "#666", textAlign: "center", marginTop: "2rem" }}>
                Tanyakan tentang soal apa saja, akan bantu saya menjawabnya ✨
              </p>
            }
          </div>
        )}

        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
      </div>

      {/* Input Area */}
      <div
        style={{
          borderTop: "1px solid #ddd",
          padding: "0.8rem",
          backgroundColor: "white",
          display: "flex",
          gap: "0.5rem",
          position: "sticky",
          bottom: 0,
          left: 0,
        }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ketik pertanyaanmu di sini..."
          style={{
            flex: 1,
            minHeight: 60,
            padding: "0.6rem",
            resize: "none",
            borderRadius: 8,
            border: "1px solid #ccc",
            fontSize: "0.95rem",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            backgroundColor: green,
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "0 1rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading ? "..." : "Kirim"}
        </button>
      </div>
    </Container>
  );
}
