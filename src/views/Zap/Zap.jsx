import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Grid, Link, Avatar, CardHeader, Paper, Tab, Tabs, Typography, Zoom } from "@material-ui/core";
import NewReleases from "@material-ui/icons/NewReleases";
import RebaseTimer from "../../components/RebaseTimer/RebaseTimer";
import TabPanel from "../../components/TabPanel";
import { getOhmTokenImage, getTokenImage, trim } from "../../helpers";
import { changeApproval, changeStake } from "../../slices/StakeThunk";
import "./zap.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { Skeleton } from "@material-ui/lab";
import ZapAction from "./ZapAction";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import { getZapTokenBalances } from "src/slices/ZapSlice";
import ZapBondAction from "./ZapBondAction";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const sOhmImg = getTokenImage("sohm");
const ohmImg = getOhmTokenImage(16, 16);

function Zap() {
  const dispatch = useDispatch();

  const zapTokens = useSelector(state => {
    return state;
  });
  // console.log(zapTokens);

  const { provider, address, connected, connect, chainID } = useWeb3Context();

  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState("");

  const isAppLoading = useSelector(state => state.app.loading);
  const currentIndex = useSelector(state => {
    return state.app.currentIndex;
  });
  const fiveDayRate = useSelector(state => {
    return state.app.fiveDayRate;
  });
  const ohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.ohm;
  });
  const oldSohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.oldsohm;
  });
  const sohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.sohm;
  });
  const fsohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.fsohm;
  });
  const wsohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.wsohm;
  });
  const stakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.ohmStake;
  });
  const unstakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.ohmUnstake;
  });
  const stakingRebase = useSelector(state => {
    return state.app.stakingRebase;
  });
  const stakingAPY = useSelector(state => {
    return state.app.stakingAPY;
  });
  const stakingTVL = useSelector(state => {
    return state.app.stakingTVL;
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const setMax = token => {
    if (token === "ohm") {
      setQuantity(ohmBalance);
    } else if (token === "sohm") {
      setQuantity(sohmBalance);
    }
  };

  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "ohm") return stakeAllowance > 0;
      if (token === "sohm") return unstakeAllowance > 0;
      return 0;
    },
    [stakeAllowance, unstakeAllowance],
  );

  const isAllowanceDataLoading = (stakeAllowance == null && view === 0) || (unstakeAllowance == null && view === 1);

  let modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  );

  const changeView = (event, newView) => {
    setView(newView);
  };

  const trimmedBalance = Number(
    [sohmBalance, fsohmBalance, wsohmBalance]
      .filter(Boolean)
      .map(balance => Number(balance))
      .reduce((a, b) => a + b, 0)
      .toFixed(4),
  );
  const trimmedStakingAPY = trim(stakingAPY * 100, 1);
  const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  const nextRewardValue = trim((stakingRebasePercentage / 100) * trimmedBalance, 4);

  return (
    // <div display="flex">
    <div id="zap-view">
      <Box flexDirection="row" minWidth="350px">
        <Tabs
          key={String(zoomed)}
          centered
          value={view}
          textColor="primary"
          indicatorColor="primary"
          className="stake-tab-buttons"
          onChange={changeView}
          aria-label="stake tabs"
          variant="fullWidth"
          wrapped
        >
          <Tab
            label={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                Zap-Stake
                <FlashOnIcon />
              </div>
            }
            {...a11yProps(0)}
          />
          <Tab
            label={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                Zap-Bond
              </div>
            }
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <Zoom in={true} onEntered={() => setZoomed(true)}>
        <Paper className={`ohm-card`}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <div className="card-header">
                <Typography variant="h5">Single Stake (3, 3)</Typography>
                <RebaseTimer />
              </div>
            </Grid>

            <Grid item>
              <div className="stake-top-metrics">
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-apy">
                      <Typography variant="h5" color="textSecondary">
                        APY
                      </Typography>
                      <Typography variant="h4">
                        {stakingAPY ? (
                          <>{new Intl.NumberFormat("en-US").format(trimmedStakingAPY)}%</>
                        ) : (
                          <Skeleton width="150px" />
                        )}
                      </Typography>
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-tvl">
                      <Typography variant="h5" color="textSecondary">
                        Total Value Deposited
                      </Typography>
                      <Typography variant="h4">
                        {stakingTVL ? (
                          new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                            minimumFractionDigits: 0,
                          }).format(stakingTVL)
                        ) : (
                          <Skeleton width="150px" />
                        )}
                      </Typography>
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-index">
                      <Typography variant="h5" color="textSecondary">
                        Current Index
                      </Typography>
                      <Typography variant="h4">
                        {currentIndex ? <>{trim(currentIndex, 1)} OHM</> : <Skeleton width="150px" />}
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </Grid>
          <div className="staking-area">
            {!address ? (
              <div className="stake-wallet-notification">
                <div className="wallet-menu" id="wallet-menu">
                  {modalButton}
                </div>
                <Typography variant="h6">Connect your wallet to stake OHM</Typography>
              </div>
            ) : (
              <>
                <Box className="stake-action-area">
                  <Box alignSelf="center" minWidth="420px" width="80%"></Box>

                  <TabPanel value={view} index={0} className="stake-tab-panel">
                    <ZapAction address={address} />
                  </TabPanel>
                  <TabPanel value={view} index={1} className="stake-tab-panel">
                    <ZapBondAction address={address} />
                  </TabPanel>
                </Box>

                <div className={`stake-user-data`}>
                  <div className="data-row">
                    <Typography variant="body1">Your Balance</Typography>
                    <Typography variant="body1">
                      {isAppLoading ? <Skeleton width="80px" /> : <>{trim(ohmBalance, 4)} OHM</>}
                    </Typography>
                  </div>

                  <div className="data-row">
                    <Typography variant="body1">Your Staked Balance</Typography>
                    <Typography variant="body1">
                      {isAppLoading ? <Skeleton width="80px" /> : <>{trimmedBalance} sOHM</>}
                    </Typography>
                  </div>

                  <div className="data-row">
                    <Typography variant="body1">Next Reward Amount</Typography>
                    <Typography variant="body1">
                      {isAppLoading ? <Skeleton width="80px" /> : <>{nextRewardValue} sOHM</>}
                    </Typography>
                  </div>

                  <div className="data-row">
                    <Typography variant="body1">Next Reward Yield</Typography>
                    <Typography variant="body1">
                      {isAppLoading ? <Skeleton width="80px" /> : <>{stakingRebasePercentage}%</>}
                    </Typography>
                  </div>

                  <div className="data-row">
                    <Typography variant="body1">ROI (5-Day Rate)</Typography>
                    <Typography variant="body1">
                      {isAppLoading ? <Skeleton width="80px" /> : <>{trim(fiveDayRate * 100, 4)}%</>}
                    </Typography>
                  </div>
                </div>
              </>
            )}
          </div>
        </Paper>
      </Zoom>
    </div>
    // </div>
  );
}

export default Zap;
