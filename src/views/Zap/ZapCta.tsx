import "./Zap.scss";

import { Trans } from "@lingui/macro";
import { Box, Button, Grid, Link, Paper, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { TokenStack } from "@olympusdao/component-library";
import React from "react";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  subHeader: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
    [theme.breakpoints.up("sm")]: {
      display: "flex",
    },
  },
  buttonBox: {
    [theme.breakpoints.down("md")]: {
      justifyContent: "center",
    },
    [theme.breakpoints.up("sm")]: {
      justifyContent: "flex-end",
    },
  },
}));

const ZapCta: React.FC = () => {
  const classes = useStyles();
  return (
    <>
      <Paper className="ohm-card" id="olyzaps-cta">
        <Grid container className="cta-box">
          <Grid item xs={5} sm={3} className="icons-box">
            <TokenStack tokens={["DAI", "wETH"]} />
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
              <Button component="div" variant="outlined" color="secondary" className="learn-more-button">
                <Typography variant="body1">
                  <Trans>Swap into sOHM</Trans>
                </Typography>
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default ZapCta;
