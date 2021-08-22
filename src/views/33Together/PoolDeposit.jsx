import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Button, Typography, FormControl, InputLabel, OutlinedInput, InputAdornment } from "@material-ui/core";
import ConnectButton from "../../components/ConnectButton.jsx";
import { useWeb3Context } from "../../hooks";
import { trim, getTokenImage } from "src/helpers/index.js";
import { isPendingTxn, txnButtonText } from "../../slices/PendingTxnsSlice";

const sohmImg = getTokenImage("sohm");

export const PoolDeposit = () => {
  const dispatch = useDispatch();
  const { provider, address } = useWeb3Context();
  const [quantity, setQuantity] = useState(0);

  const sohmBalance = useSelector(state => {
    return state.app.balances && state.app.balances.sohm;
  });

  // const onSeekApproval = async token => {
  //   await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  // };

  // const hasAllowance = useCallback(
  //   token => {
  //     if (token === "sohm") return poolAllowance > 0;
  //     return 0;
  //   },
  //   [poolAllowance],
  // );

  const setMax = () => {
    setQuantity(sohmBalance);
  };

  return (
    <Box display="flex" justifyContent="center" className="pool-deposit-ui">
      {!address ? (
        <ConnectButton />
      ) : (
        <Box>
          <Typography>Deposit sOHM</Typography>
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
        </Box>
      )}
    </Box>
  );
};
