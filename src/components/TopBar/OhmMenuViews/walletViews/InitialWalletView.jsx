import { useState } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@material-ui/core/styles";
import { trim } from "../../../../helpers";
import { ReactComponent as ArrowUpIcon } from "../../../../assets/icons/fullscreen.svg";
import { ReactComponent as sOhmTokenImg } from "../../../../assets/tokens/token_sOHM.svg";
import { ReactComponent as ohmTokenImg } from "../../../../assets/tokens/token_OHM.svg";
import { ReactComponent as t33TokenImg } from "../../../../assets/tokens/token_33T.svg";
import { ReactComponent as wsOhmTokenImg } from "src/assets/tokens/token_wsOHM.svg";
import OhmImg from "src/assets/tokens/token_OHM.svg";
import SOhmImg from "src/assets/tokens/token_sOHM.svg";
import WsOhmImg from "src/assets/tokens/token_wsOHM.svg";
import token33tImg from "src/assets/tokens/token_33T.svg";

import { addresses, TOKEN_DECIMALS } from "../../../../constants";
import SOhmLearnView from "./SOhm/SOhmLearnView";
import SOhmTxView from "./SOhm/SOhmTxView";
import SOhmZapView from "./SOhm/SOhmTxView";
import Chart from "../../../../components/Chart/WalletChart.jsx";
import apollo from "../../../../lib/apolloClient";
import { rebasesDataQuery, bulletpoints, tooltipItems, tooltipInfoMessages, itemType } from "../../treasuryData.js";
import { useWeb3Context } from "../../../../../src/hooks";
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
  Divider,
} from "@material-ui/core";

