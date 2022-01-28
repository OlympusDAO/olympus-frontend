import "../Stake/Stake.scss";
import "./V1-Stake.scss";

import { t, Trans } from "@lingui/macro";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  Zoom,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import { Tab, TabPanel, Tabs } from "@olympusdao/component-library";
import { DataRow, Metric, MetricCollection, Paper } from "@olympusdao/component-library";
import { ethers } from "ethers";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { LearnMoreButton, MigrateButton } from "src/components/CallToAction/CallToAction";
import { useAppSelector } from "src/hooks";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";

import RebaseTimer from "../../components/RebaseTimer/RebaseTimer";
import { getOhmTokenImage, getTokenImage, trim } from "../../helpers";
import { error } from "../../slices/MessagesSlice";
import { changeApproval, changeStake } from "../../slices/StakeThunk";
import ExternalStakePool from "../Stake/ExternalStakePool";

const sOhmImg = getTokenImage("sohm");
const ohmImg = getOhmTokenImage(16, 16);

function V1Stake({ oldAssetsDetected, setMigrationModalOpen, hasActiveV1Bonds }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { provider, address, connect, networkId } = useWeb3Context();

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
    return state.account.balances && state.account.balances.ohmV1;
  });
  const sohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.sohmV1;
  });
  const fsohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.fsohm;
  });
  const wsohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.wsohm;
  });
  const stakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.ohmStakeV1;
  });
  const unstakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.ohmUnstakeV1;
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

  const fiatDaowsohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.fiatDaowsohm;
  });

  const gOhmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.gohm;
  });
  const sohmV2Balance = useSelector(state => {
    return state.account.balances && state.account.balances.sohm;
  });

  const calculateWrappedAsSohm = balance => {
    return Number(balance) * Number(currentIndex);
  };
  const fiatDaoAsSohm = calculateWrappedAsSohm(fiatDaowsohmBalance);
  const gOhmAsSohm = calculateWrappedAsSohm(gOhmBalance);
  const wsohmAsSohm = calculateWrappedAsSohm(wsohmBalance);

  const setMax = () => {
    if (view === 0) {
      setQuantity(ohmBalance);
    } else {
      setQuantity(sohmBalance);
    }
  };

  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, token, provider, networkID: networkId, version2: false }));
  };

  const onChangeStake = async action => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || quantity === 0 || quantity === "") {
      // eslint-disable-next-line no-alert
      return dispatch(error("Please enter a value!"));
    }

    // 1st catch if quantity > balance
    let gweiValue = ethers.utils.parseUnits(quantity, "gwei");
    if (action === "stake" && gweiValue.gt(ethers.utils.parseUnits(ohmBalance, "gwei"))) {
      return dispatch(error("You cannot stake more than your OHM balance."));
    }

    if (action === "unstake" && gweiValue.gt(ethers.utils.parseUnits(sohmBalance, "gwei"))) {
      return dispatch(error("You cannot unstake more than your sOHM balance."));
    }

    await dispatch(
      changeStake({ address, action, value: quantity.toString(), provider, networkID: networkId, version2: false }),
    );
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
    [sohmBalance, gOhmAsSohm, sohmV2Balance, wsohmAsSohm, fiatDaoAsSohm, fsohmBalance]
      .filter(Boolean)
      .map(balance => Number(balance))
      .reduce((a, b) => a + b, 0)
      .toFixed(4),
  );
  const trimmedStakingAPY = trim(stakingAPY * 100, 1);
  const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  const nextRewardValue = trim((stakingRebasePercentage / 100) * trimmedBalance, 4);

  const goToV2Stake = () => {
    history.push("/stake");
  };

  const goToBonds = () => {
    // v1 bonds for v1 stake
    history.push("/bonds-v1");
  };

  const formattedTrimmedStakingAPY = new Intl.NumberFormat("en-US").format(Number(trimmedStakingAPY));
  const formattedStakingTVL = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(stakingTVL);
  const formattedCurrentIndex = trim(currentIndex, 1);
  return (
    <div id="v1-stake-view">
      <Zoom in={true} onEntered={() => setZoomed(true)}>
        <Paper headerText={`${t`Single Stake`} (3, 3)`} subHeader={<RebaseTimer />}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <MetricCollection>
                <Metric
                  className="stake-apy"
                  label={`${t`APY`} (v1)`}
                  metric={`${formattedTrimmedStakingAPY}%`}
                  isLoading={stakingAPY ? false : true}
                />
                <Metric
                  className="stake-tvl"
                  label={`${t`TVL`} (v1)`}
                  metric={formattedStakingTVL}
                  isLoading={stakingTVL ? false : true}
                />
                <Metric
                  className="stake-index"
                  label={`${t`Current Index`} (v1)`}
                  metric={`${formattedCurrentIndex} OHM`}
                  isLoading={currentIndex ? false : true}
                />
              </MetricCollection>
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
                    >
                      <Tab aria-label="stake-button" label={t`Stake`} />
                      <Tab aria-label="unstake-button" label={t`Unstake`} />
                    </Tabs>

                    <Box mt={"10px"}>
                      <Typography variant="body1" className="stake-note" color="textSecondary">
                        {view === 0 ? (
                          <>
                            {hasActiveV1Bonds
                              ? t`Once your current bonds have been claimed, you can migrate your assets to stake more OHM`
                              : !oldAssetsDetected
                              ? t`All your assets are migrated`
                              : t`You must complete the migration of your assets to stake additional OHM`}
                          </>
                        ) : (
                          <br />
                        )}
                      </Typography>
                    </Box>

                    <Box className="stake-action-row v1-row " display="flex" alignItems="center">
                      {address && !isAllowanceDataLoading ? (
                        !hasAllowance("sohm") && view === 1 ? (
                          <Box mt={"10px"}>
                            <Typography variant="body1" className="stake-note" color="textSecondary">
                              <>
                                <Trans>First time unstaking</Trans> <b>sOHM</b>?
                                <br />
                                <Trans>Please approve Olympus Dao to use your</Trans> <b>sOHM </b>
                                <Trans> for unstaking</Trans>.
                              </>
                            </Typography>
                          </Box>
                        ) : (
                          <>
                            {view === 1 && (
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
                            )}

                            {view === 0 && <LearnMoreButton />}
                          </>
                        )
                      ) : (
                        <Skeleton width="150px" />
                      )}

                      {!hasActiveV1Bonds && oldAssetsDetected ? (
                        <TabPanel value={view} index={0}>
                          {isAllowanceDataLoading ? (
                            <Skeleton />
                          ) : (
                            <MigrateButton setMigrationModalOpen={setMigrationModalOpen} btnText={t`Migrate`} />
                          )}
                        </TabPanel>
                      ) : hasActiveV1Bonds ? (
                        <TabPanel value={view} index={0}>
                          <Button
                            className="migrate-button"
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              goToBonds();
                            }}
                          >
                            <Trans>Go to Bonds</Trans>
                          </Button>
                        </TabPanel>
                      ) : (
                        <TabPanel value={view} index={0}>
                          <Button
                            className="migrate-button"
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              goToV2Stake();
                            }}
                          >
                            <Trans>Go to Stake V2</Trans>
                          </Button>
                        </TabPanel>
                      )}

                      <TabPanel value={view} index={1}>
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
                      </TabPanel>
                    </Box>
                  </Box>
                  <div className="stake-user-data">
                    <DataRow
                      title={`${t`Unstaked Balance`} (v1)`}
                      id="user-balance"
                      balance={`${trim(Number(ohmBalance), 4)} OHM`}
                      isLoading={isAppLoading}
                    />
                    <Accordion className="stake-accordion" square>
                      <AccordionSummary expandIcon={<ExpandMore className="stake-expand" />}>
                        <DataRow
                          title={t`Total Staked Balance`}
                          id="user-staked-balance"
                          balance={`${trimmedBalance} sOHM`}
                          isLoading={isAppLoading}
                        />
                      </AccordionSummary>
                      <AccordionDetails>
                        <DataRow
                          title={`${t`sOHM Balance`} (v1)`}
                          balance={`${trim(Number(sohmBalance), 4)} sOHM`}
                          indented
                          isLoading={isAppLoading}
                        />
                        {Number(fsohmBalance) > 0.00009 && (
                          <DataRow
                            title={`${t`gOHM Balance in Fuse`}`}
                            balance={`${trim(Number(fsohmBalance), 4)} gOHM`}
                            indented
                            isLoading={isAppLoading}
                          />
                        )}
                        {Number(wsohmBalance) > 0.0 && (
                          <DataRow
                            title={`${t`wsOHM Balance`} (v1)`}
                            balance={`${trim(Number(wsohmBalance), 4)} wsOHM`}
                            isLoading={isAppLoading}
                            indented
                          />
                        )}
                        {Number(fiatDaowsohmBalance) > 0.00009 && (
                          <DataRow
                            title={`${t`wsOHM Balance in FiatDAO`} (v1)`}
                            balance={`${trim(Number(fiatDaowsohmBalance), 4)} wsOHM`}
                            isLoading={isAppLoading}
                            indented
                          />
                        )}
                        <DataRow
                          title={`${t`sOHM Balance`} (v2)`}
                          balance={`${trim(Number(sohmV2Balance), 4)} sOHM`}
                          indented
                          isLoading={isAppLoading}
                        />
                        <DataRow
                          title={`${t`gOHM Balance`} (v2)`}
                          balance={`${trim(Number(gOhmBalance), 4)} gOHM`}
                          indented
                          isLoading={isAppLoading}
                        />
                      </AccordionDetails>
                    </Accordion>
                    <Divider color="secondary" />
                    <DataRow
                      title={t`Next Reward Amount`}
                      balance={`${nextRewardValue} sOHM`}
                      isLoading={isAppLoading}
                    />
                    <DataRow
                      title={t`Next Reward Yield`}
                      balance={`${stakingRebasePercentage}%`}
                      isLoading={isAppLoading}
                    />
                    <DataRow
                      title={t`ROI (5-Day Rate)`}
                      balance={`${trim(Number(fiveDayRate) * 100, 4)}%`}
                      isLoading={isAppLoading}
                    />
                  </div>
                </>
              )}
            </div>
          </Grid>
        </Paper>
      </Zoom>

      <ExternalStakePool />
    </div>
  );
}

export default V1Stake;
