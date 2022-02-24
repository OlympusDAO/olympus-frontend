import { SwipeableDrawer } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import NavContent from "./NavContent";

const drawerWidth = 280;

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
    borderRight: 0,
  },
}));

type NavDrawerProps = {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
};

const NavDrawer: React.FC<NavDrawerProps> = ({ mobileOpen, handleDrawerToggle }) => {
  const location = useLocation();
  const classes = useStyles();
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  useEffect(() => {
    if (mobileOpen && handleDrawerToggle) {
      handleDrawerToggle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <SwipeableDrawer
      variant="temporary"
      anchor="left"
      open={mobileOpen}
      onOpen={handleDrawerToggle}
      onClose={handleDrawerToggle}
      classes={{
        paper: classes.drawerPaper,
      }}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      disableBackdropTransition={!isIOS}
      disableDiscovery={isIOS}
    >
      <NavContent handleDrawerToggle={handleDrawerToggle} />
    </SwipeableDrawer>
  );
};

export default NavDrawer;
