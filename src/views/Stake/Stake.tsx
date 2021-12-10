import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  Tab,
  Tabs,
  Typography,
  Zoom,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import { t, Trans } from "@lingui/macro";
import NewReleases from "@material-ui/icons/NewReleases";
import RebaseTimer from "../../components/RebaseTimer/RebaseTimer";
import TabPanel from "../../components/TabPanel";
import { trim } from "../../helpers";
import { changeApproval, changeStake } from "../../slices/StakeThunk";
import "./stake.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import ExternalStakePool from "./ExternalStakePool";
import { error } from "../../slices/MessagesSlice";
import { ethers } from "ethers";
import ZapCta from "../Zap/ZapCta";
import { useAppSelector } from "src/hooks";
import { ExpandMore } from "@material-ui/icons";
import StakeRow from "./StakeRow";
import Metric from "../../components/Metric/Metric";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Stake() {
  const dispatch = useDispatch();
  const { provider, address, connect } = useWeb3Context();
  const networkId = useAppSelector(state => state.network.networkId);

  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const isAppLoading = useAppSelector(state => state.app.loading);
  const currentIndex = useAppSelector(state => {
    return state.app.currentIndex;
  });
  const fiveDayRate = useAppSelector(state => {
    return state.app.fiveDayRate;
  });
  const ohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.ohm;
  });
  const oldSohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.oldsohm;
  });
  const sohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.sohm;
  });
  const fsohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.fsohm;
  });
  const wsohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.wsohm;
  });
  const fiatDaowsohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.fiatDaowsohm;
  });
  const fiatDaoAsSohm = Number(fiatDaowsohmBalance) * Number(currentIndex);
  const gOhmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.gohm;
  });
  const gOhmAsSohm = Number(gOhmBalance) * Number(currentIndex);
  const wsohmAsSohm = useAppSelector(state => {
    return state.account.balances && state.account.balances.wsohmAsSohm;
  });
  const stakeAllowance = useAppSelector(state => {
    return (state.account.staking && state.account.staking.ohmStake) || 0;
  });
  const unstakeAllowance = useAppSelector(state => {
    return (state.account.staking && state.account.staking.ohmUnstake) || 0;
  });
  const stakingRebase = useAppSelector(state => {
    return state.app.stakingRebase || 0;
  });
  const stakingAPY = useAppSelector(state => {
    return state.app.stakingAPY || 0;
  });
  const stakingTVL = useAppSelector(state => {
    return state.app.stakingTVL || 0;
  });

  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });

  const setMax = () => {
    if (view === 0) {
      setQuantity(Number(ohmBalance));
    } else {
      setQuantity(Number(sohmBalance));
    }
  };

  const onSeekApproval = async (token: string) => {
    await dispatch(changeApproval({ address, token, provider, networkID: networkId }));
  };

  const onChangeStake = async (action: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || quantity === 0) {
      // eslint-disable-next-line no-alert
      return dispatch(error(t`Please enter a value!`));
    }

    // 1st catch if quantity > balance
    let gweiValue = ethers.utils.parseUnits(quantity.toString(), "gwei");
    if (action === "stake" && gweiValue.gt(ethers.utils.parseUnits(ohmBalance, "gwei"))) {
      return dispatch(error(t`You cannot stake more than your OHM balance.`));
    }

    if (action === "unstake" && gweiValue.gt(ethers.utils.parseUnits(sohmBalance, "gwei"))) {
      return dispatch(error(t`You cannot unstake more than your sOHM balance.`));
    }

    await dispatch(changeStake({ address, action, value: quantity.toString(), provider, networkID: networkId }));
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
      <Trans>Connect Wallet</Trans>
    </Button>,
  );

  const changeView = (_event: React.ChangeEvent<{}>, newView: number) => {
    setView(newView);
  };

  const trimmedBalance = Number(
    [sohmBalance, fsohmBalance, wsohmAsSohm, gOhmAsSohm, fiatDaoAsSohm]
      .filter(Boolean)
      .map(balance => Number(balance))
      .reduce((a, b) => a + b, 0)
      .toFixed(4),
  );
  const trimmedStakingAPY = trim(stakingAPY * 100, 1);

  const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  const nextRewardValue = trim((Number(stakingRebasePercentage) / 100) * trimmedBalance, 4);

  const formattedTrimmedStakingAPY = new Intl.NumberFormat("en-US").format(Number(trimmedStakingAPY));
  const formattedStakingTVL = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(stakingTVL);
  const formattedCurrentIndex = trim(Number(currentIndex), 1);
  return (
    <div id="stake-view">
      <Zoom in={true} onEntered={() => setZoomed(true)}>
        <Paper className={`ohm-card`}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <div className="card-header">
                <Typography variant="h5">Single Stake (3, 3)</Typography>
                <RebaseTimer />

                {address && Number(oldSohmBalance) > 0.01 && (
                  <Link
                    className="migrate-sohm-button"
                    style={{ textDecoration: "none" }}
                    href="https://docs.olympusdao.finance/using-the-website/migrate"
                    aria-label="migrate-sohm"
                    target="_blank"
                  >
                    <NewReleases viewBox="0 0 24 24" />
                    <Typography>
                      <Trans>Migrate sOHM!</Trans>
                    </Typography>
                  </Link>
                )}
              </div>
            </Grid>

            <Grid item>
              <div className="stake-top-metrics">
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <Metric
                      className="stake-apy"
                      label={t`APY`}
                      metric={`${formattedTrimmedStakingAPY}%`}
                      isLoading={stakingAPY ? false : true}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <Metric
                      className="stake-tvl"
                      label={t`Total Value Deposited`}
                      metric={formattedStakingTVL}
                      isLoading={stakingTVL ? false : true}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <Metric
                      className="stake-index"
                      label={t`Current Index`}
                      metric={`${formattedCurrentIndex} OHM`}
                      isLoading={currentIndex ? false : true}
                    />
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
                  <Typography variant="h6">
                    <Trans>Connect your wallet to stake OHM</Trans>
                  </Typography>
                </div>
              ) : (
                <>
                  <Box className="stake-action-area">
                    <Tabs
                      key={String(zoomed)}
                      centered
                      value={view}
                      textColor="primary"
                      indicatorColor="primary"
                      className="stake-tab-buttons"
                      onChange={changeView}
                      aria-label="stake tabs"
                      //hides the tab underline sliding animation in while <Zoom> is loading
                      TabIndicatorProps={!zoomed ? { style: { display: "none" } } : undefined}
                    >
                      <Tab
                        label={t({
                          id: "do_stake",
                          comment: "The action of staking (verb)",
                        })}
                        {...a11yProps(0)}
                      />
                      <Tab label={t`Unstake`} {...a11yProps(1)} />
                    </Tabs>
                    <Grid container className="stake-action-row">
                      <Grid item xs={12} sm={8} className="stake-grid-item">
                        {address && !isAllowanceDataLoading ? (
                          (!hasAllowance("ohm") && view === 0) || (!hasAllowance("sohm") && view === 1) ? (
                            <Box className="help-text">
                              <Typography variant="body1" className="stake-note" color="textSecondary">
                                {view === 0 ? (
                                  <>
                                    <Trans>First time staking</Trans> <b>OHM</b>?
                                    <br />
                                    <Trans>Please approve Olympus Dao to use your</Trans> <b>OHM</b>{" "}
                                    <Trans>for staking</Trans>.
                                  </>
                                ) : (
                                  <>
                                    <Trans>First time unstaking</Trans> <b>sOHM</b>?
                                    <br />
                                    <Trans>Please approve Olympus Dao to use your</Trans> <b>sOHM</b>{" "}
                                    <Trans>for unstaking</Trans>.
                                  </>
                                )}
                              </Typography>
                            </Box>
                          ) : (
                            <FormControl className="ohm-input" variant="outlined" color="primary">
                              <InputLabel htmlFor="amount-input"></InputLabel>
                              <OutlinedInput
                                id="amount-input"
                                type="number"
                                placeholder="Enter an amount"
                                className="stake-input"
                                value={quantity}
                                onChange={e => setQuantity(Number(e.target.value))}
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
                          )
                        ) : (
                          <Skeleton width="150px" />
                        )}
                      </Grid>
                      <Grid item xs={12} sm={4} className="stake-grid-item">
                        <TabPanel value={view} index={0} className="stake-tab-panel">
                          <Box m={-2}>
                            {isAllowanceDataLoading ? (
                              <Skeleton />
                            ) : address && hasAllowance("ohm") ? (
                              <Button
                                className="stake-button"
                                variant="contained"
                                color="primary"
                                disabled={isPendingTxn(pendingTransactions, "staking")}
                                onClick={() => {
                                  onChangeStake("stake");
                                }}
                              >
                                {txnButtonText(pendingTransactions, "staking", t`Stake OHM`)}
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
                                {txnButtonText(pendingTransactions, "approve_staking", t`Approve`)}
                              </Button>
                            )}
                          </Box>
                        </TabPanel>

                        <TabPanel value={view} index={1} className="stake-tab-panel">
                          <Box m={-2}>
                            {isAllowanceDataLoading ? (
                              <Skeleton />
                            ) : address && hasAllowance("sohm") ? (
                              <Button
                                className="stake-button"
                                variant="contained"
                                color="primary"
                                disabled={isPendingTxn(pendingTransactions, "unstaking")}
                                onClick={() => {
                                  onChangeStake("unstake");
                                }}
                              >
                                {txnButtonText(pendingTransactions, "unstaking", t`Unstake OHM`)}
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
                                {txnButtonText(pendingTransactions, "approve_unstaking", t`Approve`)}
                              </Button>
                            )}
                          </Box>
                        </TabPanel>
                      </Grid>
                    </Grid>
                  </Box>
                  <div className="stake-user-data">
                    <StakeRow
                      title={t`Unstaked Balance`}
                      id="user-balance"
                      balance={`${trim(Number(ohmBalance), 4)} OHM`}
                      {...{ isAppLoading }}
                    />
                    <Accordion className="stake-accordion" square>
                      <AccordionSummary expandIcon={<ExpandMore className="stake-expand" />}>
                        <StakeRow
                          title={t`Staked Balance`}
                          id="user-staked-balance"
                          balance={`${trimmedBalance} sOHM`}
                          {...{ isAppLoading }}
                        />
                      </AccordionSummary>
                      <AccordionDetails>
                        <StakeRow
                          title={t`Single Staking`}
                          balance={`${trim(Number(sohmBalance), 4)} sOHM`}
                          indented
                          {...{ isAppLoading }}
                        />
                        <StakeRow
                          title={t`Staked Balance in Fuse`}
                          balance={`${trim(Number(fsohmBalance), 4)} fsOHM`}
                          indented
                          {...{ isAppLoading }}
                        />
                        <StakeRow
                          title={t`Wrapped Balance`}
                          balance={`${trim(Number(wsohmBalance), 4)} wsOHM`}
                          {...{ isAppLoading }}
                          indented
                        />
                        <StakeRow
                          title={t`Wrapped Balance in FiatDAO`}
                          balance={`${trim(Number(fiatDaowsohmBalance), 4)} wsOHM`}
                          {...{ isAppLoading }}
                          indented
                        />
                        <StakeRow
                          title={`${t`Wrapped Balance`} (v2)`}
                          balance={`${trim(Number(gOhmBalance), 4)} gOHM`}
                          indented
                          {...{ isAppLoading }}
                        />
                      </AccordionDetails>
                    </Accordion>
                    <Divider color="secondary" />
                    <StakeRow title={t`Next Reward Amount`} balance={`${nextRewardValue} sOHM`} {...{ isAppLoading }} />
                    <StakeRow
                      title={t`Next Reward Yield`}
                      balance={`${stakingRebasePercentage}%`}
                      {...{ isAppLoading }}
                    />
                    <StakeRow
                      title={t`ROI (5-Day Rate)`}
                      balance={`${trim(Number(fiveDayRate) * 100, 4)}%`}
                      {...{ isAppLoading }}
                    />
                  </div>
                </>
              )}
            </div>
          </Grid>
        </Paper>
      </Zoom>
      <ZapCta />
      <ExternalStakePool />
    </div>
  );
}

export default Stake;
