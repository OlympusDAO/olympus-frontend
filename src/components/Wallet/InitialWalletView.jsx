import { useState } from "react";
import { useSelector } from "react-redux";
import { useTheme, makeStyles, withStyles } from "@material-ui/core";
import { trim } from "src/helpers";
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
import { SvgIcon, Button, Typography, Box, Drawer, Paper, Divider, Link } from "@material-ui/core";

import { dai, frax } from "src/helpers/AllBonds";

import { TokensList } from "./TokensList";

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
    htmlColor="#A3A3A3"
  />
);
const ExternalLink = props => <Link target="_blank" rel="noreferrer" {...props} />;

const Bond = ({ Icon1, Icon2, lpName }) => {
  const theme = useTheme();
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Icon1 style={{ height: "25px", width: "25px" }} />
        <Icon2 style={{ height: "25px", width: "25px" }} />
        <Box sx={{ display: "flex", flexDirection: "column", ml: "8px" }}>
          <Typography>{lpName}</Typography>
          <ExternalLink href="#">
            <Typography variant="body2" color="textSecondary">
              Get LP <ExternalLinkIcon size={16} />
            </Typography>
          </ExternalLink>
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", textAlign: "right" }}>
        <Button size="medium" color="secondary" variant="outlined" style={{ height: "28px" }}>
          <Typography variant="body2">Bond to Save 12%</Typography>
        </Button>
      </Box>
    </Box>
  );
};

const Bonds = () => {
  const theme = useTheme();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: theme.spacing(0.5) }}>
      <Bond Icon1={wethTokenImg} Icon2={wethTokenImg} lpName={`BANK-ETH SLP`} />
      <Typography align="right" variant="body2">
        View all bond discounts
      </Typography>
    </Box>
  );
};

const Borrow = ({ Icon1, Icon2, borrowOn, totalAvailable }) => {
  const theme = useTheme();
  return (
    <Button variant="contained" color="secondary" style={{ margin: theme.spacing(0, -2), background: "transparent" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Icon1 style={{ height: "25px", width: "25px" }} />
          <Icon2 style={{ height: "25px", width: "25px" }} />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ display: "flex", flexDirection: "column", textAlign: "right", marginRight: theme.spacing(0.5) }}>
            <Typography>Borrow on {borrowOn}</Typography>
            {totalAvailable && (
              <Typography variant="body2" color="textSecondary">
                {totalAvailable} Available
              </Typography>
            )}
          </Box>
          <ExternalLinkIcon />
        </Box>
      </Box>
    </Button>
  );
};

const MoreResources = () => {
  const { chainID, address } = useWeb3Context();

  return (
    <Box sx={{ display: "flex", flexWrap: "nowrap", flexDirection: "row", justifyContent: "space-between" }}>
      <ExternalLink
        href={`https://app.sushi.com/swap?inputCurrency=${dai.getAddressForReserve(chainID)}&outputCurrency=${
          addresses[chainID].OHM_ADDRESS
        }`}
      >
        <Button color="secondary">
          <Typography align="left" style={{ lineHeight: "20px", whiteSpace: "break-spaces" }}>
            Buy on <br />
            Sushiswap <ExternalLinkIcon />
          </Typography>
        </Button>
      </ExternalLink>

      <ExternalLink
        href={`https://app.uniswap.org/#/swap?inputCurrency=${frax.getAddressForReserve(chainID)}&outputCurrency=${
          addresses[chainID].OHM_ADDRESS
        }`}
      >
        <Button color="secondary">
          <Typography align="left" style={{ lineHeight: "20px", whiteSpace: "break-spaces" }}>
            Buy on <br />
            Uniswap <ExternalLinkIcon />
          </Typography>
        </Button>
      </ExternalLink>

      <ExternalLink href={`https://dune.xyz/0xrusowsky/Olympus-Wallet-History`}>
        <Button color="secondary">
          <Typography align="left" style={{ lineHeight: "20px", whiteSpace: "break-spaces" }}>
            Charts & <br />
            Analytics <ExternalLinkIcon />
          </Typography>
        </Button>
      </ExternalLink>
    </Box>
  );
};

const DisconnectButton = () => {
  const { disconnect } = useWeb3Context();
  return (
    <Button onClick={disconnect} variant="contained" size="large" color="secondary" fullWidth>
      <Typography>Disconnect</Typography>
    </Button>
  );
};

function InitialWalletView() {
  const theme = useTheme();
  const styles = useStyles();

  return (
    <Box sx={{ padding: theme.spacing(0, 3) }}>
      <Box className={styles.section}>
        <TokensList />
      </Box>

      <Divider color="secondary" className="less-margin" />

      <Box className={styles.section}>
        <Bonds />
      </Box>

      <Divider color="secondary" className="less-margin" />

      <Box className={styles.section}>
        <Borrow borrowOn="Abracadabra" Icon1={ohmTokenImg} Icon2={abracadabraTokenImg} />
        <Borrow borrowOn="Rari" Icon1={ohmTokenImg} Icon2={props => <img src={rariTokenImg} {...props} />} />
      </Box>

      <Divider color="secondary" className="less-margin" />

      <Box className={styles.section}>
        <MoreResources />
      </Box>

      <Box sx={{ marginTop: theme.spacing(2) }}>
        <DisconnectButton />
      </Box>
    </Box>
  );
}

export default InitialWalletView;
