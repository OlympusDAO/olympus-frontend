// import "src/views/Zap/Zap.scss";

import { Trans } from "@lingui/macro";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { SecondaryButton, Token, TokenStack } from "@olympusdao/component-library";
import React from "react";
import { trackGAEvent } from "src/helpers/analytics/trackGAEvent";
import { useAccount } from "wagmi";

const PREFIX = "ZapInfo";

const classes = {
  infoBox: `${PREFIX}-infoBox`,
  infoBoxItem: `${PREFIX}-infoBoxItem`,
  infoHeader: `${PREFIX}-infoHeader`,
  infoBody: `${PREFIX}-infoBody`,
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  [`& .${classes.infoBox}`]: {
    [theme.breakpoints.down("lg")]: {
      display: "flex",
      flexDirection: "row",
    },
    [theme.breakpoints.up("md")]: {
      display: "flex",
      flexDirection: "column",
    },
  },

  [`& .${classes.infoBoxItem}`]: {
    [theme.breakpoints.down("lg")]: {
      padding: "8px !important",
    },
    [theme.breakpoints.up("md")]: {
      padding: "16px !important",
    },
  },

  [`& .${classes.infoHeader}`]: {
    [theme.breakpoints.down("lg")]: {
      width: "40%",
      padding: "12px 0px",
    },
    [theme.breakpoints.up("md")]: {
      width: "100%",
      paddingBottom: "1.5rem",
    },
  },

  [`& .${classes.infoBody}`]: {
    [theme.breakpoints.down("lg")]: {
      width: "60%",
      paddingTop: "12px",
      paddingInline: "6px",
    },
    [theme.breakpoints.up("md")]: {
      width: "100%",
      paddingTop: 0,
    },
  },
}));

const ZapInfo: React.FC = () => {
  const { address = "" } = useAccount();
  const trackClick = (address?: string) => {
    const uaData = {
      address,
      type: "Learn more OlyZaps",
    };
    trackGAEvent({
      category: "OlyZaps",
      action: uaData.type,
    });
  };
  return (
    <StyledPaper>
      <Grid container direction="row">
        <Grid item sm={12} md={4} classes={{ root: classes.infoBox, item: classes.infoBoxItem }}>
          <Box
            alignItems="center"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            className={`${classes.infoHeader}`}
          >
            <Box>
              <TokenStack tokens={["DAI", "wETH"]} style={{ marginBottom: "16px" }} />
            </Box>
            <Typography color="textSecondary" align="center">
              <Trans>You Give</Trans>
            </Typography>
          </Box>
          <Box className={classes.infoBody}>
            <Typography variant="h6">
              <Trans>Zap is a swap</Trans>
            </Typography>
            <Typography align="left">
              <Trans>
                A zap swap is a series of smart contracts that deploys one asset to another protocol to handle a trusted
                transaction.
              </Trans>
            </Typography>
          </Box>
        </Grid>
        <Grid item sm={12} md={4} classes={{ root: classes.infoBox, item: classes.infoBoxItem }}>
          <Box
            alignItems="center"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            className={`${classes.infoHeader} oly-info-header-box`}
          >
            {/* @ts-ignore - (keith) add style prop & types to Token Component */}
            <Token name="zap" style={{ marginBottom: "16px" }} />
            <Typography color="textSecondary" align="center">
              <Trans>All-in-one zap contracts</Trans>
            </Typography>
          </Box>
          <Box className={classes.infoBody}>
            <Typography variant="h6">
              <Trans>All-in-one easy staking</Trans>
            </Typography>
            <Typography align="left">
              <Trans>OlyZap reduces complexity, saves you time and keeps you here on Olympus.</Trans>
            </Typography>
          </Box>
        </Grid>
        <Grid item sm={12} md={4} classes={{ root: classes.infoBox, item: classes.infoBoxItem }}>
          <Box
            alignItems="center"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            className={`${classes.infoHeader} oly-info-header-box`}
          >
            {/* @ts-ignore - (keith) add style prop & types to Token Component */}
            <TokenStack tokens={["sOHM", "wsOHM"]} style={{ marginBottom: "16px" }} />
            <Typography color="textSecondary" align="center">
              <Trans>You Choose</Trans>
            </Typography>
          </Box>
          <Box className={classes.infoBody}>
            <Typography variant="h6">
              <Trans>Staking</Trans>
            </Typography>
            <Typography align="left">
              <Trans>
                Staking is the primary value accrual strategy of Olympus. When you stake, you lock OHM and receive an
                equal value of sOHM or gOHM.
              </Trans>
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="center">
        <SecondaryButton
          href="https://docs.olympusdao.finance/main/using-the-website/olyzaps"
          onClick={() => {
            trackClick(address);
          }}
        >
          Learn More
        </SecondaryButton>
      </Box>
    </StyledPaper>
  );
};

export default ZapInfo;
