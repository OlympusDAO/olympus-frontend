import { useState, useEffect } from "react";
import { useWeb3Context } from "../../hooks";
import { Paper, Box, Typography, Button, Tab, Tabs, Zoom, SvgIcon } from "@material-ui/core";
import { POOL_GRAPH_URLS } from "../../constants";
import { poolTimeQuery } from "./poolData.js";
import { apolloExt } from "../../lib/apolloClient";

// TODO: Add countdown timer functionality using prizePeriodSeconds, prizePeriodEndAt from apollo
const countdownTimer = end => {
  const start = new Date();

  console.log("countdown timer: ", end);

  useEffect(() => {
    // start timer
  }, []);

  return <Typography variant="h3">00:00:00</Typography>;
};

export const PoolPrize = () => {
  const { chainID } = useWeb3Context();
  // TODO: swap out hardcoded 4 for chainID when pool api available
  const [graphUrl, setGraphUrl] = useState(POOL_GRAPH_URLS[4]);
  const [prize, setPrize] = useState(0);
  const [end, setEnd] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setGraphUrl(POOL_GRAPH_URLS[4]);
  }, []);

  useEffect(() => {
    apolloExt(poolTimeQuery, graphUrl).then(r => {
      let endTime = r.data.prizeStrategy.multipleWinners.prizePeriodEndAt;
      console.log("prize period ends at: ", endTime);
      setEnd(endTime);
      setPrize(2000); // need to replace this with actual data
      setLoading(false);
    });
  }, []);

  return (
    <Zoom in={true}>
      <Paper className="ohm-card">
        <div className="card-header">
          <Typography variant="h5">3, 3 Together</Typography>
        </div>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h2">{prize} sOHM</Typography>
          {countdownTimer(end)}
        </Box>
      </Paper>
    </Zoom>
  );
};
