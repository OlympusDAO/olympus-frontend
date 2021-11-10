import { useState, useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";

import { addresses, TOKEN_DECIMALS } from "../../constants";
import { getTokenImage } from "../../helpers";
import { useSelector } from "react-redux";
import { Link, SvgIcon, Popper, Button, Paper, Typography, Divider, Box, Fade, Slide } from "@material-ui/core";
import { ReactComponent as InfoIcon } from "../../assets/icons/info-fill.svg";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up.svg";
import { ReactComponent as sOhmTokenImg } from "../../assets/tokens/token_sOHM.svg";
import { ReactComponent as ohmTokenImg } from "../../assets/tokens/token_OHM.svg";
import { ReactComponent as t33TokenImg } from "../../assets/tokens/token_33T.svg";

import "./ohmmenu.scss";
import { dai, frax } from "src/helpers/AllBonds";
import { useWeb3Context } from "../../hooks/web3Context";
import { trim, formatCurrency } from "../../helpers";

import OhmImg from "src/assets/tokens/token_OHM.svg";
import SOhmImg from "src/assets/tokens/token_sOHM.svg";
import token33tImg from "src/assets/tokens/token_33T.svg";

import Chart from "../../components/Chart/WalletChart.jsx";
import apollo from "../../lib/apolloClient";

import { rebasesDataQuery, bulletpoints, tooltipItems, tooltipInfoMessages, itemType } from "./treasuryData.js";

function OhmMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [apy, setApy] = useState(null);
  const [walletView, setWalletView] = useState(false);
  const [ohmView, setOhmView] = useState(false);
  const [returnToMainView, setReturnToMainView] = useState(false);

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

  const ohmViewFunc = info => async () => {
    if (info === "Return") {
      setReturnToMainView(!returnToMainView);
      setOhmView(!ohmView);
    } else {
      setOhmView(!ohmView);
      setWalletView(!walletView);
    }
  };
  const walletViewFunc = () => async () => {
    setWalletView(!walletView);
  };
  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const returnToMainViewFunc = info => async () => {
    if (info === "ohmView") {
      setOhmView(!ohmView);
    }
    setWalletView(!walletView);
  };

  const open = Boolean(anchorEl);
  const id = "ohm-popper";
  const daiAddress = dai.getAddressForReserve(networkID);
  const fraxAddress = frax.getAddressForReserve(networkID);
  return (
    <Box
      component="div"
      onMouseEnter={e => handleClick(e)}
      onMouseLeave={e => handleClick(e)}
      id="ohm-menu-button-hover"
    >
      <Button
        onClick={walletViewFunc()}
        id="ohm-menu-button"
        size="large"
        variant="contained"
        color="secondary"
        title="OHM"
        aria-describedby={id}
      >
        <SvgIcon component={InfoIcon} color="primary" />
        <Typography>OHM</Typography>
      </Button>
      {walletView ? (
        <Slide direction="left" in={walletView} mountOnEnter unmountOnExit>
          <Paper className="ohm-card">
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
            <Box>
              <Button variant="contained" color="secondary" onClick={walletViewFunc()}>
                <Typography align="left">
                  {" "}
                  <SvgIcon component={ohmTokenImg} viewBox="0 0 32 32" style={{ height: "15px", width: "15px" }} />
                  sOHM
                </Typography>
              </Button>
            </Box>
            <Box className="ohm-pairs">
              <Button variant="contained" color="secondary" onClick={ohmViewFunc()}>
                <Typography align="left">
                  {" "}
                  <SvgIcon component={ohmTokenImg} viewBox="0 0 32 32" style={{ height: "15px", width: "15px" }} />
                  OHM
                </Typography>
              </Button>
            </Box>
            <Box className="ohm-pairs">
              <Button variant="contained" color="secondary" onClick={ohmViewFunc()}>
                <Typography align="left">
                  {" "}
                  <SvgIcon component={ohmTokenImg} viewBox="0 0 32 32" style={{ height: "15px", width: "15px" }} />
                  wsOHM
                </Typography>
              </Button>
            </Box>
            <Box className="ohm-pairs">
              <Button variant="contained" color="secondary" onClick={ohmViewFunc()}>
                <Typography align="left">
                  {" "}
                  <SvgIcon component={ohmTokenImg} viewBox="0 0 32 32" style={{ height: "15px", width: "15px" }} />
                  3TT
                </Typography>
              </Button>
            </Box>

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
        </Slide>
      ) : null}
    </Box>
  );
}

export default OhmMenu;
