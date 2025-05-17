import React, { useEffect, useState, useRef } from "react";

type TimerProps = {
  initialSeconds: number;
  onComplete?: () => void;
};

const Timer: React.FC<TimerProps> = ({ initialSeconds, onComplete }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const completedRef = useRef(false);

  useEffect(() => {
    setSeconds(initialSeconds);
    completedRef.current = false;
  }, [initialSeconds]);

  useEffect(() => {
    if (seconds <= 0) {
      if (!completedRef.current && onComplete) {
        completedRef.current = true;
        onComplete();
      }
      return;
    }
    const interval = setInterval(() => {
      setSeconds(s => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, onComplete]);

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