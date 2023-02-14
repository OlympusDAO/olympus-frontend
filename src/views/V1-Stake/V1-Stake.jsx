import "src/views/Stake/Stake.scss";
import "src/views/V1-Stake/V1-Stake.scss";

import { ExpandMore } from "@mui/icons-material";
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
} from "@mui/material";
import { Skeleton } from "@mui/material";
import { Tab, TabPanel, Tabs } from "@olympusdao/component-library";
import { DataRow, MetricCollection, Paper } from "@olympusdao/component-library";
import { ethers } from "ethers";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LearnMoreButton, MigrateButton } from "src/components/CallToAction/CallToAction";
import { InPageConnectButton } from "src/components/ConnectButton/ConnectButton";
import { trim } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useGohmBalance, useSohmBalance } from "src/hooks/useBalance";
import { useOldAssetsDetected } from "src/hooks/useOldAssetsDetected";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { changeApproval, changeStake } from "src/slices/StakeThunk";
import { ClaimsArea } from "src/views/Stake/components/ClaimsArea/ClaimsArea";
import RebaseTimer from "src/views/Stake/components/StakeArea/components/RebaseTimer/RebaseTimer";
import { StakeFiveDayYield } from "src/views/Stake/components/StakeArea/components/StakeFiveDayYield";
import { StakeNextRebaseAmount } from "src/views/Stake/components/StakeArea/components/StakeNextRebaseAmount";
import { StakeRebaseYield } from "src/views/Stake/components/StakeArea/components/StakeRebaseYield";
import { CurrentIndex, StakingAPY, TotalValueDeposited } from "src/views/TreasuryDashboard/components/Metric/Metric";
import { useAccount, useNetwork, useProvider } from "wagmi";

