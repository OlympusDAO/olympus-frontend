import { t } from "@lingui/macro";
import { Box, Divider, Grid, Link, Typography } from "@mui/material";
import { Icon, MetricCollection, Paper } from "@olympusdao/component-library";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { useWeb3Context } from "src/hooks";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";

import { CurrentIndex, GOHMPrice, SOHMPrice } from "../TreasuryDashboard/components/Metric/Metric";
import { MigrateInputArea } from "./components/MigrateInputArea/MigrateInputArea";
import { WrapBalances } from "./components/WrapBalances";
import { WrapInputArea } from "./components/WrapInputArea/WrapInputArea";
import { WrapSwitchNetwork } from "./components/WrapSwitchNetwork";

const Wrap: React.FC = () => {
  const networks = useTestableNetworks();
  const { networkId } = useWeb3Context();
  const isMigrating = networkId === networks.ARBITRUM || networkId === networks.AVALANCHE;

  return (
    <div id="stake-view">
      <Paper headerText={t`Wrap / Unwrap`} topRight={<GOHMExternalLink />}>
        <Box mb="28px">
          <Grid>
            <MetricCollection>
              <SOHMPrice />
              <CurrentIndex />
              <GOHMPrice />
            </MetricCollection>
          </Grid>
        </Box>

        <WalletConnectedGuard message="Connect your wallet to wrap/unwrap your staked tokens">
          {isMigrating ? <MigrateInputArea /> : <WrapInputArea />}

          <WrapBalances />

          <Divider />

          <Box width="100%" p={1} sx={{ textAlign: "center" }}>
            <WrapSwitchNetwork />
          </Box>
        </WalletConnectedGuard>
      </Paper>
    </div>
  );
};

const GOHMExternalLink = () => (
  <Link
    target="_blank"
    aria-label="wsohm-wut"
    style={{ textDecoration: "none" }}
    href="https://docs.olympusdao.finance/main/contracts/tokens#gohm"
  >
    <Box display="flex" alignItems="center">
      <Typography>gOHM</Typography> <Icon style={{ marginLeft: "5px" }} name="arrow-up" />
    </Box>
  </Link>
);

export default Wrap;
