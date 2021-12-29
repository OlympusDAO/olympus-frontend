import { Box, Grid, Typography, useMediaQuery } from "@material-ui/core";
import MultiLogo from "../../components/MultiLogo";
import { ReactComponent as MoreIcon } from "../../assets/icons/circle-more.svg";
import { ReactComponent as CircleZapIcon } from "../../assets/icons/circle-zap.svg";
import { t, Trans } from "@lingui/macro";

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
            <MultiLogo images={images} icons={[MoreIcon]} />
            <Typography color="textSecondary">{isVerySmallScreen ? t`Any asset` : t`Select any asset`}</Typography>
          </Box>
        </Grid>

        {isSmallScreen ? (
          <Grid item xs={6} sm={4}>
            <Box alignItems="center" display="flex" flexDirection="column">
              <MultiLogo
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
                <MultiLogo icons={[CircleZapIcon]} />
                <Typography color="textSecondary">
                  <Trans>Swap for OHM</Trans>
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box alignItems="center" display="flex" flexDirection="column" marginX={1}>
                <MultiLogo
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
