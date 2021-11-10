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
  const classes = useStyles();

  const ohmBalance = 0.5; // FETCH FROM STATE
  const gOhmBalance = 0.1; // CALCULATE BASED ON INDEX
  const sOhmBalance = 22.4; // FETCH FROM STATE
  const wsOhmBalance = 0.0; // FETCH FROM STATE

  const approvedOhmBalance = 0.5; // ALL APPROVED
  const approvedSOhmBalance = 22.3; // LESS THAN BALANCE APPROVED

  const rows = [
    {
      initialAsset: "OHM",
      initialBalance: ohmBalance,
      targetAsset: "OHM (v2)",
      targetBalance: ohmBalance,
      fullApproval: approvedOhmBalance == ohmBalance,
    },
    {
      initialAsset: "sOHM",
      initialBalance: sOhmBalance,
      targetAsset: "gOHM",
      targetBalance: gOhmBalance,
      fullApproval: false,
    },
    {
      initialAsset: "wsOHM",
      initialBalance: wsOhmBalance,
      targetAsset: "gOHM",
      targetBalance: wsOhmBalance,
      fullApproval: false,
    },
  ];

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
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
            <Typography id="migration-modal-description">
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
                        {row.initialBalance} {row.initialAsset}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography>
                        {row.targetBalance} {row.targetAsset}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      {row.initialBalance == 0 ? (
                        <Typography align="center" className={classes.custom}>
                          Complete
                        </Typography>
                      ) : (
                        <Button variant="outlined">
                          <Typography>{row.fullApproval ? "Migrate" : "Approve"}</Typography>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default MigrationModal;
