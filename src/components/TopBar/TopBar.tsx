import "src/components/TopBar/TopBar.scss";

import { i18n } from "@lingui/core";
import { t } from "@lingui/macro";
import { AppBar, Box, Button, SvgIcon, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { LocaleSwitcher } from "@olympusdao/component-library";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ReactComponent as MenuIcon } from "src/assets/icons/hamburger.svg";
import ConnectButton from "src/components/ConnectButton/ConnectButton";
import ThemeSwitcher from "src/components/TopBar/ThemeSwitch";
import { locales, selectLocale } from "src/locales";

const PREFIX = "TopBar";

const classes = {
  appBar: `${PREFIX}-appBar`,
  menuButton: `${PREFIX}-menuButton`,
  pageTitle: `${PREFIX}-pageTitle`,
};

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  [`&.${classes.appBar}`]: {
    [theme.breakpoints.up("sm")]: {
      width: "100%",
      padding: "10px",
    },
    background: "transparent",
    backdropFilter: "none",
    zIndex: 10,
  },

  [`& .${classes.menuButton}`]: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(1048)]: {
      display: "none",
    },
  },

  [`& .${classes.pageTitle}`]: {
    [theme.breakpoints.up(1048)]: {
      marginLeft: "287px",
    },
    marginLeft: "0px",
  },
}));

interface TopBarProps {
  theme: string;
  toggleTheme: (e: KeyboardEvent) => void;
  handleDrawerToggle: () => void;
}

function TopBar({ theme, toggleTheme, handleDrawerToggle }: TopBarProps) {
  const location = useLocation();
  const muiTheme = useTheme();
  const [pageTitle, setPageTitle] = useState("");

  //Dynamic Page Title in Topbar. Maybe there's a better way.
  //This seemed the least messy
  useEffect(() => {
    switch (location.pathname) {
      case "/stake":
        setPageTitle("Stake");
        break;
      case "/bonds/":
      case "/bonds":
        setPageTitle("Bond");
        break;
      case "/bonds/inverse":
        setPageTitle("Inverse Bond");
        break;
      case "/give":
      case "/give/grants":
      case "/give/donations":
      case "/give/redeem":
        setPageTitle("Give");
        break;
      case "/range":
        setPageTitle("Range");
        break;
      case "/wrap":
        setPageTitle("Wrap");
        break;
      case "/bridge":
        setPageTitle("Bridge");
        break;
      default:
        setPageTitle("");
    }
  }, [location.pathname]);

  return (
    <StyledAppBar position="sticky" className={classes.appBar} elevation={0}>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Box display="flex" alignItems="center">
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
          <Box display="flex" className={classes.pageTitle} alignItems="center">
            {pageTitle && <Typography variant="h1">{pageTitle}</Typography>}
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          <ConnectButton />
          <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
          <LocaleSwitcher
            initialLocale={i18n.locale}
            locales={locales}
            onLocaleChange={selectLocale}
            label={t`Change locale`}
          />
        </Box>
      </Box>
    </StyledAppBar>
  );
}

export default TopBar;
