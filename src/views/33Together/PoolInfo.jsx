// import { OhmDataLoading } from '../../components/Loading/OhmDataLoading'
import { Box, CircularProgress, Paper, SvgIcon, Typography, Zoom } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { POOL_GRAPH_URLS } from "../../constants";
import { useWeb3Context } from "../../hooks";
import { apolloExt } from "../../lib/apolloClient";
import { poolDataQuery } from "./poolData.js";

export const PoolInfo = () => {
  const { address, provider, chainID } = useWeb3Context();
  const [graphUrl, setGraphUrl] = useState(POOL_GRAPH_URLS[chainID]);
  const [poolData, setPoolData] = useState(null);
  const [poolDataError, setPoolDataError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [winners, setWinners] = useState(0);
  const [totalDeposits, setTotalDeposits] = useState(0);

  useEffect(() => {
    setGraphUrl(POOL_GRAPH_URLS[chainID]);
  }, [chainID]);

  useEffect(() => {
    apolloExt(poolDataQuery, graphUrl)
      .then(r => {
        console.log("Response:", r);
        const poolWinners = poolData.data.prizePool.prizeStrategy.multipleWinners.numberOfWinners;
        const poolTotalDeposits = poolData.data.prizePool.controlledTokens[0].totalSupply / 1_000_000_000;
        setWinners(poolWinners);
        setTotalDeposits(poolTotalDeposits);
        setLoading(false);
      })
      .catch(err => setPoolDataError(err));
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Zoom in={true}>
      <Paper className="ohm-card">
        <div className="card-header">
          <Typography variant="h5">Prize Pool Info</Typography>
        </div>
        <Box display="flex" flexDirection="column">
          <div className="data-row">
            <Typography>Winners / prize period</Typography>
            <Typography>{winners}</Typography>
          </div>
          <div className="data-row">
            <Typography>Total Deposits</Typography>
            <Typography>{totalDeposits.toLocaleString()} sOHM</Typography>
          </div>
          <div className="data-row">
            <Typography>Yield Source</Typography>
            <Typography>sOHM</Typography>
          </div>
          <div className="data-row">
            <Typography>Pool owner</Typography>
            <Box display="flex" alignItems="center">
              <Typography>OlympusDAO</Typography>
              <Link to={"/33-together"} target="_blank" style={{ marginLeft: "3px" }}>
                <SvgIcon component={ArrowUp} fontSize="small" />
              </Link>
            </Box>
          </div>
        </Box>
      </Paper>
    </Zoom>
  );
};
