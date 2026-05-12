"use client";

import { useEffect, useState } from "react";

export default function Timer({ duration }: { duration: number }) {
  const [time, setTime] = useState(duration * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="text-lg font-semibold">
      ⏱ {minutes}:{seconds.toString().padStart(2, "0")}
    </div>
  );
}