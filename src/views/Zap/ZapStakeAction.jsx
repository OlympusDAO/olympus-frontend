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
import { ButtonBase } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import { getOhmTokenImage, getTokenImage, trim } from "../../helpers";
import ZapStakeHeader from "./ZapStakeHeader";

function ZapStakeAction(props) {
  const { address, quantity, setQuantity, ...other } = props;

  const tokens = useSelector(state => state.zap.balances);
  const isTokensLoading = useSelector(state => state.zap.loading);
  const isAppLoading = useSelector(state => state.app.loading);

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

  const [inputQuantity, setInputQuantity] = useState("");
  const [outputQuantity, setOutputQuantity] = useState("");

  const ohmMarketPrice = useSelector(state => {
    return state.app.marketPrice;
  });
  const ohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.ohm;
  });
  const sohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.sohm;
  });
  const fsohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.fsohm;
  });
  const wsohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.wsohm;
  });
  const stakingRebase = useSelector(state => {
    return state.app.stakingRebase;
  });
  const stakingAPY = useSelector(state => {
    return state.app.stakingAPY;
  });
  const stakingTVL = useSelector(state => {
    return state.app.stakingTVL;
  });
  const fiveDayRate = useSelector(state => {
    return state.app.fiveDayRate;
  });
  const currentIndex = useSelector(state => {
    return state.app.currentIndex;
  });
  const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  const trimmedBalance = Number(
    [sohmBalance, fsohmBalance, wsohmBalance]
      .filter(Boolean)
      .map(balance => Number(balance))
      .reduce((a, b) => a + b, 0)
      .toFixed(4),
  );
  const trimmedStakingAPY = trim(stakingAPY * 100, 1);
  const nextRewardValue = trim((stakingRebasePercentage / 100) * trimmedBalance, 4);

  const exchangeRate = ohmMarketPrice / tokens[zapToken]?.price;

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

  const inputTokenImages = useMemo(
    () =>
      Object.entries(tokens)
        .filter(token => token[0] !== "sohm")
        .map(token => token[1].img),
    [tokens],
  );

  return (
    <div>
      <div className="card-header">
        <Typography variant="h5">OlyZaps</Typography>
        {/* <RebaseTimer /> */}
      </div>

      {/* <Grid item>
          <div className="stake-top-metrics">
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <div className="stake-apy">
                  <Typography variant="h5" color="textSecondary">
                    APY
                  </Typography>
                  <Typography variant="h4">
                    {stakingAPY ? (
                      <>{new Intl.NumberFormat("en-US").format(trimmedStakingAPY)}%</>
                    ) : (
                      <Skeleton width="150px" />
                    )}
                  </Typography>
                </div>
              </Grid>

              <Grid item xs={12} sm={4} md={4} lg={4}>
                <div className="stake-tvl">
                  <Typography variant="h5" color="textSecondary">
                    Total Value Deposited
                  </Typography>
                  <Typography variant="h4">
                    {stakingTVL ? (
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                      }).format(stakingTVL)
                    ) : (
                      <Skeleton width="150px" />
                    )}
                  </Typography>
                </div>
              </Grid>

              <Grid item xs={12} sm={4} md={4} lg={4}>
                <div className="stake-index">
                  <Typography variant="h5" color="textSecondary">
                    Current Index
                  </Typography>
                  <Typography variant="h4">
                    {currentIndex ? <>{trim(currentIndex, 1)} OHM</> : <Skeleton width="150px" />}
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </div>
        </Grid> */}
      <ZapStakeHeader images={inputTokenImages} />

      <Typography>You Pay</Typography>
      <FormControl className="zap-input" variant="outlined" color="primary">
        <InputLabel htmlFor="amount-input"></InputLabel>
        <OutlinedInput
          id="zap-amount-input"
          type="number"
          placeholder="Enter an amount"
          className="zap-input"
          disabled={zapToken == null}
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
                      <ButtonBase onClick={() => setZapTokenQuantity(tokens[zapToken].balance)}>
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
        <KeyboardArrowDownIcon />
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
          disabled={zapToken == null}
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
                <Box width="10px" />
                <Typography>sOHM</Typography>
              </div>
            </InputAdornment>
          }
        />
      </FormControl>
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
      <Box justifyContent="space-between" flexDirection="row" display="flex" marginY="20px">
        <Typography>Max Slippage</Typography>
        <Typography>2.0%</Typography>
      </Box>
      <Box justifyContent="space-between" flexDirection="row" display="flex" marginY="20px">
        <Typography>Exchange Rate</Typography>
        <Typography>
          {zapToken == null ? "nil" : `${exchangeRate.toFixed(4)} ${tokens[zapToken].symbol}`} = 1 sOHM
        </Typography>
      </Box>

      {/* <div className={`stake-user-data`}>
        <div className="data-row">
          <Typography variant="body1">Your Balance</Typography>
          <Typography variant="body1">
            {isAppLoading ? <Skeleton width="80px" /> : <>{trim(ohmBalance, 4)} OHM</>}
          </Typography>
        </div>

        <div className="data-row">
          <Typography variant="body1">Your Staked Balance</Typography>
          <Typography variant="body1">
            {isAppLoading ? <Skeleton width="80px" /> : <>{trimmedBalance} sOHM</>}
          </Typography>
        </div>

        <div className="data-row">
          <Typography variant="body1">Next Reward Amount</Typography>
          <Typography variant="body1">
            {isAppLoading ? <Skeleton width="80px" /> : <>{nextRewardValue} sOHM</>}
          </Typography>
        </div>

        <div className="data-row">
          <Typography variant="body1">Next Reward Yield</Typography>
          <Typography variant="body1">
            {isAppLoading ? <Skeleton width="80px" /> : <>{stakingRebasePercentage}%</>}
          </Typography>
        </div>

        <div className="data-row">
          <Typography variant="body1">ROI (5-Day Rate)</Typography>
          <Typography variant="body1">
            {isAppLoading ? <Skeleton width="80px" /> : <>{trim(fiveDayRate * 100, 4)}%</>}
          </Typography>
        </div>
      </div> */}

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
    </div>
  );
}

export default ZapStakeAction;
