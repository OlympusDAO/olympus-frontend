import { useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import { trim } from "../../../../helpers";
import { ReactComponent as ArrowUpIcon } from "../../../../assets/icons/arrow-up.svg";
import { ReactComponent as sOhmTokenImg } from "../../../../assets/tokens/token_sOHM.svg";
import { ReactComponent as ohmTokenImg } from "../../../../assets/tokens/token_OHM.svg";
import { ReactComponent as t33TokenImg } from "../../../../assets/tokens/token_33T.svg";
import SOhmLearnView from "./SOhm/SOhmLearnView";
import SOhmTxView from "./SOhm/SOhmTxView";
import SOhmZapView from "./SOhm/SOhmTxView";
import Chart from "../../../../components/Chart/WalletChart.jsx";
import apollo from "../../../../lib/apolloClient";
import { rebasesDataQuery, bulletpoints, tooltipItems, tooltipInfoMessages, itemType } from "../../treasuryData.js";
import {
  SvgIcon,
  Button,
  Typography,
  Box,
  Drawer,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";

function InitialWalletView() {
  const theme = useTheme();
  const [apy, setApy] = useState(null);
  const [anchor, setAnchor] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const toggleDrawer = data => () => {
    setAnchor(data);
  };
  const handleChange = panel => (event, isExpanded) => {
    if (isExpanded) {
      setExpanded(isExpanded ? panel : false);
    }
  };
  apollo(rebasesDataQuery).then(r => {
    let apy = r.data.rebases.map(entry => ({
      apy: Math.pow(parseFloat(entry.percentage) + 1, 365 * 3) * 100,
      timestamp: entry.timestamp,
    }));
    apy = apy.filter(pm => pm.apy < 300000);
    setApy(apy);
  });
  return (
    <Paper>
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
          expandIcon={<SvgIcon component={ArrowUpIcon} viewBox="0 0 32 32" style={{ height: "25px", width: "25px" }} />}
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
          expandIcon={<SvgIcon component={ArrowUpIcon} viewBox="0 0 32 32" style={{ height: "25px", width: "25px" }} />}
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
          expandIcon={<SvgIcon component={ArrowUpIcon} viewBox="0 0 32 32" style={{ height: "25px", width: "25px" }} />}
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
          expandIcon={<SvgIcon component={ohmTokenImg} viewBox="0 0 32 32" style={{ height: "25px", width: "25px" }} />}
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

      <Drawer style={{ width: "40%" }} anchor={"right"} open={anchor === "sOHMtx"} onClose={toggleDrawer("OG")}>
        {" "}
        <SOhmTxView></SOhmTxView>
      </Drawer>
      <Drawer style={{ width: "40%" }} anchor={"right"} open={anchor === "sOHMLHIW"} onClose={toggleDrawer("OG")}>
        <SOhmLearnView></SOhmLearnView>
      </Drawer>
      <Drawer style={{ width: "40%" }} anchor={"right"} open={anchor === "sOHMZaps"} onClose={toggleDrawer("OG")}>
        <SOhmZapView></SOhmZapView>
      </Drawer>
    </Paper>
  );
}

export default InitialWalletView;
