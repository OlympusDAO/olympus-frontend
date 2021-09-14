import { ethers } from "ethers";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useWeb3Context } from "../../hooks";
import { listenAndHandleRNGStartEvent } from "../../helpers/33Together.js";
import { Paper, Box, Typography, Button } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import { POOL_GRAPH_URLS } from "../../constants";
import { trim, subtractDates } from "src/helpers";

export const PoolPrize = () => {
  const { provider, chainID } = useWeb3Context();
  const [graphUrl, setGraphUrl] = useState(POOL_GRAPH_URLS[chainID]);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timer, setTimer] = useState(null);
  const [rngStarted, setRngStarted] = useState(false);
  const [showAwardStart, setShowAwardStart] = useState(false);

  const isAppLoading = useSelector(state => state.app.loading ?? true);

  const poolAwardTimeRemaining = useSelector(state => {
    return state.app.pool && state.app.pool.awardPeriodRemainingSeconds;
  });

  const poolAwardBalance = useSelector(state => {
    return state.app.pool && state.app.pool.awardBalance;
  });

  const poolIsLocked = useSelector(state => {
    return state.app.pool && state.app.pool.isRngRequested;
  });

  // TODO (appleseed): finish these buttons
  const handleStartAward = () => {
    console.log("run Start Award on contract");
  };

  // TODO (appleseed): finish these buttons
  const handleCompleteAward = () => {
    console.log("run Complete Award on contract");
  };

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

    if (
      poolIsLocked === false &&
      poolAwardTimeRemaining &&
      parseInt(poolAwardTimeRemaining, 10) > 0 &&
      secondsLeft <= 0
    ) {
      // Time has ticked down.
      // There is no time left, attach RNG (Award) Start listener
      setShowAwardStart(true);
      listenAndHandleRNGStartEvent(provider, chainID, secondsLeft, () => {
        setRngStarted(true);
      });
    }
    if (secondsLeft > 0) {
      interval.current = setInterval(decreaseNum, 1000);
      return () => clearInterval(interval.current);
    }
  }, [secondsLeft]);

  useEffect(() => {
    if (poolIsLocked) {
      // timer doesn't matter
    } else if (parseInt(poolAwardTimeRemaining, 10) > 0) {
      setSecondsLeft(parseInt(poolAwardTimeRemaining, 10));
    } else if (parseInt(poolAwardTimeRemaining, 10) <= 0) {
      console.log("setting");
      // There is no time left, attach RNG (Award) Start listener
      setShowAwardStart(true);
      listenAndHandleRNGStartEvent(provider, chainID, 0, () => {
        setRngStarted(true);
      });
    }
  }, [poolAwardTimeRemaining, poolIsLocked]);

  return (
    <Box width="100%" display="flex" flexDirection="column" alignItems="center" className="pool-prize-card">
      <Box className="vegas-container">
        <Box className="vegas"></Box>
      </Box>
      <Paper className="ohm-card">
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box margin={2} textAlign="center">
            <Typography variant="h1">{trim(poolAwardBalance, 2)} sOHM</Typography>
            <Typography variant="h4">Current Prize</Typography>
          </Box>
          {poolIsLocked ? (
            <Typography variant="h6">Prize is being awarded</Typography>
          ) : (
            <Typography variant="h6">Next award</Typography>
          )}
          <Box className="pool-timer">
            {timer && poolIsLocked !== true && (
              <>
                <Box className="pool-timer-unit">
                  <Typography variant="h3">{isAppLoading ? <Skeleton width={20} /> : timer.days}</Typography>
                  <Typography>day</Typography>
                </Box>

                <Box className="pool-timer-unit">
                  <Typography variant="h3">{isAppLoading ? <Skeleton width={20} /> : timer.hours}</Typography>
                  <Typography>hrs</Typography>
                </Box>

                <Box className="pool-timer-unit">
                  <Typography variant="h3">{isAppLoading ? <Skeleton width={20} /> : timer.minutes}</Typography>
                  <Typography>min</Typography>
                </Box>
                <Box className="pool-timer-unit">
                  <Typography variant="h3">{isAppLoading ? <Skeleton width={20} /> : timer.seconds}</Typography>
                  <Typography>sec</Typography>
                </Box>
              </>
            )}
          </Box>

          {/* Timer won't show when poolIsLocked */}
          {poolIsLocked && (
            <Box margin={2} display="flex" style={{ flexDirection: "column", gap: 4, justifyContent: "center" }}>
              <Typography variant="h6" color="textSecondary">
                Click 'Complete Award' to distribute and start a new prize period
              </Typography>
              <Button
                id="pool-complete-award-button"
                variant="contained"
                color="primary"
                onClick={handleCompleteAward}
                style={{ alignSelf: "center" }}
              >
                Complete Award
              </Button>
            </Box>
          )}

          {/* Timer still shows (0s) for poolIsLocked === false */}
          {poolIsLocked === false && showAwardStart && (
            <Box margin={2} display="flex" style={{ flexDirection: "column", gap: 4, justifyContent: "center" }}>
              <Typography variant="h6" color="textSecondary">
                Award period has finished, click 'Start Award' to begin distribution
              </Typography>
              <Button
                id="pool-start-award-button"
                variant="contained"
                color="primary"
                onClick={handleStartAward}
                style={{ alignSelf: "center" }}
              >
                Start Award
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
