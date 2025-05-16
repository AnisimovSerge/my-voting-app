import React, { useEffect, useState } from "react";

const Timer: React.FC<{ initialSeconds: number }> = ({ initialSeconds }) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (seconds <= 0) return;
    const interval = setInterval(() => {
      setSeconds(s => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const min = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const sec = (seconds % 60).toString().padStart(2, "0");

  return (
    <span style={{ fontWeight: 700, fontSize: 28, color: "#03a9f4" }}>
      {min}:{sec}
    </span>
  );
};

export default Timer;