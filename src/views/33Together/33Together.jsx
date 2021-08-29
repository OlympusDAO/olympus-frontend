import { useState } from "react";
import { Container, Paper, Tab, Tabs, Zoom } from "@material-ui/core";
import TabPanel from "../../components/TabPanel";
import CardHeader from "../../components/CardHeader/CardHeader";
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

  const changeView = (event, newView) => {
    setView(newView);
  };

  return (
    <div id="pool-together-view">
      <PoolPrize />

      <Zoom in={true}>
        <Paper className="ohm-card">
          <CardHeader title="3, 3 Together" />
          <Tabs
            centered
            value={view}
            textColor="primary"
            indicatorColor="primary"
            onChange={changeView}
            aria-label="pool tabs"
          >
            <Tab label="Deposit" {...a11yProps(0)} />
            <Tab label="Withdraw" {...a11yProps(1)} />
          </Tabs>

          <TabPanel value={view} index={0}>
            <PoolDeposit />
          </TabPanel>
          <TabPanel value={view} index={1}>
            <PoolWithdraw />
          </TabPanel>
        </Paper>
      </Zoom>

      <PoolInfo />
    </div>
  );
};

export default PoolTogether;
