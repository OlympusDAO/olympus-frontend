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
} from "@material-ui/core";
// import ButtonUnstyled from "@mui/core/ButtonUnstyled";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { BigNumber } from "ethers";
import { changeMigrationApproval } from "src/slices/MigrateThunk";
import { useWeb3Context } from "src/hooks";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
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

  const currentIndex = useSelector(state => state.app.currentIndex);
  const ohmBalance = useSelector(state => Number(state.account.balances.ohm));
  const sOhmBalance = useSelector(state => Number(state.account.balances.sohm));
  const wsOhmBalance = useSelector(state => Number(state.account.balances.wsohm));

  const approvedOhmBalance = useSelector(state => Number(state.account.migration.ohm));
  const approvedSOhmBalance = useSelector(state => Number(state.account.migration.sohm));
  const approvedWSOhmBalance = useSelector(state => Number(state.account.migration.wsohm));

  const ohmFullApproval = approvedOhmBalance >= ohmBalance;
  const sOhmFullApproval = approvedSOhmBalance >= sOhmBalance;
  const wsOhmFullApproval = approvedWSOhmBalance >= wsOhmBalance;

  const isAllApproved = ohmFullApproval && sOhmFullApproval && wsOhmFullApproval;

  const onSeekApproval = token => {
    dispatch(changeMigrationApproval({ address, networkID: chainID, provider, token }));
  };

  const rows = [
    {
      initialAsset: "OHM",
      initialBalance: ohmBalance,
      targetAsset: "gOHM",
      targetBalance: ohmBalance / currentIndex,
      fullApproval: ohmFullApproval,
    },
    {
      initialAsset: "sOHM",
      initialBalance: sOhmBalance,
      targetAsset: "gOHM",
      targetBalance: sOhmBalance / currentIndex,
      fullApproval: sOhmFullApproval,
    },
    {
      initialAsset: "wsOHM",
      initialBalance: wsOhmBalance,
      targetAsset: "gOHM",
      targetBalance: wsOhmBalance,
      fullApproval: wsOhmFullApproval,
    },
  ].filter(row => row.initialBalance != 0.0);

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
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              paddingBottom={4}
            >
              <Button onClick={handleClose}>
                <SvgIcon component={XIcon} color="primary" />
              </Button>
              <Box paddingRight={6}>
                <Typography id="migration-modal-title" variant="h6" component="h2">
                  You have assets ready to migrate to v2
                </Typography>
              </Box>
              <Box />
            </Box>
            <Typography id="migration-modal-description" variant="body1">
              You will need to migrate your assets in order to continue staking. You will not lose any yield or rewards
              during the process.{" "}
              <ButtonBase
                href="https://github.com/OlympusDAO-Education/Documentation/blob/migration/basics/migration.md"
                target="_blank"
              >
                <u>Learn More</u>
              </ButtonBase>
            </Typography>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography>Asset</Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography>Pre-migration</Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography>Post-migration</Typography>
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
                      {row.initialBalance == 0 ? (
                        <Typography align="center" className={classes.custom}>
                          Complete
                        </Typography>
                      ) : row.fullApproval ? (
                        <Typography align="center" className={classes.custom}>
                          Approved
                        </Typography>
                      ) : (
                        <Button variant="outlined" onClick={() => onSeekApproval(row.initialAsset.toLowerCase())}>
                          <Typography>{"Approve"}</Typography>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box display="flex" flexDirection="row" justifyContent="center">
              <Button color="primary" variant="contained" disabled={!isAllApproved}>
                <Box marginX={4} marginY={0.5}>
                  <Typography>{"Migrate"}</Typography>
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
