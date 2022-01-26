import "../Stake/Stake.scss";

import { t } from "@lingui/macro";
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
  Zoom,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { DataRow, Icon, Metric, MetricCollection, Paper } from "@olympusdao/component-library";
import { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "src/hooks";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonTextMultiType } from "src/slices/PendingTxnsSlice";

import { NETWORKS } from "../../constants";
import { formatCurrency, trim } from "../../helpers";
import { switchNetwork } from "../../helpers/NetworkHelper";
import { changeApproval, changeWrapV2 } from "../../slices/WrapThunk";
import WrapCrossChain from "./WrapCrossChain";

const Wrap: React.FC = () => {
  const dispatch = useDispatch();
  const { provider, address, connect, networkId } = useWeb3Context();

  const [, setZoomed] = useState<boolean>(false);
  const [assetFrom, setAssetFrom] = useState<string>("sOHM");
  const [assetTo, setAssetTo] = useState<string>("gOHM");
  const [quantity, setQuantity] = useState<string>("");

  const chooseCurrentAction = () => {
    if (assetFrom === "sOHM") return "Wrap from";
    if (assetTo === "sOHM") return "Unwrap from";
    return "Transform";
  };
  const currentAction = chooseCurrentAction();

  const isAppLoading = useAppSelector(state => state.app.loading);
  const currentIndex = useAppSelector(state => Number(state.app.currentIndex));
  const sOhmPrice = useAppSelector(state => Number(state.app.marketPrice));

  const gOhmPrice = useAppSelector(state => state.app.marketPrice! * Number(state.app.currentIndex));
  const sohmBalance = useAppSelector(state => state.account.balances && state.account.balances.sohm);
  const gohmBalance = useAppSelector(state => state.account.balances && state.account.balances.gohm);
  const unwrapGohmAllowance = useAppSelector(state => state.account.wrapping && state.account.wrapping.gOhmUnwrap);
  const wrapSohmAllowance = useAppSelector(state => state.account.wrapping && state.account.wrapping.sohmWrap);
  const pendingTransactions = useAppSelector(state => state.pendingTransactions);

  const avax = NETWORKS[43114];
  const arbitrum = NETWORKS[42161];

  const isAvax = useMemo(() => networkId != 1 && networkId != 4 && networkId != -1, [networkId]);

  const wrapButtonText =
    assetTo === "gOHM" ? (assetFrom === "wsOHM" ? "Migrate" : "Wrap") + " to gOHM" : `${currentAction} ${assetFrom}`;

  const setMax = () => {
    if (assetFrom === "sOHM") setQuantity(sohmBalance);
    if (assetFrom === "gOHM") setQuantity(gohmBalance);
  };

  const handleSwitchChain = (id: number) => {
    return () => {
      switchNetwork({ provider: provider, networkId: id });
    };
  };

  const hasCorrectAllowance = useCallback(() => {
    if (assetFrom === "sOHM" && assetTo === "gOHM") return wrapSohmAllowance > Number(sohmBalance);
    if (assetFrom === "gOHM" && assetTo === "sOHM") return unwrapGohmAllowance > Number(gohmBalance);

    return 0;
  }, [unwrapGohmAllowance, wrapSohmAllowance, assetTo, assetFrom, sohmBalance, gohmBalance]);

  // @ts-ignore
  const isAllowanceDataLoading = currentAction === "Unwrap";

  const modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  );

  const temporaryStore = assetTo;

  const changeAsset = () => {
    setQuantity("");
    setAssetTo(assetFrom);
    setAssetFrom(temporaryStore);
  };

  const approveWrap = (token: string) => {
    dispatch(changeApproval({ address, token: token.toLowerCase(), provider, networkID: networkId }));
  };

  const unwrapGohm = () => {
    dispatch(changeWrapV2({ action: "unwrap", value: quantity, provider, address, networkID: networkId }));
  };

  const wrapSohm = () => {
    dispatch(changeWrapV2({ action: "wrap", value: quantity, provider, address, networkID: networkId }));
  };

  const approveCorrectToken = () => {
    if (assetFrom === "sOHM" && assetTo === "gOHM") approveWrap("sOHM");
    if (assetFrom === "gOHM" && assetTo === "sOHM") approveWrap("gOHM");
  };

  const chooseCorrectWrappingFunction = () => {
    if (assetFrom === "sOHM" && assetTo === "gOHM") wrapSohm();
    if (assetFrom === "gOHM" && assetTo === "sOHM") unwrapGohm();
  };

  const chooseInputArea = () => {
    if (!address || isAllowanceDataLoading) return <Skeleton width="150px" />;
    if (assetFrom === assetTo) return "";
    if (!hasCorrectAllowance() && assetTo === "gOHM")
      return (
        <div className="no-input-visible">
          First time wrapping to <b>gOHM</b>?
          <br />
          Please approve Olympus to use your <b>{assetFrom}</b> for this transaction.
        </div>
      );
    else if (!hasCorrectAllowance() && assetTo === "sOHM")
      return (
        <div className="no-input-visible">
          First time unwrapping <b>{assetFrom}</b>?
          <br />
          Please approve Olympus to use your <b>{assetFrom}</b> for unwrapping.
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
    if (assetFrom === assetTo) return "";
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
          onClick={approveCorrectToken}
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
          onClick={chooseCorrectWrappingFunction}
        >
          {txnButtonTextMultiType(pendingTransactions, ["wrapping", "migrate"], wrapButtonText)}
        </Button>
      );
  };

  if (!isAvax) {
    return (
      <div id="stake-view" className="wrapper">
        <Zoom in={true} onEntered={() => setZoomed(true)}>
          <Paper
            headerText={t`Wrap / Unwrap`}
            topRight={
              <Link
                className="migrate-sohm-button"
                style={{ textDecoration: "none" }}
                href={
                  assetTo === "wsOHM"
                    ? "https://docs.olympusdao.finance/main/contracts/tokens#wsohm"
                    : "https://docs.olympusdao.finance/main/contracts/tokens#gohm"
                }
                aria-label="wsohm-wut"
                target="_blank"
              >
                <Typography>gOHM</Typography> <Icon style={{ marginLeft: "5px" }} name="arrow-up" />
              </Link>
            }
          >
            <Grid item style={{ padding: "0 0 2rem 0" }}>
              <MetricCollection>
                <Metric
                  label={`sOHM ${t`Price`}`}
                  metric={formatCurrency(sOhmPrice, 2)}
                  isLoading={sOhmPrice ? false : true}
                />
                <Metric
                  label={t`Current Index`}
                  metric={trim(currentIndex, 1)}
                  isLoading={currentIndex ? false : true}
                />
                <Metric
                  label={`gOHM ${t`Price`}`}
                  metric={formatCurrency(gOhmPrice, 2)}
                  isLoading={gOhmPrice ? false : true}
                  tooltip={`gOHM = sOHM * index\n\nThe price of gOHM is equal to the price of sOHM multiplied by the current index`}
                />
              </MetricCollection>
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
                      <>
                        <Typography>
                          <span className="asset-select-label" style={{ whiteSpace: "nowrap" }}>
                            {currentAction}
                          </span>
                        </Typography>
                        <FormControl
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            margin: "0 10px",
                            height: "33px",
                            minWidth: "69px",
                          }}
                        >
                          <Select
                            id="asset-select"
                            value={assetFrom}
                            label="Asset"
                            onChange={changeAsset}
                            disableUnderline
                          >
                            <MenuItem value={"sOHM"}>sOHM</MenuItem>
                            <MenuItem value={"gOHM"}>gOHM</MenuItem>
                          </Select>
                        </FormControl>

                        <Typography>
                          <span className="asset-select-label"> to </span>
                        </Typography>
                        <FormControl
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            margin: "0 10px",
                            height: "33px",
                            minWidth: "69px",
                          }}
                        >
                          <Select
                            id="asset-select"
                            value={assetTo}
                            label="Asset"
                            onChange={changeAsset}
                            disableUnderline
                          >
                            <MenuItem value={"gOHM"}>gOHM</MenuItem>
                            <MenuItem value={"sOHM"}>sOHM</MenuItem>
                          </Select>
                        </FormControl>
                      </>
                    </Box>
                    <Box display="flex" alignItems="center" style={{ paddingBottom: 0 }}>
                      <div className="stake-tab-panel wrap-page">
                        {chooseInputArea()}
                        {chooseButtonArea()}
                      </div>
                    </Box>
                  </Box>
                  <div className={`stake-user-data`}>
                    <>
                      <DataRow
                        title={t`sOHM Balance`}
                        balance={`${trim(+sohmBalance, 4)} sOHM`}
                        isLoading={isAppLoading}
                      />
                      <DataRow
                        title={t`gOHM Balance`}
                        balance={`${trim(+gohmBalance, 4)} gOHM`}
                        isLoading={isAppLoading}
                      />
                      <Divider />
                      <Box width="100%" p={1} sx={{ textAlign: "center" }}>
                        <Typography variant="body1" style={{ margin: "15px 0 10px 0" }}>
                          Got wsOHM on Avalanche or Arbitrum? Click below to switch networks and migrate to gOHM (no
                          bridge required!)
                        </Typography>
                        <Button onClick={handleSwitchChain(43114)} variant="outlined" style={{ margin: "0.3rem" }}>
                          <img height="28px" width="28px" src={String(avax.image)} alt={avax.imageAltText} />
                          <Typography variant="h6" style={{ marginLeft: "8px" }}>
                            {avax.chainName}
                          </Typography>
                        </Button>
                        <Button onClick={handleSwitchChain(42161)} variant="outlined" style={{ margin: "0.3rem" }}>
                          <img height="28px" width="28px" src={String(arbitrum.image)} alt={arbitrum.imageAltText} />
                          <Typography variant="h6" style={{ marginLeft: "8px" }}>
                            {arbitrum.chainName}
                          </Typography>
                        </Button>
                      </Box>
                    </>
                  </div>
                </>
              )}
            </div>
          </Paper>
        </Zoom>
      </div>
    );
  } else {
    return <WrapCrossChain />;
  }
};

export default Wrap;
