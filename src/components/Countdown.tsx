import React, { useEffect, useState } from "react";

export default function Countdown({ minutes }: { minutes: number }) {
  const [timeLeft, setTimeLeft] = useState(minutes * 60); // convert ke detik

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div>
      {timeLeft > 0 ? (
        <span style={{ color: "black", fontWeight: "bold" }}>{formatTime(timeLeft)}</span>
      ) : (
        <span style={{ color: "red", fontWeight: "bold" }}>Time`s up!</span>
      )}
    </div>
  );
}
