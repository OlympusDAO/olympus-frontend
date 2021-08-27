import { useState, useEffect, useRef } from "react";
import { useWeb3Context } from "../../hooks";
import { Paper, Box, Typography } from "@material-ui/core";
import { POOL_GRAPH_URLS } from "../../constants";
import { poolTimeQuery } from "./poolData.js";
import { apolloExt } from "../../lib/apolloClient";
import { poolDataQuery } from "./poolData.js";
import { trim } from "src/helpers";

// TODO: Add countdown timer functionality using prizePeriodSeconds, prizePeriodEndAt from apollo
const timerFormat = time => {
  // parse epoch time into hr/min/sec and return
};

export const PoolPrize = () => {
  const { chainID } = useWeb3Context();
  // TODO: swap out hardcoded 4 for chainID when pool api available
  const [graphUrl, setGraphUrl] = useState(POOL_GRAPH_URLS[4]);
  const [prize, setPrize] = useState(0);
  const [loading, setLoading] = useState(true);
  const [endTime, setEndTime] = useState(null);
  const [timer, setTimer] = useState(0);

  const decreaseNum = () => setTimer(prev => prev - 1);

  let interval = useRef();

  useEffect(() => {
    setGraphUrl(POOL_GRAPH_URLS[chainID]);
  }, [chainID]);

  useEffect(() => {
    apolloExt(poolDataQuery, graphUrl).then(r => {
      const data = r.data.prizePool;
      let endTime = data.prizeStrategy.multipleWinners.prizePeriodEndAt;
      console.log("prize period ends at: ", endTime);
      setEndTime(endTime);
      if (endTime - Date.now()) setTimer(endTime - Date.now());

      const currentPrize = data.cumulativePrizeGross / 1_000_000_000;
      setPrize(trim(currentPrize, 2)); // need to replace this with actual prize data
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    interval.current = setInterval(decreaseNum, 1000);
    return () => clearInterval(interval.current);
  }, []);

  return (
    <Box width="100%" display="flex" flexDirection="column" alignItems="center">
      <Box className="vegas-container">
        <Box className="vegas"></Box>
      </Box>
      <Paper className="ohm-card">
        <div className="card-header">
          <Typography variant="h5">3, 3 Together</Typography>
        </div>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h1">{prize} sOHM</Typography>
          <Typography variant="h3">{timer > 0 ? timer : "00:00:00"}</Typography>
        </Box>
      </Paper>
    </Box>
  );
};
