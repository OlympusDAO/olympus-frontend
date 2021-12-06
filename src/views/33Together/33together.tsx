import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { t } from "@lingui/macro";
import { Paper, Tab, Tabs, Box } from "@material-ui/core";
import InfoTooltipMulti from "../../components/InfoTooltip/InfoTooltipMulti";
import { Prize, PrizePool } from "src/typechain/pooltogether";
import TabPanel from "../../components/TabPanel";
import CardHeader from "../../components/CardHeader/CardHeader";
import { PoolDeposit } from "./PoolDeposit";
import { PoolWithdraw } from "./PoolWithdraw";
import { PoolInfo } from "./PoolInfo";
import { PoolPrize } from "./PoolPrize";
import "./33together.scss";
import { addresses, POOL_GRAPH_URLS } from "src/constants";
import { useWeb3Context, useAppSelector } from "src/hooks";
import { apolloExt } from "src/lib/apolloClient";
import { poolDataQuery, yourAwardsQuery } from "./poolData";
import { calculateOdds, trimOdds } from "src/helpers/33Together";
import { getPoolValues, getRNGStatus } from "src/slices/PoolThunk";

function a11yProps(index: number) {
  return {
    id: `pool-tab-${index}`,
    "aria-controls": `pool-tabpanel-${index}`,
  };
}

interface AwardItem {
  awardedTimestamp: number;
  awardedBlock: string;
  awardedAmount: number;
}

