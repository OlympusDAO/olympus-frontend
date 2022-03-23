import { t } from "@lingui/macro";
import { Box, Divider, Grid, Link, Typography, Zoom } from "@material-ui/core";
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
      <Zoom in>
        <Paper headerText={t`Wrap / Unwrap`} topRight={<GOHMExternalLink />}>
          <Grid>
            <MetricCollection>
              <SOHMPrice />

              <CurrentIndex />

              <GOHMPrice />
            </MetricCollection>
          </Grid>

          <WalletConnectedGuard message="Connect your wallet to wrap/unwrap your staked tokens">
            {isMigrating ? <MigrateInputArea /> : <WrapInputArea />}

            <WrapBalances />

            <Divider />

            <Box width="100%" p={1} sx={{ textAlign: "center" }}>
              <WrapSwitchNetwork />
            </Box>
          </WalletConnectedGuard>
        </Paper>
      </Zoom>
    </div>
  );
};

const GOHMExternalLink = () => (
  <Link
    target="_blank"
    aria-label="wsohm-wut"
    className="migrate-sohm-button"
    style={{ textDecoration: "none" }}
    href="https://docs.olympusdao.finance/main/contracts/tokens#gohm"
  >
    <Typography>gOHM</Typography> <Icon style={{ marginLeft: "5px" }} name="arrow-up" />
  </Link>
);

export default Wrap;
