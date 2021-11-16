import { useState } from "react";
import { useSelector } from "react-redux";
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
  const ohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.ohm;
  });
  const sohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.sohm;
  });
  const wsohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.wsohm;
  });
  const fsohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.fsohm;
  });

  const poolBalance = useSelector(state => {
    return state.account.balances && parseFloat(state.account.balances.pool);
  });

  const marketPrice = useSelector(state => {
    return state.app.marketPrice;
  });

  const toggleDrawer = data => () => {
    setAnchor(data);
  };
  const handleChange = panel => (event, isExpanded) => {
    if (isExpanded) {
      setExpanded(isExpanded ? panel : false);
    }
  };
  // apollo(rebasesDataQuery).then(r => {
  //   let apy = r.data.rebases.map(entry => ({
  //     apy: Math.pow(parseFloat(entry.percentage) + 1, 365 * 3) * 100,
  //     timestamp: entry.timestamp,
  //   }));
  //   [
  //     {
  //       "apy": 7857.424722561997,
  //       "timestamp": "1636797374"
  //     }
  //   ]
  //   apy = apy.filter(pm => pm.apy < 300000);
  //   setApy(apy);
  //   √
  // });
  return (
    <Paper>
      {/* <Chart
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
      /> */}

      <Accordion expanded={expanded === "OHM"} onChange={handleChange("OHM")}>
        <AccordionSummary
          expandIcon={<SvgIcon component={ArrowUpIcon} viewBox="0 0 32 32" style={{ height: "25px", width: "25px" }} />}
        >
          <Typography align="left" style={{ width: "100%", flexDirection: "row" }}>
            {" "}
            <SvgIcon component={ohmTokenImg} viewBox="0 0 32 32" style={{ height: "25px", width: "25px" }} />
            OHM
          </Typography>
          <Paper>
            <Typography align="left">{ohmBalance}</Typography>
            <Typography align="left">${trim(ohmBalance * marketPrice, 2)}</Typography>
          </Paper>
        </AccordionSummary>
      </Accordion>
      <Accordion expanded={expanded === "sOHM"} onChange={handleChange("sOHM")}>
        <AccordionSummary
          expandIcon={<SvgIcon component={ArrowUpIcon} viewBox="0 0 32 32" style={{ height: "25px", width: "25px" }} />}
        >
          <Typography align="left" style={{ width: "100%", flexDirection: "row" }}>
            {" "}
            <SvgIcon component={ohmTokenImg} viewBox="0 0 32 32" style={{ height: "25px", width: "25px" }} />
            sOHM
          </Typography>
          <Paper>
            <Typography align="left">{sohmBalance}</Typography>
            <Typography align="left">${trim(sohmBalance * marketPrice, 2)}</Typography>
          </Paper>
        </AccordionSummary>
        <AccordionDetails margin="auto" style={{ margin: "auto", padding: 0 }}>
          <Box className="ohm-pairs" style={{ width: "100%" }}>
            <Button
              variant="contained"
              style={{ backgroundColor: "#272D36", color: "#386794", width: "33%", minHeight: "50px" }}
              onClick={toggleDrawer("sOHMtx")}
              color="secondary"
            >
              <Typography align="left"> Transaction History</Typography>
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: "#272D36", color: "#386794", width: "33%", minHeight: "50px" }}
              min-height="60px"
              onClick={toggleDrawer("sOHMLHIW")}
              color="secondary"
            >
              <Typography align="left"> Learn how it works</Typography>
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: "#272D36", color: "#386794", width: "33%", minHeight: "50px" }}
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
          <Typography align="left" style={{ width: "100%", flexDirection: "row" }}>
            {" "}
            <SvgIcon component={ohmTokenImg} viewBox="0 0 32 32" style={{ height: "25px", width: "25px" }} />
            wsOHM
          </Typography>
          <Paper>
            <Typography align="left">{wsohmBalance}</Typography>
            <Typography align="left">${(trim(wsohmBalance * marketPrice), 2)}</Typography>
          </Paper>
        </AccordionSummary>
        <AccordionDetails margin="auto" style={{ margin: "auto", padding: 0 }}>
          <Box className="ohm-pairs" style={{ width: "100%" }}>
            <Button
              variant="contained"
              style={{ backgroundColor: "#272D36", color: "#386794", width: "33%", minHeight: "50px" }}
              onClick={toggleDrawer("sOHMtx")}
              color="secondary"
            >
              <Typography align="left"> Transaction History</Typography>
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: "#272D36", color: "#386794", width: "33%", minHeight: "50px" }}
              onClick={toggleDrawer("sOHMLHIW")}
              color="secondary"
            >
              <Typography align="left"> Learn how it works</Typography>
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: "#272D36", color: "#386794", width: "33%", minHeight: "50px" }}
              color="secondary"
              onClick={toggleDrawer("sOHMZaps")}
            >
              <Typography align="left"> Zap</Typography>
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === "3TT"} onChange={handleChange("3TT")}>
        <AccordionSummary
          expandIcon={<SvgIcon component={ArrowUpIcon} viewBox="0 0 32 32" style={{ height: "25px", width: "25px" }} />}
        >
          <Typography align="left" style={{ width: "100%", flexDirection: "row" }}>
            {" "}
            <SvgIcon component={ohmTokenImg} viewBox="0 0 32 32" style={{ height: "25px", width: "25px" }} />
            3TT
          </Typography>
          <Paper>
            <Typography align="left">{new Intl.NumberFormat("en-US").format(poolBalance)} 33T</Typography>
            <Typography align="left">${trim(poolBalance * marketPrice, 2)}</Typography>
          </Paper>
        </AccordionSummary>
      </Accordion>

      <Drawer style={{ width: "55%" }} anchor={"right"} open={anchor === "sOHMtx"} onClose={toggleDrawer("OG")}>
        {" "}
        <SOhmTxView></SOhmTxView>
      </Drawer>
      <Drawer style={{ width: "55%" }} anchor={"right"} open={anchor === "sOHMLHIW"} onClose={toggleDrawer("OG")}>
        <SOhmLearnView></SOhmLearnView>
      </Drawer>
      <Drawer style={{ width: "55%" }} anchor={"right"} open={anchor === "sOHMZaps"} onClose={toggleDrawer("OG")}>
        <SOhmZapView></SOhmZapView>
      </Drawer>
    </Paper>
  );
}

export default InitialWalletView;
