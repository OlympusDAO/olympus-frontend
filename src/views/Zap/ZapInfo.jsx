import { Box, Button, Paper, Typography, Grid, SvgIcon } from "@material-ui/core";
import "./zap.scss";
import { ReactComponent as CircleZapIcon } from "../../assets/icons/circle-zap.svg";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import HeaderLogo from "./HeaderLogo";

function ZapInfo({ tokens }) {
  return (
    <>
      <Paper className="ohm-card" id="olyzaps-info">
        <Grid container direction="row" wrap spacing={4}>
          <Grid item xs={12} sm={4}>
            <Box alignItems="center" display="flex" flexDirection="column" className="oly-info-header-box">
              <HeaderLogo images={tokens} />
              <Typography color="textSecondary">You Give</Typography>
            </Box>
            <Box>
              <Typography variant="body1" className="oly-info-body-header">
                Zap is a swap
              </Typography>
              <Typography align="left" variant="body2" className="oly-info-body">
                A zap swap is a series of smart contracts that deploys one asset to another a protocol to handle a
                trusted transaction.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box alignItems="center" display="flex" flexDirection="column" className="oly-info-header-box">
              <HeaderLogo icons={[CircleZapIcon]} />
              <Typography color="textSecondary">All-in-one zap contracts</Typography>
            </Box>
            <Box>
              <Typography variant="body1" className="oly-info-body-header">
                Save up to 75% on gas
              </Typography>
              <Typography align="left" variant="body2" className="oly-info-body">
                Our All-In-One easy zap and stake reduces the complexity of smart contracts to save you on gas fees.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box alignItems="center" display="flex" flexDirection="column" className="oly-info-header-box">
              <HeaderLogo
                images={[
                  "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x04f2694c8fcee23e8fd0dfea1d4f5bb8c352111f.png",
                ]}
              />
              <Typography color="textSecondary">You Get sOHM </Typography>
            </Box>
            <Box>
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
      ,
    </>
  );
}

export default ZapInfo;
