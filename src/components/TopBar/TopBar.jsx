<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import React, { useState } from "react";
=======
import React from 'react';
import { shorten } from '../../helpers';
=======
import { shorten } from "../../helpers";
>>>>>>> fixed dep issues, updated formatting, styled mobile nav, styled migrate page
=======
>>>>>>> refactored bond views
import ThemeSwitcher from "../ThemeSwitch/ThemeSwitch";
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> fixed links in bond discounts
import { Flex } from "rimble-ui";
<<<<<<< HEAD
import InfoIcon from "@material-ui/icons/Info";
import ThemeSwitcher from "../ThemeSwitch/ThemeSwitch";
=======
=======
>>>>>>> styled top bar/buttons, copied over light and girth theme (need work) and removed more redundnacy
import { Button } from "@material-ui/core";
=======
import { AppBar, Toolbar, Button, Link, IconButton } from "@material-ui/core";
=======
import { AppBar, Toolbar, Box, Button, Link, IconButton } from "@material-ui/core";
>>>>>>> cleaned up topbar, made hamburger left anchored, removed font awesome for custom icons
import MenuIcon from "@material-ui/icons/Menu";
>>>>>>> top bar nearly done, sidebar refactored (mostly) to use material ui drawer, bootstrap removed, sidebar styled, typography implemented
import useMediaQuery from "@material-ui/core/useMediaQuery";
>>>>>>> top bar buttons basic theme applied
import "./topbar.scss";
<<<<<<< HEAD
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { addresses } from "../../constants";
import { getOhmTokenImage, getSohmTokenImage } from "../../helpers";
import { useSelector } from "react-redux";

<<<<<<< HEAD
const TOKEN_DECIMALS = 9;
const SOHM_TOKEN_IMAGE = getSohmTokenImage();
const OHM_TOKEN_IMAGE = getOhmTokenImage();
const addOhmToWallet = (tokenSymbol, tokenAddress) => async () => {
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
            image: tokenSymbol === "OHM" ? OHM_TOKEN_IMAGE : SOHM_TOKEN_IMAGE,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
};

const ohmMenu = (isShown = false, theme = "light", isBigScreen = false, networkID = 1) => {
  const isEthereumAPIAvailable = window.ethereum;
  const SOHM_ADDRESS = addresses[networkID].SOHM_ADDRESS;
  const OHM_ADDRESS = addresses[networkID].OHM_ADDRESS;
  return isShown ? (
    <div className="ohm-card add-ohm-wallet" style={{ right: isBigScreen ? "13vw" : "200px" }}>
      <div className="ohm-menu-container">
        <div style={{ marginBottom: "5px" }}>
          <a
            style={{ fontFamily: "Square", color: theme === "light" ? "black" : "white" }}
            href={`https://app.sushi.com/swap?inputCurrency=${addresses[networkID].RESERVES.DAI}&outputCurrency=${OHM_ADDRESS}`}
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
            href={`https://app.uniswap.org/#/swap?inputCurrency=${addresses[networkID].RESERVES.FRAX}&outputCurrency=${OHM_ADDRESS}`}
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
            <div className="ohm-token-name" onClick={addOhmToWallet("OHM", OHM_ADDRESS)}>
              <p>OHM</p>
            </div>
            <div className="ohm-token-name" onClick={addOhmToWallet("sOHM", SOHM_ADDRESS)}>
              <p>sOHM</p>
            </div>
          </div>
        </>
      ) : null}
    </div>
  ) : null;
};

