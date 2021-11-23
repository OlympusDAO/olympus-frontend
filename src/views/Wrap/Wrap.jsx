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
  Select,
  MenuItem,
} from "@material-ui/core";
import TabPanel from "../../components/TabPanel";
import InfoTooltip from "../../components/InfoTooltip/InfoTooltip.jsx";
import { ReactComponent as InfoIcon } from "../../assets/icons/info-fill.svg";
import { getOhmTokenImage, getTokenImage, trim, formatCurrency } from "../../helpers";
import { changeApproval, changeWrap } from "../../slices/WrapThunk";
import { changeMigrationApproval, bridgeBack, migrateWithType } from "../../slices/MigrateThunk";
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

const sOhmImg = getTokenImage("sohm");
const ohmImg = getOhmTokenImage(16, 16);

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
  const [asset, setAsset] = useState(1);
  const [quantity, setQuantity] = useState("");
  const classes = useStyles();

  const isAppLoading = useSelector(state => state.app.loading);
  const currentIndex = useSelector(state => {
    return state.app.currentIndex;
  });

  const sOhmPrice = useSelector(state => {
    return state.app.marketPrice;
  });

  const wsOhmPrice = useSelector(state => {
    return state.app.marketPrice * state.app.currentIndex;
  });

  const sohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.sohm;
  });
  const wsohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.wsohm;
  });
  const gohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.gohm;
  });
  const wrapAllowance = useSelector(state => {
    return state.account.wrapping && state.account.wrapping.ohmWrap;
  });
  const unwrapAllowance = useSelector(state => {
    return state.account.wrapping && state.account.wrapping.ohmUnwrap;
  });

  const migrateAllowance = useSelector(state => {
    return state.account.migration && state.account.migration.sohm;
  });

  const unwrapGohmAllowance = useSelector(state => {
    return state.account.wrapping && state.account.wrapping.gOhmUnwrap;
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const setMax = () => {
    if (view === 0) {
      setQuantity(sohmBalance);
    } else {
      if (asset === 0) {
        setQuantity(wsohmBalance);
      } else {
        setQuantity(gohmBalance);
      }
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
      ethers.utils.parseUnits(quantity, "gwei").gt(ethers.utils.parseUnits(sohmBalance, "gwei"))
    ) {
      return dispatch(error("You cannot wrap more than your sOHM balance."));
    }

    if (
      action === "unwrap" &&
      ethers.utils.parseUnits(quantity, "ether").gt(ethers.utils.parseUnits(wsohmBalance, "ether"))
    ) {
      return dispatch(error("You cannot unwrap more than your wsOHM balance."));
    }

    await dispatch(changeWrap({ address, action, value: quantity.toString(), provider, networkID: chainID }));
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "sohm" && asset === 0) return wrapAllowance > 0;
      if (token === "sohm" && asset === 1) return migrateAllowance > 0;
      if (token === "wsohm") return unwrapAllowance > 0;
      if (token === "gohm") return unwrapGohmAllowance > 0;
      return 0;
    },
    [wrapAllowance, unwrapAllowance, migrateAllowance, asset],
  );

  const isAllowanceDataLoading = (wrapAllowance == null && view === 0) || (unwrapAllowance == null && view === 1);

  const isUnwrap = view === 1;
  const convertedQuantity = isUnwrap ? (quantity * wsOhmPrice) / sOhmPrice : (quantity * sOhmPrice) / wsOhmPrice;

  let modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  );

  const changeView = (event, newView) => {
    setQuantity("");
    setView(newView);
  };

  const changeAsset = event => {
    setQuantity("");
    setAsset(event.target.value);
  };

  const approveMigrate = token => {
    dispatch(changeMigrationApproval({ token, provider, address, networkID: chainID, displayName: "sohm" }));
  };

  const migrateToGohm = () => {
    dispatch(
      migrateWithType({
        provider,
        address,
        networkID: chainID,
        type: "sohm",
        value: quantity,
        action: "wrap to gOHM",
      }),
    );
  };

  const unwrapGohm = () => {
    dispatch(bridgeBack({ provider, address, networkID: chainID, value: quantity }));
  };

  const assetName = asset === 0 ? "wsOHM" : "gOHM";

  const chooseInputArea = () => {
    if (!address || isAllowanceDataLoading) return <Skeleton width="150px" />;
    if (view === 0 && asset === 0)
      return (
        <div className="no-input-visible">
          Sorry, but wrapping to <b>wsOHM</b> has been disabled at this time
          <br />
          If you'd like to wrap your <b>sOHM</b>, please try wrapping to <b>gOHM</b> instead
        </div>
      );
    if (!hasAllowance("sohm") && view === 0 && asset === 1)
      return (
        <div className="no-input-visible">
          First time wrapping to <b>gOHM</b>?
          <br />
          Please approve Olympus Dao to use your <b>sOHM</b> for this transaction.
        </div>
      );
    if (!hasAllowance("gohm") && view === 1 && asset === 1)
      return (
        <div className="no-input-visible">
          First time unwrapping <b>gOHM</b>?
          <br />
          Please approve Olympus Dao to use your <b>gOHM</b> for unwrapping.
        </div>
      );
    if (!hasAllowance("wsohm") && view === 1 && asset === 0)
      return (
        <div className="no-input-visible">
          First time unwrapping <b>wsOHM</b>?
          <br />
          Please approve Olympus Dao to use your <b>wsOHM</b> for unwrapping.
        </div>
      );

    return (
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
              <Button variant="text" onClick={setMax} color="inherit">
                Max
              </Button>
            </InputAdornment>
          }
        />
      </FormControl>
    );
  };

  const chooseButtonArea = () => {
    if (!address) return "";
    // wrap view
    if (view === 0) {
      // if trying to wrap to wsOHM
      if (asset === 0) return "";
      // if trying to wrap to gOhm but not approved yet
      if (!hasAllowance("sohm") && asset === 1)
        return (
          <Button
            className="stake-button wrap-page"
            variant="contained"
            color="primary"
            disabled={isPendingTxn(pendingTransactions, "approve_wrapping")}
            onClick={() => {
              approveMigrate("sohm");
            }}
          >
            {txnButtonText(pendingTransactions, "approve_wrapping", "Approve")}
          </Button>
        );
      if (hasAllowance("sohm") && asset === 1)
        return (
          <Button
            className="stake-button wrap-page"
            variant="contained"
            color="primary"
            disabled={isPendingTxn(pendingTransactions, "wrapping")}
            onClick={() => {
              migrateToGohm();
            }}
          >
            {txnButtonText(pendingTransactions, "wrapping", "Wrap to gOHM")}
          </Button>
        );
    }
    // unwrap view
    if (view === 1) {
      // if not approved to unwrap the current asset
      if (!hasAllowance(assetName.toLowerCase()))
        return (
          <Button
            className="stake-button wrap-page"
            variant="contained"
            color="primary"
            disabled={isPendingTxn(pendingTransactions, "approve_wrapping")}
            onClick={() => {
              asset === 0 ? onSeekApproval("wsohm") : approveMigrate("gohm");
            }}
          >
            {txnButtonText(pendingTransactions, "approve_wrapping", "Approve")}
          </Button>
        );

      if (hasAllowance(assetName.toLowerCase()))
        return (
          <Button
            className="stake-button wrap-page"
            variant="contained"
            color="primary"
            disabled={isPendingTxn(pendingTransactions, "unwrapping")}
            onClick={() => {
              asset === 0 ? onChangeWrap("unwrap") : unwrapGohm();
            }}
          >
            {asset === 0
              ? txnButtonText(pendingTransactions, "unwrapping", "Unwrap wsOHM")
              : txnButtonText(pendingTransactions, "unwrapping", "Unwrap gOHM")}
          </Button>
        );
    }
  };

  return (
    <div id="stake-view">
      <Zoom in={true} onEntered={() => setZoomed(true)}>
        <Paper className={`ohm-card`}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <div className="card-header">
                <Typography variant="h5">Wrap / Unwrap</Typography>
                <Link
                  className="migrate-sohm-button"
                  style={{ textDecoration: "none" }}
                  href={
                    asset === 0
                      ? "https://docs.olympusdao.finance/main/contracts/tokens#wsohm"
                      : "https://docs.olympusdao.finance/main/contracts/tokens#wsohm"
                  }
                  aria-label="wsohm-wut"
                  target="_blank"
                >
                  <Typography>{assetName}</Typography> <SvgIcon component={InfoIcon} color="primary" />
                </Link>
              </div>
            </Grid>

            <Grid item>
              <div className="stake-top-metrics">
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="wrap-sOHM">
                      <Typography variant="h5" color="textSecondary">
                        sOHM Price
                      </Typography>
                      <Typography variant="h4">
                        {sOhmPrice ? formatCurrency(sOhmPrice, 2) : <Skeleton width="150px" />}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="wrap-index">
                      <Typography variant="h5" color="textSecondary">
                        Current Index
                      </Typography>
                      <Typography variant="h4">
                        {currentIndex ? <>{trim(currentIndex, 1)} OHM</> : <Skeleton width="150px" />}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="wrap-wsOHM">
                      <Typography variant="h5" color="textSecondary">
                        {`${assetName} Price`}
                        <InfoTooltip
                          message={`${assetName} = sOHM * index\n\nThe price of ${assetName} is equal to the price of OHM multiplied by the current index`}
                        />
                      </Typography>
                      <Typography variant="h4">
                        {wsOhmPrice ? formatCurrency(wsOhmPrice, 2) : <Skeleton width="150px" />}
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
                  <Typography variant="h6">Connect your wallet to wrap sOHM</Typography>
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
                    <Box>
                      <FormControl style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <span className="asset-select-label">{view === 0 ? "Wrap to" : "Unwrap"} </span>
                        <Select id="asset-select" value={asset} label="Asset" onChange={changeAsset} disableUnderline>
                          <MenuItem value={0}>wsOHM</MenuItem>
                          <MenuItem value={1}>gOHM</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Box display="flex" alignItems="center" style={{ paddingBottom: 0 }}>
                      <div className="stake-tab-panel wrap-page">
                        {chooseInputArea()}
                        {/* <Box width="1px" /> */}
                        {chooseButtonArea()}
                      </div>
                    </Box>
                    {quantity && (
                      <Box padding={1}>
                        <Typography variant="body2" className={classes.textHighlight}>
                          {isUnwrap
                            ? `Unwrapping ${quantity} ${asset === 0 ? "wsOHM" : "gOHM"} will result in ${trim(
                                convertedQuantity,
                                4,
                              )} sOHM`
                            : `Wrapping ${quantity} sOHM will result in ${trim(convertedQuantity, 4)} wsOHM`}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <div className={`stake-user-data`}>
                    <div className="data-row">
                      <Typography variant="body1">Wrappable Balance</Typography>
                      <Typography variant="body1">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(sohmBalance, 4)} sOHM</>}
                      </Typography>
                    </div>
                    <div className="data-row">
                      <Typography variant="body1">Unwrappable Balance</Typography>
                      <Typography variant="body1">
                        {isAppLoading ? (
                          <Skeleton width="80px" />
                        ) : (
                          <>{asset === 0 ? trim(wsohmBalance, 4) + " wsOHM" : trim(gohmBalance, 4) + " gOHM"}</>
                        )}
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
