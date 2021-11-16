import { Box, Button, Paper, Typography, Grid, SvgIcon } from "@material-ui/core";
import "./zap.scss";
import { ReactComponent as CircleZapIcon } from "../../assets/icons/circle-zap.svg";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import HeaderLogo from "./HeaderLogo";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  infoBox: {
    [theme.breakpoints.down("md")]: {
      display: "flex",
      flexDirection: "row",
    },
    [theme.breakpoints.up("md")]: {
      display: "flex",
      flexDirection: "column",
    },
  },
  infoBoxItem: {
    [theme.breakpoints.down("md")]: {
      padding: "0px !important",
    },
    [theme.breakpoints.up("md")]: {
      padding: "16px !important",
    },
  },
  infoHeader: {
    [theme.breakpoints.down("md")]: {
      width: "50%",
    },
    [theme.breakpoints.up("md")]: {
      width: "100%",
    },
  },
  infoBody: {
    [theme.breakpoints.down("md")]: {
      width: "50%",
      paddingTop: "24px",
    },
    [theme.breakpoints.up("md")]: {
      width: "100%",
      paddingTop: 0,
    },
  },
}));

function ZapInfo({ tokens }) {
  const classes = useStyles();
  return (
    <>
      <Paper className="ohm-card" id="olyzaps-info">
        <Grid container direction="row" wrap spacing={4}>
          <Grid item sm={12} md={4} classes={{ root: classes.infoBox, item: classes.infoBoxItem }}>
            <Box
              alignItems="center"
              display="flex"
              flexDirection="column"
              classes={{ root: classes.infoHeader }}
              className="oly-info-header-box"
            >
              <HeaderLogo images={tokens} />
              <Typography color="textSecondary" align="center">
                You Give
              </Typography>
            </Box>
            <Box classes={{ root: classes.infoBody }}>
              <Typography variant="body1" className="oly-info-body-header">
                Zap is a swap
              </Typography>
              <Typography align="left" variant="body2" className="oly-info-body">
                A zap swap is a series of smart contracts that deploys one asset to another a protocol to handle a
                trusted transaction.
              </Typography>
            </Box>
          </Grid>
          <Grid item sm={12} md={4} classes={{ root: classes.infoBox, item: classes.infoBoxItem }}>
            <Box
              alignItems="center"
              display="flex"
              flexDirection="column"
              classes={{ root: classes.infoHeader }}
              className="oly-info-header-box"
            >
              <HeaderLogo icons={[CircleZapIcon]} />
              <Typography color="textSecondary" align="center">
                All-in-one zap contracts
              </Typography>
            </Box>
            <Box classes={{ root: classes.infoBody }}>
              <Typography variant="body1" className="oly-info-body-header">
                Save up to 75% on gas
              </Typography>
              <Typography align="left" variant="body2" className="oly-info-body">
                Our All-In-One easy zap and stake reduces the complexity of smart contracts to save you on gas fees.
              </Typography>
            </Box>
          </Grid>
          <Grid item sm={12} md={4} classes={{ root: classes.infoBox, item: classes.infoBoxItem }}>
            <Box
              alignItems="center"
              display="flex"
              flexDirection="column"
              classes={{ root: classes.infoHeader }}
              className="oly-info-header-box"
            >
              <HeaderLogo
                images={[
                  "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x04f2694c8fcee23e8fd0dfea1d4f5bb8c352111f.png",
                ]}
              />
              <Typography color="textSecondary" align="center">
                You Get sOHM{" "}
              </Typography>
            </Box>
            <Box classes={{ root: classes.infoBody }}>
              <Typography variant="body1" className="oly-info-body-header">
                Staking
              </Typography>
              <Typography align="left" variant="body2" className="oly-info-body">
                Staking is the primary value accrual strategy of Olympus. When you stake, you lock OHM and receive an
                equal amount of sOHM.
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Box className="button-box">
          <Button
            variant="outlined"
            color="secondary"
            href="https://docs.olympusdao.finance/main/"
            target="_blank"
            className="learn-more-button"
          >
            <Typography variant="body1">Learn More</Typography>
            <SvgIcon component={ArrowUp} color="primary" />
          </Button>
        </Box>
      </Paper>
    </>
  );
}

export default ZapInfo;
