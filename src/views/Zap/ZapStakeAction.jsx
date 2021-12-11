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
  ButtonBase,
  IconButton,
  CardHeader,
  ListItemText,
  SvgIcon,
  CircularProgress,
  Paper,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { changeZapTokenAllowance, executeZap, getTokenBalances, getZapTokenAllowance } from "src/slices/ZapSlice";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import ZapStakeHeader from "./ZapStakeHeader";
import { ReactComponent as DownIcon } from "../../assets/icons/arrow-down.svg";
import { ReactComponent as FirstStepIcon } from "../../assets/icons/step-1.svg";
import { ReactComponent as SecondStepIcon } from "../../assets/icons/step-2.svg";
import { ReactComponent as CompleteStepIcon } from "../../assets/icons/step-complete.svg";
import { useAppSelector, useWeb3Context } from "src/hooks";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import { ReactComponent as ZapperIcon } from "../../assets/icons/powered-by-zapper.svg";
import { ReactComponent as SettingsIcon } from "../../assets/icons/settings.svg";
import { ethers } from "ethers";
import { segmentUA } from "../../helpers/userAnalyticHelpers";
import { trim } from "src/helpers";
import { Trans } from "@lingui/macro";

const iconStyle = { height: "24px", width: "24px", zIndex: 1 };
const viewBox = "-8 -12 48 48";
const buttonIconStyle = { height: "16px", width: "16px", marginInline: "6px" };

const useStyles = makeStyles(theme => ({
  ApprovedButton: {
    backgroundColor: theme.palette.type === "light" ? "#9EC4AB !important" : "#92A799 !important",
  },
  ApprovedText: {
    color: theme.palette.type === "light" ? "#fff" : "#333333",
  },
}));

