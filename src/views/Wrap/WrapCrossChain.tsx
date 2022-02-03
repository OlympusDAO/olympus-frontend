import "../Stake/Stake.scss";

import { t } from "@lingui/macro";
import { Box, Button, Divider, Grid, Link, Typography, Zoom } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Icon, Metric, MetricCollection, Paper } from "@olympusdao/component-library";
import { DataRow, InputWrapper } from "@olympusdao/component-library";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import ConnectButton from "src/components/ConnectButton/ConnectButton";
import { useAppSelector } from "src/hooks/index";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonTextMultiType } from "src/slices/PendingTxnsSlice";

import { NETWORKS } from "../../constants";
import { formatCurrency, trim } from "../../helpers";
import { switchNetwork } from "../../helpers/NetworkHelper";
import { changeMigrationApproval, migrateCrossChainWSOHM } from "../../slices/MigrateThunk";

function WrapCrossChain() {
  const dispatch = useDispatch();
  const { provider, address, networkId, networkName, connect } = useWeb3Context();
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
      switchNetwork({ provider: provider, networkId: id });
    };
  };

  const hasCorrectAllowance = useCallback(() => {
    return wsOhmAllowance > wsOhmBalance;
  }, [wsOhmBalance, wsOhmAllowance]);

  const isDataLoading = useAppSelector(state => state.account.loading);

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
        buttonOnClick={migrateToGohm}
        buttonText={txnButtonTextMultiType(pendingTransactions, ["wrapping", "migrate"], wrapButtonText)}
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
          onClick={approveWrap}
        >
          {txnButtonTextMultiType(pendingTransactions, ["approve_wrapping", "approve_migration"], "Approve")}
        </Button>
      );
  };

  return (
    <div id="stake-view" className="wrapper">
      <Zoom in={true}>
        <Paper
          headerText={t`Wrap / Unwrap`}
          topRight={
            <Link
              className="migrate-sohm-button"
              style={{ textDecoration: "none" }}
              href={"https://docs.olympusdao.finance/main/contracts/tokens#gohm"}
              aria-label="wsohm-wut"
              target="_blank"
            >
              <Typography>gOHM</Typography> <Icon name="arrow-up" style={{ marginLeft: "5px" }} />
            </Link>
          }
        >
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <MetricCollection>
                <Metric
                  label={`sOHM ${t`Price`}`}
                  metric={formatCurrency(sOhmPrice, 2)}
                  isLoading={sOhmPrice ? false : true}
                />
                <Metric
                  label={t`Current Index`}
                  metric={`${trim(currentIndex, 1)} OHM`}
                  isLoading={currentIndex ? false : true}
                />
                <Metric
                  label={`${assetTo} Price`}
                  metric={formatCurrency(gOhmPrice, 2)}
                  isLoading={gOhmPrice ? false : true}
                  tooltip={`${assetTo} = sOHM * index\n\nThe price of ${assetTo} is equal to the price of OHM multiplied by the current index`}
                />
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
                    <DataRow
                      title={`${t`wsOHM Balance`} (${networkName})`}
                      balance={`${trim(wsOhmBalance, 4)} wsOHM`}
                      isLoading={isAppLoading}
                    />
                    <DataRow
                      title={`${t`gOHM Balance`} (${networkName})`}
                      balance={`${trim(gohmBalance, 4)} gOHM`}
                      isLoading={isAppLoading}
                    />
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
