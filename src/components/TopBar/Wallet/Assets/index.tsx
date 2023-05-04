import { Box, Fade, FormControl, Link, MenuItem, Select, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { OHMTokenStackProps, SecondaryButton, WalletBalance } from "@olympusdao/component-library";
import { FC, useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Balances from "src/components/TopBar/Wallet/Assets/Balances";
import { TransactionHistory } from "src/components/TopBar/Wallet/Assets/TransactionHistory";
import { useFaucet } from "src/components/TopBar/Wallet/hooks/useFaucet";
import { GetTokenPrice } from "src/components/TopBar/Wallet/queries";
import { formatCurrency, formatNumber, isTestnet, trim } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { prettifySeconds, prettifySecondsInDays } from "src/helpers/timeUtil";
import { nonNullable } from "src/helpers/types/nonNullable";
import {
  useFuseBalance,
  useGohmBalance,
  useGohmTokemakBalance,
  useOhmBalance,
  useSohmBalance,
  useV1OhmBalance,
  useV1SohmBalance,
  useWsohmBalance,
} from "src/hooks/useBalance";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { useOhmPrice } from "src/hooks/usePrices";
import { useStakingRebaseRate } from "src/hooks/useStakingRebaseRate";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { NetworkId } from "src/networkDetails";
import { useBondNotes } from "src/views/Bond/components/ClaimBonds/hooks/useBondNotes";
import { useNextRebaseDate } from "src/views/Stake/components/StakeArea/components/RebaseTimer/hooks/useNextRebaseDate";
import { useNetwork } from "wagmi";

const PREFIX = "AssetsIndex";

const classes = {
  selector: `${PREFIX}-selector`,
  forecast: `${PREFIX}-forecast`,
  faucet: `${PREFIX}-faucet`,
};

const StyledFade = styled(Fade)(({ theme }) => ({
  [`& .${classes.selector}`]: {
    "& p": {
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: "24px",

      cursor: "pointer",
    },
    "& a": {
      color: theme.colors.gray[90],
      marginRight: "18px",
    },
    "& a:last-child": {
      marginRight: 0,
    },
    "& .active": {
      color: theme.palette.mode === "light" ? theme.palette.primary.main : theme.colors.primary[300],
      textDecoration: "inherit",
    },
  },

  [`& .${classes.forecast}`]: {
    textAlign: "right",
    "& .number": {
      fontWeight: 400,
    },
    "& .numberSmall": {
      justifyContent: "flex-end",
    },
  },

  [`& .${classes.faucet}`]: {
    width: "30%",
  },
}));

/**
 * Component for Displaying Assets
 */

export interface OHMAssetsProps {
  path?: string;
}
const AssetsIndex: FC<OHMAssetsProps> = (props: { path?: string }) => {
  const navigate = useNavigate();
  const networks = useTestableNetworks();
  const { chain = { id: 1 } } = useNetwork();
  const { data: ohmPrice = 0 } = useOhmPrice();
  const { data: priceFeed = { usd_24h_change: -0 } } = GetTokenPrice();
  const { data: currentIndex = new DecimalBigNumber("0", 9) } = useCurrentIndex();
  const { data: nextRebaseDate } = useNextRebaseDate();
  const { data: rebaseRate = 0 } = useStakingRebaseRate();
  const { data: v1OhmBalance = new DecimalBigNumber("0", 9) } = useV1OhmBalance()[networks.MAINNET];
  const { data: v1SohmBalance = new DecimalBigNumber("0", 9) } = useV1SohmBalance()[networks.MAINNET];
  const { data: sOhmBalance = new DecimalBigNumber("0", 9) } = useSohmBalance()[networks.MAINNET];
  const wsohmBalances = useWsohmBalance();
  const gohmBalances = useGohmBalance();
  const ohmBalances = useOhmBalance();
  const { data: gohmFuseBalance = new DecimalBigNumber("0", 18) } = useFuseBalance()[NetworkId.MAINNET];
  const { data: gohmTokemakBalance = new DecimalBigNumber("0", 18) } = useGohmTokemakBalance()[NetworkId.MAINNET];
  const [faucetToken, setFaucetToken] = useState("OHM V2");

  const ohmTokens = isTestnet(chain.id)
    ? [ohmBalances[NetworkId.TESTNET_GOERLI].data, ohmBalances[NetworkId.ARBITRUM_GOERLI].data]
    : [ohmBalances[NetworkId.MAINNET].data, ohmBalances[NetworkId.ARBITRUM].data];

  const gohmTokens = [
    gohmFuseBalance,
    gohmTokemakBalance,
    gohmBalances[networks.MAINNET].data,
    gohmBalances[NetworkId.ARBITRUM].data,
    gohmBalances[NetworkId.AVALANCHE].data,
    gohmBalances[NetworkId.POLYGON].data,
    gohmBalances[NetworkId.FANTOM].data,
    gohmBalances[NetworkId.OPTIMISM].data,
  ];
  const wsohmTokens = [
    wsohmBalances[NetworkId.MAINNET].data,
    wsohmBalances[NetworkId.ARBITRUM].data,
    wsohmBalances[NetworkId.AVALANCHE].data,
  ];

  const totalOhmBalance = ohmTokens
    .filter(nonNullable)
    .reduce((res, bal) => res.add(bal), new DecimalBigNumber("0", 18));

  const totalGohmBalance = gohmTokens
    .filter(nonNullable)
    .reduce((res, bal) => res.add(bal), new DecimalBigNumber("0", 18));

  const totalWsohmBalance = wsohmTokens
    .filter(nonNullable)
    .reduce((res, bal) => res.add(bal), new DecimalBigNumber("0", 18));

  const notes = useBondNotes().data;
  const formattedohmBalance = totalOhmBalance.toString({ decimals: 4, trim: false, format: true });
  const formattedV1OhmBalance = v1OhmBalance.toString({ decimals: 4, trim: false, format: true });
  const formattedV1SohmBalance = v1SohmBalance.toString({ decimals: 4, trim: false, format: true });
  const formattedWsOhmBalance = totalWsohmBalance.toString({ decimals: 4, trim: false, format: true });
  const formattedgOhmBalance = totalGohmBalance.toString({ decimals: 4, trim: false, format: true });
  const formattedSOhmBalance = sOhmBalance.toString({ decimals: 4, trim: false, format: true });
  const gOhmPriceChange = priceFeed.usd_24h_change * currentIndex.toApproxNumber();
  const gOhmPrice = ohmPrice * currentIndex.toApproxNumber();
  const rebaseAmountPerDay = rebaseRate * Number(formattedSOhmBalance) * 3;

  const tokenArray = [
    {
      symbol: ["OHM"] as OHMTokenStackProps["tokens"],
      balance: formattedohmBalance,
      assetValue: totalOhmBalance.toApproxNumber() * ohmPrice,
      alwaysShow: true,
    },
    {
      symbol: ["OHM"] as OHMTokenStackProps["tokens"],
      balance: formattedV1OhmBalance,
      label: "(v1)",
      assetValue: v1OhmBalance.toApproxNumber() * ohmPrice,
    },
    {
      symbol: ["sOHM"] as OHMTokenStackProps["tokens"],
      balance: formattedSOhmBalance,
      timeRemaining:
        nextRebaseDate && `Stakes in ${prettifySeconds((nextRebaseDate.getTime() - new Date().getTime()) / 1000)}`,
      assetValue: sOhmBalance.toApproxNumber() * ohmPrice,
      alwaysShow: true,
      lineThreeLabel: "Rebases per day",
      lineThreeValue: Number(formattedSOhmBalance) > 0 ? `${trim(rebaseAmountPerDay, 3)} sOHM ` : undefined,
    },
    {
      symbol: ["sOHM"] as OHMTokenStackProps["tokens"],
      balance: formattedV1SohmBalance,
      label: "(v1)",
      timeRemaining:
        nextRebaseDate && `Stakes in ${prettifySeconds((nextRebaseDate.getTime() - new Date().getTime()) / 1000)}`,
      assetValue: v1SohmBalance.toApproxNumber() * ohmPrice,
    },
    {
      symbol: ["wsOHM"] as OHMTokenStackProps["tokens"],
      balance: formattedWsOhmBalance,
      assetValue: gOhmPrice * totalWsohmBalance.toApproxNumber(),
      geckoTicker: "governance-ohm",
    },
    {
      symbol: ["gOHM"] as OHMTokenStackProps["tokens"],
      balance: formattedgOhmBalance,
      assetValue: gOhmPrice * totalGohmBalance.toApproxNumber(),
      pnl: formattedgOhmBalance ? 0 : formatCurrency(totalGohmBalance.toApproxNumber() * gOhmPriceChange, 2),
      alwaysShow: true,
      geckoTicker: "governance-ohm",
    },
  ];

  const bondsArray =
    notes?.map(note => ({
      key: note.id,
      symbol: note.bond.quoteToken.icons,
      balance: note.payout.toString({ decimals: 4, trim: false }),
      label: "(Bond)",
      timeRemaining:
        Date.now() > note.matured ? "Fully Vested" : prettifySecondsInDays((note.matured - Date.now()) / 1000),
      assetValue: note.payout.toApproxNumber() * gOhmPrice,
      underlyingSymbol: "gOHM",
      pnl: Number(note.payout) === 0 ? 0 : formatCurrency(note.payout.toApproxNumber() * gOhmPriceChange, 2),
      ctaText: "Claim",
      ctaOnClick: () => navigate("/bonds"),
      geckoTicker: "governance-ohm",
    })) || [];

  const assets = [...tokenArray, ...bondsArray];
  const walletTotalValueUSD = Object.values(assets).reduce((totalValue, token) => totalValue + token.assetValue, 0);

  const faucetMutation = useFaucet();
  const isFaucetLoading = faucetMutation.isLoading;

  return (
    <StyledFade in={true}>
      <Box>
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <WalletBalance
            title="Balance"
            usdBalance={formatCurrency(walletTotalValueUSD, 2)}
            underlyingBalance={`${formatNumber(walletTotalValueUSD / (ohmPrice !== 0 ? ohmPrice : 1), 2)} OHM`}
          />
        </Box>
        <Box display="flex" flexDirection="row" className={classes.selector} mb="18px" mt="18px">
          <Link component={NavLink} to="/wallet" end>
            <Typography>My Wallet</Typography>
          </Link>
          <Link component={NavLink} to="/wallet/history">
            <Typography>History</Typography>
          </Link>
        </Box>
        {(() => {
          switch (props.path) {
            case "history":
              return <TransactionHistory />;
            default:
              return (
                <>
                  {assets.map((asset, index) => (
                    <Balances key={index} token={asset} />
                  ))}
                </>
              );
          }
        })()}
        {chain.id === NetworkId.TESTNET_GOERLI && (
          <>
            <Typography variant="h5">Dev Faucet</Typography>
            <Box display="flex" flexDirection="row" justifyContent="space-between" mt="18px">
              <FormControl className={classes.faucet}>
                <Select
                  label="Contract"
                  id="contract-select"
                  value={faucetToken}
                  onChange={event => setFaucetToken(event.target.value)}
                >
                  <MenuItem value="OHM V1">OHM V1</MenuItem>
                  <MenuItem value="OHM V2">OHM V2</MenuItem>
                  <MenuItem value="sOHM V1">sOHM V1</MenuItem>
                  <MenuItem value="sOHM V2">sOHM V2</MenuItem>
                  <MenuItem value="wsOHM">wsOHM</MenuItem>
                  <MenuItem value="gOHM">gOHM</MenuItem>
                  <MenuItem value="DAI">DAI</MenuItem>
                  <MenuItem value="ETH">ETH</MenuItem>
                </Select>
              </FormControl>
              <SecondaryButton onClick={() => faucetMutation.mutate(faucetToken)}>
                {isFaucetLoading ? "Loading..." : "Get Tokens"}
              </SecondaryButton>
            </Box>
          </>
        )}
      </Box>
    </StyledFade>
  );
};

export default AssetsIndex;
