import { useState } from "react";
import { Paper, Box, Typography, Button, Tab, Tabs, Zoom, SvgIcon } from "@material-ui/core";
import { ReactComponent as ArrowUp } from "../../assets/icons/v1.2/arrow-up.svg";
import { useWeb3Context } from "../../hooks";
import TabPanel from "../../components/TabPanel";
import { PoolDeposit } from "./PoolDeposit";
import { PoolWithdraw } from "./PoolWithdraw";
import { Link } from "react-router-dom";
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
      <Zoom in={true}>
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
      </Zoom>

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
      <Zoom in={true}>
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
              <Typography>-- sOHM</Typography>
            </div>
            <div className="data-row">
              <Typography>Yield Source</Typography>
              <Typography>sOHM</Typography>
            </div>
            <div className="data-row">
              <Typography>Pool owner</Typography>
              <Box display="flex" alignItems="center">
                <Typography>OlympusDAO</Typography>
                <Link to={"/33-together"} target="_blank" style={{ marginLeft: "3px" }}>
                  <SvgIcon component={ArrowUp} fontSize="small" />
                </Link>
              </Box>
            </div>
          </Box>
        </Paper>
      </Zoom>
    </div>
  );
};

export default PoolTogether;
