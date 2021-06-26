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
import "./topbar.scss";
import { ReactComponent as OhmIcon } from '../../assets/icons/ohm-mini-logo.svg';
import { ReactComponent as SohmIcon } from '../../assets/icons/sohm-gold-logo.svg';
import ToggleButton from "@material-ui/lab/ToggleButton";

const SOHM_ADDRESS = '0x04f2694c8fcee23e8fd0dfea1d4f5bb8c352111f';
const OHM_ADDRESS = '0x383518188c0c6d7730d91b2c03a03c837814a899';
const TOKEN_DECIMALS = 9;
const TOKEN_IMAGE = 'https://app.olympusdao.finance/static/media/logo.b949cd68.svg';


const addOhmToWallet = (tokenSymbol, tokenAddress) => async () => {
  try {
    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenAddress,
          symbol: tokenSymbol,
          decimals: TOKEN_DECIMALS,
          image: TOKEN_IMAGE,
        },
      },
    });

    if (wasAdded) {
      console.log('Welcome aboard Ohmie!');
    } else {
      console.log('Woopsie!');
    }
  } catch (error) {
    console.log(error);
  }
}



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

  const modalButtons = [];
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        <Button variant="contained" color="secondary" size="large" onClick={logoutOfWeb3Modal} key={1}>
          Disconnect
        </Button>,
      );
    } else {
      modalButtons.push(
        <Button variant="contained" color="secondary" size="large" onClick={loadWeb3Modal} key={2}>
          Connect Wallet
        </Button>,
      );
    }
  }

  return (
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

				}

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
    </div>
>>>>>>> Implemented wallet token integration
  );
}

export default TopBar;
