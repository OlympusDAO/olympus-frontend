import ThemeSwitcher from "../ThemeSwitch/ThemeSwitch";
import { AppBar, Toolbar, Box, Button, Link, IconButton, SvgIcon } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { ReactComponent as MenuIcon } from "../../assets/icons/v1.2/hamburger.svg";
import OhmMenu from "./OhmMenu.jsx";
import "./topbar.scss";

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
  // necessary for content to be below app bar
  // toolbar: theme.mixins.toolbar,
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
    <AppBar position="sticky" className={classes.appBar} elevation={0}>
      <Toolbar disableGutters className="dapp-topbar">
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <SvgIcon component={MenuIcon} />
        </IconButton>

        <Box display="flex">
          {!isVerySmallScreen && <OhmMenu />}

          <div className="wallet-menu" id="wallet-menu">
            {modalButtons}
          </div>

          <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