<<<<<<< HEAD
function TopBar({ web3Modal, loadWeb3Modal, logoutOfWeb3Modal, theme, toggleTheme }) {
  const [showOhmMenu, setShowOhmMenu] = useState(false);
  const isBigScreen = useMediaQuery("(min-width: 2350px)");
  const networkID = useSelector(state => {
    return (state.app && state.app.networkID) || 1;
  });
=======
function TopBar({ web3Modal, loadWeb3Modal, logoutOfWeb3Modal, address, theme, toggleTheme}) {
	const isVerySmallScreen = useMediaQuery("(max-width: 649px)");
	const isUltraSmallScreen = useMediaQuery("(max-width: 495px)");
>>>>>>> dashboard tiles use graph queries from app state
=======
function TopBar({ web3Modal, loadWeb3Modal, logoutOfWeb3Modal, address, theme, toggleTheme }) {
  const isVerySmallScreen = useMediaQuery("(max-width: 649px)");
>>>>>>> fixed dep issues, updated formatting, styled mobile nav, styled migrate page
=======
import { makeStyles } from "@material-ui/core/styles";
=======
=======
>>>>>>> staking updated with current index, button links fixed, bond cards styled
=======
>>>>>>> Implemented wallet token integration
=======
>>>>>>> Implement new menu design and only show add token when eth api is available
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
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> top bar ohm info button integrated and refactored
=======
import { ReactComponent as OhmIcon } from '../../assets/icons/ohm-mini-logo.svg';
import { ReactComponent as SohmIcon } from '../../assets/icons/sohm-gold-logo.svg';
import ToggleButton from "@material-ui/lab/ToggleButton";
=======
>>>>>>> Implement new menu design and only show add token when eth api is available

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

<<<<<<< HEAD
>>>>>>> Implemented wallet token integration
=======
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
>>>>>>> Implement new menu design and only show add token when eth api is available

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
<<<<<<< HEAD
  const isVerySmallScreen = useMediaQuery("(max-width: 600px)");
>>>>>>> top bar nearly done, sidebar refactored (mostly) to use material ui drawer, bootstrap removed, sidebar styled, typography implemented
=======
  const isVerySmallScreen = useMediaQuery("(max-width: 433px)");
<<<<<<< HEAD
>>>>>>> cleaned up topbar, made hamburger left anchored, removed font awesome for custom icons
=======
=======
function TopBar({ web3Modal, loadWeb3Modal, logoutOfWeb3Modal, theme, toggleTheme }) {
  const [showOhmMenu, setShowOhmMenu] = useState(false);
>>>>>>> Implement new menu design and only show add token when eth api is available
>>>>>>> Implement new menu design and only show add token when eth api is available

  const modalButtons = [];
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
        	<Button 
						type="button" 
						variant="contained"
						color="primary"
						size="large"
						onClick={logoutOfWeb3Modal} 
						key={1}>
						Disconnect
				</Button>,
      );
    } else {
      modalButtons.push(
<<<<<<< HEAD
<<<<<<< HEAD
        <Button variant="contained" color="secondary" type="button" className={`btn top-bar-button btn-overwrite-primer m-2`} onClick={loadWeb3Modal} key={2}>Connect Wallet</Button>,
>>>>>>> top bar buttons basic theme applied
=======
        <Button variant="contained" color="secondary" type="button" onClick={loadWeb3Modal} key={2}>Connect Wallet</Button>,
>>>>>>> styled top bar/buttons, copied over light and girth theme (need work) and removed more redundnacy
=======
        <Button variant="contained" color="secondary" type="button" size="large" onClick={loadWeb3Modal} key={2}>Connect Wallet</Button>,
>>>>>>> theme toggle styled, bonds page basic styles, fixed rounded sidebar issue
=======
        <Button type="button" color="secondary" variant="contained" size="large" onClick={logoutOfWeb3Modal} key={1}>
=======
        <Button color="secondary" variant="contained" size="large" onClick={logoutOfWeb3Modal} key={1}>
>>>>>>> top bar nearly done, sidebar refactored (mostly) to use material ui drawer, bootstrap removed, sidebar styled, typography implemented
=======
=======
>>>>>>> Implement new menu design and only show add token when eth api is available
        <Button variant="contained" color="secondary" size="large" onClick={logoutOfWeb3Modal} key={1}>
>>>>>>> imported new icons (still need to implement), cformatted files to clear prettier warnings, still need to fix advanced settings and style input fields
          Disconnect
        </Button>,
      );
    } else {
      modalButtons.push(
        <Button variant="contained" color="secondary" size="large" onClick={loadWeb3Modal} key={2}>
          Connect Wallet
        </Button>,
<<<<<<< HEAD
>>>>>>> fixed dep issues, updated formatting, styled mobile nav, styled migrate page
=======
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
>>>>>>> Implement new menu design and only show add token when eth api is available
      );
    }
  }

  return (
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    <div className="dapp-topbar">
      {ohmMenu(showOhmMenu, theme, isBigScreen, networkID)}
      <Flex className="dapp-topbar-items">
        <>
          <button
            id="get-ohm"
            className="get-ohm-button btn btn-overwrite-primer m-2 top-bar-button"
            title="Get OHM"
            onClick={() => setShowOhmMenu(!showOhmMenu)}
          >
            <div style={{ paddingTop: "5px" }}>
              <InfoIcon style={{ marginBottom: "5px" }} fontSize="small" /> <span>OHM</span>
            </div>
          </button>
        </>

        <div className="wallet-menu" id="wallet-menu">
          {modalButtons}
        </div>

        <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
      </Flex>
=======
    <div className={`dapp-topbar`}>
<<<<<<< HEAD
			{!isVerySmallScreen && 
				<Button
					id="get-ohm"
					className="get-ohm-button"
					size="large"
					variant="contained"
					color="secondary"
					title="Get OHM"
				>		
					<a href="https://app.sushi.com/swap?inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&outputCurrency=0x383518188c0c6d7730d91b2c03a03c837814a899" target="_blank">
						Get OHM
					</a>
				</Button>
			}
				
<<<<<<< HEAD
				<div className="wallet-menu" id="wallet-menu">
					{modalButtons}
					{address && <button type="button" className={`btn top-bar-button btn-overwrite-primer m-2`}>
						<a href={`https://etherscan.io/address/${address}`} target="_blank" className="ml-2">
							{shorten(address)}
						</a>
					</button>
					}
				</div>
			</Flex>
>>>>>>> top bar buttons basic theme applied
=======
			<div className="wallet-menu" id="wallet-menu">
				{modalButtons}
				{address && <Button variant="contained" color="secondary" size="large">
					<a href={`https://etherscan.io/address/${address}`} target="_blank">
						{shorten(address)}
					</a>
				</Button>
				}
			</div>
<<<<<<< HEAD
>>>>>>> styled top bar/buttons, copied over light and girth theme (need work) and removed more redundnacy
=======

			<ThemeSwitcher 
					theme={theme}		
					toggleTheme={toggleTheme} 
				/>
>>>>>>> theme toggle styled, bonds page basic styles, fixed rounded sidebar issue
=======
      {!isVerySmallScreen && (
        <Button
          id="get-ohm"
          className="get-ohm-button"
          size="large"
          variant="contained"
          color="secondary"
          title="Get OHM"
=======
    <AppBar position="sticky" className={classes.appBar} elevation="0">
=======
=======
>>>>>>> Implemented wallet token integration
=======
>>>>>>> Implement new menu design and only show add token when eth api is available
    <AppBar position="sticky" className={classes.appBar} elevation={0}>
>>>>>>> imported new icons (still need to implement), cformatted files to clear prettier warnings, still need to fix advanced settings and style input fields
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
>>>>>>> top bar nearly done, sidebar refactored (mostly) to use material ui drawer, bootstrap removed, sidebar styled, typography implemented
        >
          <SvgIcon component={MenuIcon} />
        </Button>

        <Box display="flex">
          {!isVerySmallScreen && <OhmMenu />}

<<<<<<< HEAD
<<<<<<< HEAD
      <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
>>>>>>> fixed dep issues, updated formatting, styled mobile nav, styled migrate page
    </div>
=======
        <div className="wallet-menu" id="wallet-menu">
          {modalButtons}
        </div>
=======
          <div className="wallet-menu" id="wallet-menu">
            {modalButtons}
          </div>
>>>>>>> cleaned up topbar, made hamburger left anchored, removed font awesome for custom icons

          <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
        </Box>
      </Toolbar>
    </AppBar>
<<<<<<< HEAD
>>>>>>> top bar nearly done, sidebar refactored (mostly) to use material ui drawer, bootstrap removed, sidebar styled, typography implemented
=======
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
>>>>>>> Implemented wallet token integration
  );
}

export default TopBar;
