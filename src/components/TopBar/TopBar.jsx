import { AppBar, Toolbar, Box, Button, SvgIcon, Typography, Popper, Paper, Divider, Link } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { ReactComponent as MenuIcon } from "../../assets/icons/v1.2/hamburger.svg";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/v1.2/arrow-up.svg";
import { ReactComponent as CaretDownIcon } from "../../assets/icons/v1.2/caret-down.svg";
import OhmMenu from "./OhmMenu.jsx";
import { useWeb3Context } from "src/hooks/web3Context";
import ThemeSwitcher from "./ThemeSwitch.jsx";
import "./topbar.scss";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useStyles = makeStyles(theme => ({
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: "100%",
      padding: "10px",
    },
    justifyContent: "flex-end",
    alignItems: "flex-end",
    background: "transparent",
    backdropFilter: "none",
    zIndex: 10,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

function ConnectButton({ theme }) {
  const { connect, disconnect, connected, web3 } = useWeb3Context();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isConnected, setConnected] = useState(connected);

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  let buttonText = "Connect Wallet";
  let clickFunc = connect;

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  if (isConnected) {
    buttonText = "Disconnect";
    clickFunc = disconnect;
  }

  if (pendingTransactions && pendingTransactions.length > 0) {
    buttonText = "In progress";
    clickFunc = handleClick;
  }

  const open = Boolean(anchorEl);
  const id = open ? "ohm-popper-pending" : undefined;

  const primaryColor = theme === "light" ? "#49A1F2" : "#F8CC82";

  useEffect(() => {
    setConnected(connected);
  }, [web3, connected]);

  return (
    <>
      <Button
        className="pending-txn-container"
        variant="contained"
        color="secondary"
        size="large"
        style={pendingTransactions.length > 0 ? { color: primaryColor } : {}}
        onClick={clickFunc}
        key={1}
      >
        {buttonText}
        {pendingTransactions.length > 0 && (
          <SvgIcon className={open ? "rotated-caret" : ""} component={CaretDownIcon} htmlColor={primaryColor} />
        )}
      </Button>

      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start">
        <Paper className="ohm-menu" elevation={1}>
          {pendingTransactions.map(x => (
            <Link
              key={x.txnHash}
              href={"https://etherscan.io/tx/" + x.txnHash}
              color="primary"
              target="_blank"
              rel="noreferrer"
            >
              <div className="pending-txn-container">
                <Typography style={{ color: primaryColor }}>{x.text}</Typography>
                <SvgIcon component={ArrowUpIcon} htmlColor={primaryColor} />
              </div>
            </Link>
          ))}
          <Box className="add-tokens">
            <Divider color="secondary" />
            <Button variant="text" color="secondary" onClick={disconnect}>
              <Typography>Disconnect</Typography>
            </Button>
          </Box>
        </Paper>
      </Popper>
    </>
  );
}

function TopBar({ theme, toggleTheme, handleDrawerToggle }) {
  const classes = useStyles();
  const isVerySmallScreen = useMediaQuery("(max-width: 355px)");

  return (
    <AppBar position="sticky" className={classes.appBar} elevation={0}>
      <Toolbar disableGutters className="dapp-topbar">
        <Button
          id="hamburger"
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
            <ConnectButton theme={theme} />
          </div>

          <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
