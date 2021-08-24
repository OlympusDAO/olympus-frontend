import { useState, useEffect } from "react";
import { addresses, TOKEN_DECIMALS } from "../../constants";
import { getTokenImage } from "../../helpers";
import { useSelector } from "react-redux";
import { Link, SvgIcon, Popper, Button, Paper, Typography, Divider, Box, Fade, Slide } from "@material-ui/core";
import { ReactComponent as InfoIcon } from "../../assets/icons/info-fill.svg";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up.svg";
import "./ohmmenu.scss";

const sohmImg = getTokenImage("sohm");
const ohmImg = getTokenImage("ohm");

const addTokenToWallet = (tokenSymbol, tokenAddress) => async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: TOKEN_DECIMALS,
            image: tokenSymbol === "OHM" ? ohmImg : sohmImg,
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

  const networkID = useSelector(state => {
    return (state.app && state.app.networkID) || 1;
  });

  const SOHM_ADDRESS = addresses[networkID].SOHM_ADDRESS;
  const OHM_ADDRESS = addresses[networkID].OHM_ADDRESS;

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = "ohm-popper";
  return (
    <>
      <div onMouseEnter={e => handleClick(e)} onMouseLeave={e => handleClick(e)} id="ohm-menu-button-hover">
        <Button
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

        <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start" transition>
          {({ TransitionProps }) => {
            return (
              <Fade {...TransitionProps} timeout={200}>
                <Paper className="ohm-menu" elevation={1}>
                  <div className="buy-tokens">
                    <Link
                      href={`https://app.sushi.com/swap?inputCurrency=${addresses[networkID].RESERVES.DAI}&outputCurrency=${OHM_ADDRESS}`}
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
                      href={`https://app.uniswap.org/#/swap?inputCurrency=${addresses[networkID].RESERVES.FRAX}&outputCurrency=${OHM_ADDRESS}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button size="large" variant="contained" color="secondary" fullWidth>
                        <Typography align="left">
                          Buy on Uniswap <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                        </Typography>
                      </Button>
                    </Link>
                  </div>

                  {isEthereumAPIAvailable ? (
                    <Box className="add-tokens">
                      <Divider color="secondary" />
                      <p>ADD TOKEN TO WALLET</p>
                      <Button
                        size="large"
                        variant="contained"
                        color="secondary"
                        onClick={addTokenToWallet("OHM", OHM_ADDRESS)}
                      >
                        <Typography>OHM</Typography>
                      </Button>
                      <Button
                        variant="contained"
                        size="large"
                        color="secondary"
                        onClick={addTokenToWallet("sOHM", SOHM_ADDRESS)}
                      >
                        <Typography>sOHM</Typography>
                      </Button>
                    </Box>
                  ) : null}

                  <Divider color="secondary" />
                  <Link
                    href="https://docs.olympusdao.finance/using-the-website/unstaking_lp"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="large" variant="contained" color="secondary" fullWidth>
                      <Typography align="left">Unstake LP Token</Typography>
                    </Button>
                  </Link>
                </Paper>
              </Fade>
            );
          }}
        </Popper>
      </div>
    </>
  );
}

export default OhmMenu;
