import { Box, Button, Fade, Grid, Paper, Tab, Tabs, Typography, Zoom } from "@material-ui/core";
import HeaderLogo from "./HeaderLogo";

export default function ZapStakeHeader({ images }) {
  return (
    <Box paddingBottom={4}>
      <Grid container direction="row" wrap>
        <Grid item xs={12} sm={4}>
          <Box alignItems="center" display="flex" flexDirection="column">
            <HeaderLogo images={images} />
            <Typography>
              Select <b>ANY</b> asset
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box alignItems="center" display="flex" flexDirection="column">
            <HeaderLogo
              images={[
                "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x04f2694c8fcee23e8fd0dfea1d4f5bb8c352111f.png",
              ]}
            />
            <Typography>Swap for OHM</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box alignItems="center" display="flex" flexDirection="column">
            <HeaderLogo
              images={[
                "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x04f2694c8fcee23e8fd0dfea1d4f5bb8c352111f.png",
              ]}
            />
            <Typography>Auto staked for sOHM</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
