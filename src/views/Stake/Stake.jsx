import { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Grid,
  Box,
  Paper,
  Typography,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Button,
  Tab,
  Tabs,
  Link,
  Zoom,
} from "@material-ui/core";
import NewReleases from "@material-ui/icons/NewReleases";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RebaseTimer from "../../components/RebaseTimer/RebaseTimer";
import TabPanel from "../../components/TabPanel";
import { trim, getTokenImage, getOhmTokenImage } from "../../helpers";
import { changeStake, changeApproval } from "../../slices/StakeThunk";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "./stake.scss";
import { NavLink } from "react-router-dom";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import ExternalStakePool from "./ExternalStakePool";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const sOhmImg = getTokenImage("sohm");
const ohmImg = getOhmTokenImage(16, 16);

function Stake() {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();

  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState("");

  const isSmallScreen = useMediaQuery("(max-width: 705px)");
  const isMobileScreen = useMediaQuery("(max-width: 513px)");

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

  const setMax = () => {
    if (view === 0) {
      setQuantity(ohmBalance);
    } else {
      setQuantity(sohmBalance);
    }
  };

  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };

  const onChangeStake = async action => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || quantity === 0 || quantity === "") {
      // eslint-disable-next-line no-alert
      alert("Please enter a value!");
    } else {
      await dispatch(changeStake({ address, action, value: quantity.toString(), provider, networkID: chainID }));
    }
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "ohm") return stakeAllowance > 0;
      if (token === "sohm") return unstakeAllowance > 0;
      return 0;
    },
    [stakeAllowance],
  );

  let modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  );

  const changeView = (event, newView) => {
    setView(newView);
  };

  const trimmedSOHMBalance = trim(sohmBalance, 4);
  const trimmedStakingAPY = trim(stakingAPY * 100, 1);
  const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  const nextRewardValue = trim((stakingRebasePercentage / 100) * trimmedSOHMBalance, 4);

  return (
    <div id="stake-view">
      <Zoom in={true}>
        <Paper className={`ohm-card`}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <div className="card-header">
                <Typography variant="h5">Single Stake (3, 3)</Typography>
                <RebaseTimer />

                {address && oldSohmBalance > 0.01 && (
                  <Link
                    className="migrate-sohm-button"
                    style={{ textDecoration: "none" }}
                    href="https://docs.olympusdao.finance/using-the-website/migrate"
                    aria-label="migrate-sohm"
                    target="_blank"
                  >
                    <NewReleases viewBox="0 0 24 24" />
                    <Typography>Migrate sOHM!</Typography>
                  </Link>
                )}
              </div>
            </Grid>

            <Grid item>
              <div className="stake-top-metrics">
                <Grid container spacing={2}>
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

                  <Grid item xs={6} sm={4} md={4} lg={4}>
                    <div className="stake-tvl">
                      <Typography variant="h5" color="textSecondary">
                        TVL
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

                  <Grid item xs={6} sm={4} md={4} lg={4}>
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
                    <Tabs
                      centered
                      value={view}
                      textColor="primary"
                      indicatorColor="primary"
                      className="stake-tab-buttons"
                      onChange={changeView}
                      aria-label="stake tabs"
                    >
                      <Tab label="Stake" {...a11yProps(0)} />
                      <Tab label="Unstake" {...a11yProps(0)} />
                    </Tabs>
                    <Box className="help-text">
                      {address && ((!hasAllowance("ohm") && view === 0) || (!hasAllowance("sohm") && view === 1)) && (
                        <Typography variant="body2" className="stake-note" color="textSecondary">
                          Note: The "Approve" transaction is only needed when staking/unstaking for the first time;
                          subsequent staking/unstaking only requires you to perform the "Stake" or "Unstake"
                          transaction.
                        </Typography>
                      )}
                    </Box>
                    <Box className="stake-action-row " display="flex" alignItems="center">
                      <FormControl className="ohm-input" variant="outlined" color="primary">
                        <InputLabel htmlFor="amount-input"></InputLabel>
                        <OutlinedInput
                          id="amount-input"
                          type="number"
                          placeholder="Enter an amount"
                          className="stake-input"
                          value={quantity}
                          onChange={e => setQuantity(e.target.value)}
                          labelWidth={0}
                          endAdornment={
                            <InputAdornment position="end">
                              <Button variant="text" onClick={setMax} color="inherit">
                                Max
                              </Button>
                            </InputAdornment>
                          }
                        />
                      </FormControl>

                      <TabPanel value={view} index={0} className="stake-tab-panel">
                        {address && hasAllowance("ohm") ? (
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "staking")}
                            onClick={() => {
                              onChangeStake("stake");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "staking", "Stake OHM")}
                          </Button>
                        ) : (
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "approve_staking")}
                            onClick={() => {
                              onSeekApproval("ohm");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "approve_staking", "Approve")}
                          </Button>
                        )}
                      </TabPanel>

                      <TabPanel value={view} index={1} className="stake-tab-panel">
                        {address && hasAllowance("sohm") ? (
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "unstaking")}
                            onClick={() => {
                              onChangeStake("unstake");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "unstaking", "Unstake OHM")}
                          </Button>
                        ) : (
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "approve_unstaking")}
                            onClick={() => {
                              onSeekApproval("sohm");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "approve_unstaking", "Approve")}
                          </Button>
                        )}
                      </TabPanel>
                    </Box>
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
                        {isAppLoading ? (
                          <Skeleton width="80px" />
                        ) : (
                          <>{new Intl.NumberFormat("en-US").format(trimmedSOHMBalance)} sOHM</>
                        )}
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
          </Grid>
        </Paper>
      </Zoom>

      {/* TODO (appleseed-lusd): hiding Stake Pool temporarily, when ready update button links */}
      {/* <ExternalStakePool /> */}
    </div>
  );
}

export default Stake;
