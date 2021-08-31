import { useState, useEffect, useRef } from "react";
import { useWeb3Context } from "../../hooks";
import { Paper, Box, Typography } from "@material-ui/core";
import { POOL_GRAPH_URLS } from "../../constants";
import { poolTimeQuery } from "./poolData.js";
import { apolloExt } from "../../lib/apolloClient";
import { poolDataQuery } from "./poolData.js";
import { trim, getDateFromSeconds, subtractDates } from "src/helpers";

// TODO: Add countdown timer functionality using prizePeriodSeconds, prizePeriodEndAt from apollo
const timerFormat = time => {
  // parse epoch time into hr/min/sec and return
};

export const PoolPrize = () => {
  const { chainID } = useWeb3Context();
  // TODO: swap out hardcoded 4 for chainID when pool api available
  const [graphUrl, setGraphUrl] = useState(POOL_GRAPH_URLS[chainID]);
  const [prize, setPrize] = useState(0);
  const [loading, setLoading] = useState(true);
  const [endTime, setEndTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timer, setTimer] = useState();

  const decreaseNum = () => setTimer(prev => prev - 1);

  let interval = useRef();

  useEffect(() => {
    setGraphUrl(POOL_GRAPH_URLS[chainID]);
  }, [chainID]);

  useEffect(() => {
    apolloExt(poolDataQuery, graphUrl).then(r => {
      let data = r.data.prizePool;
      if (data) {
        let stratData = r.data.prizePool.prizeStrategy.multipleWinners;
        let endTime = stratData.prizePeriodEndAt;
        let startTime = stratData.pprizePeriodStartedAt;

        setEndTime(endTime);
        setStartTime(startTime);

        let e = getDateFromSeconds(endTime);
        let s = getDateFromSeconds(startTime);
        let currentTime = endTime - startTime;
        let formatted = subtractDates(e, s);

        console.log("prize period started at: ", startTime, s);
        console.log("prize period ends at: ", endTime, e);
        console.log("current prize timer -- ", currentTime);
        console.log("formatted prize timmer: ", formatted);

        setSecondsLeft(currentTime);
        setTimer(formatted);

        const gross = data.cumulativePrizeGross / 1_000_000_000;
        const net = data.cumulativePrizeNet / 1_000_000_000;
        const prize = data.cumulativePrizeReserveFee;
        const currentPrize = net - gross; // dont think this is correct
        console.log(prize, currentPrize);
        setPrize(trim(currentPrize, 2));
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (secondsLeft > 0) {
      interval.current = setInterval(decreaseNum, 1000);
      return () => clearInterval(interval.current);
    }
  }, [secondsLeft]);

  return (
    <Box width="100%" display="flex" flexDirection="column" alignItems="center" className="pool-prize-card">
      <Box className="vegas-container">
        <Box className="vegas"></Box>
      </Box>
      <Paper className="ohm-card">
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box margin={2} textAlign="center">
            <Typography variant="h1">{prize && prize} sOHM</Typography>
            <Typography variant="h4">Current Prize</Typography>
          </Box>
          <Typography variant="h6">Next award</Typography>
          <Box className="pool-timer">
            {timer && (
              <>
                <Box className="pool-timer-unit">
                  <Typography variant="h3">{timer.days}</Typography>
                  <Typography>day</Typography>
                </Box>

                <Box className="pool-timer-unit">
                  <Typography variant="h3">{timer.hours}</Typography>
                  <Typography>hrs</Typography>
                </Box>

                <Box className="pool-timer-unit">
                  <Typography variant="h3">{timer.minutes}</Typography>
                  <Typography>min</Typography>
                </Box>
                <Box className="pool-timer-unit">
                  <Typography variant="h3">{timer.seconds}</Typography>
                  <Typography>sec</Typography>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
