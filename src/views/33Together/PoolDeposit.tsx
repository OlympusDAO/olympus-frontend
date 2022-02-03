import { t, Trans } from "@lingui/macro";
import { Box, Typography, useMediaQuery } from "@material-ui/core";
import { DataRow, InputWrapper } from "@olympusdao/component-library";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { calculateOdds, trimOdds } from "src/helpers/33Together";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { changeApproval, poolDeposit } from "src/slices/PoolThunk";

import ConnectButton from "../../components/ConnectButton/ConnectButton";
import { useAppSelector, useWeb3Context } from "../../hooks";
import { error } from "../../slices/MessagesSlice";
import { ConfirmationModal } from "./ConfirmationModal";

interface PoolDepositProps {
  totalPoolDeposits: number;
  winners: string | number;
  setInfoTooltipMessage: (messages: Array<string>) => void;
}

export const PoolDeposit = (props: PoolDepositProps) => {
  const dispatch = useDispatch();
  const { provider, address, networkId } = useWeb3Context();
  const isAppLoading = useAppSelector(state => state.app.loading);
  const [quantity, setQuantity] = useState(0);
  const [newOdds, setNewOdds] = useState(0);
  const [isDepositing, setDepositing] = useState(false);
  const isMobileScreen = useMediaQuery("(max-width: 513px)");

  const sohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.sohmV1;
  });

  const poolBalance = useAppSelector(state => {
    return state.account.balances && parseFloat(state.account.balances.pool);
  });

  const poolAllowance = useAppSelector(state => {
    return state.account.pooling && state.account.pooling.sohmPool;
  });

  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });

  const poolIsLocked = useAppSelector(state => {
    return state.poolData && state.poolData.isRngRequested;
  });

  const onSeekApproval = async (token: string) => {
    await dispatch(changeApproval({ address, token, provider, networkID: networkId }));
  };

  const onDeposit = async (action: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || quantity === 0) {
      // eslint-disable-next-line no-alert
      dispatch(error(t`Please enter a value!`));
    } else {
      setDepositing(true);
    }
  };

  const onSubmitDeposit = async (action: string) => {
    await dispatch(
      poolDeposit({
        address,
        action,
        value: quantity.toString(),
        provider,
        networkID: networkId,
      }),
    );
  };

  const hasAllowance = useCallback(() => {
    return poolAllowance > 0;
  }, [poolAllowance]);

  const setMax = () => {
    const value = parseFloat(sohmBalance);
    setQuantity(value);
    const userBalanceAfterDeposit = poolBalance + value;

    const userOdds = calculateOdds(
      userBalanceAfterDeposit.toString(),
      props.totalPoolDeposits + value,
      parseFloat(props.winners.toString()),
    );
    setNewOdds(Number(trimOdds(userOdds)));
  };

  const updateDepositQuantity = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = parseFloat(e.target.value);
    setQuantity(value);
    const userBalanceAfterDeposit = poolBalance + value;

    const userOdds = calculateOdds(
      userBalanceAfterDeposit.toString(),
      props.totalPoolDeposits + value,
      parseFloat(props.winners.toString()),
    );
    setNewOdds(Number(trimOdds(userOdds)));
  };

  useEffect(() => {
    props.setInfoTooltipMessage([
      t`Deposit sOHM to win! Once deposited, you will receive a corresponding amount of 33T and be entered to win until your sOHM is withdrawn.`,
    ]);
  }, []);

  if (poolIsLocked) {
    return (
      <Box display="flex" alignItems="center" className="pool-deposit-ui" flexDirection="column">
        {/*<img src={Warning} className="w-10 sm:w-14 mx-auto mb-4" />*/}
        <Typography variant="h6">
          <Trans>This Prize Pool is unable to accept deposits at this time.</Trans>
        </Typography>
        <Typography variant="body1" style={{ marginTop: "0.5rem" }}>
          <Trans>Deposits can be made once the prize has been awarded.</Trans>
        </Typography>
        <Typography variant="body1" style={{ marginTop: "0.5rem" }}>
          <Trans>Check back soon!</Trans>
        </Typography>
      </Box>
    );
  }
  let inputWrapperOnClick: () => Promise<void>;
  let inputWrapperDisabled: boolean;
  let inputWrapperButtonText: string;
  if (address && hasAllowance()) {
    inputWrapperDisabled = isPendingTxn(pendingTransactions, "pool_deposit");
    inputWrapperButtonText = txnButtonText(pendingTransactions, "pool_deposit", t`Deposit sOHM`);
    inputWrapperOnClick = () => onDeposit("deposit");
  } else {
    inputWrapperDisabled = isPendingTxn(pendingTransactions, "approve_pool_together");
    inputWrapperButtonText = txnButtonText(pendingTransactions, "approve_pool_together", t`Approve`);
    inputWrapperOnClick = () => onSeekApproval("sohm");
  }
  return (
    <Box display="flex" justifyContent="center" className="pool-deposit-ui">
      {!address ? (
        <ConnectButton />
      ) : (
        <Box className="deposit-container">
          <InputWrapper
            id="amount-input"
            type="number"
            placeholder={t`Enter an amount`}
            value={quantity}
            onChange={e => updateDepositQuantity(e)}
            startAdornment="sOHM"
            labelWidth={0}
            endString={t`Max`}
            endStringOnClick={setMax}
            buttonText={inputWrapperButtonText}
            disabled={inputWrapperDisabled}
            buttonOnClick={inputWrapperOnClick}
          />
          {newOdds > 0 && quantity > 0 && (
            <Box padding={1}>
              <Typography variant="body2" style={{ color: "#33BB33" }}>
                <Trans>
                  Depositing {quantity} sOHM will increase odds of winning to 1 in {newOdds}
                </Trans>
                &nbsp;
              </Typography>
            </Box>
          )}
          {/* NOTE (Appleseed): added this bc I kept losing track of which accounts I had sOHM in during testing */}
          <div className={`stake-user-data`}>
            <DataRow
              title={t`Your Staked Balance (Depositable)`}
              balance={`${new Intl.NumberFormat("en-US").format(parseFloat(sohmBalance))} sOHM`}
              isLoading={isAppLoading}
            />
          </div>
        </Box>
      )}
      {isDepositing && (
        <ConfirmationModal
          show={isDepositing}
          quantity={quantity}
          onClose={() => setDepositing(false)}
          onSubmit={() => {
            setDepositing(false);
            onSubmitDeposit("deposit");
          }}
        />
      )}
    </Box>
  );
};
