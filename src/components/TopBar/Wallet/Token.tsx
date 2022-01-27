import { t } from "@lingui/macro";
import {
  Accordion as MuiAccordion,
  AccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  Box,
  Button,
  Typography,
  useTheme,
  withStyles,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Icon, OHMTokenProps, Token as TokenSVG } from "@olympusdao/component-library";
import { ChangeEvent, useState } from "react";
import { useQuery } from "react-query";
import { addresses, NETWORKS } from "src/constants";
import { NetworkId } from "src/constants";
import { formatCurrency } from "src/helpers";
import { segmentUA } from "src/helpers/userAnalyticHelpers";
import { useAppSelector } from "src/hooks";
import { useWeb3Context } from "src/hooks/web3Context";
import { fetchCrossChainBalances } from "src/lib/fetchBalances";

const Accordion = withStyles({
  root: {
    backgroundColor: "inherit",
    backdropFilter: "none",
    "-webkit-backdrop-filter": "none",
    boxShadow: "none",
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: 0,
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles(theme => ({
  root: {
    minHeight: "36px",
    height: "36px",
    padding: theme.spacing(0),
    "&$expanded": {
      padding: theme.spacing(0),
      minHeight: "36px",
    },
  },
  content: {
    margin: 0,
    "&$expanded": {
      margin: 0,
    },
  },
  expanded: {},
}))(MuiAccordionSummary);

export interface IToken {
  symbol: string;
  address: string;
  decimals: number;
  icon: OHMTokenProps["name"];
  balance: string;
  price: number;
  crossChainBalances?: { balances: Record<NetworkId, string>; isLoading: boolean };
  vaultBalances?: { [vaultName: string]: string };
  totalBalance: string;
}

const addTokenToWallet = async (token: IToken, userAddress: string) => {
  if (!window.ethereum) return;
  const host = window.location.origin;
  try {
    await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: token.address,
          symbol: token.symbol,
          decimals: token.decimals,
          image: `${host}/${token.icon}`,
        },
      },
    });
    segmentUA({
      address: userAddress,
      type: "Add Token",
      tokenName: token.symbol,
    });
  } catch (error) {
    console.log(error);
  }
};

interface TokenProps extends IToken {
  expanded: boolean;
  onChangeExpanded: (event: ChangeEvent<any>, isExpanded: boolean) => void;
  onAddTokenToWallet: () => void;
  decimals: number;
}

