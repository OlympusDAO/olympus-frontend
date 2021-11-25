import { useState } from "react";

import { ReactComponent as ArrowUpIcon } from "../../assets/icons/x.svg";
import { ReactComponent as WalletIcon } from "../../assets/icons/wallet.svg";
import "./ohmmenu.scss";
import { useWeb3Context } from "../../hooks/web3Context";
import InitialWalletView from "./OhmMenuViews/walletViews/InitialWalletView";
import { Drawer, SvgIcon, Button, Typography, Box } from "@material-ui/core";

function OhmMenu() {
  const [anchor, setAnchor] = useState(false);
  const toggleDrawer = data => () => {
    setAnchor(data);
  };

  return (
    <Box>
      <Button
        onClick={toggleDrawer("OG")}
        id="ohm-menu-button"
        size="large"
        variant="contained"
        color="secondary"
        title="OHM"
      >
        <SvgIcon component={WalletIcon} color="primary" />
        <Typography>Wallet</Typography>
      </Button>
      <Drawer style={{ width: "55%" }} anchor={"right"} open={anchor === "OG"} onClose={toggleDrawer("OG")}>
        <Button
          onClick={toggleDrawer("CLOSED")}
          id="ohm-menu-button"
          size="large"
          variant="contained"
          color="secondary"
          title="OHM"
        >
          <SvgIcon component={ArrowUpIcon} viewBox="0 0 32 32" style={{ height: "25px", width: "25px" }} />
        </Button>
        <InitialWalletView></InitialWalletView>
      </Drawer>
    </Box>
  );
}

export default OhmMenu;
