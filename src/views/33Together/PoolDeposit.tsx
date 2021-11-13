import { useCallback, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import ConnectButton from "src/components/ConnectButton";
import { useAppSelector, useWeb3Context } from "src/hooks";
import { getTokenImage } from "src/helpers/index";
import { calculateOdds, trimOdds } from "src/helpers/33Together";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { changeApproval, poolDeposit } from "src/slices/PoolThunk";
import { Skeleton } from "@material-ui/lab";
import { error } from "src/slices/MessagesSlice";

const sohmImg = getTokenImage("sohm");

interface PoolDepositProps {
  totalPoolDeposits: number;
  winners: string | number;
  setInfoTooltipMessage: (messages: Array<string>) => void;
}

export const PoolDeposit = (props: PoolDepositProps) => {
  const dispatch = useDispatch();
  const { provider, address, chainID } = useWeb3Context();
  const [quantity, setQuantity] = useState(0);
  const [newOdds, setNewOdds] = useState<string | number>(0);
  const isAppLoading = useAppSelector(state => state.app.loading);
  const isMobileScreen = useMediaQuery("(max-width: 513px)");

  const sohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.sohm;
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

  const onSeekApproval = (token: string) => dispatch(changeApproval({ address, token, provider, networkID: chainID }));

  const onDeposit = (action: string) => {
    if (isNaN(quantity) || quantity === 0) {
      dispatch(error("Please enter a value!"));
    } else {
      dispatch(poolDeposit({ address, action, value: quantity.toString(), provider, networkID: chainID }));
    }
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
    setNewOdds(trimOdds(userOdds));
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
    setNewOdds(trimOdds(userOdds));
  };

  useEffect(() => {
    props.setInfoTooltipMessage([
      "Deposit sOHM to win! Once deposited, you will receive a corresponding amount of 33T and be entered to win until your sOHM is withdrawn.",
    ]);
  }, []);

  if (poolIsLocked) {
    return (
      <Box display="flex" alignItems="center" className="pool-deposit-ui" flexDirection="column">
        {/*<img src={Warning} className="w-10 sm:w-14 mx-auto mb-4" />*/}
        <Typography variant="h6">This Prize Pool is unable to accept deposits at this time.</Typography>
        <Typography variant="body1" style={{ marginTop: "0.5rem" }}>
          Deposits can be made once the prize has been awarded.
        </Typography>
        <Typography variant="body1" style={{ marginTop: "0.5rem" }}>
          Check back soon!
        </Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" className="pool-deposit-ui">
      {!address ? (
        <ConnectButton />
      ) : (
        <Box className="deposit-container">
          <Box display="flex" alignItems="center" flexDirection={`${isMobileScreen ? "column" : "row"}`}>
            <FormControl className="ohm-input" variant="outlined" color="primary">
              <InputLabel htmlFor="amount-input"></InputLabel>
              <OutlinedInput
                id="amount-input"
                type="number"
                placeholder="Enter an amount"
                className="pool-input"
                value={quantity}
                onChange={e => updateDepositQuantity(e)}
                startAdornment={
                  <InputAdornment position="start">
                    <div className="logo-holder">{sohmImg}</div>
                  </InputAdornment>
                }
                labelWidth={0}
                endAdornment={
                  <InputAdornment position="end">
                    <Button variant="text" onClick={setMax}>
                      Max
                    </Button>
                  </InputAdornment>
                }
              />
            </FormControl>

            {address && hasAllowance() ? (
              <Button
                className="pool-deposit-button"
                variant="contained"
                color="primary"
                disabled={isPendingTxn(pendingTransactions, "pool_deposit")}
                onClick={() => onDeposit("deposit")}
                fullWidth
              >
                {txnButtonText(pendingTransactions, "pool_deposit", "Deposit sOHM")}
              </Button>
            ) : (
              <Button
                className="pool-deposit-button"
                variant="contained"
                color="primary"
                disabled={isPendingTxn(pendingTransactions, "approve_pool_together")}
                onClick={() => onSeekApproval("sohm")}
              >
                {txnButtonText(pendingTransactions, "approve_pool_together", "Approve")}
              </Button>
            )}
          </Box>
          {newOdds > 0 && quantity > 0 && (
            <Box padding={1}>
              <Typography variant="body2" style={{ color: "#33BB33" }}>
                Depositing {quantity} sOHM will increase odds of winning to 1 in {newOdds}&nbsp;
              </Typography>
            </Box>
          )}
          {/* NOTE (Appleseed): added this bc I kept losing track of which accounts I had sOHM in during testing */}
          <div className={`stake-user-data`}>
            <div className="data-row">
              <Typography variant="body1" align="left">
                Your Staked Balance (depositable)
              </Typography>
              <Typography variant="body1" align="right">
                {isAppLoading ? (
                  <Skeleton width="80px" />
                ) : (
                  <>{new Intl.NumberFormat("en-US").format(parseFloat(sohmBalance))} sOHM</>
                )}
              </Typography>
            </div>
          </div>
        </Box>
      )}
    </Box>
  );
};
