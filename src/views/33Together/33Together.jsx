import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Container, Paper, Tab, Tabs, Zoom } from "@material-ui/core";
import TabPanel from "../../components/TabPanel";
import CardHeader from "../../components/CardHeader/CardHeader";
import { PoolDeposit } from "./PoolDeposit";
import { PoolWithdraw } from "./PoolWithdraw";
import { PoolInfo } from "./PoolInfo";
import { PoolPrize } from "./PoolPrize";
import "./33together.scss";
import { POOL_GRAPH_URLS } from "../../constants";
import { useWeb3Context } from "../../hooks";
import { apolloExt } from "../../lib/apolloClient";
import { poolDataQuery } from "./poolData.js";

function a11yProps(index) {
  return {
    id: `pool-tab-${index}`,
    "aria-controls": `pool-tabpanel-${index}`,
  };
}

const PoolTogether = () => {
  const [view, setView] = useState(0);

  const changeView = (event, newView) => {
    setView(newView);
  };

  // NOTE (appleseed): these calcs were previously in PoolInfo, however would be need in PoolPrize, too, if...
  // ... we ever were to implement other types of awards
  const { address, provider, chainID } = useWeb3Context();
  const [graphUrl, setGraphUrl] = useState(POOL_GRAPH_URLS[chainID]);
  const [poolData, setPoolData] = useState(null);
  const [poolDataError, setPoolDataError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [winners, setWinners] = useState(0);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [totalSponsorship, setTotalSponsorship] = useState(0);
  const [yourOdds, setYourOdds] = useState(0);

  const sohmBalance = useSelector(state => {
    return state.account.balances && parseFloat(state.account.balances.sohm);
  });

  const poolBalance = useSelector(state => {
    return state.account.balances && parseFloat(state.account.balances.pool);
  });

  const calculateOdds = poolBalance => {
    let userOdds;
    if (poolBalance === undefined || poolBalance === 0 || parseInt(poolBalance) === 0) {
      userOdds = "ngmi";
    } else {
      userOdds = 1 / (1 - Math.pow((totalDeposits - poolBalance) / totalDeposits, winners));
    }
    setYourOdds(userOdds);
  };

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
        const poolWinners = poolData.data.prizePool.prizeStrategy.multipleWinners.numberOfWinners;
        setWinners(parseFloat(poolWinners));

        const poolTotalDeposits = poolData.data.prizePool.controlledTokens[0].totalSupply / 1_000_000_000;
        setTotalDeposits(poolTotalDeposits);

        // sponsorship is deposited funds contributing to the prize without being eligible to win
        const poolTotalSponsorship = poolData.data.prizePool.controlledTokens[1].totalSupply / 1_000_000_000;
        setTotalSponsorship(poolTotalSponsorship);

        setPoolData(poolData.data);
        setLoading(false);
      })
      .catch(err => setPoolDataError(err));
  }, [graphUrl]);

  useEffect(() => {
    calculateOdds(poolBalance);
  }, [poolData, poolBalance]);

  return (
    <div id="pool-together-view">
      <PoolPrize />

      <Zoom in={true}>
        <Paper className="ohm-card">
          <CardHeader title="3, 3 Together" />
          <Tabs
            centered
            value={view}
            textColor="primary"
            indicatorColor="primary"
            onChange={changeView}
            aria-label="pool tabs"
          >
            <Tab label="Deposit" {...a11yProps(0)} />
            <Tab label="Withdraw" {...a11yProps(1)} />
          </Tabs>

          <TabPanel value={view} index={0}>
            <PoolDeposit />
          </TabPanel>
          <TabPanel value={view} index={1}>
            <PoolWithdraw />
          </TabPanel>
        </Paper>
      </Zoom>

      <PoolInfo
        loading={loading}
        poolBalance={poolBalance}
        sohmBalance={sohmBalance}
        yourOdds={yourOdds}
        winners={winners}
        totalDeposits={totalDeposits}
        totalSponsorship={totalSponsorship}
      />
    </div>
  );
};

export default PoolTogether;
