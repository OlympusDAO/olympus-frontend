import { Box, Link as MuiLink, SwipeableDrawer, withStyles } from "@material-ui/core";
import { Icon, TabBar } from "@olympusdao/component-library";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import Assets from "./Assets";
import Calculator from "./Calculator";
import GetOhm from "./GetOhm";
import Info from "./Info";
//import InitialWalletView from "./InitialWalletView";

const StyledSwipeableDrawer = withStyles(theme => ({
  root: {
    width: "460px",
    maxWidth: "100%",
  },
  paper: {
    maxWidth: "100%",
    background: theme.colors.paper.background,
  },
}))(SwipeableDrawer);

export function Wallet(props: { open?: boolean; component?: string; currentPath?: any }) {
  const [isWalletOpen, setWalletOpen] = useState(false);
  const closeWallet = () => setWalletOpen(false);
  const openWallet = () => setWalletOpen(true);
  const { id } = useParams<{ id: string }>();

  // only enable backdrop transition on ios devices,
  // because we can assume IOS is hosted on hight-end devices and will not drop frames
  // also disable discovery on IOS, because of it's 'swipe to go back' feat
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  const RenderComponent = (props: { component?: string }) => {
    switch (props.component) {
      case "calculator":
        return <Calculator />;
      case "info":
        return <Info path={id} />;
      case "getohm":
        return <GetOhm />;
      case "wallet":
        return <Assets />;
      case "wallet/history":
        return <Assets path="history" />;
      default:
        return <></>;
    }
  };
  const CloseButton = (props: any) => (
    <MuiLink {...props}>
      <Icon name="x" />
    </MuiLink>
  );
  return (
    <>
      <StyledSwipeableDrawer
        disableBackdropTransition={!isIOS}
        disableDiscovery={isIOS}
        anchor="right"
        open={props.open ? true : false}
        onOpen={openWallet}
        onClose={closeWallet}
      >
        <Box p="30px 15px" style={{ overflow: "hidden" }}>
          <Box style={{ top: 0, position: "sticky" }}>
            <Box display="flex" flexDirection="row" justifyContent="flex-end" mb={"18px"} textAlign="right">
              <Link to="/stake" component={CloseButton} />
            </Box>
            <TabBar
              items={[
                { label: "Wallet", to: "/wallet" },
                { label: "Get OHM", to: "/get-ohm" },
                { label: "Calculator", to: "/calculator" },
                { label: "Info", to: "/info" },
              ]}
              mb={"18px"}
            />
          </Box>
          <Box style={{ height: "100%", display: "block", overflow: "scroll", paddingBottom: "100px" }}>
            <RenderComponent component={props.component} />
          </Box>
        </Box>
      </StyledSwipeableDrawer>
    </>
  );
}

export default Wallet;
