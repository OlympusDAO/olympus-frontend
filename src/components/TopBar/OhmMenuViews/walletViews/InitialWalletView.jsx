import { useState } from "react";
import { useSelector } from "react-redux";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import { trim } from "../../../../helpers";
import { ReactComponent as ArrowUpIcon } from "../../../../assets/icons/arrow-up.svg";
import { ReactComponent as sOhmTokenImg } from "../../../../assets/tokens/token_sOHM.svg";
import { ReactComponent as ohmTokenImg } from "../../../../assets/tokens/token_OHM.svg";
import { ReactComponent as t33TokenImg } from "../../../../assets/tokens/token_33T.svg";
import { ReactComponent as wsOhmTokenImg } from "src/assets/tokens/token_wsOHM.svg";
import { ReactComponent as wethTokenImg } from "src/assets/tokens/wETH.svg";
import { ReactComponent as abracadabraTokenImg } from "src/assets/tokens/MIM.svg";
import rariTokenImg from "src/assets/tokens/RARI.png";

import { segmentUA } from "src/helpers/userAnalyticHelpers";

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
  Link,
} from "@material-ui/core";

import { dai, frax } from "src/helpers/AllBonds";

const useStyles = makeStyles(theme => ({
  menuContainer: {
    padding: "16px",
    width: "400px",
  },
  closeMenuButton: {
    marginLeft: "auto",
  },
  menuItem: {
    padding: "6px 16px",
  },
  viewAllBonds: {
    marginTop: "6px",
  },
  menuSection: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    padding: theme.spacing(1, 0),
  },
}));

const ExternalLinkIcon = ({ size = 20 }) => (
  <SvgIcon
    component={ArrowUpIcon}
    style={{ height: `${size} px`, width: `${size} px`, verticalAlign: "sub" }}
    htmlColor="#A3A3A3"
  />
);
const ExternalLink = props => <Link target="_blank" rel="noreferrer" {...props} />;

const MenuItemBond = ({ Icon1, Icon2, lpName }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Icon1 style={{ height: "25px", width: "25px" }} />
        <Icon2 style={{ height: "25px", width: "25px" }} />
        <Box sx={{ display: "flex", flexDirection: "column", ml: "8px" }}>
          <Typography>{lpName}</Typography>
          <ExternalLink href="#">
            <Typography variant="body2" color="textSecondary">
              Get LP <ExternalLinkIcon size={16} />
            </Typography>
          </ExternalLink>
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", textAlign: "right" }}>
        <Button size="small" color="secondary" variant="outlined">
          <Typography>Bond to Save 12%</Typography>
        </Button>
      </Box>
    </Box>
  );
};

const MenuItemBorrow = ({ Icon1, Icon2, borrowOn, totalAvailable }) => (
  <Button size="large" variant="contained" color="secondary" fullWidth>
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Icon1 style={{ height: "25px", width: "25px" }} />
        <Icon2 style={{ height: "25px", width: "25px" }} />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ display: "flex", flexDirection: "column", textAlign: "right" }}>
          <Typography>Borrow on {borrowOn}</Typography>
          {totalAvailable && (
            <Typography variant="body2" color="textSecondary">
              {totalAvailable} Available
            </Typography>
          )}
        </Box>
        <Box component={ExternalLinkIcon} sx={{ ml: "6px" }} />
      </Box>
    </Box>
  </Button>
);

const MenuItemUserToken = ({ name, icon, userBalance, userBalanceUSD, onExpandedChange, expanded, toggleDrawer }) => {
  return (
    <Accordion expanded={expanded} onChange={onExpandedChange}>
      <AccordionSummary
        expandIcon={<SvgIcon component={ArrowUpIcon} viewBox="0 0 32 32" style={{ height: "25px", width: "25px" }} />}
      >
        <Button variant="contained" style={{ width: "100%", flexDirection: "row" }} color="secondary">
          <Typography align="left" style={{ width: "100%", flexDirection: "row" }}>
            <SvgIcon component={icon} viewBox="0 0 32 32" style={{ height: "25px", width: "25px" }} />
            {name}
          </Typography>
          <Box>
            <Typography align="left">{userBalance}</Typography>
            <Typography align="left">${userBalanceUSD}</Typography>
          </Box>
        </Button>
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
  );
};

const addTokenToWallet = (tokenSymbol, tokenAddress, address) => async () => {
  if (!window.ethereum) return;

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
    segmentUA({
      address: address,
      type: "Add Token",
      tokenName: tokenSymbol,
    });
  } catch (error) {
    console.log(error);
  }
};
function InitialWalletView() {
  const theme = useTheme();
  const styles = useStyles();
  const { chainID, address } = useWeb3Context();
  const isEthereumAPIAvailable = window.ethereum;
  // const [apy, setApy] = useState(null);
  const [anchor, setAnchor] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const SOHM_ADDRESS = addresses[chainID].SOHM_ADDRESS;
  const OHM_ADDRESS = addresses[chainID].OHM_ADDRESS;
  const PT_TOKEN_ADDRESS = addresses[chainID].PT_TOKEN_ADDRESS;
  const WSOHM_ADDRESS = addresses[chainID].WSOHM_ADDRESS;

  const ohmBalance = useSelector(state => state.account.balances?.ohm);
  const sohmBalance = useSelector(state => state.account.balances?.sohm);
  const wsohmBalance = useSelector(state => state.account.balances?.wsohm);
  const fsohmBalance = useSelector(state => state.account.balances?.fsohm);

  const poolBalance = useSelector(state => {
    return state.account.balances && parseFloat(state.account.balances.pool);
  });
  const marketPrice = useSelector(state => state.app.marketPrice);

  const handleChange = panel => (event, isExpanded) => {
    if (isExpanded) {
      setExpanded(isExpanded ? panel : false);
    }
  };
  return (
    <Paper>
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

          <ExternalLink href={`https://dune.xyz/0xrusowsky/Olympus-Wallet-History`}>
            <Button size="large" variant="contained" color="secondary">
              <Typography style={{ lineHeight: "20px", whiteSpace: "break-spaces" }}>
                View Wallet on Dune Analytics <ExternalLinkIcon />
              </Typography>
            </Button>
          </ExternalLink>
        </Box>
      </Box>
      {/* <Drawer style={{ width: "55%" }} anchor={"right"} open={anchor === "sOHMtx"} onClose={toggleDrawer("OG")}>
        {" "}
        <SOhmTxView></SOhmTxView>
      </Drawer>
      <Drawer style={{ width: "55%" }} anchor={"right"} open={anchor === "sOHMLHIW"} onClose={toggleDrawer("OG")}>
        <SOhmLearnView></SOhmLearnView>
      </Drawer>
      <Drawer style={{ width: "55%" }} anchor={"right"} open={anchor === "sOHMZaps"} onClose={toggleDrawer("OG")}>
        <SOhmZapView></SOhmZapView>
      </Drawer> */}
    </Paper>
  );
}

export default InitialWalletView;
