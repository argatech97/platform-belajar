"use client";

import { useEffect, useState } from "react";

export function useTimer(duration: number, storageKey: string) {
  const [timeLeft, setTimeLeft] = useState<number>();

  useEffect(() => {
    const x = localStorage.getItem("timeLeft")
      ? JSON.parse(localStorage.getItem("timeLeft") || "0")
      : duration;
    setTimeLeft(x);
  }, [duration]);

  useEffect(() => {
    if (timeLeft !== undefined) {
      localStorage.setItem("timeLeft", JSON.stringify(timeLeft));
    }
  }, [timeLeft, storageKey]);

  return { timeLeft, setTimeLeft };
}
