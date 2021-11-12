import { useState } from "react";
import { useTheme } from "@material-ui/core/styles";

import { addresses } from "../../constants";
import {
  Drawer,
  Link,
  SvgIcon,
  Button,
  Paper,
  Typography,
  Divider,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tab,
  Tabs,
} from "@material-ui/core";
import { ReactComponent as InfoIcon } from "../../assets/icons/info-fill.svg";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up.svg";
import { ReactComponent as sOhmTokenImg } from "../../assets/tokens/token_sOHM.svg";
import { ReactComponent as ohmTokenImg } from "../../assets/tokens/token_OHM.svg";
import { ReactComponent as t33TokenImg } from "../../assets/tokens/token_33T.svg";

import "./ohmmenu.scss";
import { dai, frax } from "src/helpers/AllBonds";
import { useWeb3Context } from "../../hooks/web3Context";
import { trim, formatCurrency } from "../../helpers";

import Chart from "../../components/Chart/WalletChart.jsx";
import apollo from "../../lib/apolloClient";
import SOhmLearnView from "./OhmMenuViews/SOhm/SOhmLearnView";
import SOhmTxView from "./OhmMenuViews/SOhm/SOhmTxView";

import { rebasesDataQuery, bulletpoints, tooltipItems, tooltipInfoMessages, itemType } from "./treasuryData.js";

