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
// import ButtonUnstyled from "@mui/core/ButtonUnstyled";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { BigNumber } from "ethers";
import { changeMigrationApproval, migrateAll } from "src/slices/MigrateThunk";
import { useWeb3Context } from "src/hooks";
import { useEffect, useMemo } from "react";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { info } from "src/slices/MessagesSlice";
import InfoTooltip from "../InfoTooltip/InfoTooltip";
import "./migration-modal.scss";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  zIndex: 3,
};

const useStyles = makeStyles({
  custom: {
    color: "#00EE00",
  },
});

function MigrationModal({ open, handleOpen, handleClose }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { provider, address, connected, connect, chainID } = useWeb3Context();

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  let rows = [];
  let isMigrationComplete = useSelector(state => state.account.isMigrationComplete);

  const onSeekApproval = token => {
    dispatch(
      changeMigrationApproval({
        address,
        networkID: chainID,
        provider,
        token: token.toLowerCase(),
        displayName: token,
      }),
    );
  };

  const onMigrate = () => dispatch(migrateAll({ provider, address, networkID: chainID }));
  const currentIndex = useSelector(state => state.app.currentIndex);

  const currentOhmBalance = useSelector(state => Number(state.account.balances.ohm));
  const currentSOhmBalance = useSelector(state => Number(state.account.balances.sohm));
  const currentWSOhmBalance = useSelector(state => Number(state.account.balances.wsohm));

  const approvedOhmBalance = useSelector(state => Number(state.account.migration.ohm));
  const approvedSOhmBalance = useSelector(state => Number(state.account.migration.sohm));
  const approvedWSOhmBalance = useSelector(state => Number(state.account.migration.wsohm));

  const ohmFullApproval = approvedOhmBalance >= currentOhmBalance;
  const sOhmFullApproval = approvedSOhmBalance >= currentSOhmBalance;
  const wsOhmFullApproval = approvedWSOhmBalance >= currentWSOhmBalance;

  const isAllApproved = ohmFullApproval && sOhmFullApproval && wsOhmFullApproval;

  useEffect(() => {
    if (isAllApproved && (currentOhmBalance || currentSOhmBalance || currentWSOhmBalance)) {
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
    },
    {
      initialAsset: "sOHM",
      initialBalance: currentSOhmBalance,
      targetAsset: "gOHM",
      targetBalance: currentSOhmBalance / currentIndex,
      fullApproval: sOhmFullApproval,
    },
    {
      initialAsset: "wsOHM",
      initialBalance: currentWSOhmBalance,
      targetAsset: "gOHM",
      targetBalance: currentWSOhmBalance,
      fullApproval: wsOhmFullApproval,
    },
  ].filter(row => row.initialBalance != 0);

  return (
    <div>
      <Modal
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
          <Box sx={style}>
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
              <Button onClick={handleClose}>
                <SvgIcon component={XIcon} color="primary" />
              </Button>
              <Box paddingRight={6}>
                <Typography id="migration-modal-title" variant="h6" component="h2">
                  {isMigrationComplete
                    ? "Migration complete"
                    : isAllApproved
                    ? "You are now ready to migrate"
                    : "You have assets ready to migrate to v2"}
                </Typography>
              </Box>
              <Box />
            </Box>
            {isMigrationComplete ? null : (
              <Box paddingTop={4}>
                <Typography id="migration-modal-description" variant="body1">
                  {isAllApproved
                    ? "Click on the Migrate button to complete the upgrade to v2. "
                    : "Olympus v2 introduces upgrades to on-chain governance and bonds to enhance decentralization and immutability. "}
                  <ButtonBase
                    href="https://github.com/OlympusDAO-Education/Documentation/blob/migration/basics/migration.md"
                    target="_blank"
                  >
                    <u>Learn More</u>
                  </ButtonBase>
                </Typography>
              </Box>
            )}

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography>Asset</Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Box display="inline-flex">
                      <Typography>Pre-migration</Typography>
                      <InfoTooltip
                        className="migartion-tooltip"
                        message={"This is the current balance of v1 assets in your wallet."}
                      ></InfoTooltip>
                    </Box>
                  </TableCell>
                  <TableCell align="left">
                    <Box display="inline-flex">
                      <Typography>Post-migration</Typography>
                      <InfoTooltip
                        className="migartion-tooltip"
                        message={
                          "This is the equivalent amount of gOHM you will have in your wallet once migration is complete."
                        }
                      ></InfoTooltip>
                    </Box>
                  </TableCell>

                  <TableCell align="left"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row.initialAsset} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      <Typography>{`${row.initialAsset} -> ${row.targetAsset}`}</Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography>
                        {row.initialBalance == 0 ? row.initialBalance : row.initialBalance.toFixed(4)}{" "}
                        {row.initialAsset}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography>
                        {row.targetBalance == 0 ? row.targetBalance : row.targetBalance.toFixed(4)} {row.targetAsset}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      {isMigrationComplete ? (
                        <Typography align="center" className={classes.custom}>
                          Migrated
                        </Typography>
                      ) : row.fullApproval ? (
                        <Typography align="center" className={classes.custom}>
                          Approved
                        </Typography>
                      ) : (
                        <Button
                          variant="outlined"
                          onClick={() => onSeekApproval(row.initialAsset)}
                          disabled={isPendingTxn(pendingTransactions, "approve_migration")}
                        >
                          <Typography>{txnButtonText(pendingTransactions, "approve_migration", "Approve")}</Typography>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Box display="flex" flexDirection="row" justifyContent="center">
              <Button
                color="primary"
                variant="contained"
                disabled={!isAllApproved || isPendingTxn(pendingTransactions, "migrate_all")}
                onClick={isMigrationComplete ? handleClose : onMigrate}
              >
                <Box marginX={4} marginY={0.5}>
                  <Typography>
                    {isMigrationComplete ? "Close" : txnButtonText(pendingTransactions, "migrate_all", "Migrate")}
                  </Typography>
                </Box>
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default MigrationModal;
