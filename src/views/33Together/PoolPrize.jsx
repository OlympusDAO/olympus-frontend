import { ethers } from "ethers";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useWeb3Context } from "../../hooks";
import { listenAndHandleRNGStartEvent } from "../../helpers/33Together.js";
import { awardProcess } from "../../slices/PoolThunk";

import { Paper, Box, Typography, Button } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import { POOL_GRAPH_URLS } from "../../constants";
import { trim, subtractDates } from "src/helpers";

export const PoolPrize = () => {
  const { provider, chainID } = useWeb3Context();
  const dispatch = useDispatch();

  const [graphUrl, setGraphUrl] = useState(POOL_GRAPH_URLS[chainID]);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timer, setTimer] = useState(null);
  const [rngStarted, setRngStarted] = useState(false);
  const [showAwardStart, setShowAwardStart] = useState(false);

  const isPoolLoading = useSelector(state => state.poolData.loading ?? true);

  const poolAwardTimeRemaining = useSelector(state => {
    return state.poolData && state.poolData.awardPeriodRemainingSeconds;
  });

  const poolAwardBalance = useSelector(state => {
    return state.poolData && state.poolData.awardBalance;
  });

  const poolIsLocked = useSelector(state => {
    return state.poolData && state.poolData.isRngRequested;
  });

  const isRngTimedOut = useSelector(state => {
    return state.poolData && state.poolData.isRngTimedOut;
  });

  // TODO (appleseed): finish these buttons
  const handleAward = async action => {
    console.log(`run ${action} on pool`);
    await dispatch(awardProcess({ action, provider, networkID: chainID }));
  };

  const decreaseNum = () => {
    if (secondsLeft <= 1) {
      console.log("debugging, set startlistener", poolAwardTimeRemaining, secondsLeft);
      // Time has ticked down.
      // There is no time left, attach RNG (Award) Start listener
      setShowAwardStart(true);
      listenAndHandleRNGStartEvent(provider, chainID, secondsLeft, () => {
        setRngStarted(true);
      });
    }
    setSecondsLeft(prev => prev - 1);
  };

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
    if (poolIsLocked) {
      // timer doesn't matter
    } else if (parseInt(poolAwardTimeRemaining, 10) > 0) {
      setSecondsLeft(parseInt(poolAwardTimeRemaining, 10));
    } else if (parseInt(poolAwardTimeRemaining, 10) <= 0) {
      console.log("setting start listener");
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
          {parseFloat(poolAwardBalance) === 0 ? (
            <Box margin={2} textAlign="center">
              <Typography variant="h3">Pool Award Balance is currently 0.</Typography>
              <Typography variant="h4">Award Balance will grow at 1st rebase.</Typography>
            </Box>
          ) : (
            <Box margin={2} textAlign="center">
              <Typography variant="h1">{trim(poolAwardBalance, 2)} sOHM</Typography>
              <Typography variant="h4">Current Prize</Typography>
            </Box>
          )}
          {poolIsLocked ? (
            <Typography variant="h6">Prize is being awarded</Typography>
          ) : (
            <Typography variant="h6">Next award</Typography>
          )}
          <Box className="pool-timer">
            {timer && poolIsLocked !== true && (
              <>
                <Box className="pool-timer-unit">
                  <Typography variant="h3">{isPoolLoading ? <Skeleton width={20} /> : timer.days}</Typography>
                  <Typography>day</Typography>
                </Box>

                <Box className="pool-timer-unit">
                  <Typography variant="h3">{isPoolLoading ? <Skeleton width={20} /> : timer.hours}</Typography>
                  <Typography>hrs</Typography>
                </Box>

                <Box className="pool-timer-unit">
                  <Typography variant="h3">{isPoolLoading ? <Skeleton width={20} /> : timer.minutes}</Typography>
                  <Typography>min</Typography>
                </Box>
                <Box className="pool-timer-unit">
                  <Typography variant="h3">{isPoolLoading ? <Skeleton width={20} /> : timer.seconds}</Typography>
                  <Typography>sec</Typography>
                </Box>
              </>
            )}
          </Box>

          {/* Timer won't show when poolIsLocked */}
          {poolIsLocked && (
            <Box margin={2} display="flex" style={{ flexDirection: "column", gap: 4, justifyContent: "center" }}>
              <Button
                id="pool-complete-award-button"
                className="pool-complete-award-button"
                variant="contained"
                color="primary"
                onClick={() => handleAward("completeAward")}
                style={{ alignSelf: "center", margin: "5px" }}
              >
                Complete Award
              </Button>
              <Typography variant="body1" color="textSecondary" padding={2}>
                Click 'Complete Award' to distribute and start a new prize period
              </Typography>
            </Box>
          )}

          {isRngTimedOut && (
            <Box margin={2} display="flex" style={{ flexDirection: "column", gap: 4, justifyContent: "center" }}>
              <Button
                id="pool-complete-award-button"
                className="pool-complete-award-button"
                variant="contained"
                color="primary"
                onClick={() => handleAward("cancelAward")}
                style={{ alignSelf: "center", margin: "5px" }}
              >
                Complete Award
              </Button>
              <Typography variant="body1" color="textSecondary" padding={2}>
                The random number generator has timed out. You must cancel the awarding process to unlock users funds
                users funds and start the awarding process again.
              </Typography>
            </Box>
          )}

          {/* Timer still shows (0s) for poolIsLocked === false */}
          {poolIsLocked === false && showAwardStart && (
            <Box margin={2} display="flex" style={{ flexDirection: "column", gap: 4, justifyContent: "center" }}>
              <Button
                id="pool-start-award-button"
                className="pool-start-award-button"
                variant="contained"
                color="primary"
                onClick={() => handleAward("startAward")}
                style={{ alignSelf: "center", margin: "5px" }}
              >
                Start Award
              </Button>
              <Typography variant="body1" color="textSecondary">
                Award period has finished, click 'Start Award' to begin distribution
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
