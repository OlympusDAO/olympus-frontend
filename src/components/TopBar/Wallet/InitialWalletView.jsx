import { useState } from "react";
import { useSelector } from "react-redux";
import { useTheme, makeStyles, withStyles } from "@material-ui/core";
import { trim } from "src/helpers";
import { ReactComponent as CloseIcon } from "src/assets/icons/x.svg";
import { ReactComponent as ArrowUpIcon } from "src/assets/icons/arrow-up.svg";
import { ReactComponent as wethTokenImg } from "src/assets/tokens/wETH.svg";
import { ReactComponent as ohmTokenImg } from "src/assets/tokens/token_OHM.svg";
import { ReactComponent as abracadabraTokenImg } from "src/assets/tokens/MIM.svg";
import rariTokenImg from "src/assets/tokens/RARI.png";
import { addresses, TOKEN_DECIMALS } from "src/constants";
// import SOhmLearnView from "./SOhm/SOhmLearnView";
// import SOhmTxView from "./SOhm/SOhmTxView";
// import SOhmZapView from "./SOhm/SOhmTxView";
// import Chart from "../../../../components/Chart/WalletChart.jsx";
// import apollo from "../../../../lib/apolloClient";
// import { rebasesDataQuery, bulletpoints, tooltipItems, tooltipInfoMessages, itemType } from "../../treasuryData.js";
import { useWeb3Context } from "src/hooks";
import { SvgIcon, Button, Typography, Box, Drawer, Paper, Divider, Link, IconButton } from "@material-ui/core";
import ConnectMenu from "../ConnectMenu";

import { dai, frax } from "src/helpers/AllBonds";

import { TokensList } from "./Tokens";

const useStyles = makeStyles(theme => ({
  section: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(0.5),
    padding: theme.spacing(1, 0),
  },
}));

const ExternalLinkIcon = ({ size = 18 }) => (
  <SvgIcon
    component={ArrowUpIcon}
    style={{ height: `${size}px`, width: `${size}px`, verticalAlign: "sub" }}
    // htmlColor="#A3A3A3"
  />
);
// const ExternalLink = props => <Link target="_blank" rel="noreferrer" {...props} />;

const Borrow = ({ Icon1, Icon2, borrowOn, totalAvailable }) => {
  const theme = useTheme();
  const iconSize = "24px";
  return (
    <ExternalLink>
      <Box sx={{ display: "flex", flexDirection: "column", padding: theme.spacing(1, 0) }}>
        <Box sx={{ display: "flex", alignItems: "center", flexDirection: "row-reverse", justifyContent: "flex-end" }}>
          <Icon2 style={{ height: iconSize, width: iconSize, marginLeft: "-4px" }} />
          <Icon1 style={{ height: iconSize, width: iconSize }} />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", marginTop: theme.spacing(1) }}>
          <Box sx={{ display: "flex", flexDirection: "column", textAlign: "right", marginRight: theme.spacing(0.5) }}>
            <Typography>Borrow on {borrowOn}</Typography>
            {totalAvailable && (
              <Typography variant="body2" color="textSecondary">
                {totalAvailable} Available
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </ExternalLink>
  );
};

const ExternalLinkStyledButton = withStyles(theme => ({
  root: {
    padding: theme.spacing(1),
    maxHeight: "100%",
    height: "100%",
  },
}))(Button);

const ExternalLink = ({ href, children, color = "textSecondary" }) => (
  <Link target="_blank" rel="noreferrer" href={href} style={{ width: "100%" }}>
    <ExternalLinkStyledButton color={color} variant="outlined" fullWidth>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <Box sx={{ width: "100%" }}>{children}</Box>
        <Box sx={{ display: "flex", alignSelf: "start" }}>
          <SvgIcon
            component={ArrowUpIcon}
            htmlColor={color === "textSecondary" && "#ffffff3b"}
            style={{ height: `18px`, width: `18px`, verticalAlign: "middle" }}
          />
        </Box>
      </Box>
    </ExternalLinkStyledButton>
  </Link>
);

const DisconnectButton = () => {
  const { disconnect } = useWeb3Context();
  return (
    <Button onClick={disconnect} variant="contained" size="large" color="secondary" fullWidth>
      <Typography>Disconnect</Typography>
    </Button>
  );
};

function InitialWalletView({ onClose }) {
  const theme = useTheme();
  const styles = useStyles();
  // const { chainID } = useWeb3Context();
  const chainID = 4;
  return (
    <Box sx={{ padding: theme.spacing(0, 3) }}>
      <Box sx={{ display: "flex", justifyContent: "right" }}>
        <ConnectMenu theme={theme} />
        <IconButton size="small" onClick={onClose} aria-label="close wallet">
          <SvgIcon component={CloseIcon} color="primary" style={{ width: "15px", heigth: "15px" }} />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: theme.spacing(0.5) }}>
        <TokensList />
      </Box>

      <Box sx={{ margin: theme.spacing(2, -3) }}>
        <Divider color="secondary" />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "min-content",
          gap: theme.spacing(1.5),
        }}
      >
        <ExternalLink
          color="primary"
          href={`https://app.sushi.com/swap?inputCurrency=${dai.getAddressForReserve(chainID)}&outputCurrency=${
            addresses[chainID].OHM_ADDRESS
          }`}
        >
          <Typography align="left">Buy on Sushiswap</Typography>
        </ExternalLink>
        <ExternalLink
          color="primary"
          href={`https://app.uniswap.org/#/swap?inputCurrency=${frax.getAddressForReserve(chainID)}&outputCurrency=${
            addresses[chainID].OHM_ADDRESS
          }`}
        >
          <Typography align="left">Buy on Uniswap</Typography>
        </ExternalLink>
        <Borrow borrowOn="Abracadabra" Icon1={ohmTokenImg} Icon2={abracadabraTokenImg} />
        <Borrow borrowOn="Rari Capital" Icon1={ohmTokenImg} Icon2={props => <img src={rariTokenImg} {...props} />} />
        <Box sx={{ gridColumnStart: 1, gridColumnEnd: 3 }}>
          <ExternalLink href={`https://dune.xyz/0xrusowsky/Olympus-Wallet-History`}>
            <Typography style={{ marginLeft: "18px" }}>Rusowsky's Dune</Typography>
          </ExternalLink>
        </Box>
        <Box sx={{ gridColumnStart: 1, gridColumnEnd: 3 }}>
          <ExternalLink href={`https://dune.xyz/shadow/Olympus-(OHM)`}>
            <Typography style={{ marginLeft: "18px" }}>Shadow's Dune</Typography>
          </ExternalLink>
        </Box>
      </Box>
    </Box>
  );
}

export default InitialWalletView;
