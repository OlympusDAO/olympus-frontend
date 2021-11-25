import { Box, Grid, Typography, useMediaQuery } from "@material-ui/core";
import HeaderLogo from "./HeaderLogo";
import { ReactComponent as MoreIcon } from "../../assets/icons/circle-more.svg";
import { ReactComponent as CircleZapIcon } from "../../assets/icons/circle-zap.svg";
import { Trans } from "@lingui/macro";

export default function ZapStakeHeader({ images }) {
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
      <Grid container direction="row" wrap>
        <Grid item xs={6} sm={4}>
          <Box alignItems="center" display="flex" flexDirection="column">
            <HeaderLogo images={images} icons={[MoreIcon]} />
            <Typography color="textSecondary">
              <Trans>{isVerySmallScreen ? "Any asset" : "Select any asset"}</Trans>
            </Typography>
          </Box>
        </Grid>

        {isSmallScreen ? (
          <Grid item xs={6} sm={4}>
            <Box alignItems="center" display="flex" flexDirection="column">
              <HeaderLogo
                images={[
                  "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x04f2694c8fcee23e8fd0dfea1d4f5bb8c352111f.png",
                ]}
                icons={[CircleZapIcon]}
              />
              <Typography color="textSecondary">
                <Trans>Swap for sOHM</Trans>
              </Typography>
            </Box>
          </Grid>
        ) : (
          <>
            <Grid item xs={12} sm={4}>
              <Box alignItems="center" display="flex" flexDirection="column" marginX={1}>
                <HeaderLogo icons={[CircleZapIcon]} />
                <Typography color="textSecondary">
                  <Trans>Swap for OHM</Trans>
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box alignItems="center" display="flex" flexDirection="column" marginX={1}>
                <HeaderLogo
                  images={[
                    "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x04f2694c8fcee23e8fd0dfea1d4f5bb8c352111f.png",
                  ]}
                  avatarStyleOverride={{ height: "40px", width: "40px", marginInline: "-7px" }}
                />
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
}
