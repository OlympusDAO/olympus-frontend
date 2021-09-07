import { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Link,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import ConnectButton from "../../components/ConnectButton.jsx";
import { useWeb3Context } from "../../hooks";
import { trim, getTokenImage } from "src/helpers/index.js";
import { isPendingTxn, txnButtonText } from "../../slices/PendingTxnsSlice";
import { poolWithdraw } from "../../slices/PoolThunk";
import { getEarlyExitFee } from "../../slices/PoolThunk";
import { calculateOdds } from "../../helpers/33Together";

const sohmImg = getTokenImage("sohm");

export const PoolWithdraw = props => {
  const dispatch = useDispatch();
  const { provider, address, chainID } = useWeb3Context();
  const [quantity, setQuantity] = useState(0);
  const [exitFee, setExitFee] = useState(0);
  const [newOdds, setNewOdds] = useState(0);
  const isAppLoading = useSelector(state => state.app.loading);

  const poolBalance = useSelector(state => {
    return state.account.balances && parseFloat(state.account.balances.pool);
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const setMax = () => {
    setQuantity(poolBalance);
  };

  const onWithdraw = async action => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || quantity === 0 || quantity === "") {
      // eslint-disable-next-line no-alert
      alert("Please enter a value!");
    } else {
      await dispatch(poolWithdraw({ action, value: quantity.toString(), provider, address, networkID: chainID }));
    }
  };

  // go fetch the Exit Fee from the contract
  const calcEarlyExitFee = async () => {
    const result = await dispatch(
      getEarlyExitFee({ value: quantity.toString(), provider, address, networkID: chainID }),
    );
    if (result.payload) {
      let userBalanceAfterWithdraw = poolBalance - quantity;
      let userOdds = calculateOdds(userBalanceAfterWithdraw, props.totalPoolDeposits, props.winners);
      console.log("userOdds", userBalanceAfterWithdraw, props.totalPoolDeposits, props.winners, userOdds);
      setNewOdds(userOdds);
      setExitFee(result.payload.withdraw.stringExitFee);
    } else {
      alert(result.error.message);
      setExitFee(0);
    }
  };

  useEffect(() => {
    // when user types quantity display a warning with their early exit fee
    if (quantity > 0 && quantity <= poolBalance) {
      calcEarlyExitFee();
    } else if (quantity > poolBalance) {
      alert("You cannot withdraw more than your pool balance");
      setExitFee(0);
    }
  }, [quantity]);

  return (
    <Box display="flex" justifyContent="center" className="pool-deposit-ui">
      {!address ? (
        <ConnectButton />
      ) : (
        <Box>
          <Box display="flex" alignItems="center">
            <FormControl className="ohm-input" variant="outlined" color="primary">
              <InputLabel htmlFor="amount-input"></InputLabel>
              <OutlinedInput
                id="amount-input"
                type="number"
                placeholder="Enter an amount"
                className="pool-input"
                value={quantity}
                onChange={e => setQuantity(parseFloat(e.target.value))}
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
            <Button
              className="pool-withdraw-button"
              variant="contained"
              color="primary"
              disabled={isPendingTxn(pendingTransactions, "pool_withdraw")}
              onClick={() => onWithdraw("withdraw")}
            >
              {exitFee > 0
                ? txnButtonText(pendingTransactions, "pool_withdraw", "Withdraw Early & pay " + exitFee + " sOHM")
                : txnButtonText(pendingTransactions, "pool_withdraw", "Withdraw sOHM")}
              {/* Withdraw sOHM */}
            </Button>
          </Box>
          {exitFee > 0 && (
            <Box margin={2}>
              <Typography color="error">
                Oh no! You're attempting to withdraw early and therefore, are subject to a fairness fee of {exitFee}.
                &nbsp;
                <Link
                  href="https://docs.pooltogether.com/protocol/prize-pool/fairness"
                  target="_blank"
                  rel="noreferrer"
                  color="primary"
                >
                  Read more about Fairness
                </Link>
              </Typography>
            </Box>
          )}
          {newOdds > 0 && quantity > 0 && (
            <Box margin={2}>
              <Typography color="error">
                After withdrawing {quantity} sOHM your odds of winning would be 1 in {newOdds}.&nbsp;
              </Typography>
            </Box>
          )}
          <Box margin={2}>
            <Typography variant="body2">
              You can choose to withdraw the deposited fund at any time. By withdrawing the fund, you are eliminating /
              reducing the chance to win the prize in this pool in future prize periods
            </Typography>
          </Box>

          {/* NOTE (Appleseed): added this bc I kept losing track of which accounts I had sOHM in during testing */}
          <div className={`stake-user-data`}>
            <div className="data-row">
              <Typography variant="body1">Your Pooled Balance (withdrawable)</Typography>
              <Typography variant="body1">
                {isAppLoading ? (
                  <Skeleton width="80px" />
                ) : (
                  <>{new Intl.NumberFormat("en-US").format(poolBalance)} sOHM</>
                )}
              </Typography>
            </div>
          </div>
        </Box>
      )}
    </Box>
  );
};

PoolWithdraw.propTypes = {
  totalPoolDeposits: PropTypes.number,
  winners: PropTypes.number,
};
