import { Box, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Icon, MiniCard, Paper } from "@olympusdao/component-library";
import { useState } from "react";

const PREFIX = "Bridge";

const classes = {
  dismiss: `${PREFIX}-dismiss`,
};

const StyledBox = styled(Box)(({ theme }) => ({
  [`& .${classes.dismiss}`]: {
    fill: theme.colors.primary[300],
  },
}));

/**
 * Component for Displaying BridgeLinks
 */
const Bridge = () => {
  const [open, setOpen] = useState(true);

  return (
    <div id="stake-view">
      {open && (
        <Paper>
          <StyledBox display="flex" flexDirection="row" justifyContent="flex-end">
            <Icon data-testid="dismiss" className={classes.dismiss} name="x" onClick={() => setOpen(false)} />
          </StyledBox>
          <Box justifyContent="center" alignItems="center" textAlign="center">
            <Typography variant="h6">Use your gOHM on your favorite chain.</Typography>
            <Typography variant="h6">Find the Bridge you need.</Typography>
          </Box>
        </Paper>
      )}
      <Paper headerText="Bridge">
        <Box display="flex" flexDirection="row">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box display="flex" flexDirection="column">
                <MiniCard
                  label="Bridge to"
                  title="Ethereum"
                  icon="ETH"
                  href="https://synapseprotocol.com/?inputCurrency=gOHM&outputCurrency=gOHM&outputChain=1"
                />
                <MiniCard
                  label="Bridge to"
                  title="Polygon"
                  icon="POLYGON"
                  href="https://synapseprotocol.com/?inputCurrency=gOHM&outputCurrency=gOHM&outputChain=137"
                />
                <MiniCard
                  label="Bridge to"
                  title="Avalanche"
                  icon="AVAX"
                  href="https://synapseprotocol.com/?inputCurrency=gOHM&outputCurrency=gOHM&outputChain=43114"
                />
                <MiniCard
                  label="Bridge to"
                  title="Boba"
                  icon="BOBA"
                  href="https://synapseprotocol.com/?inputCurrency=gOHM&outputCurrency=gOHM&outputChain=288"
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" flexDirection="column">
                <MiniCard
                  label="Bridge to"
                  title="Arbitrum"
                  icon="ARBITRUM"
                  href="https://synapseprotocol.com/?inputCurrency=gOHM&outputCurrency=gOHM&outputChain=42161"
                />
                <MiniCard
                  label="Bridge to"
                  title="Optimism"
                  icon="OPTIMISM"
                  href="https://synapseprotocol.com/?inputCurrency=gOHM&outputCurrency=gOHM&outputChain=10"
                />
                <MiniCard
                  label="Bridge to"
                  title="Fantom"
                  icon="FANTOM"
                  href="https://synapseprotocol.com/?inputCurrency=gOHM&outputCurrency=gOHM&outputChain=250"
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </div>
  );
};

export default Bridge;
