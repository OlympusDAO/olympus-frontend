import { t } from "@lingui/macro";
import { Grid, Link, Typography, Zoom } from "@material-ui/core";
import { Icon, MetricCollection, Paper } from "@olympusdao/component-library";
import { FC } from "react";
import { useWeb3Context } from "src/hooks/web3Context";
import { NetworkId } from "src/networkDetails";

import { CurrentIndex, GOHMPrice, SOHMPrice } from "../TreasuryDashboard/components/Metric/Metric";
import { WrapActionArea } from "./components/WrapActionArea/WrapActionArea";
import WrapCrossChain from "./components/WrapCrossChain/WrapCrossChain";

const Wrap: FC = () => {
  const { networkId } = useWeb3Context();

  const isMainnet = networkId === NetworkId.MAINNET || networkId === NetworkId.TESTNET_RINKEBY;

  if (!isMainnet) return <WrapCrossChain />;

  return (
    <div id="stake-view" className="wrapper">
      <Zoom in>
        <Paper headerText={t`Wrap / Unwrap`} topRight={<GOHMExternalLink />}>
          <Grid>
            <MetricCollection>
              <SOHMPrice />

              <CurrentIndex />

              <GOHMPrice />
            </MetricCollection>
          </Grid>

          <WrapActionArea />
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
