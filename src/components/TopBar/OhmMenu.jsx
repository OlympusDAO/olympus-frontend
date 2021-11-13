import { useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import { addresses } from "../../constants";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up.svg";

import { ReactComponent as InfoIcon } from "../../assets/icons/info-fill.svg";
import "./ohmmenu.scss";
import { dai, frax } from "src/helpers/AllBonds";
import { useWeb3Context } from "../../hooks/web3Context";
import InitialWalletView from "./OhmMenuViews/walletViews/InitialWalletView";
import { Drawer, SvgIcon, Button, Typography, Box } from "@material-ui/core";

function OhmMenu() {
  const [anchor, setAnchor] = useState(false);
  const { chainID } = useWeb3Context();
  const networkID = chainID;
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
        <SvgIcon component={InfoIcon} color="primary" />
        <Typography>OHM</Typography>
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
