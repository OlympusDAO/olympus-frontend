import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  Tab,
  Tabs,
  Typography,
  Zoom,
  SvgIcon,
  makeStyles,
} from "@material-ui/core";
import TabPanel from "../../components/TabPanel";
import InfoTooltip from "../../components/InfoTooltip/InfoTooltip.jsx";
import { ReactComponent as InfoIcon } from "../../assets/icons/info-fill.svg";
import { getTeloTokenImage, getTokenImage, trim, formatCurrency } from "../../helpers";
import { changeApproval, changeWrap } from "../../slices/WrapThunk";
import "../Stake/stake.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import { error } from "../../slices/MessagesSlice";
import { ethers } from "ethers";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const sTeloImg = getTokenImage("stelo");
const teloImg = getTeloTokenImage(16, 16);

const useStyles = makeStyles(theme => ({
  textHighlight: {
    color: theme.palette.highlight,
  },
}));

function Wrap() {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();

  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState("");
  const classes = useStyles();

  const isAppLoading = useSelector(state => state.app.loading);
  const currentIndex = useSelector(state => {
    return state.app.currentIndex;
  });

  const sTeloPrice = useSelector(state => {
    return state.app.marketPrice;
  });

  const wsTeloPrice = useSelector(state => {
    return state.app.marketPrice * state.app.currentIndex;
  });

  const steloBalance = useSelector(state => {
    return state.account.balances && state.account.balances.stelo;
  });
  const wsteloBalance = useSelector(state => {
    return state.account.balances && state.account.balances.wstelo;
  });
  const wrapAllowance = useSelector(state => {
    return state.account.wrapping && state.account.wrapping.teloWrap;
  });
  const unwrapAllowance = useSelector(state => {
    return state.account.wrapping && state.account.wrapping.teloUnwrap;
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const setMax = () => {
    if (view === 0) {
      setQuantity(steloBalance);
    } else {
      setQuantity(wsteloBalance);
    }
  };

  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };

  const onChangeWrap = async action => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || Number(quantity) === 0 || quantity === "") {
      // eslint-disable-next-line no-alert
      return dispatch(error("Please enter a value!"));
    }

    // 1st catch if quantity > balance
    if (
      action === "wrap" &&
      ethers.utils.parseUnits(quantity, "gwei").gt(ethers.utils.parseUnits(steloBalance, "gwei"))
    ) {
      return dispatch(error("You cannot wrap more than your sTELO balance."));
    }

    if (
      action === "unwrap" &&
      ethers.utils.parseUnits(quantity, "ether").gt(ethers.utils.parseUnits(wsteloBalance, "ether"))
    ) {
      return dispatch(error("You cannot unwrap more than your wsTELO balance."));
    }

    await dispatch(changeWrap({ address, action, value: quantity.toString(), provider, networkID: chainID }));
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "stelo") return wrapAllowance > 0;
      if (token === "wstelo") return wrapAllowance > 0;
      return 0;
    },
    [wrapAllowance, unwrapAllowance],
  );

  const isAllowanceDataLoading = (wrapAllowance == null && view === 0) || (unwrapAllowance == null && view === 1);

  const isUnwrap = view === 1;
  const convertedQuantity = isUnwrap ? (quantity * wsTeloPrice) / sTeloPrice : (quantity * sTeloPrice) / wsTeloPrice;

  let modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  );

  const changeView = (event, newView) => {
    setView(newView);
  };

  return (
    <div id="stake-view">
      <Zoom in={true} onEntered={() => setZoomed(true)}>
        <Paper className={`telo-card`}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <div className="card-header">
                <Typography variant="h5">Wrap / Unwrap</Typography>
                <Link
                  className="migrate-stelo-button"
                  style={{ textDecoration: "none" }}
                  href="https://docs.telesto.world/main/contracts/tokens#wstelo"
                  aria-label="wstelo-wut"
                  target="_blank"
                >
                  <Typography>wsTELO</Typography> <SvgIcon component={InfoIcon} color="primary" />
                </Link>
              </div>
            </Grid>

            <Grid item>
              <div className="stake-top-metrics">
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="wrap-sTELO">
                      <Typography variant="h5" color="textSecondary">
                        sTELO Price
                      </Typography>
                      <Typography variant="h4">
                        {sTeloPrice ? formatCurrency(sTeloPrice, 2) : <Skeleton width="150px" />}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="wrap-index">
                      <Typography variant="h5" color="textSecondary">
                        Current Index
                      </Typography>
                      <Typography variant="h4">
                        {currentIndex ? <>{trim(currentIndex, 1)} TELO</> : <Skeleton width="150px" />}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="wrap-wsTELO">
                      <Typography variant="h5" color="textSecondary">
                        wsTELO Price
                        <InfoTooltip
                          message={
                            "wsTELO = sTELO * index\n\nThe price of wsTELO is equal to the price of TELO multiplied by the current index"
                          }
                        />
                      </Typography>
                      <Typography variant="h4">
                        {wsTeloPrice ? formatCurrency(wsTeloPrice, 2) : <Skeleton width="150px" />}
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </Grid>

            <div className="staking-area">
              {!address ? (
                <div className="stake-wallet-notification">
                  <div className="wallet-menu" id="wallet-menu">
                    {modalButton}
                  </div>
                  <Typography variant="h6">Connect your wallet to wrap sTELO</Typography>
                </div>
              ) : (
                <>
                  <Box className="stake-action-area">
                    <Tabs
                      key={String(zoomed)}
                      centered
                      value={view}
                      textColor="primary"
                      indicatorColor="primary"
                      className="stake-tab-buttons"
                      onChange={changeView}
                      aria-label="stake tabs"
                    >
                      <Tab label="Wrap" {...a11yProps(0)} />
                      <Tab label="Unwrap" {...a11yProps(1)} />
                    </Tabs>
                    <Box className="stake-action-row " display="flex" alignItems="center" style={{ paddingBottom: 0 }}>
                      {address && !isAllowanceDataLoading ? (
                        !hasAllowance("stelo") && view === 0 ? (
                          <Box className="help-text">
                            <Typography variant="body1" className="stake-note" color="textSecondary">
                              {view === 0 && (
                                <>
                                  First time wrapping <b>sTELO</b>?
                                  <br />
                                  Please approve Telesto Dao to use your <b>sTELO</b> for wrapping.
                                </>
                              )}
                            </Typography>
                          </Box>
                        ) : (
                          <FormControl className="telo-input" variant="outlined" color="primary">
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
                                  <Button variant="text" onClick={setMax} color="inherit">
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

                      <TabPanel value={view} index={0} className="stake-tab-panel">
                        {address && hasAllowance("stelo") ? (
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "wrapping")}
                            onClick={() => {
                              onChangeWrap("wrap");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "wrapping", "Wrap sTELO")}
                          </Button>
                        ) : (
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "approve_wrapping")}
                            onClick={() => {
                              onSeekApproval("stelo");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "approve_wrapping", "Approve")}
                          </Button>
                        )}
                      </TabPanel>

                      <TabPanel value={view} index={1} className="stake-tab-panel">
                        <Button
                          className="stake-button"
                          variant="contained"
                          color="primary"
                          disabled={isPendingTxn(pendingTransactions, "unwrapping")}
                          onClick={() => {
                            onChangeWrap("unwrap");
                          }}
                        >
                          {txnButtonText(pendingTransactions, "unwrapping", "Unwrap sTELO")}
                        </Button>
                      </TabPanel>
                    </Box>

                    {quantity && (
                      <Box padding={1}>
                        <Typography variant="body2" className={classes.textHighlight}>
                          {isUnwrap
                            ? `Unwrapping ${quantity} wsTELO will result in ${trim(convertedQuantity, 4)} sTELO`
                            : `Wrapping ${quantity} sTELO will result in ${trim(convertedQuantity, 4)} wsTELO`}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <div className={`stake-user-data`}>
                    <div className="data-row">
                      <Typography variant="body1">Wrappable Balance</Typography>
                      <Typography variant="body1">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(steloBalance, 4)} sTELO</>}
                      </Typography>
                    </div>
                    <div className="data-row">
                      <Typography variant="body1">Unwrappable Balance</Typography>
                      <Typography variant="body1">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(wsteloBalance, 4)} wsTELO</>}
                      </Typography>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Grid>
        </Paper>
      </Zoom>
    </div>
  );
}

export default Wrap;
