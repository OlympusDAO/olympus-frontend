import { t, Trans } from "@lingui/macro";
import { Box, Grid, Typography, useMediaQuery } from "@material-ui/core";
import { Token, TokenStack } from "@olympusdao/component-library";
import React from "react";

type ZapStakeHeaderProps = {
  images: Array<string>;
};

const ZapStakeHeader: React.FC<ZapStakeHeaderProps> = ({ images }) => {
  const isSmallScreen = useMediaQuery("(max-width: 680px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 325px)");
  if (isVerySmallScreen) {
    images = images?.slice(0, 2);
  }
  return (
    <Box
      paddingBottom={4}
      flexDirection="row"
      display="flex"
      justifyContent="space-between"
      paddingX={isSmallScreen ? 0 : 8}
      width="100%"
    >
      <Grid container direction="row">
        <Grid item xs={6} sm={4}>
          <Box alignItems="center" display="flex" flexDirection="column">
            <TokenStack images={images} tokens={["more"]} style={{ marginBottom: "16px" }} />
            <Typography color="textSecondary">{isVerySmallScreen ? t`Any asset` : t`Select any asset`}</Typography>
          </Box>
        </Grid>

        {isSmallScreen ? (
          <Grid item xs={6} sm={4}>
            <Box alignItems="center" display="flex" flexDirection="column">
              <TokenStack tokens={["sOHM", "zap"]} />
              <Typography color="textSecondary">
                <Trans>Swap for sOHM</Trans>
              </Typography>
            </Box>
          </Grid>
        ) : (
          <>
            <Grid item xs={12} sm={4}>
              <Box alignItems="center" display="flex" flexDirection="column" marginX={1}>
                {/* @ts-ignore - (keith) add style prop & types to Token Component */}
                <Token name="zap" style={{ marginBottom: "16px" }} />
                <Typography color="textSecondary">
                  <Trans>Swap for OHM</Trans>
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box alignItems="center" display="flex" flexDirection="column" marginX={1}>
                {/* @ts-ignore - (keith) add style prop & types to Token Component */}
                <Token name="sOHM" style={{ marginBottom: "16px" }} />
                <Typography color="textSecondary">
                  <Trans>Auto staked for sOHM</Trans>
                </Typography>
              </Box>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default ZapStakeHeader;
