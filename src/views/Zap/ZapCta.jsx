import { Box, Button, Paper, Typography, Grid, SvgIcon, Link } from "@material-ui/core";
import "./zap.scss";
import MultiLogo from "../../components/MultiLogo";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Trans } from "@lingui/macro";
import { SecondaryButton } from "@olympusdao/component-library";

const useStyles = makeStyles(theme => ({
  subHeader: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    [theme.breakpoints.up("sm")]: {
      display: "flex",
    },
  },
  buttonBox: {
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
    },
    [theme.breakpoints.up("sm")]: {
      justifyContent: "flex-end",
    },
  },
}));

function ZapCta() {
  const classes = useStyles();
  return (
    <>
      <Paper className="ohm-card" id="olyzaps-cta">
        <Grid container display="flex" className="cta-box" wrap>
          <Grid item xs={5} sm={3} className="icons-box">
            <MultiLogo images={[]} />
          </Grid>
          <Grid item xs={7} sm={5}>
            <Box alignItems="center" display="flex" flexDirection="column">
              <Typography color="textPrimary" align="center" className="cta-header">
                <Trans>
                  Zap with more assets and stake <strong>OHM</strong>
                </Trans>
              </Typography>
              <Typography
                color="textPrimary"
                align="center"
                className="cta-subheader"
                classes={{ root: classes.subHeader }}
              >
                <Trans>All-in-One contract to save time</Trans>
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} className="button-box" classes={{ root: classes.buttonBox }}>
            <Link component={NavLink} to="/zap">
              <SecondaryButton size="small">
                <Trans>Swap into sOHM</Trans>
              </SecondaryButton>
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

export default ZapCta;