const addTokenToWallet = (tokenSymbol, tokenAddress, address) => async () => {
  if (window.ethereum) {
    const host = window.location.origin;
    let tokenPath;
    let tokenDecimals = TOKEN_DECIMALS;
    switch (tokenSymbol) {
      case "OHM":
        tokenPath = OhmImg;
        break;
      case "33T":
        tokenPath = token33tImg;
        break;
      case "wsOHM":
        tokenPath = WsOhmImg;
        tokenDecimals = 18;
        break;
      default:
        tokenPath = SOhmImg;
    }
    const imageURL = `${host}/${tokenPath}`;

    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: imageURL,
          },
        },
      });
      let uaData = {
        address: address,
        type: "Add Token",
        tokenName: tokenSymbol,
      };
      segmentUA(uaData);
    } catch (error) {
      console.log(error);
    }
  }
};
function InitialWalletView() {
  const theme = useTheme();
  const { chainID, address } = useWeb3Context();
  const networkID = chainID;
  const isEthereumAPIAvailable = window.ethereum;
  // const [apy, setApy] = useState(null);
  const [anchor, setAnchor] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const SOHM_ADDRESS = addresses[networkID].SOHM_ADDRESS;
  const OHM_ADDRESS = addresses[networkID].OHM_ADDRESS;
  const PT_TOKEN_ADDRESS = addresses[networkID].PT_TOKEN_ADDRESS;
  const WSOHM_ADDRESS = addresses[networkID].WSOHM_ADDRESS;
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
        <Box style={{ width: "100%" }}>
          {isEthereumAPIAvailable ? (
            <Box>
              <Divider color="secondary" />
              {OHM_ADDRESS && (
                <Button
                  style={{ width: "100%", fontSize: "12px" }}
                  variant="contained"
                  color="secondary"
                  onClick={addTokenToWallet("OHM", OHM_ADDRESS, address)}
                >
                  ADD TOKEN TO WALLET
                </Button>
              )}
            </Box>
          ) : null}
        </Box>
      </Accordion>
      <Accordion expanded={expanded === "sOHM"} onChange={handleChange("sOHM")}>
        <AccordionSummary
          alignItems="center"
          expandIcon={<SvgIcon component={ArrowUpIcon} viewBox="0 0 32 32" style={{ height: "25px", width: "25px" }} />}
        >
          <Typography align="left" style={{ width: "100%", flexDirection: "row" }}>
            {" "}
            <SvgIcon component={sOhmTokenImg} viewBox="0 0 99 99" style={{ height: "25px", width: "25px" }} />
            sOHM
          </Typography>
          <Paper>
            <Typography align="left">{sohmBalance}</Typography>
            <Typography align="left">${trim(sohmBalance * marketPrice, 2)}</Typography>
          </Paper>
        </AccordionSummary>
        <AccordionDetails margin="auto" style={{ margin: "auto", padding: 0 }}>
          <Box style={{ width: "100%" }}>
            {isEthereumAPIAvailable ? (
              <Box>
                <Divider color="secondary" />
                {SOHM_ADDRESS && (
                  <Button
                    style={{ width: "100%", fontSize: "12px" }}
                    variant="contained"
                    color="secondary"
                    onClick={addTokenToWallet("sOHM", SOHM_ADDRESS, address)}
                  >
                    ADD TOKEN TO WALLET
                  </Button>
                )}
              </Box>
            ) : null}
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === "wsOHM"} onChange={handleChange("wsOHM")}>
        <AccordionSummary
          expandIcon={<SvgIcon component={ArrowUpIcon} viewBox="0 0 32 32" style={{ height: "25px", width: "25px" }} />}
        >
          <Typography align="left" style={{ width: "100%", flexDirection: "row" }}>
            {" "}
            <SvgIcon component={wsOhmTokenImg} viewBox="0 0 180 180" style={{ height: "25px", width: "25px" }} />
            wsOHM
          </Typography>
          <Paper>
            <Typography align="left">{wsohmBalance}</Typography>
            <Typography align="left">${(trim(wsohmBalance * marketPrice), 2)}</Typography>
          </Paper>
        </AccordionSummary>
        <AccordionDetails margin="auto" style={{ margin: "auto", padding: 0 }}>
          <Box className="ohm-pairs" style={{ width: "100%" }}>
            {isEthereumAPIAvailable ? (
              <Box style={{ width: "100%", fontSize: "12px" }}>
                <Divider color="secondary" />
                {SOHM_ADDRESS && (
                  <Button
                    style={{ width: "100%", fontSize: "12px" }}
                    variant="contained"
                    color="secondary"
                    onClick={addTokenToWallet("wsOHM", WSOHM_ADDRESS, address)}
                  >
                    ADD TOKEN TO WALLET
                  </Button>
                )}
              </Box>
            ) : null}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === "3TT"} onChange={handleChange("3TT")}>
        <AccordionSummary
          expandIcon={<SvgIcon component={ArrowUpIcon} viewBox="0 0 32 32" style={{ height: "25px", width: "25px" }} />}
        >
          <Typography align="left" style={{ width: "100%", flexDirection: "row" }}>
            {" "}
            <SvgIcon component={t33TokenImg} viewBox="0 0 1000 1000" style={{ height: "25px", width: "25px" }} />
            3TT
          </Typography>
          <Paper>
            <Typography align="left">{new Intl.NumberFormat("en-US").format(poolBalance)}</Typography>
            <Typography align="left">${trim(poolBalance * marketPrice, 2)}</Typography>
          </Paper>
        </AccordionSummary>
        <AccordionDetails margin="auto" style={{ margin: "auto", padding: 0 }}>
          <Box className="ohm-pairs" style={{ width: "100%" }}>
            {isEthereumAPIAvailable ? (
              <Box style={{ width: "100%", fontSize: "12px" }}>
                <Divider color="secondary" />
                {SOHM_ADDRESS && (
                  <Button
                    style={{ width: "100%", fontSize: "12px" }}
                    variant="contained"
                    color="secondary"
                    onClick={addTokenToWallet("33T", PT_TOKEN_ADDRESS, address)}
                  >
                    ADD TOKEN TO WALLET
                  </Button>
                )}
              </Box>
            ) : null}
          </Box>
        </AccordionDetails>
      </Accordion>
      <Divider color="secondary" className="less-margin" />

      <Box className={styles.menuSection}>
        <MenuItemBond Icon1={wethTokenImg} Icon2={wethTokenImg} lpName={`BANK-ETH SLP`} />
        <Typography align="right" variant="body2" className={styles.viewAllBonds}>
          View all bond discounts
        </Typography>
      </Box>

      <Divider color="secondary" className="less-margin" />

      <Box className={styles.menuSection}>
        <MenuItemBorrow borrowOn="Abracadabra" Icon1={ohmTokenImg} Icon2={abracadabraTokenImg} />
        <MenuItemBorrow borrowOn="Rari" Icon1={ohmTokenImg} Icon2={props => <img src={rariTokenImg} {...props} />} />
      </Box>

      <Divider color="secondary" className="less-margin" />

      <Box className={styles.menuSection}>
        <Box sx={{ flexWrap: "nowrap", flexDirection: "row" }}>
          <ExternalLink
            href={`https://app.sushi.com/swap?inputCurrency=${dai.getAddressForReserve(chainID)}&outputCurrency=${
              addresses[chainID].OHM_ADDRESS
            }`}
          >
            <Button size="large" variant="contained" color="secondary">
              <Typography style={{ lineHeight: "20px", whiteSpace: "break-spaces" }}>
                Buy on Sushiswap <ExternalLinkIcon />
              </Typography>
            </Button>
          </ExternalLink>

          <ExternalLink
            href={`https://app.uniswap.org/#/swap?inputCurrency=${frax.getAddressForReserve(chainID)}&outputCurrency=${
              addresses[chainID].OHM_ADDRESS
            }`}
          >
            <Button size="large" variant="contained" color="secondary">
              <Typography style={{ lineHeight: "20px", whiteSpace: "break-spaces" }}>
                Buy on Uniswap <ExternalLinkIcon />
              </Typography>
            </Button>
          </ExternalLink>

          <ExternalLink href={`https://dune.xyz/shadow/Olympus-(OHM)`}>
            <Button size="large" variant="contained" color="secondary">
              <Typography style={{ lineHeight: "20px", whiteSpace: "break-spaces" }}>
                View on Dune Analytics <ExternalLinkIcon />
              </Typography>
            </Button>
          </ExternalLink>
        </Box>
      </Box>
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
