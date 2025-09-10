import React, { useEffect, useState } from "react";

export default function Countdown({
  initialTime,
  onEnd,
  onChange,
}: {
  initialTime: number;
  onEnd: (timeLeft: number) => Promise<void>;
  onChange?: (timeLeft: number) => void;
}) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(timer);
        return;
      } else {
        const newValue = timeLeft - 1;
        localStorage.setItem("timeLeft", `${newValue}`);
        setTimeLeft(newValue);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onEnd, onChange]);

  useEffect(() => {
    if (timeLeft <= 0) {
      console.log("Countdown ended, calling onEnd");
      onEnd(timeLeft);
      return;
    }
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
