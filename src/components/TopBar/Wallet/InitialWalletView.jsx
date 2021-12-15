import { useState } from "react";
import {
  useTheme,
  makeStyles,
  withStyles,
  SvgIcon,
  Button,
  Typography,
  Box,
  Divider,
  Link,
  IconButton,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { ReactComponent as CloseIcon } from "src/assets/icons/x.svg";
import { ReactComponent as WalletIcon } from "src/assets/icons/wallet.svg";
import { ReactComponent as ArrowUpIcon } from "src/assets/icons/arrow-up.svg";
import { ReactComponent as wethTokenImg } from "src/assets/tokens/wETH.svg";
import { ReactComponent as ohmTokenImg } from "src/assets/tokens/token_OHM.svg";
import { ReactComponent as abracadabraTokenImg } from "src/assets/tokens/MIM.svg";
import { ReactComponent as arrowRight } from "src/assets/icons/arrow-down.svg";
import rariTokenImg from "src/assets/tokens/RARI.png";
import { addresses, TOKEN_DECIMALS } from "src/constants";
import { formatCurrency } from "src/helpers";
import { useAppSelector, useWeb3Context } from "src/hooks";
import useCurrentTheme from "src/hooks/useTheme";

import { dai, frax } from "src/helpers/AllBonds";

import { Tokens, useTokens } from "./Token";

const iconStyle = { height: "24px", width: "24px" };

const Borrow = ({ Icon1, Icon2, borrowOn, totalAvailable, href }) => {
  const theme = useTheme();
  return (
    <ExternalLink href={href}>
      <Box sx={{ display: "flex", flexDirection: "column", padding: theme.spacing(1, 0) }}>
        <Box sx={{ display: "flex", alignItems: "center", flexDirection: "row-reverse", justifyContent: "flex-end" }}>
          <Icon2 style={{ ...iconStyle, marginLeft: "-8px" }} />
          <Icon2 style={{ ...iconStyle, marginLeft: "-8px" }} />
          <Icon2 style={iconStyle} />
          <SvgIcon component={arrowRight} viewBox="-8 -12 48 48" style={iconStyle} />
          <Icon1 style={iconStyle} />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", marginTop: theme.spacing(1) }}>
          <Box sx={{ display: "flex", flexDirection: "column", textAlign: "right", marginRight: theme.spacing(0.5) }}>
            <Typography
              style={{
                wordWrap: "break-word",
                wordBreak: "break-all",
                maxWidth: "100%",
              }}
            >
              Borrow on {borrowOn}
            </Typography>
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

const ExternalLink = ({ href, children, color = "textSecondary" }) => {
  const theme = useTheme();
  return (
    <Link target="_blank" rel="noreferrer" href={href} style={{ width: "100%" }}>
      <ExternalLinkStyledButton color={color} variant="outlined" fullWidth>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box sx={{ width: "100%" }}>{children}</Box>
          <Box sx={{ display: "flex", alignSelf: "start" }}>
            <SvgIcon
              component={ArrowUpIcon}
              htmlColor={color === "textSecondary" && theme.palette.text.secondary}
              style={{
                position: "absolute",
                right: -2,
                top: -2,
                height: `18px`,
                width: `18px`,
                verticalAlign: "middle",
              }}
            />
          </Box>
        </Box>
      </ExternalLinkStyledButton>
    </Link>
  );
};

const DisconnectButton = () => {
  const { disconnect } = useWeb3Context();
  return (
    <Button onClick={disconnect} variant="contained" size="large" color="secondary">
      <Typography>Disconnect</Typography>
    </Button>
  );
};

const useStyles = makeStyles(theme => ({
  totalValue: {
    fontWeight: "700",
  },
  myWallet: {
    lineHeight: 1.1,
    fontWeight: "600",
  },
}));

const CloseButton = withStyles(theme => ({
  root: {
    ...theme.overrides.MuiButton.containedSecondary,
    width: "30px",
    height: "30px",
  },
}))(IconButton);

const WalletTotalValue = () => {
  const tokens = useTokens();
  const styles = useStyles();
  const marketPrice = useAppSelector(s => s.app.marketPrice);
  const [currency, setCurrency] = useState("USD");

  const walletValueUSD = tokens.reduce((totalValue, token) => totalValue + parseFloat(token.balance) * token.price, 0);
  const walletValue = {
    USD: walletValueUSD,
    OHM: walletValueUSD / marketPrice,
  };
  return (
    <Box onClick={() => setCurrency(currency === "USD" ? "OHM" : "USD")}>
      <Typography className={styles.myWallet} color="textSecondary">
        MY WALLET
      </Typography>
      <Typography className={styles.totalValue} variant="h4">
        {marketPrice && walletValueUSD ? (
          formatCurrency(walletValue[currency], 2, currency)
        ) : (
          <Skeleton variant="text" width={100} />
        )}
      </Typography>
    </Box>
  );
};

function InitialWalletView({ onClose }) {
  const theme = useTheme();
  const [currentTheme] = useCurrentTheme();
  const styles = useStyles();

  // we can check if network has been initialized but I think just defaulting to mainnet while it's not initialized is fine
  const networkId = useAppSelector(({ network: { networkId, initialized } }) => (initialized ? networkId : 1));

  return (
    <Box sx={{ padding: theme.spacing(0, 3), display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", padding: theme.spacing(2, 0) }}>
        <WalletTotalValue />
        <CloseButton className={styles.closeButton} size="small" onClick={onClose} aria-label="close wallet">
          <SvgIcon component={CloseIcon} color="primary" style={{ width: "15px", height: "15px" }} />
        </CloseButton>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: theme.spacing(1) }}>
        <Tokens />
      </Box>

      <Box sx={{ margin: theme.spacing(2, -3) }}>
        <Divider color="secondary" />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gridTemplateRows: "min-content",
          gap: theme.spacing(1.5),
        }}
      >
        <ExternalLink
          color={currentTheme === "dark" ? "primary" : undefined}
          href={`https://app.sushi.com/swap?inputCurrency=${dai.getAddressForReserve(networkId)}&outputCurrency=${
            addresses[networkId].OHM_ADDRESS
          }`}
        >
          <Typography align="left">Buy on Sushiswap</Typography>
        </ExternalLink>
        <ExternalLink
          color={currentTheme === "dark" ? "primary" : undefined}
          href={`https://app.uniswap.org/#/swap?inputCurrency=${frax.getAddressForReserve(networkId)}&outputCurrency=${
            addresses[networkId].OHM_ADDRESS
          }`}
        >
          <Typography align="left">Buy on Uniswap</Typography>
        </ExternalLink>
        <Borrow
          href={`https://abracadabra.money/pool/10`}
          borrowOn="Abracadabra"
          Icon1={ohmTokenImg}
          Icon2={abracadabraTokenImg}
        />
        <Borrow
          href={`https://app.rari.capital/fuse/pool/18`}
          borrowOn="Rari Capital"
          Icon1={ohmTokenImg}
          Icon2={props => <img src={rariTokenImg} {...props} />}
        />
        <Box sx={{ gridColumnStart: 1, gridColumnEnd: 3 }}>
          <ExternalLink href={`https://dune.xyz/0xrusowsky/Olympus-Wallet-History`}>
            <Typography style={{ marginLeft: "18px" }}>Rusowsky's dashboard</Typography>
          </ExternalLink>
        </Box>
        <Box sx={{ gridColumnStart: 1, gridColumnEnd: 3 }}>
          <ExternalLink href={`https://dune.xyz/shadow/Olympus-(OHM)`}>
            <Typography style={{ marginLeft: "18px" }}>Shadow's dashboard</Typography>
          </ExternalLink>
        </Box>
      </Box>

      <Box sx={{ marginTop: "auto", marginX: "auto", padding: theme.spacing(2) }}>
        <DisconnectButton />
      </Box>
    </Box>
  );
}

export default InitialWalletView;
