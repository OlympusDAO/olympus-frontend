import { t, Trans } from "@lingui/macro";
import {
  Box,
  Link as MuiLink,
  LinkProps,
  makeStyles,
  SwipeableDrawer,
  Theme,
  Typography,
  withStyles,
} from "@material-ui/core";
import { Icon, OHMTokenProps, PrimaryButton, SecondaryButton, TabBar, Token } from "@olympusdao/component-library";
import { Link, useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { shorten } from "src/helpers";
import { useWeb3Context } from "src/hooks";
import { NetworkId } from "src/networkDetails";

import Assets from "./Assets";
import Calculator from "./Calculator";
import GetOhm from "./GetOhm";
import Info from "./Info";

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

const useStyles = makeStyles<Theme>(theme => ({
  networkSelector: {
    background: theme.colors.paper.card,
    minHeight: "39px",
    borderRadius: "6px",
    padding: "9px 18px",
    alignItems: "center",
  },
  connectButton: {
    background: theme.colors.paper.card,
    "&:hover": {
      background: theme.colors.paper.cardHover,
    },
  },
}));

export function Wallet(props: { open?: boolean; component?: string }) {
  const classes = useStyles();
  const history = useHistory();
  const { address, connect, connected, networkId } = useWeb3Context();
  const { id } = useParams<{ id: string }>();

  // only enable backdrop transition on ios devices,
  // because we can assume IOS is hosted on hight-end devices and will not drop frames
  // also disable discovery on IOS, because of it's 'swipe to go back' feat
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  const CloseButton = (props: LinkProps) => (
    <MuiLink {...props}>
      <Icon name="x" />
    </MuiLink>
  );
  const WalletButtonTop = () => {
    const onClick = !connected ? connect : undefined;
    const label = connected ? t`Wallet` : t`Connect Wallet`;
    return (
      <PrimaryButton className={classes.connectButton} color="secondary" onClick={onClick}>
        <Icon name="wallet" style={{ marginRight: "9px" }} />
        <Typography>{label}</Typography>
      </PrimaryButton>
    );
  };
  const WalletButtonBottom = () => {
    const onClick = !connected ? connect : undefined;
    const label = connected ? t`Wallet` : t`Connect Wallet`;
    return (
      <PrimaryButton onClick={onClick}>
        <Typography>{label}</Typography>
      </PrimaryButton>
    );
  };

  const DisconnectButton = () => {
    const { disconnect } = useWeb3Context();
    return (
      <SecondaryButton onClick={disconnect}>
        <Trans>Disconnect</Trans>
      </SecondaryButton>
    );
  };

  const ConnectMessage = () => (
    <Box display="flex" justifyContent="center" mt={"32px"}>
      <Typography variant={"h6"}> Please Connect Your Wallet </Typography>
    </Box>
  );

  return (
    <>
      <StyledSwipeableDrawer
        disableBackdropTransition={!isIOS}
        disableDiscovery={isIOS}
        anchor="right"
        open={props.open ? true : false}
        onOpen={() => null}
        onClose={() => history.push("/stake")}
      >
        <Box p="30px 15px" style={{ overflow: "hidden" }}>
          <Box style={{ top: 0, position: "sticky" }}>
            <Box display="flex" justifyContent="space-between" mb={"18px"}>
              <Box>
                {!connected && <WalletButtonTop />}
                {connected && (
                  <Box display="flex" className={classes.networkSelector}>
                    {NetworkId[networkId] && (
                      <Token name={NetworkId[networkId] as OHMTokenProps["name"]} style={{ fontSize: "21px" }} />
                    )}
                    <Typography style={{ marginLeft: "6px" }}> {shorten(address)}</Typography>
                  </Box>
                )}
              </Box>
              <Box display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center" textAlign="right">
                <Link to="/stake" component={CloseButton} />
              </Box>
            </Box>
            <TabBar
              items={[
                { label: "Wallet", to: "/wallet" },
                { label: "Utility", to: "/utility" },
                { label: "Calculator", to: "/calculator" },
                { label: "Info", to: `${process.env.REACT_APP_DISABLE_NEWS ? "/info/proposals" : "/info"}` },
              ]}
              mb={"18px"}
            />
          </Box>
          <Box
            style={{
              height: "100vh",
              display: "block",
              overflowY: "scroll",
              overflowX: "hidden",
              paddingBottom: "calc(85%)",
            }}
          >
            {(() => {
              switch (props.component) {
                case "calculator":
                  return <Calculator />;
                case "info":
                  return <Info path={id} />;
                case "utility":
                  return <GetOhm />;
                case "wallet":
                  return <>{!connected ? <ConnectMessage /> : <Assets />}</>;
                case "wallet/history":
                  return <Assets path="history" />;
                default:
                  <></>;
              }
            })()}
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          style={{ position: "sticky", bottom: 0, boxShadow: "0px -3px 3px rgba(0, 0, 0, 0.1)" }}
          pt={"21px"}
          pb={"21px"}
        >
          {connected ? <DisconnectButton /> : <WalletButtonBottom />}
        </Box>
      </StyledSwipeableDrawer>
    </>
  );
}

export default Wallet;
