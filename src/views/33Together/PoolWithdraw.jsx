import { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Button, Typography, FormControl, InputLabel, OutlinedInput, InputAdornment } from "@material-ui/core";
import ConnectButton from "../../components/ConnectButton.jsx";
import { useWeb3Context } from "../../hooks";
import { trim, getTokenImage } from "src/helpers/index.js";
import { isPendingTxn, txnButtonText } from "../../slices/PendingTxnsSlice";
import { poolWithdraw } from "../../slices/PoolThunk";

const sohmImg = getTokenImage("sohm");

export const PoolWithdraw = () => {
  const dispatch = useDispatch();
  const { provider, address, chainID } = useWeb3Context();
  const [quantity, setQuantity] = useState(0);

  const poolBalance = useSelector(state => {
    return state.app.balances && state.app.balances.poolBalance;
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const setMax = () => {
    setQuantity(poolBalance);
  };

  const onWithdraw = () => {
    console.log("withdrawing");
  };

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
                onChange={e => setQuantity(e.target.value)}
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
              onClick={() => onWithdraw()}
            >
              {/* {txnButtonText(pendingTransactions, "pool_withdraw", "Withdraw")} */}
              Withdraw
            </Button>
          </Box>
          <Box margin={2}>
            <Typography variant="body2">
              You can choose to withdraw the deposited fund at any time. By withdrawing the fund, you are eliminating /
              reducing the chance to win the prize in this pool in future prize periods
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};
