import React, { useEffect, useState } from "react";

export default function Countdown({
  timeLeft,
  onEnd,
  onChange,
}: {
  timeLeft: number;
  onEnd: (timeLeft: number) => Promise<void>;
  onChange: (timeLeft: number) => void;
}) {
  useEffect(() => {
    if (timeLeft <= 0) {
      onEnd(timeLeft);
      return;
    }

    const timer = setInterval(() => {
      const newValue = timeLeft - 1;
      localStorage.setItem("timeLeft", `${newValue}`);
      onChange(newValue);
    }, 1000);

    return () => clearInterval(timer);
  }, [onChange, onEnd, timeLeft]);

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
