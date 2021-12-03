import { useTheme, makeStyles, withStyles } from "@material-ui/core";
import { ReactComponent as CloseIcon } from "src/assets/icons/x.svg";
import { ReactComponent as WalletIcon } from "src/assets/icons/wallet.svg";
import { ReactComponent as ArrowUpIcon } from "src/assets/icons/arrow-up.svg";
import { ReactComponent as wethTokenImg } from "src/assets/tokens/wETH.svg";
import { ReactComponent as ohmTokenImg } from "src/assets/tokens/token_OHM.svg";
import { ReactComponent as abracadabraTokenImg } from "src/assets/tokens/MIM.svg";
import rariTokenImg from "src/assets/tokens/RARI.png";
import { addresses, TOKEN_DECIMALS } from "src/constants";
import { formatCurrency } from "src/helpers";
import { useAppSelector, useWeb3Context } from "src/hooks";
import { SvgIcon, Button, Typography, Box, Divider, Link, IconButton } from "@material-ui/core";

import { dai, frax } from "src/helpers/AllBonds";

import { Tokens, useTokens } from "./Token";

const Borrow = ({ Icon1, Icon2, borrowOn, totalAvailable, href }) => {
  const theme = useTheme();
  const iconSize = "24px";
  return (
    <ExternalLink href={href}>
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
    <Button onClick={disconnect} variant="contained" size="small" color="secondary" fullWidth>
      <Typography variant="body2" color="textSecondary">
        Disconnect
        <SvgIcon
          component={WalletIcon}
          style={{ width: "15px", height: "15px", verticalAlign: "middle", marginLeft: "4px" }}
        />
      </Typography>
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
    ...theme.overrides.MuiButton.containedSecondary, // is this how it should be done? I am finding this styling patterns not very streight foward
    width: "30px",
    height: "30px",
  },
}))(IconButton);

const WalletTotalValue = ({ onChangeCurrency }) => {
  const tokens = useTokens();
  const styles = useStyles();
  return (
    <Box>
      <Typography className={styles.myWallet} color="textSecondary">
        MY WALLET
      </Typography>
      <Typography className={styles.totalValue} variant="h4">
        {formatCurrency(
          tokens.reduce((totalValue, token) => totalValue + parseFloat(token.balance) * token.price, 0),
          2,
        )}
      </Typography>
    </Box>
  );
};

function InitialWalletView({ onClose }) {
  const theme = useTheme();
  const styles = useStyles();
  const networkId = useAppSelector(state => state.network.networkId);
  return (
    <Box sx={{ padding: theme.spacing(0, 3) }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", padding: theme.spacing(2, 0) }}>
        <WalletTotalValue />
        <Box sx={{ display: "flex", flexWrap: "nowrap", alignSelf: "end", gap: theme.spacing(1) }}>
          <DisconnectButton />
          <CloseButton className={styles.closeButton} size="small" onClick={onClose} aria-label="close wallet">
            <SvgIcon component={CloseIcon} color="primary" style={{ width: "15px", height: "15px" }} />
          </CloseButton>
        </Box>
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
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "min-content",
          gap: theme.spacing(1.5),
        }}
      >
        <ExternalLink
          color="primary"
          href={`https://app.sushi.com/swap?inputCurrency=${dai.getAddressForReserve(networkId)}&outputCurrency=${
            addresses[networkId].OHM_ADDRESS
          }`}
        >
          <Typography align="left">Buy on Sushiswap</Typography>
        </ExternalLink>
        <ExternalLink
          color="primary"
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
