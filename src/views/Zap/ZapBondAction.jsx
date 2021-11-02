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
import { useEffect, useMemo, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ButtonBase, ListItemButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import { useBonds } from "src/hooks";
import BondHeader from "../Bond/BondHeader";
import { DisplayBondDiscount } from "../Bond/Bond";
import BondLogo from "src/components/BondLogo";

function ZapBondAction(props) {
  const { address, quantity, setQuantity, ...other } = props;

  const { bonds } = useBonds();
  const bondDictionary = Object.fromEntries(bonds.map(bond => [bond.name, bond]));
  const isBondsLoading = useSelector(state => state.bonding?.loading ?? true);

  console.log(bondDictionary);

  const tokens = useSelector(state => state.zap.balances);
  const isTokensLoading = useSelector(state => state.zap.loading);

  const [zapToken, setZapToken] = useState(null);
  const handleSelectZapToken = token => {
    setZapToken(token);
    handleClose();
  };
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpen = () => {
    setModalOpen(true);
  };
  const handleClose = () => setModalOpen(false);

  const [outputToken, setOutputToken] = useState(null);
  const [outputModalOpen, setOutputModalOpen] = useState(false);
  const handleOutputOpen = () => {
    setOutputModalOpen(true);
  };
  const handleOutputClose = () => setOutputModalOpen(false);
  const handleSelectOutputToken = token => {
    setOutputToken(token);
    handleOutputClose();
  };

  const [inputQuantity, setInputQuantity] = useState("");
  const [outputQuantity, setOutputQuantity] = useState("");

  const ohmMarketPrice = useSelector(state => {
    return state.app.marketPrice;
  });

  const exchangeRate =
    outputToken == null
      ? null
      : ohmMarketPrice / tokens[zapToken]?.price / (1 + bondDictionary[outputToken].bondDiscount);

  const setZapTokenQuantity = q => {
    if (q == null || q === "") {
      setInputQuantity("");
      setOutputQuantity("");
      return;
    }
    const amount = Number(q);
    setInputQuantity(amount);
    setOutputQuantity(amount / exchangeRate);
  };

  const setOutputTokenQuantity = q => {
    if (q == null || q === "") {
      setInputQuantity("");
      setOutputQuantity("");
      return;
    }
    const amount = Number(q);
    setOutputQuantity(amount);
    setInputQuantity(amount * exchangeRate);
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
          className="zap-input"
          disabled={zapToken == null || outputToken == null}
          value={inputQuantity}
          onChange={e => setZapTokenQuantity(e.target.value)}
          //   labelWidth={0}
          //   label="Hello"
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
                {zapToken == null ? (
                  <ButtonBase onClick={handleOpen}>
                    <Box flexDirection="row" display="flex" alignItems="center">
                      <Typography>Select a Token</Typography>
                      <KeyboardArrowDownIcon />
                    </Box>
                  </ButtonBase>
                ) : (
                  <Box flexDirection="column" display="flex">
                    <Box flexDirection="row" display="flex" alignItems="center" justifyContent="flex-end">
                      <ButtonBase onClick={handleOpen}>
                        <Avatar src={tokens[zapToken].img} style={{ height: "30px", width: "30px" }} />
                        <Box width="10px" />
                        <Typography>{tokens[zapToken].symbol}</Typography>
                        <KeyboardArrowDownIcon />
                      </ButtonBase>
                    </Box>

                    <Box height="5px" />
                    <Box flexDirection="row" display="flex" alignItems="center">
                      <Typography color="textSecondary">{`Your Balance ${tokens[zapToken].balance.toFixed(
                        2,
                      )}`}</Typography>
                      <Box width="10px" />
                      <ButtonBase
                        disabled={outputToken == null}
                        onClick={() => setZapTokenQuantity(tokens[zapToken].balance)}
                      >
                        <Typography>
                          <b>Max</b>
                        </Typography>
                      </ButtonBase>
                    </Box>
                  </Box>
                )}
              </div>
            </InputAdornment>
          }
        />
      </FormControl>
      <Box marginTop="10px" minHeight="25px" display="flex" justifyContent="center" alignItems="center">
        <ButtonBase onClick={handleOutputOpen}>
          <Box flexDirection="row" display="flex" alignItems="center">
            {outputToken == null ? (
              <Typography>Select a Bond</Typography>
            ) : (
              <>
                {/* <Typography>Chosen Bond:</Typography>
                <Box width="10px" /> */}
                <Typography>{bondDictionary[outputToken].displayName}</Typography>
                <Box width="2px" />
                <BondLogo bond={bondDictionary[outputToken]}></BondLogo>
              </>
            )}
            <KeyboardArrowDownIcon />
          </Box>
        </ButtonBase>
      </Box>

      <Typography>You Get</Typography>
      <FormControl className="zap-output" variant="outlined" color="primary">
        <InputLabel htmlFor="amount-input"></InputLabel>
        <OutlinedInput
          id="zap-amount-output"
          type="number"
          placeholder="Enter an amount"
          className="zap-input"
          value={outputQuantity}
          disabled={zapToken == null || outputToken == null}
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
                <Box flexDirection="column" display="flex">
                  <Box flexDirection="row" display="flex" alignItems="center" justifyContent="flex-end">
                    <Avatar
                      src="https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x04f2694c8fcee23e8fd0dfea1d4f5bb8c352111f.png"
                      style={{ height: "30px", width: "30px" }}
                    />
                    <Box width="10px" />
                    <Typography>sOHM</Typography>
                  </Box>
                  <Box height="5px" />
                  <Typography color="textSecondary">
                    Discount{" "}
                    {isBondsLoading || outputToken == null ? (
                      "--"
                    ) : (
                      <DisplayBondDiscount key={outputToken} bond={bondDictionary[outputToken]} />
                    )}
                  </Typography>
                </Box>
              </div>
            </InputAdornment>
          }
        />
      </FormControl>
      <Box justifyContent="space-between" flexDirection="row" display="flex" marginY="20px">
        <Typography>Vesting Term</Typography>
        <Typography>7 days</Typography>
      </Box>
      <Box justifyContent="space-between" flexDirection="row" display="flex" marginY="20px">
        <Typography>ROI</Typography>
        <Typography>4.6%</Typography>
      </Box>
      <Box justifyContent="space-between" flexDirection="row" display="flex" marginY="20px">
        <Typography>Max Slippage</Typography>
        <Typography>2.0%</Typography>
      </Box>
      <Box justifyContent="space-between" flexDirection="row" display="flex" marginY="20px">
        <Typography>Exchange Rate</Typography>
        <Typography>
          {zapToken == null || outputToken == null ? "nil" : `${exchangeRate.toFixed(4)} ${tokens[zapToken].symbol}`} =
          1 sOHM
        </Typography>
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
        Zap-Bond
      </Button>

      <Dialog onClose={handleClose} open={modalOpen} keepMounted fullWidth maxWidth="xs">
        <DialogTitle>
          <Typography align="center">Select Zap Token</Typography>
        </DialogTitle>
        {isTokensLoading || Object.entries(tokens).length == 0 ? null : (
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
                  <ListItemText
                    primary={`$${token[1].balanceUSD.toFixed(2)}`}
                    secondary={token[1].balance.toFixed(4)}
                  />
                </ListItem>
              ))}
          </List>
        )}
      </Dialog>

      <Dialog onClose={handleOutputClose} open={outputModalOpen} keepMounted fullWidth maxWidth="xs">
        <DialogTitle>
          <Typography align="center">Select Bond</Typography>
          <Box justifyContent="space-between" flexDirection="row" display="flex" marginTop="20px">
            <Typography align="center">Bond Name</Typography>
            <Typography align="center">ROI</Typography>
          </Box>
        </DialogTitle>
        {/* {isTokensLoading || Object.entries(tokens).length == 0 ? null : (
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
                  <ListItemText
                    primary={`$${token[1].balanceUSD.toFixed(2)}`}
                    secondary={token[1].balance.toFixed(4)}
                  />
                </ListItem>
              ))}
          </List>
        )} */}
        <List sx={{ pt: 0 }}>
          {isBondsLoading
            ? null
            : bonds.map(bond => (
                <ListItemButton
                  disabled={!bond.isAvailable[1]}
                  onClick={bond.isAvailable[1] ? () => handleSelectOutputToken(bond.name) : null}
                >
                  {
                    <>
                      <ListItemAvatar>
                        <BondLogo bond={bond}></BondLogo>
                      </ListItemAvatar>
                      <ListItemText primary={bond.displayName} />
                      <Box flexGrow={10} />
                      <ListItemText primary={<DisplayBondDiscount key={bond.name} bond={bond} />} />
                    </>
                  }
                </ListItemButton>
              ))}
        </List>
      </Dialog>
    </div>
  );
}

export default ZapBondAction;
