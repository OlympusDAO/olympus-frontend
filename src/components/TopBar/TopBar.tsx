// import "src/components/TopBar/TopBar.scss";

import { AppBar, Box, Button, SvgIcon, useMediaQuery, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactComponent as MenuIcon } from "src/assets/icons/hamburger.svg";
import ConnectButton from "src/components/ConnectButton/ConnectButton";

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
      paddingTop: "22.5px",
    },
    backdropFilter: "none",
  },

  [`& .${classes.menuButton}`]: {
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

function TopBar({ handleDrawerToggle }: TopBarProps) {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up(1048));
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="flex-end"
      paddingTop="21px"
      marginRight={desktop ? "33px" : "0px"}
    >
      <Box display="flex" alignItems="center">
        <Box display="flex" alignItems="center">
          <ConnectButton />
        </Box>
        {!desktop && (
          <Button
            id="hamburger"
            aria-label="open drawer"
            size="large"
            variant="text"
            color="secondary"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <SvgIcon component={MenuIcon} />
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default TopBar;
