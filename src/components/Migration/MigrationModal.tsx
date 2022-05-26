import "./MigrationModal.scss";

import { t, Trans } from "@lingui/macro";
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { InfoTooltip, Modal, Tab, Tabs } from "@olympusdao/component-library";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { NetworkId } from "src/constants";
import { trim } from "src/helpers";
import { useMigrationData } from "src/helpers/Migration";
import { useWeb3Context } from "src/hooks";
import { useAppSelector } from "src/hooks";
import { info } from "src/slices/MessagesSlice";
import { changeMigrationApproval, migrateAll } from "src/slices/MigrateThunk";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { AppDispatch } from "src/store";

const classes = {
  custom: {
    color: "#00EE00",
  },
};

function MigrationModal({ open, handleClose }: { open: boolean; handleClose: any }) {
  const dispatch: AppDispatch = useDispatch();
  const isMobileScreen = useMediaQuery("(max-width: 513px)");
  const { provider, address, networkId } = useWeb3Context();

  const {
    view,
    changeView,
    currentOhmBalance,
    currentSOhmBalance,
    currentWSOhmBalance,
    ohmFullApproval,
    sOhmFullApproval,
    wsOhmFullApproval,
    ohmAsgOHM,
    sOHMAsgOHM,
    ohmInUSD,
    sOhmInUSD,
    wsOhmInUSD,
    isGOHM,
    targetAsset,
    targetMultiplier,
    oldAssetsDetected,
    pendingTransactions,
    isAllApproved,
  } = useMigrationData();

  let rows: any[] = [];
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
      targetBalance: +currentWSOhmBalance * targetMultiplier,
      fullApproval: wsOhmFullApproval,
      usdBalance: wsOhmInUSD,
    },
  ];

  // console.info(`MigrationModal rows after: [${rows}]`);

  return (
    <div data-testid="migration-modal">
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
                        <Typography align="center" sx={classes.custom}>
                          <Trans>Migrated</Trans>
                        </Typography>
                      ) : row.fullApproval ? (
                        <Typography align="center" sx={classes.custom}>
                          <Trans>Approved</Trans>
                        </Typography>
                      ) : (
                        <Button
                          variant="outlined"
                          onClick={() => onSeekApproval(row.initialAsset)}
                          aria-label="approve-migration"
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
                          <Typography align="center" sx={classes.custom}>
                            <Trans>Migrated</Trans>
                          </Typography>
                        ) : row.fullApproval ? (
                          <Typography align="center" sx={classes.custom}>
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
                    : txnButtonText(pendingTransactions, "migrate_all", t`Migrate all to ${isGOHM ? "gOHM" : "sOHM"}`)}
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
