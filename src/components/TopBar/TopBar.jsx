import { shorten } from "../../helpers";
import ThemeSwitcher from "../ThemeSwitch/ThemeSwitch";
import { Button } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "./topbar.scss";

function TopBar({ web3Modal, loadWeb3Modal, logoutOfWeb3Modal, address, theme, toggleTheme }) {
  const isVerySmallScreen = useMediaQuery("(max-width: 649px)");

  const modalButtons = [];
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        <Button type="button" color="secondary" variant="contained" size="large" onClick={logoutOfWeb3Modal} key={1}>
          Disconnect
        </Button>,
      );
    } else {
      modalButtons.push(
        <Button variant="contained" color="secondary" type="button" size="large" onClick={loadWeb3Modal} key={2}>
          Connect Wallet
        </Button>,
      );
    }
  }

  return (
    <div className={`dapp-topbar`}>
      {!isVerySmallScreen && (
        <Button
          id="get-ohm"
          className="get-ohm-button"
          size="large"
          variant="contained"
          color="secondary"
          title="Get OHM"
        >
          <a
            href="https://app.sushi.com/swap?inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&outputCurrency=0x383518188c0c6d7730d91b2c03a03c837814a899"
            target="_blank"
          >
            Get OHM
          </a>
        </Button>
      )}

      <div className="wallet-menu" id="wallet-menu">
        {modalButtons}
        {address && (
          <Button variant="contained" color="secondary" size="large">
            <a href={`https://etherscan.io/address/${address}`} target="_blank">
              {shorten(address)}
            </a>
          </Button>
        )}
      </div>

      <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
    </div>
  );
}

export default TopBar;
