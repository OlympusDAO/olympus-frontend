import { Box, Fade, Link, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { OHMTokenStackProps, WalletBalance } from "@olympusdao/component-library";
import { FC } from "react";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { formatCurrency, formatNumber, trim } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { prettifySeconds } from "src/helpers/timeUtil";
import { nonNullable } from "src/helpers/types/nonNullable";
import { useAppSelector } from "src/hooks";
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
import { IUserNote } from "src/slices/BondSliceV2";
import { useNextRebaseDate } from "src/views/Stake/components/StakeArea/components/RebaseTimer/hooks/useNextRebaseDate";

import { GetTokenPrice } from "../queries";
import Balances from "./Balances";
import TransactionHistory from "./TransactionHistory";

const useStyles = makeStyles<Theme>(theme => ({
  selector: {
    "& p": {
      fontSize: "16px",
      fontWeight: 400,
      fontFamily: "SquareMedium",
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
      color: theme.palette.type === "light" ? theme.palette.primary.main : theme.colors.primary[300],
      textDecoration: "inherit",
    },
  },
  forecast: {
    textAlign: "right",
    "& .number": {
      fontWeight: 400,
    },
    "& .numberSmall": {
      justifyContent: "flex-end",
    },
  },
}));

/**
 * Component for Displaying Assets
 */

export interface OHMAssetsProps {
  path?: string;
}
const AssetsIndex: FC<OHMAssetsProps> = (props: { path?: string }) => {
  const history = useHistory();
  const networks = useTestableNetworks();
  const { data: ohmPrice = 0 } = useOhmPrice();
  const { data: priceFeed = { usd_24h_change: -0 } } = GetTokenPrice();
  const { data: currentIndex = new DecimalBigNumber("0", 9) } = useCurrentIndex();
  const { data: nextRebaseDate } = useNextRebaseDate();
  const { data: rebaseRate = 0 } = useStakingRebaseRate();
  const { data: ohmBalance = new DecimalBigNumber("0", 9) } = useOhmBalance()[networks.MAINNET];
  const { data: v1OhmBalance = new DecimalBigNumber("0", 9) } = useV1OhmBalance()[networks.MAINNET];
  const { data: v1SohmBalance = new DecimalBigNumber("0", 9) } = useV1SohmBalance()[networks.MAINNET];
  const { data: sOhmBalance = new DecimalBigNumber("0", 9) } = useSohmBalance()[networks.MAINNET];
  const wsohmBalances = useWsohmBalance();
  const gohmBalances = useGohmBalance();
  const { data: gohmFuseBalance = new DecimalBigNumber("0", 18) } = useFuseBalance()[NetworkId.MAINNET];
  const { data: gohmTokemakBalance = new DecimalBigNumber("0", 18) } = useGohmTokemakBalance()[NetworkId.MAINNET];

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

  const totalGohmBalance = gohmTokens
    .filter(nonNullable)
    .reduce((res, bal) => res.add(bal), new DecimalBigNumber("0", 18));

  const totalWsohmBalance = wsohmTokens
    .filter(nonNullable)
    .reduce((res, bal) => res.add(bal), new DecimalBigNumber("0", 18));

  const accountNotes: IUserNote[] = useAppSelector(state => state.bondingV2.notes);
  const formattedohmBalance = ohmBalance.toString({ decimals: 4, trim: false, format: true });
  const formattedV1OhmBalance = v1OhmBalance.toString({ decimals: 4, trim: false, format: true });
  const formattedV1SohmBalance = v1SohmBalance.toString({ decimals: 4, trim: false, format: true });
  const formattedWsOhmBalance = totalWsohmBalance.toString({ decimals: 4, trim: false, format: true });
  const formattedgOhmBalance = totalGohmBalance.toString({ decimals: 4, trim: false, format: true });
  const formattedSOhmBalance = sOhmBalance.toString({ decimals: 4, trim: false, format: true });
  const gOhmPriceChange = priceFeed.usd_24h_change * currentIndex.toApproxNumber();
  const gOhmPrice = ohmPrice * currentIndex.toApproxNumber();
  const rebaseAmountPerDay = rebaseRate * Number(formattedSOhmBalance) * 3;
  const totalAsSohm = totalGohmBalance
    .mul(currentIndex)
    .add(totalWsohmBalance.mul(currentIndex))
    .add(sOhmBalance)
    .add(v1SohmBalance);

  const sOHMDailyForecast = formatNumber(totalAsSohm.toApproxNumber() * rebaseRate * 3, 2);
  const usdDailyForecast = formatCurrency(Number(sOHMDailyForecast) * ohmPrice, 2);

  const tokenArray = [
    {
      symbol: ["OHM"] as OHMTokenStackProps["tokens"],
      balance: formattedohmBalance,
      assetValue: Number(formattedohmBalance) * ohmPrice,
      alwaysShow: true,
    },
    {
      symbol: ["OHM"] as OHMTokenStackProps["tokens"],
      balance: formattedV1OhmBalance,
      label: "(v1)",
      assetValue: Number(formattedV1OhmBalance) * ohmPrice,
    },
    {
      symbol: ["sOHM"] as OHMTokenStackProps["tokens"],
      balance: formattedSOhmBalance,
      timeRemaining:
        nextRebaseDate && `Stakes in ${prettifySeconds((nextRebaseDate.getTime() - new Date().getTime()) / 1000)}`,
      assetValue: Number(formattedSOhmBalance) * ohmPrice,
      alwaysShow: true,
      lineThreeLabel: "Rebases per day",
      lineThreeValue:
        Number(formattedSOhmBalance) > 0
          ? `${trim(rebaseAmountPerDay, 3)} sOHM / ${formatCurrency(rebaseAmountPerDay * ohmPrice, 2)}`
          : undefined,
    },
    {
      symbol: ["sOHM"] as OHMTokenStackProps["tokens"],
      balance: formattedV1SohmBalance,
      label: "(v1)",
      timeRemaining:
        nextRebaseDate && `Stakes in ${prettifySeconds((nextRebaseDate.getTime() - new Date().getTime()) / 1000)}`,
      assetValue: Number(formattedV1SohmBalance) * ohmPrice,
    },
    {
      symbol: ["wsOHM"] as OHMTokenStackProps["tokens"],
      balance: formattedWsOhmBalance,
      assetValue: gOhmPrice * Number(formattedWsOhmBalance),
      geckoTicker: "governance-ohm",
    },
    {
      symbol: ["gOHM"] as OHMTokenStackProps["tokens"],
      balance: formattedgOhmBalance,
      assetValue: gOhmPrice * Number(formattedgOhmBalance),
      pnl: formattedgOhmBalance ? 0 : formatCurrency(totalGohmBalance.toApproxNumber() * gOhmPriceChange, 2),
      alwaysShow: true,
      geckoTicker: "governance-ohm",
    },
  ];

  const bondsArray = accountNotes.map((note, index) => ({
    key: index,
    symbol: note.bondIconSvg,
    balance: trim(note.payout, 4),
    label: "(Bond)",
    timeRemaining: note.timeLeft,
    assetValue: note.payout * gOhmPrice,
    underlyingSymbol: "gOHM",
    pnl: Number(note.payout) === 0 ? 0 : formatCurrency(note.payout * gOhmPriceChange, 2),
    ctaText: "Claim",
    ctaOnClick: () => history.push("/bonds"),
    geckoTicker: "governance-ohm",
  }));

  const classes = useStyles();

  const assets = [...tokenArray, ...bondsArray];
  const walletTotalValueUSD = Object.values(assets).reduce((totalValue, token) => totalValue + token.assetValue, 0);

  return (
    <Fade in={true}>
      <Box>
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <WalletBalance
            title="Balance"
            usdBalance={formatCurrency(walletTotalValueUSD, 2)}
            underlyingBalance={`${formatNumber(walletTotalValueUSD / ohmPrice, 2)} OHM`}
          />
          <WalletBalance
            className={classes.forecast}
            title="Today's Forecast"
            usdBalance={`+ ${usdDailyForecast}`}
            underlyingBalance={`+${sOHMDailyForecast} OHM`}
          />
        </Box>
        <Box display="flex" flexDirection="row" className={classes.selector} mb="18px" mt="18px">
          <Link exact component={NavLink} to="/wallet">
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
                  {assets.map(asset => (
                    <Balances token={asset} />
                  ))}
                </>
              );
          }
        })()}
      </Box>
    </Fade>
  );
};

export default AssetsIndex;