function V1Stake({ setMigrationModalOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const oldAssetsDetected = useOldAssetsDetected();
  const provider = useProvider();
  const { address = "", isConnected } = useAccount();
  const { chain = { id: 1 } } = useNetwork();

  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState("");

  const isAppLoading = useSelector(state => state.app.loading);
  const currentIndex = useSelector(state => {
    return state.app.currentIndex;
  });

  const ohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.ohmV1;
  });
  const sohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.sohmV1;
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

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  // const gOhmBalance = useAppSelector(state => {
  //   return state.account.balances && state.account.balances.gohm;
  // });
  // const o = useSelector(state => {
  //   return state.account.balances && state.account.balances.sohm;
  // });

  const networks = useTestableNetworks();
  const { data: sohmV2Balance = new DecimalBigNumber("0", 9) } = useSohmBalance()[networks.MAINNET];
  const { data: gOhmBalance = new DecimalBigNumber("0", 18) } = useGohmBalance()[networks.MAINNET];

  const calculateWrappedAsSohm = balance => {
    return Number(balance) * Number(currentIndex);
  };
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
    await dispatch(changeApproval({ address, token, provider, networkID: chain.id, version2: false }));
  };

  const onChangeStake = async action => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || quantity === 0 || quantity === "") {
      // eslint-disable-next-line no-alert
      return toast.error("Please enter a value!");
    }

    // 1st catch if quantity > balance
    let gweiValue = ethers.utils.parseUnits(quantity, "gwei");
    if (action === "stake" && gweiValue.gt(ethers.utils.parseUnits(ohmBalance, "gwei"))) {
      return toast.error("You cannot stake more than your OHM balance.");
    }

    if (action === "unstake" && gweiValue.gt(ethers.utils.parseUnits(sohmBalance, "gwei"))) {
      return toast.error("You cannot unstake more than your sOHM balance.");
    }

    await dispatch(
      changeStake({
        address,
        action,
        value: quantity.toString(),
        provider,
        networkID: chain.id,
        version2: false,
      }),
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

  const changeView = (event, newView) => {
    setView(newView);
  };

  const trimmedBalance = Number(
    [sohmBalance, gOhmAsSohm, sohmV2Balance, wsohmAsSohm]
      .filter(Boolean)
      .map(balance => Number(balance))
      .reduce((a, b) => a + b, 0)
      .toFixed(4),
  );

  const goToV2Stake = () => {
    navigate("/stake");
  };

  return (
    <div id="v1-stake-view">
      <Paper headerText={`${`Single Stake`} (3, 3)`} subHeader={<RebaseTimer />}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <MetricCollection>
              <StakingAPY className="stake-apy" />
              <TotalValueDeposited className="stake-tvl" />
              <CurrentIndex className="stake-index" />
            </MetricCollection>
          </Grid>

          <div className="staking-area">
            {!isConnected ? (
              <div className="stake-wallet-notification">
                <div className="wallet-menu" id="wallet-menu">
                  <InPageConnectButton />
                </div>
                <Typography variant="h6">Connect your wallet to stake OHM</Typography>
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
                    <Tab aria-label="stake-button" label={`Stake`} />
                    <Tab aria-label="unstake-button" label={`Unstake`} />
                  </Tabs>

                  <Box mt={"10px"}>
                    <Typography variant="body1" className="stake-note" color="textSecondary">
                      {view === 0 ? (
                        <>
                          {!oldAssetsDetected
                            ? `All your assets are migrated`
                            : `You must complete the migration of your assets to stake additional OHM`}
                        </>
                      ) : (
                        <br />
                      )}
                    </Typography>
                  </Box>

                  <Box className="stake-action-row v1-row " display="flex" alignItems="center">
                    {isConnected && !isAllowanceDataLoading ? (
                      !hasAllowance("sohm") && view === 1 ? (
                        <Box mt={"10px"}>
                          <Typography variant="body1" className="stake-note" color="textSecondary">
                            <>
                              First time unstaking <b>sOHM</b>?
                              <br />
                              Please approve Olympus Dao to use your <b>sOHM </b>
                              for unstaking.
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

                    {oldAssetsDetected ? (
                      <TabPanel value={view} index={0}>
                        {isAllowanceDataLoading ? (
                          <Skeleton />
                        ) : (
                          <MigrateButton setMigrationModalOpen={setMigrationModalOpen} btnText={`Migrate`} />
                        )}
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
                          Go to Stake V2
                        </Button>
                      </TabPanel>
                    )}

                    <TabPanel value={view} index={1}>
                      {isAllowanceDataLoading ? (
                        <Skeleton />
                      ) : isConnected && hasAllowance("sohm") ? (
                        <Button
                          className="stake-button"
                          variant="contained"
                          color="primary"
                          disabled={isPendingTxn(pendingTransactions, "unstaking")}
                          onClick={() => {
                            onChangeStake("unstake");
                          }}
                        >
                          {txnButtonText(pendingTransactions, "unstaking", `Unstake OHM`)}
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
                          {txnButtonText(pendingTransactions, "approve_unstaking", `Approve`)}
                        </Button>
                      )}
                    </TabPanel>
                  </Box>
                </Box>
                <div className="stake-user-data">
                  <DataRow
                    title={`${`Unstaked Balance`} (v1)`}
                    id="user-balance"
                    balance={`${trim(Number(ohmBalance), 4)} OHM`}
                    isLoading={isAppLoading}
                  />
                  <Accordion className="stake-accordion" square>
                    <AccordionSummary expandIcon={<ExpandMore className="stake-expand" />}>
                      <DataRow
                        title={`Total Staked Balance`}
                        id="user-staked-balance"
                        balance={`${trimmedBalance} sOHM`}
                        isLoading={isAppLoading}
                      />
                    </AccordionSummary>
                    <AccordionDetails>
                      <DataRow
                        title={`${`sOHM Balance`} (v1)`}
                        balance={`${trim(Number(sohmBalance), 4)} sOHM`}
                        indented
                        isLoading={isAppLoading}
                      />
                      {Number(wsohmBalance) > 0.0 && (
                        <DataRow
                          title={`${`wsOHM Balance`} (v1)`}
                          balance={`${trim(Number(wsohmBalance), 4)} wsOHM`}
                          isLoading={isAppLoading}
                          indented
                        />
                      )}
                      <DataRow
                        title={`${`sOHM Balance`} (v2)`}
                        balance={`${trim(Number(sohmV2Balance), 4)} sOHM`}
                        indented
                        isLoading={isAppLoading}
                      />
                      <DataRow
                        title={`${`gOHM Balance`} (v2)`}
                        balance={`${trim(Number(gOhmBalance), 4)} gOHM`}
                        indented
                        isLoading={isAppLoading}
                      />
                    </AccordionDetails>
                  </Accordion>
                  <Divider />

                  <StakeNextRebaseAmount />

                  <StakeRebaseYield />

                  <StakeFiveDayYield />
                </div>
              </>
            )}
          </div>
        </Grid>
      </Paper>
      <ClaimsArea />
    </div>
  );
}

export default V1Stake;