function ZapStakeAction(props) {
  const { address, provider } = useWeb3Context();

  const dispatch = useDispatch();
  const classes = useStyles();
  const networkId = useAppSelector(state => state.network.networkId);
  const tokens = useAppSelector(state => state.zap.balances);
  const isTokensLoading = useAppSelector(state => state.zap.balancesLoading);
  const isChangeAllowanceLoading = useAppSelector(state => state.zap.changeAllowanceLoading);
  const isExecuteZapLoading = useAppSelector(state => state.zap.stakeLoading);
  const isAppLoading = useAppSelector(state => state.app.loading);
  const [zapToken, setZapToken] = useState(null);
  const handleSelectZapToken = token => {
    const uaData = {
      type: "OlyZaps Token Select",
      token: token,
      address: address,
    };
    segmentUA(uaData);
    setZapToken(token);
    handleClose();
  };

  useEffect(() => {
    if (!tokens[zapToken]) {
      setZapToken(null);
    }
  }, [zapToken]);

  const [modalOpen, setModalOpen] = useState(false);
  const handleOpen = () => {
    setModalOpen(true);
  };
  const handleClose = () => setModalOpen(false);

  const [inputQuantity, setInputQuantity] = useState("");
  const [outputQuantity, setOutputQuantity] = useState("");

  const olyZapsSwapOfferDisplay = (amount, outPutQuantity) => {
    const uaData = {
      type: "OlyZaps Offer Display",
      token: zapToken,
      minOutput: outputQuantity,
    };
    segmentUA(uaData);
  };

  const ohmMarketPrice = useAppSelector(state => {
    return state.app.marketPrice;
  });

  const sOhmBalance = useAppSelector(state => Number(state.account?.balances?.sohm ?? 0.0));

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
    if (outputQuantity) {
      olyZapsSwapOfferDisplay(amount, outputQuantity);
    }
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

  useEffect(() => setZapTokenQuantity(null), [zapToken]);

  const inputTokenImages = useMemo(
    () =>
      Object.entries(tokens)
        .filter(token => token[0] !== "sohm" && !token[1].hide)
        .sort((tokenA, tokenB) => tokenB[1].balanceUSD - tokenA[1].balanceUSD)
        .map(token => token[1].tokenImageUrl)
        .slice(0, 3),
    [tokens],
  );
  const currentTokenAllowance = useAppSelector(state => state.zap.allowances[zapToken]);
  const checkTokenAllowance = (tokenAddress, tokenSymbol) => {
    if (tokenAddress && tokenSymbol) {
      if (currentTokenAllowance == null) {
        dispatch(getZapTokenAllowance({ value: tokenAddress, address, action: tokenSymbol }));
      } else {
        return currentTokenAllowance;
      }
    } else {
      return false;
    }
  };

  const isTokenAllowanceFetched = currentTokenAllowance != null;
  const initialTokenAllowance = useMemo(
    () => checkTokenAllowance(tokens[zapToken]?.address, zapToken),
    [zapToken, isTokenAllowanceFetched],
  );

  const isAllowanceTxSuccess =
    initialTokenAllowance != currentTokenAllowance && initialTokenAllowance != null && currentTokenAllowance != null;

  const onSeekApproval = async () => {
    dispatch(
      changeZapTokenAllowance({
        address,
        value: tokens[zapToken]?.address,
        provider,
        action: zapToken,
      }),
    );
  };

  const downIcon = <SvgIcon component={DownIcon} viewBox={viewBox} style={iconStyle}></SvgIcon>;

  const zapperCredit = (
    <Box display="flex" alignItems="center" justifyContent="center" paddingTop="32px" width="100%">
      <SvgIcon component={ZapperIcon} viewBox="80 -20 100 80" style={{ width: "200px", height: "40px" }} />
    </Box>
  );

  const [isCustomSlippage, setUseCustomSlippage] = useState(false);
  const [customSlippage, setCustomSlippage] = useState("0.01");

  const onZap = async () =>
    dispatch(
      executeZap({
        address,
        provider,
        slippage: customSlippage,
        sellAmount: ethers.utils.parseUnits(inputQuantity.toString(), tokens[zapToken]?.decimals),
        tokenAddress: tokens[zapToken]?.address,
        networkID: networkId,
      }),
    );

  return (
    <>
      <div className="card-header">
        <Typography variant="h5">OlyZaps</Typography>
      </div>

      <ZapStakeHeader images={inputTokenImages} />

      <Typography>
        <Trans>You Pay</Trans>
      </Typography>
      <FormControl className="zap-input" variant="outlined" color="primary">
        <InputLabel htmlFor="amount-input"></InputLabel>
        {zapToken != null ? (
          <OutlinedInput
            id="zap-amount-input"
            type="number"
            placeholder="Enter Amount"
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
                    minWidth: "50px",
                  }}
                >
                  {zapToken == null ? (
                    <ButtonBase onClick={handleOpen}>
                      <Box flexDirection="row" display="flex" alignItems="center">
                        <Typography>
                          <Trans>Select a Token</Trans>
                        </Typography>
                        {downIcon}
                      </Box>
                    </ButtonBase>
                  ) : (
                    <Box flexDirection="column" display="flex">
                      <Box flexDirection="row" display="flex" alignItems="center" justifyContent="flex-end">
                        <ButtonBase onClick={handleOpen}>
                          <Avatar src={tokens[zapToken]?.tokenImageUrl} style={{ height: "30px", width: "30px" }} />
                          <Box width="10px" />
                          <Typography>{tokens[zapToken]?.symbol}</Typography>
                          {downIcon}
                        </ButtonBase>
                      </Box>

                      <Box height="5px" />
                      <Box flexDirection="row" display="flex" alignItems="center">
                        <Typography color="textSecondary">{`Balance ${trim(tokens[zapToken]?.balance, 2)}`}</Typography>
                        <Box width="10px" />
                        <ButtonBase onClick={() => setZapTokenQuantity(tokens[zapToken]?.balance)}>
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
        ) : (
          <Box className="zap-input">
            <Button variant="contained" className="zap-input" onClick={handleOpen} color="primary">
              <Box flexDirection="row" display="flex" alignItems="center" justifyContent="end" flexGrow={1}>
                <Typography>
                  <Trans>Select a Token</Trans>
                </Typography>
                {downIcon}
              </Box>
            </Button>
          </Box>
        )}
      </FormControl>
      <Box marginY="12px" minHeight="24px" display="flex" justifyContent="center" alignItems="center" width="100%">
        {downIcon}
      </Box>

      <Typography>
        <Trans>You Get</Trans>
      </Typography>
      <FormControl className="zap-input" variant="outlined" color="primary">
        <InputLabel htmlFor="amount-input"></InputLabel>
        <OutlinedInput
          id="zap-amount-output"
          type="number"
          placeholder="Enter Amount"
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
                  minWidth: "50px",
                }}
              >
                <Box flexDirection="column" display="flex">
                  <Box flexDirection="row" display="flex" alignItems="center" justifyContent="flex-end">
                    <Avatar
                      src="https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x04f2694c8fcee23e8fd0dfea1d4f5bb8c352111f.png"
                      style={{ height: "36px", width: "36px" }}
                    />
                    <Box width="10px" />
                    <Typography>sOHM</Typography>
                  </Box>
                  <Box flexDirection="row" display="flex" alignItems="center">
                    <Typography color="textSecondary">{`Balance ${trim(sOhmBalance, 2)}`}</Typography>
                  </Box>
                </Box>
              </div>
            </InputAdornment>
          }
        />
      </FormControl>
      <Box
        justifyContent="space-between"
        flexDirection="row"
        display="flex"
        width="100%"
        marginY="12px"
        alignItems="center"
      >
        <Typography>
          <Trans>Slippage Tolerance</Trans>
        </Typography>
        {isCustomSlippage ? (
          <FormControl variant="outlined" color="primary">
            <InputLabel htmlFor="amount-input"></InputLabel>
            <OutlinedInput
              id="zap-amount-output"
              type="number"
              placeholder="Enter Slippage"
              value={customSlippage}
              onChange={e => setCustomSlippage(e.target.value)}
            />
          </FormControl>
        ) : (
          <Box display="flex" alignItems="center">
            <Typography>1.0%</Typography>
            {/* <Box width="8px" />
          <IconButton style={{ margin: 0, padding: 0 }} onClick={() => setUseCustomSlippage(true)}>
            <SvgIcon color="primary" component={SettingsIcon} />
          </IconButton> */}
          </Box>
        )}
      </Box>
      <Box justifyContent="space-between" flexDirection="row" display="flex" width="100%" marginY="12px">
        <Typography>
          <Trans>Exchange Rate</Trans>
        </Typography>
        <Typography>
          {zapToken == null ? "nil" : `${trim(exchangeRate, 4)} ${tokens[zapToken]?.symbol}`} = 1 sOHM
        </Typography>
      </Box>
      <Box
        justifyContent="space-between"
        flexDirection="row"
        display="flex"
        marginTop="12px"
        marginBottom="36px"
        width="100%"
      >
        <Typography>
          <Trans>Minimum You Get</Trans>
        </Typography>
        <Typography>{trim(Number(outputQuantity) * 0.98, 2)} sOHM</Typography>
      </Box>
      {initialTokenAllowance ? (
        <Button
          fullWidth
          className="zap-stake-button"
          variant="contained"
          color="primary"
          disabled={zapToken == null || isExecuteZapLoading || outputQuantity === ""}
          onClick={onZap}
        >
          {isExecuteZapLoading ? (
            <Trans>Pending...</Trans>
          ) : outputQuantity === "" ? (
            <Trans>Enter Amount</Trans>
          ) : (
            <Trans>Zap-Stake</Trans>
          )}
        </Button>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              className="zap-stake-button"
              variant="contained"
              color="primary"
              disabled={zapToken == null || isTokensLoading || isAllowanceTxSuccess || isChangeAllowanceLoading}
              onClick={onSeekApproval}
              classes={isAllowanceTxSuccess ? { disabled: classes.ApprovedButton } : {}}
            >
              {/* {txnButtonText(pendingTransactions, approveTxnName, "Approve")} */}
              <Box display="flex" flexDirection="row">
                {isAllowanceTxSuccess ? (
                  <>
                    <SvgIcon component={CompleteStepIcon} style={buttonIconStyle} viewBox={"0 0 18 18"} />
                    <Typography classes={{ root: classes.ApprovedText }}>
                      <Trans>Approved</Trans>
                    </Typography>
                  </>
                ) : (
                  <>
                    <SvgIcon component={FirstStepIcon} style={buttonIconStyle} viewBox={"0 0 16 16"} />
                    <Typography>
                      {isChangeAllowanceLoading ? <Trans>Pending...</Trans> : <Trans>Approve</Trans>}
                    </Typography>
                  </>
                )}
              </Box>
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              className="zap-stake-button"
              variant="contained"
              color="primary"
              disabled={!currentTokenAllowance || isExecuteZapLoading || outputQuantity === ""}
              // disabled={isPendingTxn(pendingTransactions, approveTxnName)}
              onClick={onZap}
            >
              {/* {txnButtonText(pendingTransactions, approveTxnName, "Approve")} */}
              <Box display="flex" flexDirection="row" alignItems="center">
                <SvgIcon component={SecondStepIcon} style={buttonIconStyle} viewBox={"0 0 16 16"} />

                <Typography>
                  {outputQuantity === "" ? <Trans>Enter Amount</Trans> : <Trans>Zap-Stake</Trans>}
                </Typography>
              </Box>
            </Button>
          </Grid>
        </Grid>
      )}
      {zapperCredit}
      <Dialog onClose={handleClose} open={modalOpen} keepMounted fullWidth maxWidth="xs" id="zap-select-token-modal">
        <DialogTitle>
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
            <Button onClick={handleClose}>
              <SvgIcon component={XIcon} color="primary" />
            </Button>
            <Box paddingRight={6}>
              <Typography id="migration-modal-title" variant="h6" component="h2">
                <Trans>Select Zap Token</Trans>
              </Typography>
            </Box>
            <Box />
          </Box>
        </DialogTitle>
        <Box paddingX="36px" paddingBottom="36px" paddingTop="12px">
          {isTokensLoading ? (
            <Box display="flex" justifyItems="center" flexDirection="column" alignItems="center">
              <CircularProgress />
              <Box height={24} />
              <Typography>
                <Trans>Dialing Zapper...</Trans>
              </Typography>
            </Box>
          ) : Object.entries(tokens).length == 0 ? (
            <Box display="flex" justifyContent="center">
              <Typography>
                <Trans>Ser, you have no assets...</Trans>
              </Typography>
            </Box>
          ) : (
            <Paper style={{ maxHeight: 300, overflow: "auto", borderRadius: 10 }}>
              <List style={{ pt: 0 }}>
                {Object.entries(tokens)
                  .filter(token => !token[1].hide)
                  .sort((tokenA, tokenB) => tokenB[1].balanceUSD - tokenA[1].balanceUSD)
                  .map(token => (
                    <ListItem button onClick={() => handleSelectZapToken(token[0])} key={token[1].symbol}>
                      <ListItemAvatar>
                        <Avatar src={token[1].tokenImageUrl} />
                      </ListItemAvatar>
                      <ListItemText primary={token[1].symbol} />
                      <Box flexGrow={10} />
                      <ListItemText
                        style={{ primary: { justify: "center" } }}
                        primary={`$${trim(token[1].balanceUSD, 2)}`}
                        secondary={trim(token[1].balance, 4)}
                      />
                    </ListItem>
                  ))}
              </List>
            </Paper>
          )}
          {zapperCredit}
        </Box>
      </Dialog>
    </>
  );
}

export default ZapStakeAction;
