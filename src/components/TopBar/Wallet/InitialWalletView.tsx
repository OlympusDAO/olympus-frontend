import { Component, ReactElement, useState } from "react";
import {
  useTheme,
  makeStyles,
  withStyles,
  SvgIcon,
  Button,
  Typography,
  Box,
  Divider,
  IconButton,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { ReactComponent as CloseIcon } from "src/assets/icons/x.svg";
import { ReactComponent as ArrowUpIcon } from "src/assets/icons/arrow-up.svg";
import { ReactComponent as wethTokenImg } from "src/assets/tokens/wETH.svg";
import { ReactComponent as fraxTokenImg } from "src/assets/tokens/FRAX.svg";
import { ReactComponent as daiTokenImg } from "src/assets/tokens/DAI.svg";
import { ReactComponent as wsOhmTokenImg } from "src/assets/tokens/token_wsOHM.svg";
import { ReactComponent as arrowDown } from "src/assets/icons/arrow-down.svg";
import { addresses, TOKEN_DECIMALS } from "src/constants";
import { formatCurrency } from "src/helpers";
import { useAppSelector, useWeb3Context } from "src/hooks";
import useCurrentTheme from "src/hooks/useTheme";

import { dai, frax } from "src/helpers/AllBonds";

import { Tokens, useWallet } from "./Token";

const Borrow = ({
  Icon1,
  borrowableTokensIcons,
  borrowOn,
  href,
}: {
  Icon1: typeof Component;
  borrowableTokensIcons: typeof Component[];
  borrowOn: string;
  href: string;
}) => {
  const theme = useTheme();
  return (
    <ExternalLink href={href}>
      <Box sx={{ display: "flex", flexDirection: "column", padding: theme.spacing(1, 0) }}>
        <Box sx={{ display: "flex", alignItems: "center", flexDirection: "row-reverse", justifyContent: "flex-end" }}>
          {borrowableTokensIcons.map((Icon, i, arr) => (
            <Icon style={{ height: "24px", width: "24px", ...(arr.length !== i + 1 && { marginLeft: "-8px" }) }} />
          ))}
          <SvgIcon
            component={arrowDown}
            viewBox="-12 -12 48 48"
            style={{ height: "24px", width: "24px", transform: "rotate(270deg)" }}
          />
          <Icon1 style={{ height: "24px", width: "24px" }} />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", marginTop: theme.spacing(1) }}>
          <Box sx={{ display: "flex", flexDirection: "column", textAlign: "right", marginRight: theme.spacing(0.5) }}>
            <Typography align="left" style={{ maxWidth: "90px", whiteSpace: "break-spaces" }}>
              Borrow on {borrowOn}
            </Typography>
          </Box>
        </Box>
      </Box>
    </ExternalLink>
  );
};

const ExternalLink = ({ href, children, color }: { href: string; children: ReactElement; color?: any }) => {
  const theme = useTheme();
  return (
    <Button
      href={href}
      color={color}
      variant="outlined"
      style={{ padding: theme.spacing(1), maxHeight: "100%", height: "100%" }}
      fullWidth
    >
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
            htmlColor={color === "textSecondary" ? theme.palette.text.secondary : ""}
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
    </Button>
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

const useStyles = makeStyles({
  totalValue: {
    fontWeight: 700,
  },
  myWallet: {
    lineHeight: 1.1,
    fontWeight: 600,
  },
});

const CloseButton = withStyles(theme => ({
  root: {
    ...theme.overrides?.MuiButton?.containedSecondary,
    width: "30px",
    height: "30px",
  },
}))(IconButton);

const WalletTotalValue = () => {
  const tokens = useWallet();
  const styles = useStyles();
  const isLoading = useAppSelector(s => s.account.loading || s.app.loadingMarketPrice || s.app.loading);
  const marketPrice = useAppSelector(s => s.app.marketPrice || 0);
  const [currency, setCurrency] = useState<"USD" | "OHM">("USD");

  const walletNetworkValueUSD = Object.values(tokens).reduce(
    (totalValue, token) => totalValue + parseFloat(token.balance) * token.price,
    0,
  );
  const walletTotalValueUSD = Object.values(tokens).reduce((totalValue, token) => {
    const allChainsBalance = !!token.crossChainBalances
      ? Object.values(token.crossChainBalances).reduce((sum, b) => sum + parseFloat(b), 0)
      : null;
    return totalValue + (allChainsBalance || parseFloat(token.balance)) * token.price;
  }, 0);
  const walletValue = {
    USD: walletTotalValueUSD,
    OHM: walletTotalValueUSD / marketPrice,
  };
  return (
    <Box onClick={() => setCurrency(currency === "USD" ? "OHM" : "USD")}>
      <Typography className={styles.myWallet} color="textSecondary">
        MY WALLET
      </Typography>
      <Typography className={styles.totalValue} variant="h4">
        {!isLoading ? formatCurrency(walletValue[currency], 2, currency) : <Skeleton variant="text" width={100} />}
      </Typography>
    </Box>
  );
};

function InitialWalletView({ onClose }: { onClose: () => void }) {
  const theme = useTheme();
  const [currentTheme] = useCurrentTheme();
  const styles = useStyles();

  // we can check if network has been initialized but I think just defaulting to mainnet while it's not initialized is fine
  const networkId = useAppSelector(({ network: { networkId, initialized } }) => (initialized ? networkId : 1));

  return (
    <Box sx={{ padding: theme.spacing(0, 3), display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", padding: theme.spacing(2, 0) }}>
        <WalletTotalValue />
        <CloseButton size="small" onClick={onClose} aria-label="close wallet">
          <SvgIcon component={CloseIcon} color="primary" style={{ width: "15px", height: "15px" }} />
        </CloseButton>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column" }} style={{ gap: theme.spacing(1) }}>
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
        }}
        style={{ gap: theme.spacing(1.5) }}
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
          href={`https://app.rari.capital/fuse/pool/18`}
          borrowOn="Rari Capital"
          borrowableTokensIcons={[wethTokenImg, daiTokenImg, fraxTokenImg]}
          Icon1={wsOhmTokenImg}
        />
        <Box style={{ gridColumnStart: 1, gridColumnEnd: 3 }}>
          <ExternalLink href={`https://dune.xyz/0xrusowsky/Olympus-Wallet-History`}>
            <Typography align="center">Rusowsky's dashboard</Typography>
          </ExternalLink>
        </Box>
        <Box style={{ gridColumnStart: 1, gridColumnEnd: 3 }}>
          <ExternalLink href={`https://dune.xyz/shadow/Olympus-(OHM)`}>
            <Typography align="center">Shadow's dashboard</Typography>
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
