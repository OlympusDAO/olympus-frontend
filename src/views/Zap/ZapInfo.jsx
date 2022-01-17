import { Box, Button, Paper, Typography, Grid, SvgIcon } from "@material-ui/core";
import "./zap.scss";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { makeStyles } from "@material-ui/core/styles";
import { segmentUA } from "../../helpers/userAnalyticHelpers";
import { Trans } from "@lingui/macro";
import { TokenStack, Token } from "@olympusdao/component-library";

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
      padding: "8px !important",
    },
    [theme.breakpoints.up("md")]: {
      padding: "16px !important",
    },
  },
  infoHeader: {
    [theme.breakpoints.down("md")]: {
      width: "40%",
    },
    [theme.breakpoints.up("md")]: {
      width: "100%",
    },
  },
  infoBody: {
    [theme.breakpoints.down("md")]: {
      width: "60%",
      paddingTop: "24px",
    },
    [theme.breakpoints.up("md")]: {
      width: "100%",
      paddingTop: 0,
    },
  },
}));

function ZapInfo({ tokens, address }) {
  const trackClick = address => {
    let uaData = {
      address: address,
      type: "Learn more OlyZaps",
    };
    segmentUA(uaData);
  };
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
              <Box>
                <TokenStack tokens={["DAI", "wETH"]} style={{ marginBottom: "16px" }} />
              </Box>

              <Typography color="textSecondary" align="center">
                <Trans>You Give</Trans>
              </Typography>
            </Box>
            <Box classes={{ root: classes.infoBody }}>
              <Typography variant="body1" className="oly-info-body-header">
                <Trans>Zap is a swap</Trans>
              </Typography>
              <Typography align="left" variant="body2" className="oly-info-body">
                <Trans>
                  A zap swap is a series of smart contracts that deploys one asset to another protocol to handle a
                  trusted transaction.
                </Trans>
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
              <Token name={["zap"]} style={{ marginBottom: "16px" }} />
              <Typography color="textSecondary" align="center">
                <Trans>All-in-one zap contracts</Trans>
              </Typography>
            </Box>
            <Box classes={{ root: classes.infoBody }}>
              <Typography variant="body1" className="oly-info-body-header">
                <Trans>All-in-one easy staking</Trans>
              </Typography>
              <Typography align="left" variant="body2" className="oly-info-body">
                <Trans>OlyZap reduces complexity, saves you time and keeps you here on Olympus.</Trans>
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
              <Token name="sOHM" style={{ marginBottom: "16px" }} />
              <Typography color="textSecondary" align="center">
                <Trans>You Get sOHM</Trans>{" "}
              </Typography>
            </Box>
            <Box classes={{ root: classes.infoBody }}>
              <Typography variant="body1" className="oly-info-body-header">
                <Trans>Staking</Trans>
              </Typography>
              <Typography align="left" variant="body2" className="oly-info-body">
                <Trans>
                  Staking is the primary value accrual strategy of Olympus. When you stake, you lock OHM and receive an
                  equal amount of sOHM.
                </Trans>
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Box className="button-box">
          <Button
            variant="outlined"
            color="secondary"
            href="https://docs.olympusdao.finance/main/using-the-website/olyzaps"
            target="_blank"
            className="learn-more-button"
            onClick={() => {
              trackClick(address);
            }}
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
