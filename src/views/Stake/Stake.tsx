import "./Stake.scss";

import { t } from "@lingui/macro";
import { Grid, Zoom } from "@material-ui/core";
import { MetricCollection, Paper } from "@olympusdao/component-library";
import { memo, useState } from "react";

import { CurrentIndex, StakingAPY, TotalValueDeposited } from "../TreasuryDashboard/components/Metric/Metric";
import ExternalStakePools from "./components/ExternalStakePools/ExternalStakePools";
import RebaseTimer from "./components/RebaseTimer/RebaseTimer";
import { StakeActionArea } from "./components/StakeActionArea/StakeActionArea";

const Stake: React.FC = () => {
  const [isZoombed, setIsZoomed] = useState(false);

  return (
    <div id="stake-view">
      <Zoom in onEntered={() => setIsZoomed(true)}>
        <Paper headerText={t`Single Stake (3, 3)`} subHeader={<RebaseTimer />}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <MetricCollection>
                <StakingAPY className="stake-apy" />

                <TotalValueDeposited className="stake-tvl" />

                <CurrentIndex className="stake-index" />
              </MetricCollection>
            </Grid>

            <div className="staking-area">
              <StakeActionArea isZoomed={isZoombed} />
            </div>
          </Grid>
        </Paper>
      </Zoom>

      {/* NOTE (appleseed-olyzaps) olyzaps disabled until v2 contracts */}
      {/* <ZapCta /> */}

      <ExternalStakePools />
    </div>
  );
};

export default memo(Stake);
