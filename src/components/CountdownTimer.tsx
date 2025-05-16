
import React, { useState, useEffect } from "react";

type Props = {
  deadline: Date;
};

const CountdownTimer = ({ deadline }: Props) => {
  const calculateTimeLeft = () => {
    const difference = +deadline - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timerComponents = [];

  Object.keys(timeLeft).forEach(interval => {
    if (!timeLeft[interval]) return;
    timerComponents.push(
      <span key={interval}>{timeLeft[interval]} {interval} </span>,
    );
  });

  return <>{timerComponents.length ? timerComponents : <span>����� �����!</span>}</>;
};

export default CountdownTimer;



