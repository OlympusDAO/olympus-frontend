<<<<<<< HEAD
<<<<<<< HEAD
import { AppBar, Toolbar, Box, Button, Link, IconButton, SvgIcon } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
=======
import React, { Fragment } from "react";
// import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { useSelector, useDispatch } from 'react-redux';
// import Web3Modal from "web3modal";
import { shorten } from '../../helpers';
import ThemeSwitcher from "../ThemeSwitch/ThemeSwitch";
import { Flex } from "rimble-ui";
>>>>>>> Implemented wallet token integration
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { ReactComponent as MenuIcon } from "../../assets/icons/v1.2/hamburger.svg";
import OhmMenu from "./OhmMenu.jsx";
import ThemeSwitcher from "./ThemeSwitch.jsx";
=======
import React, { useState } from "react";
import { Flex } from "rimble-ui";
import InfoIcon from "@material-ui/icons/Info";
import ThemeSwitcher from "../ThemeSwitch/ThemeSwitch";
>>>>>>> Implement new menu design and only show add token when eth api is available
import "./topbar.scss";

const SOHM_ADDRESS = "0x04f2694c8fcee23e8fd0dfea1d4f5bb8c352111f";
const OHM_ADDRESS = "0x383518188c0c6d7730d91b2c03a03c837814a899";
const TOKEN_DECIMALS = 9;
const TOKEN_IMAGE = "https://app.olympusdao.finance/static/media/logo.b949cd68.svg";

const addOhmToWallet = (tokenSymbol, tokenAddress) => async () => {
  if (window.ethereum) {
    try {
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: TOKEN_DECIMALS,
            image: TOKEN_IMAGE,
          },
        },
      });

      if (wasAdded) {
        console.log("Welcome aboard Ohmie!");
      } else {
        console.log("Woopsie!");
      }
    } catch (error) {
      console.log(error);
    }
  }
};

const ohmMenu = (isShown = false, theme = "light") => {
  const isEthereumAPIAvailable = window.ethereum;
  return isShown ? (
    <div className="ohm-card add-ohm-wallet">
      <div className="ohm-menu-container">
        <div style={{ marginBottom: "5px" }}>
          <a
            style={{ fontFamily: "Square", color: theme === "light" ? "black" : "white" }}
            href="https://app.sushi.com/swap?inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&outputCurrency=0x383518188c0c6d7730d91b2c03a03c837814a899"
            target="_blank"
            rel="noreferrer"
          >
            Buy on Sushiswap{" "}
          </a>
          <i className="fa fa-external-link-alt" />
        </div>
        <div>
          <a
            style={{ fontFamily: "Square", color: theme === "light" ? "black" : "white" }}
            href="https://app.uniswap.org/swap?inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&outputCurrency=0x383518188c0c6d7730d91b2c03a03c837814a899"
            target="_blank"
            rel="noreferrer"
          >
            Buy on Uniswap{" "}
          </a>
          <i className="fa fa-external-link-alt" />
        </div>
      </div>

      {isEthereumAPIAvailable ? (
        <>
          <hr style={{ color: "grey", margin: "0px" }} />
          <div className="ohm-menu-container">
            <p className="add-token-title">ADD TOKEN TO WALLET</p>
            <div onClick={addOhmToWallet("sOHM", SOHM_ADDRESS)}>
              <p className="ohm-token-name">sOHM</p>
            </div>
            <div onClick={addOhmToWallet("OHM", OHM_ADDRESS)}>
              <p className="ohm-token-name">OHM</p>
            </div>
          </div>
        </>
      ) : null}
    </div>
  ) : null;
};

