import React, { useEffect, useState } from "react";

export default function Countdown({
  initialTime,
  onEnd,
}: {
  initialTime: number;
  onEnd: (timeLeft: number) => void;
}) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      const newValue = timeLeft - 1;
      localStorage.setItem("timeLeft", `${newValue}`);
      setTimeLeft(newValue);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onEnd]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onEnd(timeLeft);
      return;
    }
  }, [onEnd, timeLeft]);

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
