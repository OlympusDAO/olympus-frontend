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

import Chart from "../../components/Chart/Chart.jsx";
import apollo from "../../lib/apolloClient";

import { rebasesDataQuery, bulletpoints, tooltipItems, tooltipInfoMessages, itemType } from "./treasuryData.js";

function OhmMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [apy, setApy] = useState(null);
  const [mainWindow, setMainWindow] = useState(true);
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
      setMainWindow(!mainWindow);
    }
  };
  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const returnToMainViewFunc = info => async () => {
    if (info === "ohmView") {
      setOhmView(!ohmView);
    }
    setMainWindow(!mainWindow);
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
      <Button id="ohm-menu-button" size="large" variant="contained" color="secondary" title="OHM" aria-describedby={id}>
        <SvgIcon component={InfoIcon} color="primary" />
        <Typography>OHM</Typography>
      </Button>

      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start" transition>
        {({ TransitionProps }) => {
          return (
            <Fade {...TransitionProps} timeout={100}>
              <Paper className="ohm-menu" elevation={1}>
                <Box component="div" className="buy-tokens">
                  {mainWindow ? (
                    <div>
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
                      </Paper>
                      <Box className="ohm-pairs">
                        <Button variant="contained" color="secondary" onClick={ohmViewFunc()}>
                          <Typography align="left">
                            {" "}
                            <SvgIcon
                              component={ohmTokenImg}
                              viewBox="0 0 32 32"
                              style={{ height: "25px", width: "25px" }}
                            />
                            OHM
                          </Typography>
                        </Button>
                      </Box>

                      <Link
                        href={`https://app.sushi.com/swap?inputCurrency=${daiAddress}&outputCurrency=${OHM_ADDRESS}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button size="large" variant="contained" color="secondary" fullWidth>
                          <Typography>
                            Buy on Sushiswap <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                          </Typography>
                        </Button>
                      </Link>

                      <Link
                        href={`https://app.uniswap.org/#/swap?inputCurrency=${fraxAddress}&outputCurrency=${OHM_ADDRESS}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button size="large" variant="contained" color="secondary" fullWidth>
                          <Typography align="left">
                            Buy on Uniswap <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                          </Typography>
                        </Button>
                      </Link>

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
                        {isEthereumAPIAvailable ? (
                          <Box className="add-tokens">
                            <Divider color="secondary" />
                            <p>ADD TOKEN TO WALLET</p>
                            <Box display="flex" flexDirection="row" justifyContent="space-between">
                              <Button variant="contained" color="secondary">
                                <SvgIcon
                                  component={sOhmTokenImg}
                                  viewBox="0 0 100 100"
                                  style={{ height: "25px", width: "25px" }}
                                />
                                <Typography variant="body1">sOHM</Typography>
                              </Button>
                              <Button variant="contained" color="secondary">
                                <SvgIcon
                                  component={t33TokenImg}
                                  viewBox="0 0 1000 1000"
                                  style={{ height: "25px", width: "25px" }}
                                />
                                <Typography variant="body1">33T</Typography>
                              </Button>
                              <Link
                                href="https://docs.olympusdao.finance/using-the-website/unstaking_lp"
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Button size="large" variant="contained" color="secondary" fullWidth>
                                  <Typography align="left">Unstake Legacy LP Token</Typography>
                                </Button>
                              </Link>
                            </Box>
                          </Box>
                        ) : null}
                      </Box>
                    </div>
                  ) : null}
                  {ohmView ? (
                    <div>
                      <Button variant="contained" color="secondary" onClick={returnToMainViewFunc("ohmView")}>
                        <Typography align="left">Back Arrow to be placed here</Typography>
                      </Button>
                      <Box className="ohm-pairs">
                        {" "}
                        <Slide direction="left" in={ohmView} mountOnEnter unmountOnExit>
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
                          </Paper>
                        </Slide>
                      </Box>
                    </div>
                  ) : null}
                </Box>

                <Divider color="secondary" />
              </Paper>
            </Fade>
          );
        }}
      </Popper>
    </Box>
  );
}

export default OhmMenu;