<<<<<<< HEAD
const useStyles = makeStyles(theme => ({
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: "100%",
    },
    justifyContent: "flex-end",
    alignItems: "flex-end",
    background: "transparent",
    backdropFilter: "none",
    padding: "10px",
    zIndex: 10,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

function TopBar({ web3Modal, loadWeb3Modal, logoutOfWeb3Modal, theme, toggleTheme, handleDrawerToggle }) {
  const classes = useStyles();
  const isVerySmallScreen = useMediaQuery("(max-width: 433px)");
=======
function TopBar({ web3Modal, loadWeb3Modal, logoutOfWeb3Modal, theme, toggleTheme }) {
  const [showOhmMenu, setShowOhmMenu] = useState(false);
>>>>>>> Implement new menu design and only show add token when eth api is available

  const modalButtons = [];
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
<<<<<<< HEAD
        <Button variant="contained" color="secondary" size="large" onClick={logoutOfWeb3Modal} key={1}>
          Disconnect
        </Button>,
      );
    } else {
      modalButtons.push(
        <Button variant="contained" color="secondary" size="large" onClick={loadWeb3Modal} key={2}>
          Connect Wallet
        </Button>,
=======
        <button
          type="button"
          className="btn top-bar-button btn-overwrite-primer m-2"
          onClick={logoutOfWeb3Modal}
          key={1}
        >
          Disconnect
        </button>,
      );
    } else {
      modalButtons.push(
        <button type="button" className="btn top-bar-button btn-overwrite-primer m-2" onClick={loadWeb3Modal} key={2}>
          Connect Wallet
        </button>,
>>>>>>> Implement new menu design and only show add token when eth api is available
      );
    }
  }

  return (
<<<<<<< HEAD
<<<<<<< HEAD
    <AppBar position="sticky" className={classes.appBar} elevation={0}>
      <Toolbar disableGutters className="dapp-topbar">
        <Button
          id="hamburger"
          color="inherit"
          aria-label="open drawer"
          edge="start"
          size="large"
          variant="contained"
          color="secondary"
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <SvgIcon component={MenuIcon} />
        </Button>

        <Box display="flex">
          {!isVerySmallScreen && <OhmMenu />}

          <div className="wallet-menu" id="wallet-menu">
            {modalButtons}
          </div>

          <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
        </Box>
      </Toolbar>
    </AppBar>
=======
    <div className={`dapp-topbar`}>
			<Flex className="dapp-topbar-items">
				{!(address && isUltraSmallScreen) &&
					<ThemeSwitcher
						theme={theme}
						toggleTheme={toggleTheme}
					/>
				}

				{!isVerySmallScreen &&
          <Fragment>
            <ToggleButton
              className="toggle-button btn top-bar-button m-2 .add-ohm-wallet"
              type="button"
              title="Add sOHM to Wallet"
              value="check"
              onClick={addOhmToWallet('sOHM', SOHM_ADDRESS)}
            >
              <SohmIcon className="ohm-mm-icon" />
            </ToggleButton>

            <ToggleButton
              className="toggle-button btn top-bar-button m-2 .add-ohm-wallet"
              type="button"
              title="Add OHM to Wallet"
              value="check"
              onClick={addOhmToWallet('OHM', OHM_ADDRESS)}
            >
              <OhmIcon className="ohm-mm-icon" />
            </ToggleButton>
            <button
              id="get-ohm"
              className="get-ohm-button btn btn-overwrite-primer m-2 top-bar-button"
              title="Get OHM"
            >
              <a href="https://app.sushi.com/swap?inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&outputCurrency=0x383518188c0c6d7730d91b2c03a03c837814a899" target="_blank">
                Get OHM
              </a>
            </button>
          </Fragment>
=======
    <div className="dapp-topbar">
      {ohmMenu(showOhmMenu, theme)}
      <Flex className="dapp-topbar-items">
        <>
          <button
            id="get-ohm"
            className="get-ohm-button btn btn-overwrite-primer m-2 top-bar-button"
            title="Get OHM"
            onClick={() => setShowOhmMenu(!showOhmMenu)}
          >
            <div style={{ paddingTop: "5px" }}>
              <InfoIcon style={{ marginBottom: "5px" }} fontSize="small" /> <span>Ohm</span>
            </div>
          </button>
        </>
>>>>>>> Implement new menu design and only show add token when eth api is available

        <div className="wallet-menu" id="wallet-menu">
          {modalButtons}
        </div>

        <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
      </Flex>
    </div>
>>>>>>> Implemented wallet token integration
  );
}

export default TopBar;
