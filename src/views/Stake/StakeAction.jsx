import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@material-ui/core";
import "./stake.scss";
import { Skeleton } from "@material-ui/lab";
import { ethers } from "ethers";
import { changeApproval, changeStake } from "../../slices/StakeThunk";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3Context } from "src/hooks/web3Context";
import { error } from "../../slices/MessagesSlice";

function StakeAction(props) {
  const {
    hasAllowance,
    isAllowanceDataLoading,
    tokenFormatted,
    text,
    setQuantity,
    setMax,
    onSeekApproval,
    txnButtonText,
    // onChangeStake,
    isPendingTxn,
    quantity,
    pendingTransactions,
    approveTxnName,
    txnName,
    buttonLabel,
    actionType,
    children,
    balance,
    ...other
  } = props;

  const token = tokenFormatted.toLowerCase();

  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();

  const onChangeStake = async action => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || quantity === 0 || quantity === "") {
      // eslint-disable-next-line no-alert
      return dispatch(error("Please enter a value!"));
    }

    // 1st catch if quantity > balance
    let gweiValue = ethers.utils.parseUnits(quantity, "gwei");
    if (action === actionType && gweiValue.gt(ethers.utils.parseUnits(balance, "gwei"))) {
      return dispatch(error(`"You cannot ${actionType} more than your ${tokenFormatted} balance."`));
    }

    await dispatch(changeStake({ address, action, value: quantity.toString(), provider, networkID: chainID }));
  };
  return (
    <Grid container directio="row" spacing={2} alignItems="center">
      <Grid item xs={12} sm={8}>
        <Box paddingRight={1}>
          {address && !isAllowanceDataLoading ? (
            !hasAllowance(token) ? (
              <Box className="help-text">
                <Typography variant="body1" className="stake-note" color="textSecondary">
                  {children}
                </Typography>
              </Box>
            ) : (
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
                      <Button variant="text" onClick={() => setMax(token)} color="inherit">
                        Max
                      </Button>
                    </InputAdornment>
                  }
                />
              </FormControl>
            )
          ) : (
            <Skeleton width="150px" />
          )}
        </Box>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Box>
          {isAllowanceDataLoading ? (
            <Skeleton />
          ) : address && hasAllowance(token) ? (
            <Button
              fullWidth
              className="stake-button"
              variant="contained"
              color="primary"
              disabled={isPendingTxn(pendingTransactions, txnName)}
              onClick={() => {
                onChangeStake(actionType);
              }}
            >
              {txnButtonText(pendingTransactions, txnName, buttonLabel)}
            </Button>
          ) : (
            <Button
              fullWidth
              className="stake-button"
              variant="contained"
              color="primary"
              disabled={isPendingTxn(pendingTransactions, approveTxnName)}
              onClick={() => {
                onSeekApproval(token);
              }}
            >
              {txnButtonText(pendingTransactions, approveTxnName, "Approve")}
            </Button>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}

export default StakeAction;
