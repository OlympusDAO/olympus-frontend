import "./MigrationModal.scss";

import { t, Trans } from "@lingui/macro";
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { InfoTooltip, Modal, Tab, Tabs } from "@olympusdao/component-library";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { NetworkId } from "src/constants";
import { trim } from "src/helpers";
import { useWeb3Context } from "src/hooks";
import { useAppSelector } from "src/hooks";
import { info } from "src/slices/MessagesSlice";
import { changeMigrationApproval, migrateAll } from "src/slices/MigrateThunk";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
const formatCurrency = (c: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(c);
};

const useStyles = makeStyles({
  custom: {
    color: "#00EE00",
  },
});

function MigrationModal({ open, handleClose }: { open: boolean; handleClose: any }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const isMobileScreen = useMediaQuery("(max-width: 513px)");
  const { provider, address, networkId } = useWeb3Context();

  const [view, setView] = useState(0);
  const changeView: any = (_event: ChangeEvent<any>, newView: number) => {
    setView(newView);
  };

  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });

  const oldAssetsDetected = useAppSelector(state => {
    return (
      state.account.balances &&
      (Number(state.account.balances.sohmV1) ||
      Number(state.account.balances.ohmV1) ||
      Number(state.account.balances.wsohm)
        ? true
        : false)
    );
  });

  let rows = [];
  const isMigrationComplete = useAppSelector(state => state.account.isMigrationComplete);

  const onSeekApproval = (token: string) => {
    dispatch(
      changeMigrationApproval({
        address,
        networkID: networkId,
        provider,
        token: token.toLowerCase(),
        displayName: token,
        insertName: true,
      }),
    );
  };

  const indexV1 = useAppSelector(state => Number(state.app.currentIndexV1!));
  const currentIndex = useAppSelector(state => Number(state.app.currentIndex));

  const currentOhmBalance = useAppSelector(state => Number(state.account.balances.ohmV1));
  const currentSOhmBalance = useAppSelector(state => Number(state.account.balances.sohmV1));
  const currentWSOhmBalance = useAppSelector(state => Number(state.account.balances.wsohm));
  const wsOhmPrice = useAppSelector(state => state.app.marketPrice! * Number(state.app.currentIndex!));
  const gOHMPrice = wsOhmPrice;

  /**
   * V2!!! market price
   */
  const marketPrice = useAppSelector(state => {
    return state.app.marketPrice;
  });
  const approvedOhmBalance = useAppSelector(state => Number(state.account.migration.ohm));
  const approvedSOhmBalance = useAppSelector(state => Number(state.account.migration.sohm));
  const approvedWSOhmBalance = useAppSelector(state => Number(state.account.migration.wsohm));
  const ohmFullApproval = approvedOhmBalance >= currentOhmBalance;
  const sOhmFullApproval = approvedSOhmBalance >= currentSOhmBalance;
  const wsOhmFullApproval = approvedWSOhmBalance >= currentWSOhmBalance;
  const isAllApproved = ohmFullApproval && sOhmFullApproval && wsOhmFullApproval;

  const ohmAsgOHM = currentOhmBalance / currentIndex;
  const sOHMAsgOHM = currentSOhmBalance / indexV1;

  const ohmInUSD = formatCurrency(gOHMPrice! * ohmAsgOHM);
  const sOhmInUSD = formatCurrency(gOHMPrice! * sOHMAsgOHM);
  const wsOhmInUSD = formatCurrency(wsOhmPrice * currentWSOhmBalance);

  useEffect(() => {
    if (
      networkId &&
      (networkId === NetworkId.MAINNET || networkId === NetworkId.TESTNET_RINKEBY) &&
      isAllApproved &&
      (currentOhmBalance || currentSOhmBalance || currentWSOhmBalance)
    ) {
      dispatch(info("All approvals complete. You may now migrate."));
    }
  }, [isAllApproved]);
  const isGOHM = view === 1;
  const targetAsset = useMemo(() => (isGOHM ? "gOHM" : "sOHM (v2)"), [view]);
  const targetMultiplier = useMemo(() => (isGOHM ? 1 : currentIndex), [currentIndex, view]);

  const onMigrate = () => dispatch(migrateAll({ provider, address, networkID: networkId, gOHM: isGOHM }));

  rows = [
    {
      initialAsset: "OHM",
      initialBalance: currentOhmBalance,
      targetAsset: targetAsset,
      targetBalance: ohmAsgOHM * targetMultiplier,
      fullApproval: ohmFullApproval,
      usdBalance: ohmInUSD,
    },
    {
      initialAsset: "sOHM",
      initialBalance: currentSOhmBalance,
      targetAsset: targetAsset,
      targetBalance: sOHMAsgOHM * targetMultiplier,
      fullApproval: sOhmFullApproval,
      usdBalance: sOhmInUSD,
    },
    {
      initialAsset: "wsOHM",
      initialBalance: currentWSOhmBalance,
      targetAsset: targetAsset,
      targetBalance: currentWSOhmBalance * targetMultiplier,
      fullApproval: wsOhmFullApproval,
      usdBalance: wsOhmInUSD,
    },
  ];

  return (
    <div>
      <Modal
        aria-labelledby="migration-modal-title"
        aria-describedby="migration-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        minHeight={"200px"}
        closePosition={"left"}
        headerText={
          isMigrationComplete || !oldAssetsDetected
            ? t`Migration complete`
            : isAllApproved
            ? t`You are now ready to migrate`
            : t`You have assets ready to migrate to v2`
        }
      >
        <>
          {isMigrationComplete || !oldAssetsDetected ? null : (
            <Box paddingTop={isMobileScreen ? 2 : 4} paddingBottom={isMobileScreen ? 2 : 0}>
              <Typography id="migration-modal-description" variant="body2" className={isMobileScreen ? `mobile` : ``}>
                {isAllApproved
                  ? t`Click on the Migrate button to complete the upgrade to v2.`
                  : t`Olympus v2 introduces upgrades to on-chain governance and bonds to enhance decentralization and immutability.`}{" "}
                <a
                  href="https://docs.olympusdao.finance/main/basics/migration"
                  target="_blank"
                  color="inherit"
                  rel="noreferrer"
                  className="docs-link"
                >
                  <u>
                    <Trans>Learn More</Trans>
                  </u>
                </a>
              </Typography>
            </Box>
          )}
          <Box display="flex" justifyContent="center" marginTop={1}>
            <Typography variant="h5" color="textSecondary">
              <Trans>Migration Output</Trans>
            </Typography>
          </Box>
          <Tabs
            centered
            value={view}
            textColor="primary"
            indicatorColor="primary"
            onChange={changeView}
            aria-label="payout token tabs"
            className="payout-token-tabs"
          >
            <Tab aria-label="payout-sohm-button" label="sOHM" className="payout-token-tab" />
            <Tab aria-label="payout-gohm-button" label="gOHM" className="payout-token-tab" />
          </Tabs>
          {isMobileScreen ? (
            <Box id="mobile-container-migration">
              {rows
                .filter(asset => asset.initialBalance > 0)
                .map(row => (
                  <Box style={{ margin: "20px 0px 20px 0px" }}>
                    <Typography
                      id="m-asset-row"
                      style={{ margin: "10px 0px 10px 0px", fontWeight: 700 }}
                    >{`${row.initialAsset} -> ${row.targetAsset}`}</Typography>
                    <Box display="flex" flexDirection="row" justifyContent="space-between">
                      <Typography>
                        {trim(row.initialBalance, 4)} {row.initialAsset}
                      </Typography>
                      <Typography>{`(${row.usdBalance})`}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="center" style={{ margin: "10px 0px 10px 0px" }}>
                      {isMigrationComplete || !oldAssetsDetected ? (
                        <Typography align="center" className={classes.custom}>
                          <Trans>Migrated</Trans>
                        </Typography>
                      ) : row.fullApproval ? (
                        <Typography align="center" className={classes.custom}>
                          <Trans>Approved</Trans>
                        </Typography>
                      ) : (
                        <Button
                          variant="outlined"
                          onClick={() => onSeekApproval(row.initialAsset)}
                          disabled={isPendingTxn(
                            pendingTransactions,
                            `approve_migration_${row.initialAsset.toLowerCase()}`,
                          )}
                        >
                          <Typography>
                            {txnButtonText(
                              pendingTransactions,
                              `approve_migration_${row.initialAsset.toLowerCase()}`,
                              t`Approve`,
                            )}
                          </Typography>
                        </Button>
                      )}
                    </Box>
                  </Box>
                ))}
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow style={{ verticalAlign: "top" }}>
                  <TableCell align="center">
                    <Typography>Asset</Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Box display="flex">
                      <Box display="inline-flex">
                        <Typography>
                          <Trans>Pre-migration</Trans>
                        </Typography>
                        <InfoTooltip
                          message={t`This is the current balance of v1 assets in your wallet.`}
                          children={undefined}
                        />
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="left">
                    <Box display="flex" flexDirection="column">
                      <Box display="inline-flex">
                        <Typography>
                          <Trans>Post-migration</Trans>
                        </Typography>
                        <InfoTooltip
                          message={t`This is the equivalent amount of gOHM you will have in your wallet once migration is complete.`}
                          children={undefined}
                        />
                      </Box>
                    </Box>
                    <Box display="inline-flex">
                      <Typography variant="body2">
                        <Trans>(includes rebase rewards)</Trans>
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Box display="inline-flex">{/* <Typography>Migration Completion Status</Typography> */}</Box>
                  </TableCell>

                  <TableCell align="left" />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .filter(asset => asset.initialBalance > 0)
                  .map(row => (
                    <TableRow key={row.initialAsset}>
                      <TableCell component="th" scope="row">
                        <Typography>{`${row.initialAsset} -> ${row.targetAsset}`}</Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography>
                          {trim(row.initialBalance, 4)} {row.initialAsset}
                          <Typography style={{ marginTop: "10px" }}>{`(${row.usdBalance})`}</Typography>
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography>
                          {trim(row.targetBalance, 4)} {row.targetAsset}
                          <Typography style={{ marginTop: "10px" }}>{`(${row.usdBalance})`}</Typography>
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        {isMigrationComplete || !oldAssetsDetected ? (
                          <Typography align="center" className={classes.custom}>
                            <Trans>Migrated</Trans>
                          </Typography>
                        ) : row.fullApproval ? (
                          <Typography align="center" className={classes.custom}>
                            <Trans>Approved</Trans>
                          </Typography>
                        ) : (
                          <Button
                            variant="outlined"
                            onClick={() => onSeekApproval(row.initialAsset)}
                            disabled={isPendingTxn(
                              pendingTransactions,
                              `approve_migration_${row.initialAsset.toLowerCase()}`,
                            )}
                          >
                            <Typography>
                              {txnButtonText(
                                pendingTransactions,
                                `approve_migration_${row.initialAsset.toLowerCase()}`,
                                t`Approve`,
                              )}
                            </Typography>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}

          <Box display="flex" flexDirection="row" justifyContent="center">
            <Button
              color="primary"
              variant="contained"
              disabled={!isAllApproved || isPendingTxn(pendingTransactions, "migrate_all")}
              onClick={isMigrationComplete || !oldAssetsDetected ? handleClose : onMigrate}
              fullWidth={isMobileScreen}
            >
              <Box marginX={4} marginY={0.5}>
                <Typography>
                  {isMigrationComplete || !oldAssetsDetected
                    ? "Close"
                    : txnButtonText(
                        pendingTransactions,
                        "migrate_all",
                        `${t`Migrate all to`} ${isGOHM ? "gOHM" : "sOHM"}`,
                      )}
                </Typography>
              </Box>
            </Button>
          </Box>
          <div className="help-text">
            <em>
              <Typography variant="body2" style={isMobileScreen ? { lineHeight: "1em" } : {}}>
                <Trans>
                  Save on gas fees by migrating all your assets to the new gOHM or sOHM in one transaction. Each asset
                  asset above must be approved before all can be migrated.
                </Trans>
              </Typography>
            </em>
          </div>
        </>
      </Modal>
    </div>
  );
}

export default MigrationModal;
