import { t, Trans } from "@lingui/macro";
import { Box, Grid, Tab, Tabs, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { InputWrapper, PrimaryButton } from "@olympusdao/component-library";
import { ethers } from "ethers";
import { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { getGohmBalFromSohm } from "src/helpers";
import { useAppSelector } from "src/hooks";
import { useWeb3Context } from "src/hooks/web3Context";
import { error } from "src/slices/MessagesSlice";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { changeApproval, changeStake } from "src/slices/StakeThunk";
import { changeApproval as changeGohmApproval } from "src/slices/WrapThunk";

import { ConfirmDialog } from "./components/ConfirmDialog/ConfirmDialog";

export const StakeInputArea: React.FC<{ isZoomed: boolean }> = props => {
  const dispatch = useDispatch();
  const { provider, address, networkId } = useWeb3Context();

  const [currentAction, setCurrentAction] = useState<"STAKE" | "UNSTAKE">("STAKE");

  const changeView: any = (_event: ChangeEvent<any>, newView: number) => {
    setCurrentAction(newView === 0 ? "STAKE" : "UNSTAKE");
  };

  const view = currentAction === "STAKE" ? 0 : 1;

  const [quantity, setQuantity] = useState("");
  const [confirmation, setConfirmation] = useState(false);

  const currentIndex = useAppSelector(state => {
    return state.app.currentIndex;
  });

  const ohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.ohm;
  });
  const sohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.sohm;
  });

  const gOhmAsSohm = useAppSelector(state => {
    return state.account.balances && state.account.balances.gOhmAsSohmBal;
  });

  const stakeAllowance = useAppSelector(state => {
    return (state.account.staking && state.account.staking.ohmStake) || 0;
  });
  const unstakeAllowance = useAppSelector(state => {
    return (state.account.staking && state.account.staking.ohmUnstake) || 0;
  });

  const directUnstakeAllowance = useAppSelector(state => {
    return (state.account.wrapping && state.account.wrapping.gOhmUnwrap) || 0;
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

  const hasAllowance = (token: string) => {
    if (token === "ohm") return stakeAllowance > 0;
    if (token === "sohm") return unstakeAllowance > 0;
    if (token === "gohm") return directUnstakeAllowance > 0;
    return 0;
  };

  const isAllowanceDataLoading = (stakeAllowance == null && view === 0) || (unstakeAllowance == null && view === 1);

  const handleChangeQuantity = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value) >= 0) setQuantity(event.target.value);
  };

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
      if (hasAllowance("ohm")) {
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
      if ((hasAllowance("sohm") && !confirmation) || (hasAllowance("gohm") && confirmation)) {
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
    <Box className="stake-action-area">
      <Tabs
        centered
        textColor="primary"
        onChange={changeView}
        aria-label="stake tabs"
        indicatorColor="primary"
        key={String(props.isZoomed)}
        className="stake-tab-buttons"
        value={currentAction === "STAKE" ? 0 : 1}
        //hides the tab underline sliding animation in while <Zoom> is loading
        TabIndicatorProps={!props.isZoomed ? { style: { display: "none" } } : undefined}
      >
        <Tab aria-label="stake-button" label={t({ id: "do_stake", comment: "The action of staking (verb)" })} />

        <Tab aria-label="unstake-button" label={t`Unstake`} />
      </Tabs>

      <Grid container className="stake-action-row">
        {!isAllowanceDataLoading ? (
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
                        <Trans>Please approve Olympus Dao to use your</Trans> <b>OHM</b> <Trans>for staking</Trans>.
                      </>
                    ) : (
                      <>
                        <Trans>First time unstaking</Trans> <b>{confirmation ? "gOHM" : "sOHM"}</b>?
                        <br />
                        <Trans>Please approve Olympus Dao to use your</Trans> <b>{confirmation ? "gOHM" : "sOHM"}</b>{" "}
                        <Trans>for unstaking</Trans>.
                      </>
                    )}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4} className="stake-grid-item">
                <Box mt={1}>
                  <PrimaryButton fullWidth className="stake-button" disabled={stakeDisabled} onClick={stakeOnClick}>
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

        <ConfirmDialog quantity={quantity} currentIndex={currentIndex} view={view} onConfirm={setConfirmation} />
      </Grid>
    </Box>
  );
};
