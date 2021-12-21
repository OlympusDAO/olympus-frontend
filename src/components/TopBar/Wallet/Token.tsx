import { useState } from "react";
import {
  SvgIcon,
  Button,
  Typography,
  Box,
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails,
  withStyles,
  useTheme,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import { useAppSelector } from "src/hooks";
import { useWeb3Context } from "src/hooks/web3Context";
import { addresses, NETWORKS } from "src/constants";
import { formatCurrency } from "src/helpers";
import { RootState } from "src/store";
import { NetworkID } from "src/lib/Bond";

import { ReactComponent as MoreIcon } from "src/assets/icons/more.svg";
import OhmImg from "src/assets/tokens/token_OHM.svg";
import SOhmImg from "src/assets/tokens/token_sOHM.svg";
import WsOhmImg from "src/assets/tokens/token_wsOHM.svg";
import Token33tImg from "src/assets/tokens/token_33T.svg";
import GOhmImg from "src/assets/tokens/gohm.png";

import { segmentUA } from "src/helpers/userAnalyticHelpers";
import { t } from "@lingui/macro";

import { useQuery } from "react-query";
import { fetchCrossChainBalances } from "src/lib/fetchBalances";
import { BigNumber } from "ethers";

const Accordion = withStyles({
  root: {
    backgroundColor: "transparent",
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
  icon: string;
  balance: string;
  price: number;
  crossChainBalances?: { balances: Record<NetworkID, string>; isLoading: boolean };
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
  onChangeExpanded: (event: React.ChangeEvent<{}>, isExpanded: boolean) => void;
  onAddTokenToWallet: () => void;
}

const BalanceValue = ({
  balance,
  balanceValueUSD,
  isLoading = false,
}: {
  balance: string;
  balanceValueUSD: number;
  isLoading?: boolean;
}) => (
  <Box sx={{ textAlign: "right", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
    <Typography variant="body2" style={{ fontWeight: 600 }}>
      {!isLoading ? balance.substring(0, 5) : <Skeleton variant="text" width={50} />}
    </Typography>
    <Typography variant="body2" color="textSecondary">
      {!isLoading ? formatCurrency(balanceValueUSD, 2) : <Skeleton variant="text" width={50} />}
    </Typography>
  </Box>
);

const sumAllChainsBalances = (crossChainBalances: IToken["crossChainBalances"]) =>
  crossChainBalances?.balances &&
  Object.values(crossChainBalances.balances)
    .reduce((sum, b = "0") => sum + parseFloat(b), 0)
    .toString();

export const Token = ({
  symbol,
  icon,
  balance = "0.0",
  price = 0,
  crossChainBalances,
  onAddTokenToWallet,
  expanded,
  onChangeExpanded,
}: TokenProps) => {
  const theme = useTheme();
  const isLoading = useAppSelector(s => s.account.loading || s.app.loadingMarketPrice || s.app.loading);
  const allChainsBalance = sumAllChainsBalances(crossChainBalances);
  const totalBalance = allChainsBalance || balance;
  const balanceValue = parseFloat(totalBalance) * price;
  return (
    <Accordion expanded={expanded} onChange={onChangeExpanded}>
      <AccordionSummary expandIcon={<SvgIcon component={MoreIcon} color="disabled" />}>
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <img src={icon} style={{ height: "28px", width: "28px", marginRight: theme.spacing(1) }} />
          <Typography>{symbol}</Typography>
        </Box>
        <BalanceValue
          balance={totalBalance}
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
                  <Typography key={networkId}>
                    {NETWORKS[networkId as any].chainName}:
                    <BalanceValue balance={balance} balanceValueUSD={parseFloat(balance) * price} />
                  </Typography>
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
        <img src={icon} style={{ height: "28px", width: "28px", marginRight: theme.spacing(1) }} />
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

const tokensSelector = (state: RootState) => {
  // default to mainnet while not initialized
  const networkId = state.network.initialized ? state.network.networkId : NetworkID.Mainnet;
  return {
    ohmV1: {
      symbol: "OHM V1",
      address: addresses[networkId].OHM_ADDRESS,
      balance: state.account.balances.ohmV1,
      price: state.app.marketPrice || 0,
      icon: OhmImg,
      decimals: 9,
    },
    sohmV1: {
      symbol: "sOHM V1",
      address: addresses[networkId].SOHM_ADDRESS,
      balance: state.account.balances.sohmV1,
      price: state.app.marketPrice || 0,
      icon: SOhmImg,
      decimals: 9,
    },
    ohm: {
      symbol: "OHM",
      address: addresses[networkId].OHM_V2,
      balance: state.account.balances.ohm,
      price: state.app.marketPrice || 0,
      icon: OhmImg,
      decimals: 9,
    },
    sohm: {
      symbol: "sOHM",
      address: addresses[networkId].SOHM_V2,
      balance: state.account.balances.sohm,
      price: state.app.marketPrice || 0,
      icon: SOhmImg,
      decimals: 9,
    },
    wsohm: {
      symbol: "wsOHM",
      address: addresses[networkId].WSOHM_ADDRESS,
      balance: state.account.balances.wsohm,
      price: (state.app.marketPrice || 0) * Number(state.app.currentIndex),
      icon: WsOhmImg,
      decimals: 18,
    },
    pool: {
      symbol: "33T",
      address: addresses[networkId].PT_TOKEN_ADDRESS,
      balance: state.account.balances.pool,
      price: state.app.marketPrice || 0,
      icon: Token33tImg,
      decimals: 9,
    },
    gohm: {
      symbol: "gOHM",
      address: addresses[networkId].GOHM_ADDRESS,
      balance: state.account.balances.gohm,
      price: (state.app.marketPrice || 0) * Number(state.app.currentIndex),
      icon: GOhmImg,
      decimals: 18,
    },
  };
};

export const useWallet = () => {
  const { address: userAddress } = useWeb3Context();
  const tokens = useAppSelector(tokensSelector);
  const { gohm, wsohm, isLoading } = useCrossChainBalances(userAddress);
  return {
    ...tokens,
    gohm: {
      ...tokens.gohm,
      crossChainBalances: { balances: gohm, isLoading },
    },
    wsohm: {
      ...tokens.wsohm,
      crossChainBalances: { balances: wsohm, isLoading },
    },
  } as { [key: string]: IToken };
};

export const useCrossChainBalances = (address: string) => {
  const { isLoading, data } = useQuery(["crossChainBalances", address], () => fetchCrossChainBalances(address), {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return { isLoading, ...data };
};

export const Tokens = () => {
  const { address: userAddress } = useWeb3Context();
  const tokens = useWallet();
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
          token => parseFloat(token.balance) > 0.01 && <Token key={token.symbol} {...tokenProps(token)} />,
        )}
      {!isLoading &&
        v1Tokens.map(token => parseFloat(token.balance) > 0.01 && <MigrateToken {...token} key={token.symbol} />)}
    </>
  );
};
