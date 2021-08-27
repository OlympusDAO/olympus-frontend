// import { OhmDataLoading } from '../../components/Loading/OhmDataLoading'
import { Box, CircularProgress, Divider, Paper, SvgIcon, Typography, Zoom } from "@material-ui/core";
import { useEffect, useState } from "react";
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

  // query correct pool subgraph depending on current chain
  useEffect(() => {
    setGraphUrl(POOL_GRAPH_URLS[chainID]);
  }, [chainID]);

  // handle new data or query errors
  useEffect(() => {
    if (poolDataError) {
      console.log("pool data error: ", poolDataError);
    }
    console.log("pool data updated", poolData);
  }, [poolData, poolDataError]);

  // query user pool data on wallet connect
  useEffect(() => {
    if (address) {
      console.log("user connected, querying pool data...");
      // run api query for user data
    } else {
      console.log("user not connected");
    }
  }, [address]);

  useEffect(() => {
    apolloExt(poolDataQuery, graphUrl)
      .then(poolData => {
        // for development help
        console.log(poolData);
        setPoolData(poolData.data);

        setLoading(false);
        const poolWinners = poolData.data.prizePool.prizeStrategy.multipleWinners.numberOfWinners;
        setWinners(poolWinners);

        const poolTotalDeposits = poolData.data.prizePool.controlledTokens[0].totalSupply / 1_000_000_000;
        setTotalDeposits(poolTotalDeposits);
      })
      .catch(err => setPoolDataError(err));
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  // TODO: add user pool data rows
  return (
    <Zoom in={true}>
      <Paper className="ohm-card">
        <div className="card-header">
          <Typography variant="h5">Prize Pool Info</Typography>
        </div>

        {address && (
          <>
            <Box display="flex" flexDirection="column" className="user-pool-data">
              <div className="data-row">
                <Typography>Your odds</Typography>
                <Typography>1 in 33</Typography>
              </div>
            </Box>
            <Divider color="secondary" />
          </>
        )}

        <Box display="flex" flexDirection="column" className="pool-data">
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
