import "./CountdownTimer.scss";

import { Trans } from "@lingui/macro";
import { Box, Typography } from "@material-ui/core";
import { FC, useEffect, useRef, useState } from "react";
import { subtractDates } from "src/helpers/timeUtil";

interface Timer {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

type CountdownProps = {
  endsAt: Date;
  timerTitle: string;
};

const CountdownTimer: FC<CountdownProps> = ({ endsAt, timerTitle }) => {
  const subtracted = subtractDates(endsAt, new Date(Date.now()));
  const [timer, setTimer] = useState<Timer>(subtracted.formatted);
  const timerInterval = useRef<NodeJS.Timeout>();

  // the seconds countdown timer...
  useEffect(() => {
    if (subtracted.secondsLeft > 0) {
      timerInterval.current = setInterval(() => {
        setTimer(subtracted.formatted);
      }, 1000);
      return () => clearInterval(timerInterval.current as NodeJS.Timeout);
    }
  }, [subtracted]);

  return (
    <>
      {subtracted.secondsLeft > 0 && (
        <>
          <Box alignSelf={`center`}>
            <Typography>{timerTitle}</Typography>
          </Box>
          <Box className="countdown-timer">
            <Box className="countdown-timer-unit">
              <Typography variant="h3">{timer.days}</Typography>
              <Typography>
                <Trans>day</Trans>
              </Typography>
            </Box>

            <Box className="countdown-timer-unit">
              <Typography variant="h3">{timer.hours}</Typography>
              <Typography>
                <Trans>hrs</Trans>
              </Typography>
            </Box>

            <Box className="countdown-timer-unit">
              <Typography variant="h3">{timer.minutes}</Typography>
              <Typography>
                <Trans>min</Trans>
              </Typography>
            </Box>
            <Box className="countdown-timer-unit">
              <Typography variant="h3">{timer.seconds}</Typography>
              <Typography>
                <Trans>sec</Trans>
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default CountdownTimer;
