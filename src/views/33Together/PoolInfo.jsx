import React, { useEffect, useState } from "react";
import { useWeb3Context } from "../../hooks";
import { Link } from "react-router-dom";
// import { OhmDataLoading } from '../../components/Loading/OhmDataLoading'
import { Paper, Box, Typography, Button, Tab, Tabs, Zoom, SvgIcon, CircularProgress } from "@material-ui/core";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { POOL_GRAPH_URLS } from "../../constants";
import { poolDataQuery } from "./poolData.js";
import { apolloExt } from "../../lib/apolloClient";

export const PoolInfo = () => {
  const { address, provider, chainID } = useWeb3Context();
  const [graphUrl, setGraphUrl] = useState(POOL_GRAPH_URLS[chainID]);
  const [poolData, setPoolData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setGraphUrl(POOL_GRAPH_URLS[chainID]);
  }, [chainID]);

  useEffect(() => {
    apolloExt(poolDataQuery, graphUrl).then(r => {
      console.log(r);
      // do something with r
      setPoolData(r);
      setLoading(false);
    });
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
            <Typography>10</Typography>
          </div>
          <div className="data-row">
            <Typography>Total Deposits</Typography>
            <Typography>-- sOHM</Typography>
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
