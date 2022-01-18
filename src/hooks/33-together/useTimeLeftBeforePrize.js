import { addSeconds } from "date-fns";
import { useInterval } from "lib/hooks/useInterval";
import { usePoolChainValues } from "lib/hooks/usePoolChainValues";
import { subtractDates } from "lib/utils/subtractDates";
import { useEffect, useState } from "react";

export const useTimeLeftBeforePrize = () => {
  const { data: poolChainValues } = usePoolChainValues();
  const poolValueSecondsLeft = parseInt(poolChainValues.prize.prizePeriodRemainingSeconds.toString(), 10);
  const [secondsLeft, setSecondsLeft] = useState(poolValueSecondsLeft);

  useEffect(() => {
    if (poolValueSecondsLeft > secondsLeft) {
      setSecondsLeft(poolValueSecondsLeft);
    }
  }, [poolValueSecondsLeft]);

  useInterval(() => {
    const newRemainder = secondsLeft - 1;
    if (newRemainder >= 0) {
      setSecondsLeft(newRemainder);
    }
  }, 1000);

  const currentDate = new Date(Date.now());
  const futureDate = addSeconds(currentDate, secondsLeft);

  const { days, hours, minutes, seconds } = subtractDates(futureDate, currentDate);
  const timeRemaining = Boolean(days || hours || minutes || seconds);
  return { days, hours, minutes, seconds, timeRemaining };
};
