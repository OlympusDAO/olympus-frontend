import { useState } from "react";
import { Paper, Box, Typography, Button, Tab, Tabs } from "@material-ui/core";
import TabPanel from "../../components/TabPanel";
import "./33together.scss";

function a11yProps(index) {
  return {
    id: `pool-tab-${index}`,
    "aria-controls": `pool-tabpanel-${index}`,
  };
}

const PoolTogether = ({ address, provider }) => {
  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState();

  const changeView = (event, newView) => {
    setView(newView);
  };

  return (
    <div id="pool-together-view">
      <Paper className="ohm-card">
        <div className="card-header">
          <Typography variant="h5">3, 3 Together</Typography>
        </div>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h2">Pize Amount</Typography>
          <Typography variant="h3">(Countdown Timer)</Typography>
        </Box>

        <Box
          className="award-buttons"
          display="flex"
          alignItems="center"
          justifyContent="space-evenly"
          margin="33px 0 0 0"
        >
          <Button variant="outlined" color="primary" fullWidth>
            Start Award
          </Button>
          <Button variant="outlined" color="primary" fullWidth>
            Complete Award
          </Button>
        </Box>
      </Paper>

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
          Deposit
        </TabPanel>
        <TabPanel value={view} index={1}>
          Withraw
        </TabPanel>
      </Paper>

      <Paper className="ohm-card">
        <div className="card-header">
          <Typography variant="h5">Prize Pool Info</Typography>
        </div>
        <Box display="flex" flexDirection="column">
          <div className="data-row">
            <Typography>Winners / prize period</Typography>
            <Typography>10</Typography>
          </div>
          <div className="data-row">
            <Typography>Total Deposits</Typography>
            <Typography>1,000,000 sOHM</Typography>
          </div>
          <div className="data-row">
            <Typography>Yield Source</Typography>
            <Typography>--</Typography>
          </div>
          <div className="data-row">
            <Typography>Pool owner</Typography>
            <Typography>pool address</Typography>
          </div>
        </Box>
      </Paper>
    </div>
  );
};

export default PoolTogether;
