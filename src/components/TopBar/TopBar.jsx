import { shorten } from "../../helpers";
import ThemeSwitcher from "../ThemeSwitch/ThemeSwitch";
import { AppBar, Toolbar, Button, Link, IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "./topbar.scss";
import { makeStyles } from "@material-ui/core/styles";

const drawerWidth = 280;

const useStyles = makeStyles(theme => ({
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
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
  // necessary for content to be below app bar
  // toolbar: theme.mixins.toolbar,
}));

function TopBar({ web3Modal, loadWeb3Modal, logoutOfWeb3Modal, address, theme, toggleTheme, handleDrawerToggle }) {
  const classes = useStyles();
  const isVerySmallScreen = useMediaQuery("(max-width: 600px)");

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
    <AppBar position="sticky" className={classes.appBar} elevation={0}>
      <Toolbar disableGutters className="dapp-topbar">
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>

        {!isVerySmallScreen && (
          <Button
            id="get-ohm"
            className="get-ohm-button"
            size="large"
            variant="contained"
            color="secondary"
            title="Get OHM"
          >
            <Link
              href="https://app.sushi.com/swap?inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&outputCurrency=0x383518188c0c6d7730d91b2c03a03c837814a899"
              target="_blank"
            >
              Get OHM
            </Link>
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
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
