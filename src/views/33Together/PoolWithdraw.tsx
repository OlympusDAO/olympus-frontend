import { t, Trans } from "@lingui/macro";
import { Box, Link, SvgIcon, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { InputWrapper } from "@olympusdao/component-library";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ReactComponent as ArrowUp } from "src/assets/icons/arrow-up.svg";
import { trim } from "src/helpers";

import ConnectButton from "../../components/ConnectButton/ConnectButton";
import { calculateOdds } from "../../helpers/33Together";
import { useAppDispatch, useAppSelector, useWeb3Context } from "../../hooks";
import { error } from "../../slices/MessagesSlice";
import { isPendingTxn, txnButtonText } from "../../slices/PendingTxnsSlice";
import { getEarlyExitFee, IEarlyExitFeePayload, poolWithdraw } from "../../slices/PoolThunk";

interface IPoolWithdrawProps {
  readonly totalPoolDeposits: number;
  readonly winners: string;
  readonly setInfoTooltipMessage: Dispatch<SetStateAction<string[]>>;
}

export const PoolWithdraw = (props: IPoolWithdrawProps) => {
  const dispatch = useAppDispatch();
  const { provider, address, networkId } = useWeb3Context();
  const [quantity, setQuantity] = useState(0);
  const [exitFee, setExitFee] = useState(0);
  const [newOdds, setNewOdds] = useState(0);
  const isPoolLoading = useAppSelector(state => state.poolData.loading);

  const poolBalance = useAppSelector(state => {
    return state.account.balances && parseFloat(state.account.balances.pool);
  });

  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });

  const poolIsLocked = useAppSelector(state => {
    return state.poolData && state.poolData.isRngRequested;
  });

  const setMax = () => {
    setQuantity(poolBalance);
  };

  const onWithdraw = async (action: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || quantity === 0) {
      // eslint-disable-next-line no-alert
      dispatch(error(t`Please enter a value!`));
    } else {
      await dispatch(
        poolWithdraw({
          action,
          value: quantity.toString(),
          provider,
          address,
          networkID: networkId,
        }),
      );
    }
  };

  // go fetch the Exit Fee from the contract
  const calcEarlyExitFee = async () => {
    const result = await dispatch(
      getEarlyExitFee({ value: quantity.toString(), provider, address, networkID: networkId }),
    );
    if (result.payload) {
      const userBalanceAfterWithdraw = poolBalance - quantity;
      const userOdds = calculateOdds(
        userBalanceAfterWithdraw.toString(),
        props.totalPoolDeposits,
        Number(props.winners),
      );
      setNewOdds(Number(trim(Number(userOdds), 4)));
      setExitFee(Number((result.payload as IEarlyExitFeePayload).withdraw.stringExitFee));
    } else {
      // (0xdavinchee): use as any for now, but figure out how to handle types for
      // dispatch properly
      dispatch(error((result as any).error.message));
      setExitFee(0);
    }
  };

  useEffect(() => {
    // when user types quantity display a warning with their early exit fee
    if (quantity > 0 && quantity <= poolBalance) {
      calcEarlyExitFee();
    } else if (quantity > poolBalance) {
      dispatch(error(t`You cannot withdraw more than your pool balance`));
      setExitFee(0);
    }
  }, [quantity]);

  useEffect(() => {
    props.setInfoTooltipMessage([
      t`You can choose to withdraw the deposited fund at any time. By withdrawing the fund, you are eliminating reducing the chance to win the prize in this pool in future prize periods`,
    ]);
  }, []);

  if (poolIsLocked) {
    return (
      <Box display="flex" alignItems="center" className="pool-deposit-ui" flexDirection="column">
        {/*<img src={Warning} className="w-10 sm:w-14 mx-auto mb-4" />*/}
        <Typography variant="h6">
          <Trans>This Prize Pool is unable to accept withdrawals at this time.</Trans>
        </Typography>
        <Typography variant="body1" style={{ marginTop: "0.5rem" }}>
          <Trans>Withdrawals can be made once the prize has been awarded.</Trans>
        </Typography>
        <Typography variant="body1" style={{ marginTop: "0.5rem" }}>
          <Trans>Check back soon!</Trans>
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Typography variant="body1" style={{ margin: "0.5rem" }} align="center">
        <Trans>The pool has been temporarily disabled for V2 Migration. Please withdraw your 33T</Trans>
      </Typography>
      <Typography variant="body1" style={{ margin: "0.5rem" }} align="center">
        <Trans>(The 6-day early exit fee has been waived. Network fees apply.)</Trans>
      </Typography>
      <Box display="flex" justifyContent="center" className="pool-deposit-ui">
        {!address ? (
          <ConnectButton />
        ) : (
          <Box className="withdrawal-container">
            <InputWrapper
              id="amount-input"
              type="number"
              placeholder="Enter an amount"
              value={quantity}
              onChange={e => setQuantity(parseFloat(e.target.value))}
              startAdornment="sOHM"
              labelWidth={0}
              endString={t`Max`}
              endStringOnClick={setMax}
              buttonText={
                exitFee > 0
                  ? txnButtonText(pendingTransactions, "pool_withdraw", t`Withdraw Early & pay` + exitFee + " sOHM")
                  : txnButtonText(pendingTransactions, "pool_withdraw", t`Withdraw sOHM`)
              }
              disabled={isPendingTxn(pendingTransactions, "pool_withdraw")}
              buttonOnClick={() => onWithdraw("withdraw")}
            />
            {newOdds > 0 && quantity > 0 && (
              <Box padding={1}>
                <Typography color="error" variant="body2">
                  <Trans>
                    Withdrawing {quantity} sOHM reduces your odds of winning to 1 in {newOdds}
                  </Trans>
                  &nbsp;
                </Typography>
              </Box>
            )}
            {exitFee > 0 && (
              <Box margin={1}>
                <Typography color="error">
                  <Trans>Early withdraw will incur a fairness fee of {exitFee}.</Trans> &nbsp;
                  <Link
                    href="https://v3.docs.pooltogether.com/protocol/prize-pool/fairness"
                    target="_blank"
                    rel="noreferrer"
                    color="primary"
                  >
                    <br />
                    <Trans>Read more about Fairness</Trans>{" "}
                    <SvgIcon component={ArrowUp} style={{ fontSize: "1rem", verticalAlign: "middle" }} />
                  </Link>
                </Typography>
              </Box>
            )}
            {/* NOTE (Appleseed): added this bc I kept losing track of which accounts I had sOHM in during testing */}
            <div className={`stake-user-data`}>
              <div className="data-row">
                <Typography variant="body1" align="left">
                  <Trans>Your Pooled Balance (withdrawable)</Trans>
                </Typography>
                <Typography variant="body1" align="right">
                  {isPoolLoading ? (
                    <Skeleton width="80px" />
                  ) : (
                    <>{new Intl.NumberFormat("en-US").format(poolBalance)} 33T</>
                  )}
                </Typography>
              </div>
            </div>
          </Box>
        )}
      </Box>
    </>
  );
};
