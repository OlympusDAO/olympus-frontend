import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  Divider,
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
import InfoTooltip from "../../components/InfoTooltip/InfoTooltip.jsx";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";

import { getOhmTokenImage, getTokenImage, trim, formatCurrency } from "../../helpers";
import { changeApproval, changeWrapV2 } from "../../slices/WrapThunk";
import { migrateWithType, migrateCrossChainWSOHM, changeMigrationApproval } from "../../slices/MigrateThunk";
import { switchNetwork } from "../../slices/NetworkSlice";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText, txnButtonTextMultiType } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import { NETWORKS } from "../../constants";
import "../Stake/stake.scss";
import { useAppSelector } from "src/hooks/index";
import { getBalances, loadAccountDetails } from "src/slices/AccountSlice";

function WrapCrossChain() {
  const dispatch = useDispatch();
  const { provider, address, connect } = useWeb3Context();
  const networkId = useAppSelector(state => state.network.networkId);
  const networkName = useAppSelector(state => state.network.networkName);
  const [quantity, setQuantity] = useState("");
  const assetFrom = "wsOHM";
  const assetTo = "gOHM";

  const isAppLoading = useAppSelector(state => state.app.loading || state.account.loading);
  const currentIndex =
    useAppSelector(state => {
      return Number(state.app.currentIndex);
    }) ?? 1;

  const marketPrice =
    useAppSelector(state => {
      return state.app.marketPrice;
    }) ?? 0;

  const sOhmPrice = marketPrice;

  const gOhmPrice = marketPrice * currentIndex;

  const gohmBalance = useAppSelector(state => {
    return state.account.balances && Number(state.account.balances.gohm);
  });

  const wsOhmAllowance = useAppSelector(state => state.account.migration.wsohm);
  const wsOhmBalance = useAppSelector(state => Number(state.account.balances.wsohm));

  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });

  const ethereum = NETWORKS[1];

  const wrapButtonText = "Migrate";

  const setMax = () => {
    setQuantity(wsOhmBalance.toString());
  };

  const handleSwitchChain = (id: any) => {
    return () => {
      dispatch(switchNetwork({ provider, networkId: id }));
      dispatch(loadAccountDetails({ address, provider, networkID: id }));
    };
  };

  const hasCorrectAllowance = useCallback(() => {
    return wsOhmAllowance > wsOhmBalance;
  }, [wsOhmBalance, wsOhmAllowance]);

  const isDataLoading = useAppSelector(state => state.account.loading);

  let modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  );

  const migrateToGohm = () =>
    dispatch(
      migrateCrossChainWSOHM({
        provider,
        address,
        networkID: networkId,
        value: quantity,
      }),
    );

  const approveWrap = () => {
    dispatch(
      changeMigrationApproval({
        token: "wsohm",
        displayName: "wsOHM",
        insertName: true,
        address,
        networkID: networkId,
        provider,
      }),
    );
  };

  const chooseInputArea = () => {
    if (!address || isAppLoading) return <Skeleton width="80%" />;
    if (!hasCorrectAllowance() && assetTo === "gOHM")
      return (
        <div className="no-input-visible">
          First time wrapping to <b>gOHM</b>?
          <br />
          Please approve Olympus to use your <b>{assetFrom}</b> for this transaction.
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
    if (!hasCorrectAllowance())
      return (
        <Button
          className="stake-button wrap-page"
          variant="contained"
          color="primary"
          disabled={
            isPendingTxn(pendingTransactions, "approve_wrapping") ||
            isPendingTxn(pendingTransactions, "approve_migration")
          }
          onClick={approveWrap}
        >
          {txnButtonTextMultiType(pendingTransactions, ["approve_wrapping", "approve_migration"], "Approve")}
        </Button>
      );

    if (hasCorrectAllowance())
      return (
        <Button
          className="stake-button wrap-page"
          variant="contained"
          color="primary"
          disabled={isPendingTxn(pendingTransactions, "wrapping") || isPendingTxn(pendingTransactions, "migrate")}
          onClick={migrateToGohm}
        >
          {txnButtonTextMultiType(pendingTransactions, ["wrapping", "migrate"], wrapButtonText)}
        </Button>
      );
  };

  return (
    <div id="stake-view" className="wrapper">
      <Zoom in={true}>
        <Paper className={`ohm-card`}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <div className="card-header">
                <Typography variant="h5">Wrap / Unwrap</Typography>
                <Link
                  className="migrate-sohm-button"
                  style={{ textDecoration: "none" }}
                  href={"https://docs.olympusdao.finance/main/contracts/tokens#gohm"}
                  aria-label="wsohm-wut"
                  target="_blank"
                >
                  <Typography>gOHM</Typography>{" "}
                  <SvgIcon component={ArrowUp} color="primary" style={{ marginLeft: "5px", width: ".8em" }} />
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
                        {`${assetTo} Price`}
                        <InfoTooltip
                          message={`${assetTo} = sOHM * index\n\nThe price of ${assetTo} is equal to the price of OHM multiplied by the current index`}
                          children={undefined}
                        />
                      </Typography>
                      <Typography variant="h4">
                        {gOhmPrice ? formatCurrency(gOhmPrice, 2) : <Skeleton width="150px" />}
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
                  <Typography variant="h6">Connect your wallet</Typography>
                </div>
              ) : (
                <>
                  <Box className="stake-action-area">
                    <Box style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                      <Box height="32px">
                        <Typography>
                          Transform <b>wsOHM</b> to <b>gOHM</b>
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" style={{ paddingBottom: 0 }}>
                      <div className="stake-tab-panel wrap-page">
                        {chooseInputArea()}
                        {chooseButtonArea()}
                      </div>
                    </Box>
                  </Box>
                  <div className={`stake-user-data`}>
                    <div className="data-row">
                      <Typography variant="body1">wsOHM Balance ({networkName})</Typography>
                      <Typography variant="body1">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(wsOhmBalance, 4) + " wsOHM"}</>}
                      </Typography>
                    </div>
                    <div className="data-row">
                      <Typography variant="body1">gOHM Balance ({networkName})</Typography>
                      <Typography variant="body1">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(gohmBalance, 4) + " gOHM"}</>}
                      </Typography>
                    </div>
                    <Divider />
                    <Box width="100%" alignItems={"center"} display="flex" flexDirection="column" p={1}>
                      <Typography variant="h6" style={{ margin: "15px 0 10px 0" }}>
                        Back to Ethereum Mainnet
                      </Typography>
                      <Button onClick={handleSwitchChain(1)} variant="outlined">
                        <img height="28px" width="28px" src={String(ethereum.image)} alt={ethereum.imageAltText} />
                        <Typography variant="h6" style={{ marginLeft: "8px" }}>
                          {ethereum.chainName}
                        </Typography>
                      </Button>
                    </Box>
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

export default WrapCrossChain;
