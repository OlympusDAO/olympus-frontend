import { useState } from "react";
import { addresses, TOKEN_DECIMALS } from "../../constants";
import { getTokenImage } from "../../helpers";
import { useSelector } from "react-redux";
import { Link, SvgIcon, Popper, Button, Paper, Typography, Divider, Box } from "@material-ui/core";
import { ReactComponent as InfoIcon } from "../../assets/icons/v1.2/info-fill.svg";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/v1.2/arrow-up.svg";
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
  const id = open ? "ohm-popper" : undefined;

  return (
    <>
      <Button
        id="ohm-menu-button"
        size="large"
        variant="contained"
        color="secondary"
        title="OHM"
        onClick={handleClick}
        aria-describedby={id}
      >
        <SvgIcon component={InfoIcon} color="primary" />
        <Typography>OHM</Typography>
      </Button>
      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start">
        <Paper className="ohm-menu" elevation={1}>
          <Link
            href={`https://app.sushi.com/swap?inputCurrency=${addresses[networkID].RESERVES.DAI}&outputCurrency=${OHM_ADDRESS}`}
            target="_blank"
            rel="noreferrer"
          >
            <Typography>
              Buy on Sushiswap <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
            </Typography>
          </Link>

          <Link
            href={`https://app.uniswap.org/#/swap?inputCurrency=${addresses[networkID].RESERVES.FRAX}&outputCurrency=${OHM_ADDRESS}`}
            target="_blank"
            rel="noreferrer"
          >
            <Typography>
              Buy on Uniswap <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
            </Typography>
          </Link>

          {isEthereumAPIAvailable ? (
            <Box className="add-tokens">
              <Divider color="secondary" />
              <p>ADD TOKEN TO WALLET</p>
              <Button variant="text" color="secondary" onClick={addTokenToWallet("OHM", OHM_ADDRESS)}>
                <Typography>OHM</Typography>
              </Button>
              <Button variant="text" color="secondary" onClick={addTokenToWallet("sOHM", SOHM_ADDRESS)}>
                <Typography>sOHM</Typography>
              </Button>
            </Box>
          ) : null}
        </Paper>
      </Popper>
    </>
  );
}

export default OhmMenu;
