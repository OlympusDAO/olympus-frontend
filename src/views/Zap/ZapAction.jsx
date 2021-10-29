import {
  Box,
  Button,
  FormControl,
  Grid,
  Icon,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Avatar,
  Typography,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  IconButton,
  CardHeader,
  ListItemText,
  CircularProgress,
} from "@material-ui/core";
import { getTokenBalances } from "src/slices/ZapSlice";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ButtonBase } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";

function ZapAction(props) {
  const { address, quantity, setQuantity, ...other } = props;

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "primary.secondary",
    // border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  //   const tokens = ["ETH", "OHM"];

  const tokens = useSelector(state => state.zap.balances);
  const isTokensLoading = useSelector(state => state.zap.loading);

  const [zapToken, setZapToken] = useState(null);
  const handleSelectZapToken = token => {
    setZapToken(token);
    handleClose();
  };

  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpen = () => {
    setModalOpen(true);
  };
  const handleClose = () => setModalOpen(false);
  //   dispatch(getTokenBalances({ address }));
  const [inputQuantity, setInputQuantity] = useState("");
  const [outputQuantity, setOutputQuantity] = useState("");
  const exchangeRate = 2.0;

  const setZapTokenQuantity = q => {
    if (q == null || q === "") {
      setInputQuantity("");
      setOutputQuantity("");
      return;
    }
    const amount = Number(q);
    setInputQuantity(amount);
    setOutputQuantity(exchangeRate * amount);
  };

  const setOutputTokenQuantity = q => {
    if (q == null || q === "") {
      setInputQuantity("");
      setOutputQuantity("");
      return;
    }
    const amount = Number(q);
    setOutputQuantity(amount);
    setInputQuantity(amount / exchangeRate);
  };

  return (
    <div>
      <Typography>You Pay</Typography>
      <FormControl className="zap-input" variant="outlined" color="primary">
        <InputLabel htmlFor="amount-input"></InputLabel>
        <OutlinedInput
          id="zap-amount-input"
          type="number"
          placeholder="Enter an amount"
          className="stake-input"
          value={inputQuantity}
          onChange={e => setZapTokenQuantity(e.target.value)}
          //   labelWidth={0}
          //   label="Hello"
          endAdornment={
            <InputAdornment position="end">
              <ButtonBase onClick={handleOpen}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    minWidth: "60px",
                  }}
                >
                  {zapToken == null ? (
                    <Typography>Select a Token</Typography>
                  ) : (
                    <>
                      <Avatar src={tokens[zapToken].img} style={{ height: "30px", width: "30px" }} />
                      <Box width="20px" />
                      <Typography>{tokens[zapToken].symbol}</Typography>
                    </>
                  )}
                  <KeyboardArrowDownIcon />
                </div>
              </ButtonBase>
            </InputAdornment>
          }
        />
      </FormControl>
      <Box marginTop="10px" minHeight="25px" display="flex" justifyContent="center" alignItems="center">
        <KeyboardArrowDownIcon />
      </Box>

      <Typography>You Get</Typography>
      <FormControl className="zap-output" variant="outlined" color="primary">
        <InputLabel htmlFor="amount-input"></InputLabel>
        <OutlinedInput
          id="zap-amount-output"
          type="number"
          placeholder="Enter an amount"
          className="stake-input"
          value={outputQuantity}
          onChange={e => setOutputTokenQuantity(e.target.value)}
          labelWidth={0}
          endAdornment={
            <InputAdornment position="end">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  minWidth: "60px",
                }}
              >
                <Avatar
                  src="https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x04f2694c8fcee23e8fd0dfea1d4f5bb8c352111f.png"
                  style={{ height: "30px", width: "30px" }}
                />
                <Box width="20px" />
                <Typography>sOHM</Typography>
              </div>
            </InputAdornment>
          }
        />
      </FormControl>
      <Box justifyContent="space-between" flexDirection="row" display="flex" marginY="20px">
        <Typography>Slippage</Typography>
        <Typography>0.03%</Typography>
      </Box>
      <Box justifyContent="space-between" flexDirection="row" display="flex" marginY="20px">
        <Typography>Exchange Rate</Typography>
        <Typography>$X $TOKEN = $Y sOHM</Typography>
      </Box>
      <Button
        fullWidth
        className="zap-stake-button"
        variant="contained"
        color="primary"
        // disabled={isPendingTxn(pendingTransactions, approveTxnName)}
        onClick={() => {
          onSeekApproval(token);
        }}
      >
        {/* {txnButtonText(pendingTransactions, approveTxnName, "Approve")} */}
        Zap-Stake
      </Button>

      <Dialog onClose={handleClose} open={modalOpen} keepMounted fullWidth maxWidth="xs">
        <DialogTitle>Select Zap Token</DialogTitle>
        <List sx={{ pt: 0 }}>
          {Object.entries(tokens)
            .filter(token => !token[1].hide)
            .sort((tokenA, tokenB) => tokenB[1].balanceUSD - tokenA[1].balanceUSD)
            .map(token => (
              <ListItem button onClick={() => handleSelectZapToken(token[0])} key={token[1].symbol}>
                <ListItemAvatar>
                  <Avatar src={token[1].img} />
                </ListItemAvatar>
                <ListItemText primary={token[1].symbol} />
                <Box flexGrow={10} />
                <ListItemText primary={`$${token[1].balanceUSD.toFixed(2)}`} secondary={token[1].balance.toFixed(4)} />
              </ListItem>
            ))}
        </List>
      </Dialog>
    </div>
  );
}

export default ZapAction;
