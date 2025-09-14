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

  // Sinkronisasi kalau initialTime berubah
  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  // Interval jalan
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        const newValue = prev - 1;
        localStorage.setItem("timeLeft", `${newValue}`);
        return newValue;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [initialTime]); // restart kalau initialTime ganti

  // Trigger event
  useEffect(() => {
    if (timeLeft <= 0) {
      console.log("Countdown ended, calling onEnd");
      onEnd(timeLeft);
    } else {
      onChange?.(timeLeft);
    }
  }, [timeLeft, onEnd, onChange]);

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
