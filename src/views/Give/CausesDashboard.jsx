import { useCallback, useState } from "react";
import "./give.scss";
import { Button, Paper, Typography, Zoom, Grid } from "@material-ui/core";
import { useWeb3Context } from "src/hooks/web3Context";
import useMediaQuery from "@material-ui/core/useMediaQuery";

export default function CausesDashboard() {
  const { provider, address, connected, connect, chainID } = useWeb3Context();
  const [zoomed, setZoomed] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 705px)");

  return (
    <>
      <div className="give-view">
        <Zoom in={true}>
          <Paper className={`ohm-card secondary ${isSmallScreen && "mobile"}`}>
            <div className="card-header">
              <div className="give-yield-title">
                <Typography variant="h5">Causes Dashboard</Typography>
              </div>
            </div>
            <div className="causes-body">
              <Grid container spacing={2} className="data-grid">
                <Grid item xs={12} className="cause-card">
                  <div className="cause-image">IM Logo</div>
                  <div className="cause-content">
                    <div className="cause-title">
                      <Typography variant="h6">ImpactMarket</Typography>
                    </div>
                    <div className="cause-body">
                      <Typography variant="body2">Lorem ipsum dolor sit amet</Typography>
                    </div>
                    <div className="cause-misc-info">
                      <Typography variant="body2">Time remaining</Typography>
                      <Typography variant="body2">% complete</Typography>
                      <Button variant="outlined" color="secondary">
                        Give
                      </Button>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} className="cause-card">
                  <div className="cause-image">Gitcoin Logo</div>
                  <div className="cause-content">
                    <div className="cause-title">
                      <Typography variant="h6">Gitcoin</Typography>
                    </div>
                    <div className="cause-body">
                      <Typography variant="body2">Lorem ipsum dolor sit amet</Typography>
                    </div>
                    <div className="cause-misc-info">
                      <Typography variant="body2">Time remaining</Typography>
                      <Typography variant="body2">% complete</Typography>
                      <Button variant="outlined" color="secondary">
                        Give
                      </Button>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} className="cause-card">
                  <div className="cause-image">Angel Logo</div>
                  <div className="cause-content">
                    <div className="cause-title">
                      <Typography variant="h6">Angel Protocol</Typography>
                    </div>
                    <div className="cause-body">
                      <Typography variant="body2">Lorem ipsum dolor sit amet</Typography>
                    </div>
                    <div className="cause-misc-info">
                      <Typography variant="body2">Time remaining</Typography>
                      <Typography variant="body2">% complete</Typography>
                      <Button variant="outlined" color="secondary">
                        Give
                      </Button>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
          </Paper>
        </Zoom>
      </div>
    </>
  );
}
