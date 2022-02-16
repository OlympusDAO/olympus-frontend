import "../Stake/Stake.scss";

import { t } from "@lingui/macro";
import { Box, Button, Divider, Grid, Link, Typography, Zoom } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Icon, InputWrapper, MetricCollection, Paper } from "@olympusdao/component-library";
import { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import ChainButton from "src/components/ChainButton";
import ConnectButton from "src/components/ConnectButton/ConnectButton";
import { GOHMBalance, SOHMBalance } from "src/components/DataRows";
import { useAppSelector } from "src/hooks";
import { useGohmWalletBalanceData, useSohmWalletBalanceData } from "src/hooks/useBalances";
import { useGohmUnwrapAllowance, useSohmWrapAllowance } from "src/hooks/useContractAllowance";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonTextMultiType } from "src/slices/PendingTxnsSlice";
import { CurrentIndex, GOHMPrice, OHMPrice } from "src/views/TreasuryDashboard/components/Metric/Metric";

import { NETWORKS } from "../../constants";
import { switchNetwork } from "../../helpers/NetworkHelper";
import { changeApproval, changeWrapV2 } from "../../slices/WrapThunk";
import WrapActionChooser from "./components/WrapActionChooser";
import { WrapAction } from "./components/WrapActionChooser";
import WrapCrossChain from "./WrapCrossChain";
const Wrap: React.FC = () => {
  const dispatch = useDispatch();
  const { provider, address, networkId } = useWeb3Context();

  const [, setZoomed] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<string>("");
  const [action, setAction] = useState<WrapAction>("wrap");

  const sohmBalance = useSohmWalletBalanceData().data;
  const gohmBalance = useGohmWalletBalanceData().data;

  const unwrapGohmAllowance = useGohmUnwrapAllowance().data;
  const wrapSohmAllowance = useSohmWrapAllowance().data;
  const pendingTransactions = useAppSelector(state => state.pendingTransactions);

  const assetFrom = useMemo(() => {
    action === "wrap" ? "sOHM" : "gOHM";
  }, [action]);
  const assetTo = useMemo(() => {
    action === "wrap" ? "gOHM" : "sOHM";
  }, [action]);

  const avax = NETWORKS[43114];
  const arbitrum = NETWORKS[42161];

  const isAvax = useMemo(() => networkId != 1 && networkId != 4 && networkId != -1, [networkId]);

  const wrapButtonText = () => {
    return "wrap";
  };

  const setMax = () => {
    setQuantity(String(action == "wrap" ? sohmBalance : gohmBalance));
  };

  const handleSwitchChain = (id: number) => {
    return () => {
      console.log("a");
      switchNetwork({ provider: provider, networkId: id });
    };
  };

  const hasCorrectAllowance = useCallback(() => {
    if (action === "wrap" && wrapSohmAllowance && sohmBalance) return wrapSohmAllowance > sohmBalance;
    if (action === "unwrap" && unwrapGohmAllowance && gohmBalance) return unwrapGohmAllowance > gohmBalance;
    console.log(wrapSohmAllowance);
    console.log(unwrapGohmAllowance);
    return 0;
  }, [unwrapGohmAllowance, wrapSohmAllowance, sohmBalance, gohmBalance, action]);

  const approve = () => {
    const token = action === "wrap" ? "sOHM" : "gOHM";
    dispatch(changeApproval({ address, token: token.toLowerCase(), provider, networkID: networkId }));
  };

  const performAction = () => {
    action === "wrap"
      ? dispatch(changeWrapV2({ action: "wrap", value: quantity, provider, address, networkID: networkId }))
      : dispatch(changeWrapV2({ action: "unwrap", value: quantity, provider, address, networkID: networkId }));
  };

  const chooseInputArea = () => {
    if (!address) return <Skeleton width="150px" />;
    if (!hasCorrectAllowance()) {
      // Approve SOHM
      if (action === "wrap") {
        return (
          <div className="no-input-visible">
            First time wrapping to <b>gOHM</b>?
            <br />
            Please approve Olympus to use your sOHM for this transaction.
          </div>
        );
      } else {
        // Approve OHM
        return (
          <div className="no-input-visible">
            First time unwrapping gOHM?
            <br />
            Please approve Olympus to use your gOHM for unwrapping.
          </div>
        );
      }
    }
    // Wrap
    return (
      <InputWrapper
        id="amount-input"
        type="number"
        placeholder={t`Enter an amount`}
        value={quantity}
        onChange={e => setQuantity(e.target.value)}
        labelWidth={0}
        endString={t`Max`}
        endStringOnClick={setMax}
        disabled={isPendingTxn(pendingTransactions, "wrapping") || isPendingTxn(pendingTransactions, "migrate")}
        buttonOnClick={performAction}
        buttonText={txnButtonTextMultiType(pendingTransactions, ["wrapping", "migrate"], wrapButtonText())}
      />
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
          onClick={approve}
        >
          {txnButtonTextMultiType(pendingTransactions, ["approve_wrapping", "approve_migration"], "Approve")}
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
                <OHMPrice />
                <CurrentIndex />
                <GOHMPrice />
              </MetricCollection>
            </Grid>
            <div className="staking-area">
              {!address ? (
                <div className="stake-wallet-notification">
                  <div className="wallet-menu" id="wallet-menu">
                    <ConnectButton />
                  </div>
                  <Typography variant="h6">Connect your wallet</Typography>
                </div>
              ) : (
                <>
                  <Box className="stake-action-area">
                    <Box style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                      <WrapActionChooser action={action} setAction={setAction}></WrapActionChooser>
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
                      <SOHMBalance />
                      <GOHMBalance />
                      <Divider />
                      <Box width="100%" p={1} sx={{ textAlign: "center" }}>
                        <Typography variant="body1" style={{ margin: "15px 0 10px 0" }}>
                          Got wsOHM on Avalanche or Arbitrum? Click below to switch networks and migrate to gOHM (no
                          bridge required!)
                        </Typography>
                        <ChainButton click={handleSwitchChain(avax.chainId)} network={avax}></ChainButton>
                        <ChainButton click={handleSwitchChain(arbitrum.chainId)} network={arbitrum}></ChainButton>
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
