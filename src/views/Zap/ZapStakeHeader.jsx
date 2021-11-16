import { Box, Grid, Typography, useMediaQuery } from "@material-ui/core";
import HeaderLogo from "./HeaderLogo";
import { ReactComponent as MoreIcon } from "../../assets/icons/circle-more.svg";
import { ReactComponent as CircleZapIcon } from "../../assets/icons/circle-zap.svg";

export default function ZapStakeHeader({ images }) {
  const isSmallScreen = useMediaQuery("(max-width: 680px)");
  return (
    <Box paddingBottom={4} flexDirection="row" display="flex" justifyContent="space-between" paddingX={8}>
      {/* <Grid container direction="row" wrap> */}
      {/* <Grid item xs={12} sm={4}> */}
      <Box alignItems="center" display="flex" flexDirection="column">
        <HeaderLogo images={images} icons={[MoreIcon]} />
        <Typography>
          Select <b>ANY</b> asset
        </Typography>
      </Box>
      {/* </Grid> */}
      {/* <Grid item xs={12} sm={4}> */}
      {isSmallScreen ? (
        <Box alignItems="center" display="flex" flexDirection="column">
          <HeaderLogo
            images={[
              "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x04f2694c8fcee23e8fd0dfea1d4f5bb8c352111f.png",
            ]}
            icons={[CircleZapIcon]}
          />
          <Typography>Swap for sOHM</Typography>
        </Box>
      ) : (
        <>
          <Box alignItems="center" display="flex" flexDirection="column" marginX={1}>
            <HeaderLogo
              //   images={[
              //     "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x04f2694c8fcee23e8fd0dfea1d4f5bb8c352111f.png",
              //   ]}
              icons={[CircleZapIcon]}
            />
            <Typography>Swap for OHM</Typography>
          </Box>
          {/* </Grid> */}
          {/* <Grid item xs={12} sm={4}> */}
          <Box alignItems="center" display="flex" flexDirection="column" marginX={1}>
            <HeaderLogo
              images={[
                "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x04f2694c8fcee23e8fd0dfea1d4f5bb8c352111f.png",
              ]}
            />
            <Typography>Auto staked for sOHM</Typography>
          </Box>
        </>
      )}
      {/* </Grid> */}
      {/* </Grid> */}
    </Box>
  );
}
