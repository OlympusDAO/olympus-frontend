import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useWeb3Context } from "../../hooks";
import { awardProcess, getRNGStatus, getPoolValues } from "../../slices/PoolThunk";

import { Paper, Box, Typography, Button } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import { trim, subtractDates } from "src/helpers";

export const PoolPrize = () => {
  const { provider, chainID } = useWeb3Context();
  const dispatch = useDispatch();
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timer, setTimer] = useState(null);
  const [showAwardStart, setShowAwardStart] = useState(false);

  const isPoolLoading = useSelector(state => state.poolData.loading ?? true);

  const poolAwardTimeRemaining = useSelector(state => {
    return state.poolData && state.poolData.awardPeriodRemainingSeconds;
  });

  const poolAwardBalance = useSelector(state => {
    return state.poolData && state.poolData.awardBalance;
  });

  // when true someone has started the award
  const poolIsLocked = useSelector(state => {
    return state.poolData && state.poolData.isRngRequested;
  });

  // when true we need to cancel award
  const isRngTimedOut = useSelector(state => {
    return state.poolData && state.poolData.isRngTimedOut;
  });

  // when true the award is complete & timer should reset.
  const rngRequestCompleted = useSelector(state => {
    return state.poolData && state.poolData.rngRequestCompleted;
  });

  let timerInterval = useRef();

  // handleAward not used yet
  const handleAward = async action => {
    console.log(`run ${action} on pool`);
    await dispatch(awardProcess({ action, provider, networkID: chainID }));
  };

  const rngQueryFunc = () => {
    dispatch(getRNGStatus({ networkID: chainID, provider: provider }));
    if (poolIsLocked) dispatch(getPoolValues({ networkID: chainID, provider: provider }));
  };

  const decreaseNum = () => {
    if (secondsLeft <= 1) {
      // Time has ticked down.
      // There is no time left, attach RNG (Award) Start listener
      rngQueryFunc();
    }
    setSecondsLeft(prev => prev - 1);
  };

  // the seconds countdown timer...
  useEffect(() => {
    const currentDate = new Date(Date.now());
    // multiply integerTimeRemaining by 1000 for milliseconds
    const futureDate = new Date(currentDate.getTime() + secondsLeft * 1000);
    const formatted = subtractDates(futureDate, currentDate);
    setTimer(formatted);
    if (secondsLeft > 0) {
      timerInterval.current = setInterval(decreaseNum, 1000);
      return () => clearInterval(timerInterval.current);
    }
  }, [secondsLeft]);

  useEffect(() => {
    if (parseInt(poolAwardTimeRemaining, 10) > 0) {
      setShowAwardStart(false);
      setSecondsLeft(parseInt(poolAwardTimeRemaining, 10));
    } else if (poolIsLocked) {
      setShowAwardStart(false);
      // wait 30 seconds... we're just waiting for award
      setTimeout(() => {
        // retry until Pool Is Not Locked, then go get new time
        rngQueryFunc();
      }, 30000);
    } else if (parseInt(poolAwardTimeRemaining, 10) <= 0) {
      setShowAwardStart(true);
      // There is no time left, attach RNG (Award) Start listener
      // the rngQueryFunc will run repeatedly once the above conditions are true;
      setTimeout(() => {
        // retry until pool is locked, then hits above block
        rngQueryFunc();
      }, 10000);
    }
  }, [poolAwardTimeRemaining, poolIsLocked, rngRequestCompleted]);

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
              {/* <Button
                id="pool-complete-award-button"
                className="pool-complete-award-button"
                variant="contained"
                color="primary"
                onClick={() => handleAward("completeAward")}
                style={{ alignSelf: "center", margin: "5px" }}
              >
                Complete Award
              </Button> */}
              <Typography variant="body1" color="textSecondary" padding={2}>
                Award period has finished, you can navigate to Pool Together's UI to complete distribution
              </Typography>
            </Box>
          )}

          {/* Timer still shows (0s) for poolIsLocked === false */}
          {!poolIsLocked && showAwardStart && (
            <Box margin={2} display="flex" style={{ flexDirection: "column", gap: 4, justifyContent: "center" }}>
              {/* <Button
                id="pool-start-award-button"
                className="pool-start-award-button"
                variant="contained"
                color="primary"
                onClick={() => handleAward("startAward")}
                style={{ alignSelf: "center", margin: "5px" }}
              >
                Start Award
              </Button> */}
              <Typography variant="body1" color="textSecondary">
                Award period has finished, you can navigate to Pool Together's UI to begin distribution
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
