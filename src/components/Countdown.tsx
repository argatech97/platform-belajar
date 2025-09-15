import React, { useEffect, useRef, useState } from "react";

export default function Countdown({
  initialTime,
  onEnd,
  onChange,
  isStopTimer,
}: {
  isStopTimer?: boolean;
  initialTime: number;
  onEnd: (timeLeft: number) => Promise<void>;
  onChange?: (timeLeft: number) => void;
}) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sinkronisasi kalau initialTime berubah
  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (isStopTimer && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [isStopTimer]);

  // Interval jalan
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1 && timerRef.current) {
          clearInterval(timerRef.current);
          return 0;
        }
        const newValue = prev - 1;
        localStorage.setItem("timeLeft", `${newValue}`);
        return newValue;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [initialTime]); // restart kalau initialTime ganti

  // Trigger event
  useEffect(() => {
    if (timeLeft <= 0) {
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
