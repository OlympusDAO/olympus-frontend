import "./Stake.scss";

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
import { DataRow, Metric, MetricCollection, Paper, Tab, TabPanel, Tabs } from "@olympusdao/component-library";
import { ethers } from "ethers";
import { ChangeEvent, ChangeEventHandler, memo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { useAppSelector } from "src/hooks";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";

import RebaseTimer from "../../components/RebaseTimer/RebaseTimer";
import { getGohmBalFromSohm, trim } from "../../helpers";
import { error } from "../../slices/MessagesSlice";
import {
  ACTION_STAKE,
  ACTION_UNSTAKE,
  changeApproval,
  changeStake,
  PENDING_TXN_STAKING,
  PENDING_TXN_STAKING_APPROVE,
  PENDING_TXN_UNSTAKING,
  PENDING_TXN_UNSTAKING_APPROVE,
  TOKEN_GOHM,
  TOKEN_OHM,
  TOKEN_SOHM,
} from "../../slices/StakeThunk";
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
  const [usingGOhm, setUsingGOhm] = useState(false);

  const isAppLoading = useAppSelector(state => state.app.loading);
  const isBalanceLoading = useAppSelector(state => state.account.loadingBalance);
  const isAccountDetailsLoading = useAppSelector(state => state.account.loadingAccountDetails);
  const isAllowanceDataLoading = useAppSelector(state => state.account.staking.loading);

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
    } else if (!usingGOhm) {
      setQuantity(sohmBalance);
    } else if (usingGOhm) {
      setQuantity(gOhmAsSohm.toString());
    }
  };

  // TODO consider consolidating the approval functions into one
  /**
   * Requests approval to access the source token
   *
   * gOHM uses a different contract, so this function will handle the redirection
   *
   * @param sourceToken
   */
  const onSeekApproval = async (sourceToken: string) => {
    if (sourceToken === TOKEN_GOHM) {
      await dispatch(changeGohmApproval({ address, token: sourceToken.toLowerCase(), provider, networkID: networkId }));
    } else {
      await dispatch(changeApproval({ address, token: sourceToken, provider, networkID: networkId, version2: true }));
    }
  };

  // TODO consider consolidating the stake/unstake functions into one, with from and to assets
  /**
   * Handles interaction with staking/unstaking contracts, and formats numbers.
   */
  const onChangeStake = async (action: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(Number(quantity)) || Number(quantity) === 0 || Number(quantity) < 0) {
      // eslint-disable-next-line no-alert
      return dispatch(error(t`Please enter a value!`));
    }

    // 1st catch if quantity > balance
    const gweiValue = ethers.utils.parseUnits(quantity.toString(), "gwei");
    if (action === ACTION_STAKE && gweiValue.gt(ethers.utils.parseUnits(ohmBalance, "gwei"))) {
      return dispatch(error(t`You cannot stake more than your OHM balance.`));
    }

    if (
      usingGOhm === false &&
      action === ACTION_UNSTAKE &&
      gweiValue.gt(ethers.utils.parseUnits(sohmBalance, "gwei"))
    ) {
      return dispatch(
        error(
          t`You do not have enough sOHM to complete this transaction. To unstake from gOHM, please toggle the sohm-gohm switch.`,
        ),
      );
    }

    /**
     * converts sOHM quantity to gOHM quantity when box is checked for gOHM staking
     * @returns sOHM as gOHM quantity
     */
    // const formQuant = checked && currentIndex && view === 1 ? quantity / Number(currentIndex) : quantity;
    const formQuant = async () => {
      if (usingGOhm && currentIndex && view === 1) {
        return await getGohmBalFromSohm({ provider, networkID: networkId, sOHMbalance: quantity });
      } else {
        return quantity;
      }
    };

    // NOTE: the contracts handle unwrapping gOHM to OHM in the case of unstaking, so we don't need to worry about it here
    await dispatch(
      changeStake({
        address,
        action,
        value: await formQuant(),
        provider,
        networkID: networkId,
        version2: true,
        rebase: !usingGOhm,
      }),
    );
  };

  const hasAllowance: (token: string) => boolean = useCallback(
    token => {
      // TODO check allowances are revoked or not
      if (token === TOKEN_OHM) return stakeAllowance > 0;
      if (token === TOKEN_SOHM) return unstakeAllowance > 0;
      if (token === TOKEN_GOHM) return directUnstakeAllowance > 0;
      return false;
    },
    [stakeAllowance, unstakeAllowance, directUnstakeAllowance],
  );

  /*
    Borrows from MigrationModal.tsx
    There's an issue with MUI 4.x that results in a compilation error if
    we deviate from these parameter and return types.
    mui-org/material-ui#17454
  */
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

  const isLoading = () => {
    return isBalanceLoading || isAccountDetailsLoading || isAllowanceDataLoading;
  };

  const getTabArea = () => {
    /**
     * NOTE: this was split from a larger return statement so that under certain conditions, there
     * can be an early exit:
     * - no wallet connected: show a connect prompt only
     * - loading: show a skeleton component only
     *
     * Otherwise, there's a fairly complex layout of fields and buttons that would be difficult to split.
     */
    // If there is no wallet connected, we ask the user to connect
    if (!address) {
      return (
        <div className="stake-wallet-notification">
          <div className="wallet-menu" id="wallet-menu">
            <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
              <Trans>Connect Wallet</Trans>
            </Button>
            ,
          </div>
          <Typography variant="h6">
            <Trans>Connect your wallet to stake OHM</Trans>
          </Typography>
        </div>
      );
    }

    if (isLoading()) {
      return <Skeleton height={30} />;
    }

    const hasApprovalStaking = hasAllowance(TOKEN_OHM);
    const requiresStakingApproval = view === 0 && !hasApprovalStaking;
    const hasApprovalUnstaking = usingGOhm ? hasAllowance(TOKEN_GOHM) : hasAllowance(TOKEN_SOHM);
    const requiresUnstakingApproval = view === 1 && !hasApprovalUnstaking;

    /**
     * Returns the case-sensitive token name
     *
     * @returns string
     */
    const getTokenToUnstake = (): string => {
      return usingGOhm ? "gOHM" : "sOHM";
    };

    const getApprovalElements = () => {
      if (view === 0) {
        return (
          <>
            <Trans>First time staking</Trans> <b>OHM</b>?
            <br />
            <Trans>Please approve Olympus Dao to use your</Trans> <b>OHM</b> <Trans>for staking</Trans>.
          </>
        );
      }

      return (
        <>
          <Trans>First time unstaking</Trans> <b>{getTokenToUnstake()}</b>?
          <br />
          <Trans>Please approve Olympus Dao to use your</Trans> <b>{getTokenToUnstake()}</b>{" "}
          <Trans>for unstaking</Trans>.
        </>
      );
    };

    /**
     * Returns the pending transaction type for staking, given the current state.
     *
     * @returns string
     */
    const getStakePendingTxnType = (): string => {
      if (hasApprovalStaking) return PENDING_TXN_STAKING;

      return PENDING_TXN_STAKING_APPROVE;
    };

    /**
     * Handle the onClick event for a staking button.
     *
     * If approval is granted, it will perform the action.
     *
     * Otherwise it will seek approval.
     */
    const getStakeOnClickHandler = (): void => {
      if (hasApprovalStaking) {
        onChangeStake(ACTION_STAKE);
        return;
      }

      // When staking, the only token that can be used is TOKEN_OHM, so we don't need to perform any checks
      onSeekApproval(TOKEN_OHM);
    };

    /**
     * Provides the text for the staking button.
     *
     * @returns string
     */
    const getStakeButton = (): string => {
      return txnButtonText(
        pendingTransactions,
        getStakePendingTxnType(),
        hasApprovalStaking ? t`Stake to ${getTokenToUnstake()}` : t`Approve`,
      );
    };

    /**
     * Determines if the staking button should be disabled.
     *
     * @returns boolean
     */
    const isStakeButtonDisabled = (): boolean => {
      if (isPendingTxn(pendingTransactions, getStakePendingTxnType())) return true;

      // If approval is not yet given, then we should enable the button to let that happen
      if (!hasApprovalStaking) return false;

      if (!quantity) return true;

      return false;
    };

    /**
     * Returns the pending transaction type for unstaking, given the current state.
     *
     * @returns string
     */
    const getUnstakePendingTxnType = (): string => {
      if (hasApprovalUnstaking) return PENDING_TXN_UNSTAKING;

      return PENDING_TXN_UNSTAKING_APPROVE;
    };

    /**
     * Handle the onClick event for an unstaking button.
     *
     * If approval is granted, it will perform the action.
     *
     * Otherwise it will seek approval.
     */
    const getUnstakeOnClickHandler = (): void => {
      if (hasApprovalUnstaking) {
        onChangeStake(ACTION_UNSTAKE);
        return;
      }

      onSeekApproval(getTokenToUnstake().toLowerCase());
    };

    /**
     * Provides the text for the unstaking button.
     *
     * @returns string
     */
    const getUnstakeButton = (): string => {
      return txnButtonText(
        pendingTransactions,
        getUnstakePendingTxnType(),
        hasApprovalUnstaking ? t`Unstake from ${getTokenToUnstake()}` : t`Approve`,
      );
    };

    /**
     * Determines if the unstaking button should be disabled.
     *
     * @returns boolean
     */
    const isUnstakeButtonDisabled = (): boolean => {
      if (isPendingTxn(pendingTransactions, getUnstakePendingTxnType())) return true;

      // If approval is not yet given, then we should enable the button to let that happen
      if (!hasApprovalUnstaking) return false;

      if (!quantity) return true;

      return false;
    };

    // TODO add balance warning
    // TODO remember gOHM toggle post transaction

    return (
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
            // hides the tab underline sliding animation in while <Zoom> is loading
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
            <Grid item xs={12} sm={8} className="stake-grid-item">
              {
                // If for the given action (view), approval is needed, show the explanatory text
                // Otherwise give an input field
                requiresStakingApproval || requiresUnstakingApproval ? (
                  <Box mt={"10px"}>
                    <Typography variant="body1" className="stake-note" color="textSecondary">
                      {getApprovalElements()}
                    </Typography>
                  </Box>
                ) : (
                  <FormControl className="ohm-input" variant="outlined" color="primary">
                    <InputLabel htmlFor="amount-input" />
                    <OutlinedInput
                      id="amount-input"
                      type="number"
                      placeholder="Enter an amount"
                      className="stake-input"
                      value={quantity}
                      onChange={handleChangeQuantity}
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
              }
            </Grid>
            <Grid item xs={12} sm={4} className="stake-grid-item">
              <TabPanel value={view} index={0}>
                <Box m={-2}>
                  <Button
                    className="stake-button"
                    variant="contained"
                    color="primary"
                    disabled={isStakeButtonDisabled()}
                    onClick={getStakeOnClickHandler}
                  >
                    {getStakeButton()}
                  </Button>
                </Box>
              </TabPanel>

              <TabPanel value={view} index={1}>
                <Box m={-2}>
                  <Button
                    className="stake-button"
                    variant="contained"
                    color="primary"
                    disabled={isUnstakeButtonDisabled()}
                    onClick={getUnstakeOnClickHandler}
                  >
                    {getUnstakeButton()}
                  </Button>
                </Box>
              </TabPanel>
            </Grid>
          </Grid>
        </Box>
        <ConfirmDialog
          quantity={quantity}
          isLoading={isBalanceLoading && isAccountDetailsLoading}
          currentIndex={currentIndex}
          view={view}
          onConfirm={setUsingGOhm}
          initialChecked={usingGOhm}
        />
      </>
    );
  };

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
                  isLoading={!stakingAPY}
                />
                <Metric
                  className="stake-tvl"
                  label={t`Total Value Deposited`}
                  metric={formattedStakingTVL}
                  isLoading={!stakingTVL}
                />
                <Metric
                  className="stake-index"
                  label={t`Current Index`}
                  metric={`${formattedCurrentIndex} sOHM`}
                  isLoading={!currentIndex}
                />
              </MetricCollection>
            </Grid>
            <div className="staking-area">
              {getTabArea()}
              <div className="stake-user-data">
                <DataRow
                  title={t`Unstaked Balance`}
                  id="user-balance"
                  balance={`${trim(Number(ohmBalance), 4)} OHM`}
                  isLoading={isBalanceLoading}
                />
                <Accordion className="stake-accordion" square defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMore className="stake-expand" />}>
                    <DataRow
                      title={t`Total Staked Balance`}
                      id="user-staked-balance"
                      balance={`${trimmedBalance} sOHM`}
                      isLoading={isBalanceLoading}
                    />
                  </AccordionSummary>
                  <AccordionDetails>
                    <DataRow
                      title={t`sOHM Balance`}
                      balance={`${trim(Number(sohmBalance), 4)} sOHM`}
                      indented
                      isLoading={isBalanceLoading}
                    />
                    <DataRow
                      title={`${t`gOHM Balance`}`}
                      balance={`${trim(Number(gOhmBalance), 4)} gOHM`}
                      indented
                      isLoading={isBalanceLoading}
                    />
                    {Number(gOhmOnArbitrum) > 0.00009 && (
                      <DataRow
                        title={`${t`gOHM (Arbitrum)`}`}
                        balance={`${trim(Number(gOhmOnArbitrum), 4)} gOHM`}
                        indented
                        isLoading={isBalanceLoading}
                      />
                    )}
                    {Number(gOhmOnAvax) > 0.00009 && (
                      <DataRow
                        title={`${t`gOHM (Avalanche)`}`}
                        balance={`${trim(Number(gOhmOnAvax), 4)} gOHM`}
                        indented
                        isLoading={isBalanceLoading}
                      />
                    )}
                    {Number(gOhmOnPolygon) > 0.00009 && (
                      <DataRow
                        title={`${t`gOHM (Polygon)`}`}
                        balance={`${trim(Number(gOhmOnPolygon), 4)} gOHM`}
                        indented
                        isLoading={isBalanceLoading}
                      />
                    )}
                    {Number(gOhmOnFantom) > 0.00009 && (
                      <DataRow
                        title={`${t`gOHM (Fantom)`}`}
                        balance={`${trim(Number(gOhmOnFantom), 4)} gOHM`}
                        indented
                        isLoading={isBalanceLoading}
                      />
                    )}
                    {Number(gOhmOnTokemak) > 0.00009 && (
                      <DataRow
                        title={`${t`gOHM (Tokemak)`}`}
                        balance={`${trim(Number(gOhmOnTokemak), 4)} gOHM`}
                        indented
                        isLoading={isBalanceLoading}
                      />
                    )}
                    {Number(fgohmBalance) > 0.00009 && (
                      <DataRow
                        title={`${t`gOHM Balance in Fuse`}`}
                        balance={`${trim(Number(fgohmBalance), 4)} gOHM`}
                        indented
                        isLoading={isBalanceLoading}
                      />
                    )}
                    {Number(sohmV1Balance) > 0.00009 && (
                      <DataRow
                        title={`${t`sOHM Balance`} (v1)`}
                        balance={`${trim(Number(sohmV1Balance), 4)} sOHM (v1)`}
                        indented
                        isLoading={isBalanceLoading}
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
                        isLoading={isBalanceLoading}
                        indented
                      />
                    )}
                    {Number(fsohmBalance) > 0.00009 && (
                      <DataRow
                        title={t`sOHM Balance in Fuse (v1)`}
                        balance={`${trim(Number(fsohmBalance), 4)} sOHM (v1)`}
                        isLoading={isBalanceLoading}
                        indented
                      />
                    )}
                  </AccordionDetails>
                </Accordion>
                <Divider color="secondary" />
                <DataRow
                  title={t`Next Reward Amount`}
                  balance={`${nextRewardValue} sOHM`}
                  isLoading={isAppLoading || isBalanceLoading}
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

export default memo(Stake);
