import { ethers } from "ethers";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useWeb3Context } from "../../hooks";
import { Paper, Box, Typography } from "@material-ui/core";
import { POOL_GRAPH_URLS } from "../../constants";
import { subtractDates } from "src/helpers";

export const PoolPrize = () => {
  const { chainID } = useWeb3Context();
  // TODO: swap out hardcoded 4 for chainID when pool api available
  const [graphUrl, setGraphUrl] = useState(POOL_GRAPH_URLS[chainID]);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timer, setTimer] = useState();

  const poolAwardTimeRemaining = useSelector(state => {
    return state.app.pool && state.app.pool.awardPeriodRemainingSeconds;
  });

  const poolAwardBalance = useSelector(state => {
    return state.app.pool && state.app.pool.awardBalance;
  });

  const decreaseNum = () => setSecondsLeft(prev => prev - 1);

  let interval = useRef();

  useEffect(() => {
    setGraphUrl(POOL_GRAPH_URLS[chainID]);
  }, [chainID]);

  // the seconds countdown timer...
  useEffect(() => {
    const currentDate = new Date(Date.now());
    // multiply integerTimeRemaining by 1000 for milliseconds
    const futureDate = new Date(currentDate.getTime() + secondsLeft * 1000);

    const formatted = subtractDates(futureDate, currentDate);
    // NOTE (appleseed): PoolTogether uses the following boolean too
    // const timeRemaining = Boolean(days || hours || minutes || seconds);

    setTimer(formatted);

    if (secondsLeft > 0) {
      interval.current = setInterval(decreaseNum, 1000);
      return () => clearInterval(interval.current);
    }
  }, [secondsLeft]);

  useEffect(() => {
    if (parseInt(poolAwardTimeRemaining, 10) > 0) {
      setSecondsLeft(parseInt(poolAwardTimeRemaining, 10));
    }
  }, [poolAwardTimeRemaining]);

  return (
    <Box width="100%" display="flex" flexDirection="column" alignItems="center" className="pool-prize-card">
      <Box className="vegas-container">
        <Box className="vegas"></Box>
      </Box>
      <Paper className="ohm-card">
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box margin={2} textAlign="center">
            <Typography variant="h1">{poolAwardBalance} sOHM</Typography>
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
