import { useState, useEffect } from "react";
import { addresses, TOKEN_DECIMALS } from "../../constants";
import { NavLink } from "react-router-dom";
import { Link, SvgIcon, Popper, Button, Paper, Typography, Divider, Box, Fade, Slide } from "@material-ui/core";
import { ReactComponent as InfoIcon } from "../../assets/icons/info-fill.svg";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up.svg";
import { ReactComponent as sOhmTokenImg } from "../../assets/tokens/token_sOHM.svg";
import { ReactComponent as wsOhmTokenImg } from "../../assets/tokens/token_wsOHM.svg";
import { ReactComponent as ohmTokenImg } from "../../assets/tokens/token_OHM.svg";
import { ReactComponent as t33TokenImg } from "../../assets/tokens/token_33T.svg";

import "./ohmmenu.scss";
import { dai, frax } from "src/helpers/AllBonds";
import { useWeb3Context } from "../../hooks/web3Context";

import OhmImg from "src/assets/tokens/token_OHM.svg";
import SOhmImg from "src/assets/tokens/token_sOHM.svg";
import WsOhmImg from "src/assets/tokens/token_wsOHM.svg";
import token33tImg from "src/assets/tokens/token_33T.svg";

const addTokenToWallet = (tokenSymbol, tokenAddress) => async () => {
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
    } catch (error) {
      console.log(error);
    }
  }
};

function OhmMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const isEthereumAPIAvailable = window.ethereum;
  const { chainID } = useWeb3Context();

  const networkID = chainID;

  const SOHM_ADDRESS = addresses[networkID].SOHM_ADDRESS;
  const OHM_ADDRESS = addresses[networkID].OHM_ADDRESS;
  const PT_TOKEN_ADDRESS = addresses[networkID].PT_TOKEN_ADDRESS;
  const WSOHM_ADDRESS = addresses[networkID].WSOHM_ADDRESS;
  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
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
                  <Link
                    href={`https://app.sushi.com/swap?inputCurrency=${daiAddress}&outputCurrency=${OHM_ADDRESS}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="large" variant="contained" color="secondary" fullWidth>
                      <Typography align="left">
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

                  <Link component={NavLink} to="/wrap" style={{ textDecoration: "none" }}>
                    <Button size="large" variant="contained" color="secondary" fullWidth>
                      <Typography align="left">Wrap sOHM</Typography>
                    </Button>
                  </Link>
                </Box>

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

                {isEthereumAPIAvailable ? (
                  <Box className="add-tokens">
                    <Divider color="secondary" />
                    <p>ADD TOKEN TO WALLET</p>
                    <Box display="flex" flexDirection="row" justifyContent="space-between">
                      {OHM_ADDRESS && (
                        <Button variant="contained" color="secondary" onClick={addTokenToWallet("OHM", OHM_ADDRESS)}>
                          <SvgIcon
                            component={ohmTokenImg}
                            viewBox="0 0 32 32"
                            style={{ height: "25px", width: "25px" }}
                          />
                          <Typography variant="body1">OHM</Typography>
                        </Button>
                      )}
                      {SOHM_ADDRESS && (
                        <Button variant="contained" color="secondary" onClick={addTokenToWallet("sOHM", SOHM_ADDRESS)}>
                          <SvgIcon
                            component={sOhmTokenImg}
                            viewBox="0 0 100 100"
                            style={{ height: "25px", width: "25px" }}
                          />
                          <Typography variant="body1">sOHM</Typography>
                        </Button>
                      )}
                      {WSOHM_ADDRESS && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={addTokenToWallet("wsOHM", WSOHM_ADDRESS)}
                        >
                          <SvgIcon
                            component={wsOhmTokenImg}
                            viewBox="0 0 180 180"
                            style={{ height: "25px", width: "25px" }}
                          />
                          <Typography variant="body1">wsOHM</Typography>
                        </Button>
                      )}
                      {PT_TOKEN_ADDRESS && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={addTokenToWallet("33T", PT_TOKEN_ADDRESS)}
                        >
                          <SvgIcon
                            component={t33TokenImg}
                            viewBox="0 0 1000 1000"
                            style={{ height: "25px", width: "25px" }}
                          />
                          <Typography variant="body1">33T</Typography>
                        </Button>
                      )}
                    </Box>
                  </Box>
                ) : null}

                <Divider color="secondary" />
                <Link
                  href="https://docs.olympusdao.finance/using-the-website/unstaking_lp"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button size="large" variant="contained" color="secondary" fullWidth>
                    <Typography align="left">Unstake Legacy LP Token</Typography>
                  </Button>
                </Link>
              </Paper>
            </Fade>
          );
        }}
      </Popper>
    </Box>
  );
}

export default OhmMenu;
