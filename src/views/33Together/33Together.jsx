import { useState } from "react";
import { Paper, Box, Typography, Button, Tab, Tabs, Zoom, SvgIcon } from "@material-ui/core";
import { useWeb3Context } from "../../hooks";
import TabPanel from "../../components/TabPanel";
import { PoolDeposit } from "./PoolDeposit";
import { PoolWithdraw } from "./PoolWithdraw";
import { PoolInfo } from "./PoolInfo";
import { PoolPrize } from "./PoolPrize";
import "./33together.scss";

function a11yProps(index) {
  return {
    id: `pool-tab-${index}`,
    "aria-controls": `pool-tabpanel-${index}`,
  };
}

const PoolTogether = () => {
  const [view, setView] = useState(0);
  const { address, provider } = useWeb3Context();

  const changeView = (event, newView) => {
    setView(newView);
  };

  return (
    <div id="pool-together-view">
      <PoolPrize />

      <Zoom in={true}>
        <Paper className="ohm-card">
          <Tabs
            centered
            value={view}
            textColor="primary"
            indicatorColor="primary"
            onChange={changeView}
            aria-label="bond tabs"
          >
            <Tab label="Deposit to Win" {...a11yProps(0)} />
            <Tab label="Withdraw" {...a11yProps(1)} />
          </Tabs>

          <TabPanel value={view} index={0}>
            <Box display="flex" justifyContent="center">
              {address !== null ? <PoolDeposit provider={provider} /> : ConnectButton}
            </Box>
          </TabPanel>
          <TabPanel value={view} index={1}>
            {address !== null ? <PoolWithdraw provider={provider} /> : ConnectButton}
          </TabPanel>
        </Paper>
      </Zoom>

      <PoolInfo />
    </div>
  );
};

export default PoolTogether;
