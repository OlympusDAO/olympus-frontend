import "./Stake.scss";

import { t, Trans } from "@lingui/macro";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Grid,
  Typography,
  Zoom,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import {
  DataRow,
  InputWrapper,
  Metric,
  MetricCollection,
  Paper,
  PrimaryButton,
  Tab,
  Tabs,
} from "@olympusdao/component-library";
import { ethers } from "ethers";
import { ChangeEvent, ChangeEventHandler, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { useAppSelector } from "src/hooks";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";

import RebaseTimer from "../../components/RebaseTimer/RebaseTimer";
import { getGohmBalFromSohm, trim } from "../../helpers";
import { error } from "../../slices/MessagesSlice";
import { changeApproval, changeStake } from "../../slices/StakeThunk";
import { changeApproval as changeGohmApproval } from "../../slices/WrapThunk";
import { ConfirmDialog } from "./ConfirmDialog";
import ExternalStakePool from "./ExternalStakePool";

const Stake: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { provider, address, connect, networkId } = useWeb3Context();
  usePathForNetwork({ pathName: "stake", networkID: networkId, history });

  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState("");
  const [confirmation, setConfirmation] = useState(false);

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
  const sohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.sohm;
  });
  const sohmV1Balance = useAppSelector(state => {
    return state.account.balances && state.account.balances.sohmV1;
  });
  const fsohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.fsohm;
  });
  const fgohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.fgohm;
  });
  const fgOHMAsfsOHMBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.fgOHMAsfsOHM;
  });
  const wsohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.wsohm;
  });
  const fiatDaowsohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.fiatDaowsohm;
  });
  const calculateWrappedAsSohm = (balance: string) => {
    return Number(balance) * Number(currentIndex);
  };
  const fiatDaoAsSohm = calculateWrappedAsSohm(fiatDaowsohmBalance);
  const gOhmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.gohm;
  });
  const gOhmAsSohm = useAppSelector(state => {
    return state.account.balances && state.account.balances.gOhmAsSohmBal;
  });

  const gOhmOnArbitrum = useAppSelector(state => {
    return state.account.balances && state.account.balances.gOhmOnArbitrum;
  });
  const gOhmOnArbAsSohm = useAppSelector(state => {
    return state.account.balances && state.account.balances.gOhmOnArbAsSohm;
  });

  const gOhmOnAvax = useAppSelector(state => {
    return state.account.balances && state.account.balances.gOhmOnAvax;
  });
  const gOhmOnAvaxAsSohm = useAppSelector(state => {
    return state.account.balances && state.account.balances.gOhmOnAvaxAsSohm;
  });

  const gOhmOnPolygon = useAppSelector(state => {
    return state.account.balances && state.account.balances.gOhmOnPolygon;
  });
  const gOhmOnPolygonAsSohm = useAppSelector(state => {
    return state.account.balances && state.account.balances.gOhmOnPolygonAsSohm;
  });

  const gOhmOnFantom = useAppSelector(state => {
    return state.account.balances && state.account.balances.gOhmOnFantom;
  });
  const gOhmOnFantomAsSohm = useAppSelector(state => {
    return state.account.balances && state.account.balances.gOhmOnFantomAsSohm;
  });

  const gOhmOnTokemak = useAppSelector(state => {
    return state.account.balances && state.account.balances.gOhmOnTokemak;
  });
  const gOhmOnTokemakAsSohm = useAppSelector(state => {
    return state.account.balances && state.account.balances.gOhmOnTokemakAsSohm;
  });

  const wsohmAsSohm = calculateWrappedAsSohm(wsohmBalance);

  const stakeAllowance = useAppSelector(state => {
    return (state.account.staking && state.account.staking.ohmStake) || 0;
  });
  const unstakeAllowance = useAppSelector(state => {
    return (state.account.staking && state.account.staking.ohmUnstake) || 0;
  });

  const directUnstakeAllowance = useAppSelector(state => {
    return (state.account.wrapping && state.account.wrapping.gOhmUnwrap) || 0;
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
      setQuantity(ohmBalance);
    } else if (!confirmation) {
      setQuantity(sohmBalance);
    } else if (confirmation) {
      setQuantity(gOhmAsSohm.toString());
    }
  };

  const onSeekApproval = async (token: string) => {
    if (token === "gohm") {
      await dispatch(changeGohmApproval({ address, token: token.toLowerCase(), provider, networkID: networkId }));
    } else {
      await dispatch(changeApproval({ address, token, provider, networkID: networkId, version2: true }));
    }
  };

  const onChangeStake = async (action: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(Number(quantity)) || Number(quantity) === 0 || Number(quantity) < 0) {
      // eslint-disable-next-line no-alert
      return dispatch(error(t`Please enter a value!`));
    }

    // 1st catch if quantity > balance
    const gweiValue = ethers.utils.parseUnits(quantity.toString(), "gwei");
    if (action === "stake" && gweiValue.gt(ethers.utils.parseUnits(ohmBalance, "gwei"))) {
      return dispatch(error(t`You cannot stake more than your OHM balance.`));
    }

    if (confirmation === false && action === "unstake" && gweiValue.gt(ethers.utils.parseUnits(sohmBalance, "gwei"))) {
      return dispatch(
        error(
          t`You do not have enough sOHM to complete this transaction.  To unstake from gOHM, please toggle the sohm-gohm switch.`,
        ),
      );
    }

    /**
     * converts sOHM quantity to gOHM quantity when box is checked for gOHM staking
     * @returns sOHM as gOHM quantity
     */
    // const formQuant = checked && currentIndex && view === 1 ? quantity / Number(currentIndex) : quantity;
    const formQuant = async () => {
      if (confirmation && currentIndex && view === 1) {
        return await getGohmBalFromSohm({ provider, networkID: networkId, sOHMbalance: quantity });
      } else {
        return quantity;
      }
    };

    await dispatch(
      changeStake({
        address,
        action,
        value: await formQuant(),
        provider,
        networkID: networkId,
        version2: true,
        rebase: !confirmation,
      }),
    );
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "ohm") return stakeAllowance > 0;
      if (token === "sohm") return unstakeAllowance > 0;
      if (token === "gohm") return directUnstakeAllowance > 0;
      return 0;
    },
    [stakeAllowance, unstakeAllowance, directUnstakeAllowance],
  );

  const isAllowanceDataLoading = (stakeAllowance == null && view === 0) || (unstakeAllowance == null && view === 1);

  const modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      <Trans>Connect Wallet</Trans>
    </Button>,
  );

  const changeView: any = (_event: ChangeEvent<any>, newView: number) => {
    setView(newView);
  };

  const handleChangeQuantity = useCallback<ChangeEventHandler<HTMLInputElement>>(e => {
    if (Number(e.target.value) >= 0) setQuantity(e.target.value);
  }, []);

  const trimmedBalance = Number(
    [
      sohmBalance,
      gOhmAsSohm,
      gOhmOnArbAsSohm,
      gOhmOnAvaxAsSohm,
      gOhmOnPolygonAsSohm,
      gOhmOnFantomAsSohm,
      gOhmOnTokemakAsSohm,
      sohmV1Balance,
      wsohmAsSohm,
      fiatDaoAsSohm,
      fsohmBalance,
      fgOHMAsfsOHMBalance,
    ]
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

  let stakeOnClick: () => Promise<{ payload: string; type: string } | undefined | void>;
  let stakeDisabled: boolean;
  let stakeButtonText: string;

  //set defaults. if unstake tab selected else use staking tab as default
  if (view === 1) {
    stakeDisabled = isPendingTxn(pendingTransactions, "approve_unstaking");
    stakeOnClick = () => onSeekApproval(confirmation ? "gohm" : "sohm");
    stakeButtonText = txnButtonText(pendingTransactions, "approve_unstaking", t`Approve`);
  } else {
    stakeDisabled = isPendingTxn(pendingTransactions, "approve_staking");
    stakeOnClick = () => onSeekApproval("ohm");
    stakeButtonText = txnButtonText(pendingTransactions, "approve_staking", t`Approve`);
  }

  //evaluate if data allowance data is finished loading
  if (!isAllowanceDataLoading) {
    //If Staking Tab
    if (view === 0) {
      if (address && hasAllowance("ohm")) {
        stakeDisabled = isPendingTxn(pendingTransactions, "staking");
        stakeOnClick = () => onChangeStake("stake");
        stakeButtonText = txnButtonText(
          pendingTransactions,
          "staking",
          `${t`Stake to`} ${confirmation ? " gOHM" : " sOHM"}`,
        );
      }
    }
    //If Unstaking Tab
    if (view === 1) {
      if ((address && hasAllowance("sohm") && !confirmation) || (hasAllowance("gohm") && confirmation)) {
        stakeDisabled = isPendingTxn(pendingTransactions, "unstaking");
        stakeOnClick = () => onChangeStake("unstake");
        stakeButtonText = txnButtonText(
          pendingTransactions,
          "unstaking",
          `${t`Unstake from`} ${confirmation ? " gOHM" : " sOHM"}`,
        );
      }
    }
  }

  return (
    <div id="stake-view">
      <Zoom in={true} onEntered={() => setZoomed(true)}>
        <Paper headerText={t`Single Stake (3, 3)`} subHeader={<RebaseTimer />}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <MetricCollection>
                <Metric
                  className="stake-apy"
                  label={t`APY`}
                  metric={`${formattedTrimmedStakingAPY}%`}
                  isLoading={stakingAPY ? false : true}
                />
                <Metric
                  className="stake-tvl"
                  label={t`Total Value Deposited`}
                  metric={formattedStakingTVL}
                  isLoading={stakingTVL ? false : true}
                />
                <Metric
                  className="stake-index"
                  label={t`Current Index`}
                  metric={`${formattedCurrentIndex} sOHM`}
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
                      //hides the tab underline sliding animation in while <Zoom> is loading
                      TabIndicatorProps={!zoomed ? { style: { display: "none" } } : undefined}
                    >
                      <Tab
                        aria-label="stake-button"
                        label={t({
                          id: "do_stake",
                          comment: "The action of staking (verb)",
                        })}
                      />
                      <Tab aria-label="unstake-button" label={t`Unstake`} />
                    </Tabs>
                    <Grid container className="stake-action-row">
                      {address && !isAllowanceDataLoading ? (
                        (!hasAllowance("ohm") && view === 0) ||
                        (!hasAllowance("sohm") && view === 1 && !confirmation) ||
                        (!hasAllowance("gohm") && view === 1 && confirmation) ? (
                          <>
                            <Grid item xs={12} sm={8} className="stake-grid-item">
                              <Box mt={"10px"}>
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
                                      <Trans>First time unstaking</Trans> <b>{confirmation ? "gOHM" : "sOHM"}</b>?
                                      <br />
                                      <Trans>Please approve Olympus Dao to use your</Trans>{" "}
                                      <b>{confirmation ? "gOHM" : "sOHM"}</b> <Trans>for unstaking</Trans>.
                                    </>
                                  )}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={4} className="stake-grid-item">
                              <Box mt={1}>
                                <PrimaryButton
                                  fullWidth
                                  className="stake-button"
                                  disabled={stakeDisabled}
                                  onClick={stakeOnClick}
                                >
                                  {stakeButtonText}
                                </PrimaryButton>
                              </Box>
                            </Grid>
                          </>
                        ) : (
                          <InputWrapper
                            id="amount-input"
                            type="number"
                            label={t`Enter an amount`}
                            value={quantity}
                            onChange={handleChangeQuantity}
                            labelWidth={0}
                            endString={t`Max`}
                            endStringOnClick={setMax}
                            buttonText={stakeButtonText}
                            buttonOnClick={stakeOnClick}
                            disabled={stakeDisabled}
                          />
                        )
                      ) : (
                        <Skeleton width="150px" />
                      )}
                    </Grid>
                  </Box>
                  <ConfirmDialog
                    quantity={quantity}
                    currentIndex={currentIndex}
                    view={view}
                    onConfirm={setConfirmation}
                  />
                  <div className="stake-user-data">
                    <DataRow
                      title={t`Unstaked Balance`}
                      id="user-balance"
                      balance={`${trim(Number(ohmBalance), 4)} OHM`}
                      isLoading={isAppLoading}
                    />
                    <Accordion className="stake-accordion" square defaultExpanded>
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
                          title={t`sOHM Balance`}
                          balance={`${trim(Number(sohmBalance), 4)} sOHM`}
                          indented
                          isLoading={isAppLoading}
                        />
                        <DataRow
                          title={`${t`gOHM Balance`}`}
                          balance={`${trim(Number(gOhmBalance), 4)} gOHM`}
                          indented
                          isLoading={isAppLoading}
                        />
                        {Number(gOhmOnArbitrum) > 0.00009 && (
                          <DataRow
                            title={`${t`gOHM (Arbitrum)`}`}
                            balance={`${trim(Number(gOhmOnArbitrum), 4)} gOHM`}
                            indented
                            {...{ isAppLoading }}
                          />
                        )}
                        {Number(gOhmOnAvax) > 0.00009 && (
                          <DataRow
                            title={`${t`gOHM (Avalanche)`}`}
                            balance={`${trim(Number(gOhmOnAvax), 4)} gOHM`}
                            indented
                            {...{ isAppLoading }}
                          />
                        )}
                        {Number(gOhmOnPolygon) > 0.00009 && (
                          <DataRow
                            title={`${t`gOHM (Polygon)`}`}
                            balance={`${trim(Number(gOhmOnPolygon), 4)} gOHM`}
                            indented
                            {...{ isAppLoading }}
                          />
                        )}
                        {Number(gOhmOnFantom) > 0.00009 && (
                          <DataRow
                            title={`${t`gOHM (Fantom)`}`}
                            balance={`${trim(Number(gOhmOnFantom), 4)} gOHM`}
                            indented
                            {...{ isAppLoading }}
                          />
                        )}
                        {Number(gOhmOnTokemak) > 0.00009 && (
                          <DataRow
                            title={`${t`gOHM (Tokemak)`}`}
                            balance={`${trim(Number(gOhmOnTokemak), 4)} gOHM`}
                            indented
                            isLoading={isAppLoading}
                          />
                        )}
                        {Number(fgohmBalance) > 0.00009 && (
                          <DataRow
                            title={`${t`gOHM Balance in Fuse`}`}
                            balance={`${trim(Number(fgohmBalance), 4)} gOHM`}
                            indented
                            isLoading={isAppLoading}
                          />
                        )}
                        {Number(sohmV1Balance) > 0.00009 && (
                          <DataRow
                            title={`${t`sOHM Balance`} (v1)`}
                            balance={`${trim(Number(sohmV1Balance), 4)} sOHM (v1)`}
                            indented
                            isLoading={isAppLoading}
                          />
                        )}
                        {Number(wsohmBalance) > 0.00009 && (
                          <DataRow
                            title={`${t`wsOHM Balance`} (v1)`}
                            balance={`${trim(Number(wsohmBalance), 4)} wsOHM (v1)`}
                            isLoading={isAppLoading}
                            indented
                          />
                        )}
                        {Number(fiatDaowsohmBalance) > 0.00009 && (
                          <DataRow
                            title={t`wsOHM Balance in FiatDAO (v1)`}
                            balance={`${trim(Number(fiatDaowsohmBalance), 4)} wsOHM (v1)`}
                            isLoading={isAppLoading}
                            indented
                          />
                        )}
                        {Number(fsohmBalance) > 0.00009 && (
                          <DataRow
                            title={t`sOHM Balance in Fuse (v1)`}
                            balance={`${trim(Number(fsohmBalance), 4)} sOHM (v1)`}
                            indented
                            isLoading={isAppLoading}
                          />
                        )}
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
      {/* NOTE (appleseed-olyzaps) olyzaps disabled until v2 contracts */}
      {/* <ZapCta /> */}
      <ExternalStakePool />
    </div>
  );
};

export default Stake;
