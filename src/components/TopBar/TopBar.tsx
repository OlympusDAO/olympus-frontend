import "./TopBar.scss";

import { i18n } from "@lingui/core";
import { t } from "@lingui/macro";
import { AppBar, Box, Button, SvgIcon, Toolbar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { LocaleSwitcher } from "@olympusdao/component-library";
import { Link, useLocation } from "react-router-dom";
import { ReactComponent as WalletIcon } from "src/assets/icons/wallet.svg";
import { useConnect } from "wagmi";

import { ReactComponent as MenuIcon } from "../../assets/icons/hamburger.svg";
import { locales, selectLocale } from "../../locales";
import ConnectButton from "../ConnectButton/ConnectButton";
import ThemeSwitcher from "./ThemeSwitch";

const PREFIX = "TopBar";

const classes = {
  appBar: `${PREFIX}-appBar`,
  menuButton: `${PREFIX}-menuButton`,
};

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  [`&.${classes.appBar}`]: {
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

  [`& .${classes.menuButton}`]: {
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
  const { isConnected } = useConnect();

  const location = useLocation();

  return (
    <StyledAppBar position="sticky" className={classes.appBar} elevation={0}>
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
        <Box display="flex" alignItems="center">
          <Link to={"/wallet"} state={{ prevPath: location.pathname }} style={{ marginRight: "0px" }}>
            <Button variant="contained" color="secondary">
              <SvgIcon component={WalletIcon} style={{ marginRight: "9px" }} />
              <Typography>{isConnected ? t`Wallet` : t`Connect`}</Typography>
            </Button>
          </Link>
          <ConnectButton />
          <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
          <LocaleSwitcher
            initialLocale={i18n.locale}
            locales={locales}
            onLocaleChange={selectLocale}
            label={t`Change locale`}
          />
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
}

export default TopBar;
