import { useCallback, useState } from "react";
import "./give.scss";
import { Button, Paper, Typography, Zoom } from "@material-ui/core";
import { useWeb3Context } from "src/hooks/web3Context";
import useMediaQuery from "@material-ui/core/useMediaQuery";

export default function CausesDashboard() {
  const { provider, address, connected, connect, chainID } = useWeb3Context();
  const [zoomed, setZoomed] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 705px)");

  // Temp

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
          </Paper>
        </Zoom>
      </div>
    </>
  );
}
