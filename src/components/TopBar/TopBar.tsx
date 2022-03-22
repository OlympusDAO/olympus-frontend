import "./TopBar.scss";

import { i18n } from "@lingui/core";
import { t } from "@lingui/macro";
import { AppBar, Box, Button, SvgIcon, Toolbar, Typography, useTheme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { LocaleSwitcher } from "@olympusdao/component-library";
import { Link } from "react-router-dom";
import { ReactComponent as WalletIcon } from "src/assets/icons/wallet.svg";
import { useWeb3Context } from "src/hooks";

import { ReactComponent as MenuIcon } from "../../assets/icons/hamburger.svg";
import { locales, selectLocale } from "../../locales";
import ThemeSwitcher from "./ThemeSwitch";

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
    [theme.breakpoints.up(981)]: {
      display: "none",
    },
  },
}));

interface TopBarProps {
  theme: string;
  toggleTheme: (e: KeyboardEvent) => void;
  handleDrawerToggle: () => void;
}

function TopBar({ theme, toggleTheme, handleDrawerToggle }: TopBarProps) {
  const { connected } = useWeb3Context();
  const classes = useStyles();
  const WalletButton = (props: any) => {
    const theme = useTheme();
    return (
      <Button id="ohm-menu-button" variant="contained" color="secondary" {...props}>
        <SvgIcon component={WalletIcon} style={{ marginRight: theme.spacing(1) }} />
        <Typography>{connected ? t`Wallet` : t`Connect`}</Typography>
      </Button>
    );
  };
  return (
    <AppBar position="sticky" className={classes.appBar} elevation={0}>
      <Toolbar disableGutters className="dapp-topbar">
        <Button
          id="hamburger"
          aria-label="open drawer"
          size="large"
          variant="contained"
          color="secondary"
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <SvgIcon component={MenuIcon} />
        </Button>
        <Box display="flex">
          <Link to="/wallet" component={WalletButton} />
          <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
          <LocaleSwitcher
            initialLocale={i18n.locale}
            locales={locales}
            onLocaleChange={selectLocale}
            label={t`Change locale`}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