function OhmMenu() {
  const [anchor, setAnchor] = useState(false);
  const [apy, setApy] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const handleChange = panel => (event, isExpanded) => {
    if (isExpanded) {
      setExpanded(isExpanded ? panel : false);
    }
  };

  const theme = useTheme();
  apollo(rebasesDataQuery).then(r => {
    let apy = r.data.rebases.map(entry => ({
      apy: Math.pow(parseFloat(entry.percentage) + 1, 365 * 3) * 100,
      timestamp: entry.timestamp,
    }));
    apy = apy.filter(pm => pm.apy < 300000);
    setApy(apy);
  });

  const isEthereumAPIAvailable = window.ethereum;
  const { chainID } = useWeb3Context();
  const networkID = chainID;

  const SOHM_ADDRESS = addresses[networkID].SOHM_ADDRESS;
  const OHM_ADDRESS = addresses[networkID].OHM_ADDRESS;
  const PT_TOKEN_ADDRESS = addresses[networkID].PT_TOKEN_ADDRESS;

  const toggleDrawer = data => () => {
    setAnchor(data);
  };

  const toggleTab = data => () => {
    setValue(data);
  };

  const daiAddress = dai.getAddressForReserve(networkID);
  const fraxAddress = frax.getAddressForReserve(networkID);
  return (
    <Box>
      <Button
        onClick={toggleDrawer("OG")}
        id="ohm-menu-button"
        size="large"
        variant="contained"
        color="secondary"
        title="OHM"
      >
        <SvgIcon component={InfoIcon} color="primary" />
        <Typography>OHM</Typography>
      </Button>
      <Drawer style={{ width: "40%" }} anchor={"right"} open={anchor === "sOHMtx"} onClose={toggleDrawer("OG")}>
        {" "}
        <SOhmTxView></SOhmTxView>
      </Drawer>
      <Drawer style={{ width: "40%" }} anchor={"right"} open={anchor === "sOHMLHIW"} onClose={toggleDrawer("OG")}>
        <SOhmLearnView></SOhmLearnView>
      </Drawer>
      <Drawer style={{ width: "40%" }} anchor={"right"} open={anchor === "sOHMZaps"} onClose={toggleDrawer("OG")}>
        sOHM Zap Stuff
      </Drawer>
      <Drawer style={{ width: "40%" }} anchor={"right"} open={anchor === "OG"} onClose={toggleDrawer("OG")}>
        <Paper>
          <Button
            onClick={toggleDrawer("CLOSED")}
            id="ohm-menu-button"
            size="large"
            variant="contained"
            color="secondary"
            title="OHM"
          >
            <SvgIcon component={ArrowUpIcon} viewBox="0 0 32 32" style={{ height: "25px", width: "25px" }} />
          </Button>
          <Chart
            type="line"
            scale="log"
            data={apy}
            dataKey={["apy"]}
            color={theme.palette.text.primary}
            stroke={[theme.palette.text.primary]}
            headerText="APY over time"
            dataFormat="percent"
            headerSubText={`${apy && trim(apy[0].apy, 2)}%`}
            bulletpointColors={bulletpoints.apy}
            itemNames={tooltipItems.apy}
            itemType={itemType.percentage}
            infoTooltipMessage={tooltipInfoMessages.apy}
            expandedGraphStrokeColor={theme.palette.graphStrokeColor}
          />
          <Accordion expanded={expanded === "sOHM"} onChange={handleChange("sOHM")}>
            <AccordionSummary
              expandIcon={
                <SvgIcon component={ArrowUpIcon} viewBox="0 0 32 32" style={{ height: "25px", width: "25px" }} />
              }
            >
              <Button variant="contained" style={{ width: "100%", flexDirection: "row" }} color="secondary">
                <Typography align="left" style={{ width: "100%", flexDirection: "row" }}>
                  {" "}
                  <SvgIcon component={ohmTokenImg} viewBox="0 0 32 32" style={{ height: "25px", width: "25px" }} />
                  sOHM
                </Typography>
                <Paper>
                  <Typography align="left">0</Typography>
                  <Typography align="left">$0.00</Typography>
                </Paper>
              </Button>
            </AccordionSummary>
            <AccordionDetails margin="auto" style={{ margin: "auto", padding: 0 }}>
              <Box className="ohm-pairs" style={{ width: "100%" }}>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#272D36", color: "#386794", width: "33%" }}
                  onClick={toggleDrawer("sOHMtx")}
                  color="secondary"
                >
                  <Typography align="left"> Transaction History</Typography>
                </Button>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#272D36", color: "#386794", width: "33%" }}
                  onClick={toggleDrawer("sOHMLHIW")}
                  color="secondary"
                >
                  <Typography align="left"> Learn how it works</Typography>
                </Button>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#272D36", color: "#386794", width: "33%" }}
                  color="secondary"
                  onClick={toggleDrawer("sOHMZaps")}
                >
                  <Typography align="left"> Zap</Typography>
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === "wsOHM"} onChange={handleChange("wsOHM")}>
            <AccordionSummary
              expandIcon={
                <SvgIcon component={ArrowUpIcon} viewBox="0 0 32 32" style={{ height: "25px", width: "25px" }} />
              }
            >
              <Button variant="contained" style={{ width: "100%", flexDirection: "row" }} color="secondary">
                <Typography align="left" style={{ width: "100%", flexDirection: "row" }}>
                  {" "}
                  <SvgIcon component={ohmTokenImg} viewBox="0 0 32 32" style={{ height: "25px", width: "25px" }} />
                  wsOHM
                </Typography>
                <Paper>
                  <Typography align="left">0</Typography>
                  <Typography align="left">$0.00</Typography>
                </Paper>
              </Button>
            </AccordionSummary>
            <AccordionDetails margin="auto" style={{ margin: "auto", padding: 0 }}>
              <Box className="ohm-pairs" style={{ width: "100%" }}>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#272D36", color: "#386794", width: "33%" }}
                  onClick={toggleDrawer("sOHMtx")}
                  color="secondary"
                >
                  <Typography align="left"> Transaction History</Typography>
                </Button>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#272D36", color: "#386794", width: "33%" }}
                  onClick={toggleDrawer("sOHMLHIW")}
                  color="secondary"
                >
                  <Typography align="left"> Learn how it works</Typography>
                </Button>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#272D36", color: "#386794", width: "33%" }}
                  color="secondary"
                  onClick={toggleDrawer("sOHMZaps")}
                >
                  <Typography align="left"> Zap</Typography>
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === "OHM"} onChange={handleChange("OHM")}>
            <AccordionSummary
              expandIcon={
                <SvgIcon component={ArrowUpIcon} viewBox="0 0 32 32" style={{ height: "25px", width: "25px" }} />
              }
            >
              <Button variant="contained" style={{ width: "100%" }} color="secondary">
                <Typography align="left" style={{ width: "100%", flexDirection: "row" }}>
                  {" "}
                  <SvgIcon component={ohmTokenImg} viewBox="0 0 32 32" style={{ height: "25px", width: "25px" }} />
                  OHM
                </Typography>
              </Button>
            </AccordionSummary>
            <AccordionDetails margin="auto" style={{ margin: "auto" }}>
              <Box className="ohm-pairs" style={{ width: "100%" }}>
                <Button variant="contained" style={{ width: "100%" }} color="secondary">
                  <Typography align="left"> Transaction History</Typography>
                </Button>
                <Button variant="contained" style={{ width: "100%" }} color="secondary">
                  <Typography align="left"> Learn how it works</Typography>
                </Button>
                <Button variant="contained" style={{ width: "100%" }} color="secondary">
                  <Typography align="left"> Zap</Typography>
                </Button>
                <Paper>
                  <Typography align="left">($0.00)</Typography>
                  <Typography align="left">($0.00)</Typography>
                </Paper>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === "3TT"} onChange={handleChange("3TT")}>
            <AccordionSummary
              expandIcon={
                <SvgIcon component={ohmTokenImg} viewBox="0 0 32 32" style={{ height: "25px", width: "25px" }} />
              }
            >
              <Button variant="contained" style={{ width: "100%" }} color="secondary">
                <Typography align="left" style={{ width: "100%", flexDirection: "row" }}>
                  {" "}
                  <SvgIcon component={ohmTokenImg} viewBox="0 0 32 32" style={{ height: "25px", width: "25px" }} />
                  3TT
                </Typography>
              </Button>
            </AccordionSummary>
            <AccordionDetails margin="auto" style={{ margin: "auto" }}>
              <Box className="ohm-pairs" style={{ width: "100%" }}>
                <Button variant="contained" style={{ width: "100%" }} color="secondary">
                  <Typography align="left"> Transaction History</Typography>
                </Button>
                <Button variant="contained" style={{ width: "100%" }} color="secondary">
                  <Typography align="left"> Learn how it works</Typography>
                </Button>
                <Button variant="contained" style={{ width: "100%" }} color="secondary">
                  <Typography align="left"> Zap</Typography>
                </Button>
                <Paper>
                  <Typography align="left">($0.00)</Typography>
                  <Typography align="left">($0.00)</Typography>
                </Paper>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Link href={`https://abracadabra.money/pool/10`} target="_blank" rel="noreferrer">
            <Button size="large" variant="contained" color="secondary" fullWidth>
              <Typography align="left">
                Wrap sOHM on Abracadabra <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
              </Typography>
            </Button>
          </Link>
          <Box component="div" className="data-links">
            <Divider color="secondary" className="less-margin" />
            <Link href={`https://dune.xyz/shadow/Olympus-(OHM)`} target="_blank" rel="noreferrer">
              <Button size="large" variant="contained" color="secondary" fullWidth>
                <Typography align="left">
                  Shadow's Dune Dashboard <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                </Typography>
              </Button>
            </Link>
          </Box>
        </Paper>
      </Drawer>
    </Box>
  );
}

export default OhmMenu;
