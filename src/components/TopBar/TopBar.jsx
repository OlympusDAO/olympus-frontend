import React, { useState } from "react";
import { Flex } from "rimble-ui";
import InfoIcon from "@material-ui/icons/Info";
import ThemeSwitcher from "../ThemeSwitch/ThemeSwitch";
import "./topbar.scss";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { addresses } from "../../constants";
import { getOhmTokenImage, getSohmTokenImage } from "../../helpers";
import { useSelector } from "react-redux";
import { useWeb3Context } from "src/hooks/Web3Context";

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

function TopBar({ theme, toggleTheme }) {
  const { address, connect, disconnect } = useWeb3Context();

  const [showOhmMenu, setShowOhmMenu] = useState(false);
  const isBigScreen = useMediaQuery("(min-width: 2350px)");
  const networkID = useSelector(state => {
    return (state.app && state.app.networkID) || 1;
  });

  const modalButtons = [];
  if (address) {
    modalButtons.push(
      <button
        type="button"
        className="btn top-bar-button btn-overwrite-primer m-2"
        onClick={disconnect}
        key={1}
      >
        Disconnect
      </button>,
    );
  } else {
    modalButtons.push(
      <button type="button" className="btn top-bar-button btn-overwrite-primer m-2" onClick={connect} key={2}>
        Connect Wallet
      </button>,
    );
  }

  return (
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
    </div>
  );
}

export default TopBar;