const PoolTogether = () => {
  const [view, setView] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const changeView = (_event: React.ChangeEvent<{}>, newView: number) => {
    setView(newView);
  };

  // NOTE (appleseed): these calcs were previously in PoolInfo, however would be need in PoolPrize, too, if...
  // ... we ever were to implement other types of awards
  const { connect, address, provider, hasCachedProvider } = useWeb3Context();
  const networkId = useAppSelector(state => state.network.networkId);
  const dispatch = useDispatch();
  const [graphUrl, setGraphUrl] = useState(POOL_GRAPH_URLS[1]);
  const [poolData, setPoolData] = useState(null);
  const [poolDataError, setPoolDataError] = useState(null);
  const [graphLoading, setGraphLoading] = useState(true);
  const [walletChecked, setWalletChecked] = useState(false);
  const [winners, setWinners] = useState("--");
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [totalSponsorship, setTotalSponsorship] = useState(0);
  const [yourOdds, setYourOdds] = useState<number | string>(0);
  const [yourTotalAwards, setYourTotalAwards] = useState(0);
  // TODO (appleseed-33T): create a table for AwardHistory
  const [yourAwardHistory, setYourAwardHistory] = useState<Array<AwardItem>>([]);
  const [infoTooltipMessage, setInfoTooltipMessage] = useState<Array<string>>([
    "Deposit sOHM to win! Once deposited, you will receive a corresponding amount of 33T and be entered to win until your sOHM is withdrawn.",
  ]);
  const isAccountLoading = useAppSelector(state => state.account.loading ?? true);

  const sohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.sohm;
  });

  const poolBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.pool;
  });

  // query correct pool subgraph depending on current chain
  useEffect(() => {
    if (networkId === -1) {
      setGraphUrl(POOL_GRAPH_URLS[1]);
    } else {
      setGraphUrl(POOL_GRAPH_URLS[networkId]);
    }
  }, [networkId]);

  useEffect(() => {
    console.log("apollo", networkId);
    let apolloUrl: string;
    if (networkId === -1) {
      apolloUrl = poolDataQuery(addresses[1].PT_PRIZE_POOL_ADDRESS);
    } else {
      apolloUrl = poolDataQuery(addresses[networkId].PT_PRIZE_POOL_ADDRESS);
    }
    // get poolData
    apolloExt(apolloUrl, graphUrl)
      .then(poolData => {
        const prizePool: PrizePool = poolData?.data.prizePool;

        const poolWinners = prizePool.prizeStrategy?.multipleWinners?.numberOfWinners;
        if (poolWinners) setWinners(poolWinners);

        const poolTotalDeposits = prizePool.controlledTokens[0].totalSupply / 1_000_000_000;
        if (poolTotalDeposits) setTotalDeposits(poolTotalDeposits);

        // sponsorship is deposited funds contributing to the prize without being eligible to win
        const poolTotalSponsorship = prizePool.controlledTokens[1].totalSupply / 1_000_000_000;
        if (poolTotalSponsorship) setTotalSponsorship(poolTotalSponsorship);

        setPoolData(poolData?.data);
        setGraphLoading(false);
      })
      .catch(err => setPoolDataError(err));

    // get your Award History
    if (address) {
      const yourPrizes: Array<AwardItem> = [];
      let totalAwards = 0;
      apolloExt(
        yourAwardsQuery(addresses[networkId].PT_PRIZE_POOL_ADDRESS, address, addresses[networkId].PT_TOKEN_ADDRESS),
        graphUrl,
      )
        .then(poolData => {
          poolData?.data.prizePool?.prizes.map((prize: Prize) => {
            const awardedAmount = parseFloat(prize.awardedControlledTokens[0]?.amount) / 10 ** 9 || 0;
            // pushing in an AwardItem {awardedTimestamp, awardedBlock, awardedAmount}
            yourPrizes.push({
              awardedTimestamp: prize.awardedTimestamp,
              awardedBlock: prize.awardedBlock,
              awardedAmount: awardedAmount,
            } as AwardItem);
            totalAwards += awardedAmount;
          });
          setYourTotalAwards(totalAwards);
          setYourAwardHistory(yourPrizes);
        })
        .catch(err => setPoolDataError(err));
    }
  }, [graphUrl]);

  useEffect(() => {
    const userOdds = calculateOdds(poolBalance, totalDeposits, parseFloat(winners));
    setYourOdds(userOdds);
  }, [winners, totalDeposits, poolBalance]);

  useEffect(() => {
    if (hasCachedProvider()) {
      // then user DOES have a wallet
      connect().then(() => {
        setWalletChecked(true);
      });
    } else {
      // then user DOES NOT have a wallet
      setWalletChecked(true);
    }
  }, []);

  // this useEffect fires on state change from above. It will ALWAYS fire AFTER
  useEffect(() => {
    // don't load ANY details until wallet is Checked
    if (walletChecked) {
      dispatch(getPoolValues({ networkID: networkId, provider: provider }));
      dispatch(getRNGStatus({ networkID: networkId, provider: provider }));
    }
  }, [walletChecked]);

  return (
    <div id="pool-together-view">
      <PoolPrize />

      <Paper className="ohm-card">
        <Box display="flex">
          <CardHeader title={t`3, 3 Together`} />
          <InfoTooltipMulti messagesArray={infoTooltipMessage} />
        </Box>
        <Tabs
          centered
          value={view}
          textColor="primary"
          indicatorColor="primary"
          onChange={changeView}
          className="pt-tabs"
          aria-label="pool tabs"
        >
          {/* <Tab label={t`Deposit`} {...a11yProps(0)} /> */}
          <Tab label={t`Withdraw`} {...a11yProps(0)} />
        </Tabs>

        {/* <TabPanel value={view} index={0} className="pool-tab">
          <PoolDeposit
            totalPoolDeposits={totalDeposits}
            winners={winners}
            setInfoTooltipMessage={setInfoTooltipMessage}
          />
        </TabPanel> */}
        <TabPanel value={view} index={0} className="pool-tab">
          <PoolWithdraw
            totalPoolDeposits={totalDeposits}
            winners={winners}
            setInfoTooltipMessage={setInfoTooltipMessage}
          />
        </TabPanel>
      </Paper>

      <PoolInfo
        graphLoading={graphLoading}
        isAccountLoading={isAccountLoading}
        poolBalance={trimOdds(parseFloat(poolBalance))}
        sohmBalance={trimOdds(parseFloat(sohmBalance))}
        yourTotalAwards={trimOdds(yourTotalAwards)}
        yourOdds={trimOdds(yourOdds)}
        winners={winners}
        totalDeposits={totalDeposits}
        totalSponsorship={totalSponsorship}
      />
    </div>
  );
};

export default PoolTogether;
