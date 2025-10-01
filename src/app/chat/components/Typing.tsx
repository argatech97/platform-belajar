"use client";
import React, { useEffect, useState } from "react";

export const TypingDots: React.FC = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return <span style={{ fontStyle: "italic", color: "#888" }}>Menulis jawaban{dots}</span>;
};
