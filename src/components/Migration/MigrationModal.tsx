import {
  Backdrop,
  Box,
  Button,
  ButtonBase,
  Fade,
  Modal,
  SvgIcon,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Typography,
  Paper,
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";

// import ButtonUnstyled from "@mui/core/ButtonUnstyled";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { BigNumber } from "ethers";
import { changeMigrationApproval, migrateAll } from "src/slices/MigrateThunk";
import { useWeb3Context } from "src/hooks";
import { useEffect, useMemo } from "react";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { info } from "src/slices/MessagesSlice";
import InfoTooltip from "../InfoTooltip/InfoTooltip";
import "./migration-modal.scss";
import { useAppSelector } from "src/hooks";
import { trim } from "src/helpers";
import { t, Trans } from "@lingui/macro";
const formatCurrency = (c: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(c);
};
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  zIndex: 3,
  maxWidth: 600,
  minWidth: 300,
  borderRadius: 10,
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
  const { provider, address, connect } = useWeb3Context();

  const networkId = useAppSelector(state => state.network.networkId);

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
  let isMigrationComplete = useAppSelector(state => state.account.isMigrationComplete);

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

  const onMigrate = () => dispatch(migrateAll({ provider, address, networkID: networkId }));
  const currentIndex = useAppSelector(state => Number(state.app.currentIndexV1!));

  const currentOhmBalance = useAppSelector(state => Number(state.account.balances.ohmV1));
  const currentSOhmBalance = useAppSelector(state => Number(state.account.balances.sohmV1));
  const currentWSOhmBalance = useAppSelector(state => Number(state.account.balances.wsohm));
  const wsOhmPrice = useAppSelector(state => state.app.marketPrice! * Number(state.app.currentIndex!));

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

  const ohmInUSD = formatCurrency(marketPrice! * currentOhmBalance);
  const sOhmInUSD = formatCurrency(marketPrice! * currentSOhmBalance);
  const wsOhmInUSD = formatCurrency(wsOhmPrice * currentWSOhmBalance);

  useEffect(() => {
    if (
      networkId &&
      (networkId === 1 || networkId === 4) &&
      isAllApproved &&
      (currentOhmBalance || currentSOhmBalance || currentWSOhmBalance)
    ) {
      dispatch(info("All approvals complete. You may now migrate."));
    }
  }, [isAllApproved]);

  rows = [
    {
      initialAsset: "OHM",
      initialBalance: currentOhmBalance,
      targetAsset: "gOHM",
      targetBalance: currentOhmBalance / currentIndex,
      fullApproval: ohmFullApproval,
      usdBalance: ohmInUSD,
    },
    {
      initialAsset: "sOHM",
      initialBalance: currentSOhmBalance,
      targetAsset: "gOHM",
      targetBalance: currentSOhmBalance / currentIndex,
      fullApproval: sOhmFullApproval,
      usdBalance: sOhmInUSD,
    },
    {
      initialAsset: "wsOHM",
      initialBalance: currentWSOhmBalance,
      targetAsset: "gOHM",
      targetBalance: currentWSOhmBalance,
      fullApproval: wsOhmFullApproval,
      usdBalance: wsOhmInUSD,
    },
  ];

  return (
    <div>
      <Modal
        className="mig-modal-full"
        aria-labelledby="migration-modal-title"
        aria-describedby="migration-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box display="flex" alignItems="center" justifyContent="center" style={{ width: "100%", height: "100%" }}>
            <Paper className="ohm-card migration-card">
              <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                <Button onClick={handleClose}>
                  <SvgIcon component={XIcon} color="primary" />
                </Button>
                <Box paddingRight={isMobileScreen ? 0 : 6}>
                  <Typography id="migration-modal-title" variant="h6" component="h2">
                    {isMigrationComplete || !oldAssetsDetected
                      ? t`Migration complete`
                      : isAllApproved
                      ? t`You are now ready to migrate`
                      : t`You have assets ready to migrate to v2`}
                  </Typography>
                </Box>
                <Box />
              </Box>
              {isMigrationComplete || !oldAssetsDetected ? null : (
                <Box paddingTop={4}>
                  <Typography id="migration-modal-description" variant="body2">
                    {isAllApproved
                      ? t`Click on the Migrate button to complete the upgrade to v2. `
                      : `Olympus v2 introduces upgrades to on-chain governance and bonds to enhance decentralization and immutability. `}
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
                    <TableRow>
                      <TableCell align="center">
                        <Typography>Asset</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box display="inline-flex">
                          <Typography>
                            <Trans>Pre-migration</Trans>
                          </Typography>
                          <InfoTooltip
                            message={t`This is the current balance of v1 assets in your wallet.`}
                            children={undefined}
                          ></InfoTooltip>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box display="inline-flex">
                          <Typography>
                            <Trans>Post-migration</Trans>
                          </Typography>
                          <InfoTooltip
                            message={t`This is the equivalent amount of gOHM you will have in your wallet once migration is complete.`}
                            children={undefined}
                          ></InfoTooltip>
                        </Box>
                      </TableCell>

                      <TableCell align="center">
                        <Box display="inline-flex">{/* <Typography>Migration Completion Status</Typography> */}</Box>
                      </TableCell>

                      <TableCell align="left"></TableCell>
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
                        : txnButtonText(pendingTransactions, "migrate_all", t`Migrate`)}
                    </Typography>
                  </Box>
                </Button>
              </Box>
            </Paper>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default MigrationModal;
