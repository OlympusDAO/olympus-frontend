import React, { useEffect, useState } from "react";

type CountdownProps = {
  targetDate: Date;
};

const CountdownTimer: React.FC<CountdownProps> = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();
    let timeLeft = { hours: 0, minutes: 0 };

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000);

    return () => clearTimeout(timer);
  });

  return (
    <>
      {timeLeft.hours > 0 || timeLeft.minutes > 0 ? (
        <>
          in {timeLeft.hours} hours, {timeLeft.minutes} minutes
        </>
      ) : (
        <> in 0 hours, 0 minutes</>
      )}
    </>
  );
};

export default CountdownTimer;