const BalanceValue = ({
  balance,
  balanceValueUSD,
  isLoading = false,
  sigFigs,
}: {
  balance: string;
  balanceValueUSD: number;
  isLoading?: boolean;
  sigFigs: number;
}) => (
  <Box sx={{ textAlign: "right", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
    <Typography variant="body2" style={{ fontWeight: 600 }}>
      {!isLoading ? balance.substring(0, sigFigs) : <Skeleton variant="text" width={50} />}
    </Typography>
    <Typography variant="body2" color="textSecondary">
      {!isLoading ? (
        formatCurrency(balanceValueUSD === NaN ? 0 : balanceValueUSD, 2)
      ) : (
        <Skeleton variant="text" width={50} />
      )}
    </Typography>
  </Box>
);

const TokenBalance = ({
  balanceLabel,
  balance,
  balanceValueUSD,
  sigFigs,
}: {
  balanceLabel: string;
  balance: string;
  balanceValueUSD: number;
  sigFigs: number;
}) => (
  <Box display="flex" flexDirection="row" justifyContent="space-between" key={balanceLabel}>
    <Typography color="textSecondary">{balanceLabel}</Typography>
    <Typography color="textSecondary">
      <BalanceValue balance={balance} sigFigs={sigFigs} balanceValueUSD={balanceValueUSD} />
    </Typography>
  </Box>
);

export const Token = ({
  symbol,
  decimals,
  icon,
  price = 0,
  crossChainBalances,
  vaultBalances,
  totalBalance,
  onAddTokenToWallet,
  expanded,
  onChangeExpanded,
}: TokenProps) => {
  const theme = useTheme();
  const isLoading = useAppSelector(s => s.account.loading || s.app.loadingMarketPrice || s.app.loading);
  const balanceValue = parseFloat(totalBalance) * price;

  // cleanedDecimals provides up to 7 sigFigs on an 18 decimal token (gOHM) & 5 sigFigs on 9 decimal Token
  const sigFigs = decimals === 18 ? 7 : 5;

  return (
    <Accordion expanded={expanded} onChange={onChangeExpanded}>
      <AccordionSummary expandIcon={<Icon name="more" color="disabled" />}>
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <TokenSVG name={icon} style={{ fontSize: 28, marginRight: theme.spacing(1) }} />
          <Typography>{symbol}</Typography>
        </Box>
        <BalanceValue
          balance={totalBalance}
          sigFigs={sigFigs}
          balanceValueUSD={balanceValue}
          isLoading={isLoading || crossChainBalances?.isLoading}
        />
      </AccordionSummary>
      <AccordionDetails style={{ margin: "auto", padding: theme.spacing(1, 0) }}>
        <Box
          sx={{ display: "flex", flexDirection: "column", flex: 1, mx: "32px", justifyContent: "center" }}
          style={{ gap: theme.spacing(1) }}
        >
          {!!crossChainBalances?.balances &&
            Object.entries(crossChainBalances.balances).map(
              ([networkId, balance]) =>
                parseFloat(balance) > 0.01 && (
                  <TokenBalance
                    balanceLabel={`${NETWORKS[networkId as any].chainName}:`}
                    balance={balance}
                    balanceValueUSD={parseFloat(balance) * price}
                    sigFigs={sigFigs}
                  />
                ),
            )}
          {!!vaultBalances &&
            Object.entries(vaultBalances).map(
              ([vaultName, balance]) =>
                parseFloat(balance) > 0.01 && (
                  <TokenBalance
                    balanceLabel={`${vaultName}:`}
                    balance={balance}
                    balanceValueUSD={parseFloat(balance) * price}
                    sigFigs={sigFigs}
                  />
                ),
            )}
          <Box className="ohm-pairs" style={{ width: "100%" }}>
            <Button variant="contained" color="secondary" fullWidth onClick={onAddTokenToWallet}>
              <Typography>{t`Add to Wallet`}</Typography>
            </Button>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export const MigrateToken = ({ symbol, icon, balance = "0.0", price = 0 }: IToken) => {
  const theme = useTheme();
  const balanceValue = parseFloat(balance) * price;
  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        <TokenSVG name={icon} style={{ fontSize: 28, marginRight: theme.spacing(1) }} />
        <Typography>{symbol}</Typography>
      </Box>
      {/* <Button variant="contained" color="primary" size="small" onClick={() => true}>
        Migrate v2
      </Button> */}
      <Box
        sx={{
          mx: theme.spacing(0.5),
          textAlign: "right",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body2" style={{ fontWeight: 600 }}>
          {balance.substring(0, 5)}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {formatCurrency(balanceValue, 2)}
        </Typography>
      </Box>
    </Box>
  );
};

const sumObjValues = (obj: Record<string, string> = {}) =>
  Object.values(obj).reduce((sum, b = "0.0") => sum + (parseFloat(b) || 0), 0);

export const useWallet = (
  userAddress: string,
  chainId: NetworkId,
  providerInitialized: boolean,
): Record<string, IToken> => {
  // default to mainnet while not initialized
  const networkId = providerInitialized ? chainId : NetworkId.MAINNET;

  const connectedChainBalances = useAppSelector(s => s.account.balances);
  const ohmPrice = useAppSelector(s => s.app.marketPrice);
  const currentIndex = useAppSelector(s => s.app.currentIndex);

  const { gohm, wsohm, isLoading } = useCrossChainBalances(userAddress);

  const tokens = {
    ohmV1: {
      symbol: "OHM V1",
      address: addresses[networkId].OHM_ADDRESS,
      balance: connectedChainBalances.ohmV1,
      price: ohmPrice || 0,
      icon: "OHM",
      decimals: 9,
    },
    sohmV1: {
      symbol: "sOHM V1",
      address: addresses[networkId].SOHM_ADDRESS,
      balance: connectedChainBalances.sohmV1,
      price: ohmPrice || 0,
      icon: "sOHM",
      decimals: 9,
    },
    ohm: {
      symbol: "OHM",
      address: addresses[networkId].OHM_V2,
      balance: connectedChainBalances.ohm,
      price: ohmPrice || 0,
      icon: "OHM",
      decimals: 9,
    },
    sohm: {
      symbol: "sOHM",
      address: addresses[networkId].SOHM_V2,
      balance: connectedChainBalances.sohm,
      price: ohmPrice || 0,
      vaultBalances: {
        "Fuse Olympus Pool Party": connectedChainBalances.fsohm,
      },
      icon: "sOHM",
      decimals: 9,
    },
    wsohm: {
      symbol: "wsOHM",
      address: addresses[networkId].WSOHM_ADDRESS,
      balance: connectedChainBalances.wsohm,
      price: (ohmPrice || 0) * Number(currentIndex || 0),
      crossChainBalances: { balances: wsohm, isLoading },
      icon: "wsOHM",
      decimals: 18,
    },
    pool: {
      symbol: "33T",
      address: addresses[networkId].PT_TOKEN_ADDRESS,
      balance: connectedChainBalances.pool,
      price: ohmPrice || 0,
      icon: "33T",
      decimals: 9,
    },
    gohm: {
      symbol: "gOHM",
      address: addresses[networkId].GOHM_ADDRESS,
      balance: connectedChainBalances.gohm,
      price: (ohmPrice || 0) * Number(currentIndex || 0),
      crossChainBalances: { balances: gohm, isLoading },
      vaultBalances: {
        "gOHM on Tokemak": connectedChainBalances.gOhmOnTokemak,
        "Fuse Olympus Pool Party": connectedChainBalances.fgohm,
      },
      icon: "wsOHM",
      decimals: 18,
    },
  } as Record<string, Omit<IToken, "totalBalance">>;

  return Object.entries(tokens).reduce((wallet, [key, token]) => {
    const crossChainBalances = sumObjValues(token.crossChainBalances?.balances);
    const vaultBalances = sumObjValues(token.vaultBalances);
    const balance = crossChainBalances || parseFloat(token.balance) || 0;
    return {
      ...wallet,
      [key]: {
        ...token,
        totalBalance: (balance + vaultBalances).toString(),
      } as IToken,
    };
  }, {});
};

export const useCrossChainBalances = (address: string) => {
  const { isLoading, data } = useQuery(["crossChainBalances", address], () => fetchCrossChainBalances(address), {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return { isLoading, ...data };
};

export const Tokens = () => {
  const { address: userAddress, networkId, providerInitialized } = useWeb3Context();
  const tokens = useWallet(userAddress, networkId, providerInitialized);
  const isLoading = useAppSelector(s => s.account.loading || s.app.loadingMarketPrice || s.app.loading);
  const [expanded, setExpanded] = useState<string | null>(null);

  const v1Tokens = [tokens.ohmV1, tokens.sohmV1];
  const alwaysShowTokens = [tokens.ohm, tokens.sohm, tokens.gohm];
  const onlyShowWhenBalanceTokens = [tokens.wsohm, tokens.pool];

  const tokenProps = (token: IToken) => ({
    ...token,
    expanded: expanded === token.symbol,
    onChangeExpanded: (e: any, isExpanded: boolean) => setExpanded(isExpanded ? token.symbol : null),
    onAddTokenToWallet: () => addTokenToWallet(token, userAddress),
  });

  return (
    <>
      {alwaysShowTokens.map(token => (
        <Token key={token.symbol} {...tokenProps(token)} />
      ))}
      {!isLoading &&
        onlyShowWhenBalanceTokens.map(
          token => parseFloat(token.totalBalance) > 0.01 && <Token key={token.symbol} {...tokenProps(token)} />,
        )}
      {!isLoading &&
        v1Tokens.map(token => parseFloat(token.totalBalance) > 0.01 && <MigrateToken {...token} key={token.symbol} />)}
    </>
  );
};
