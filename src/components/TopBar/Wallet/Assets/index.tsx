import { Box, Link, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { OHMTokenStackProps, WalletBalance } from "@olympusdao/component-library";
import { BigNumber } from "ethers";
import { FC } from "react";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { formatCurrency, parseBigNumber, trim } from "src/helpers";
import { prettifySeconds } from "src/helpers/timeUtil";
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
      color: theme.colors.primary[300],
      textDecoration: "inherit",
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
  const { data: currentIndex = 0 as unknown as BigNumber } = useCurrentIndex();
  const { data: nextRebaseDate } = useNextRebaseDate();
  const { data: rebaseRate = 0 } = useStakingRebaseRate();
  const { data: ohmBalance = 0 as unknown as BigNumber } = useOhmBalance()[networks.MAINNET];
  const { data: v1OhmBalance = 0 as unknown as BigNumber } = useV1OhmBalance()[networks.MAINNET];
  const { data: v1SohmBalance = 0 as unknown as BigNumber } = useV1SohmBalance()[networks.MAINNET];
  const { data: sOhmBalance = 0 as unknown as BigNumber } = useSohmBalance()[networks.MAINNET];
  const { data: wsOhmBalance = 0 as unknown as BigNumber } = useWsohmBalance()[networks.MAINNET];
  const { data: gOhmBalance = 0 as unknown as BigNumber } = useGohmBalance()[networks.MAINNET];
  const { data: fuseBalance = 0 as unknown as BigNumber } = useFuseBalance()[1];
  const { data: gohmTokemakBalance = 0 as unknown as BigNumber } = useGohmTokemakBalance()[1];

  const accountNotes: IUserNote[] = useAppSelector(state => state.bondingV2.notes);
  const formattedohmBalance = trim(parseBigNumber(ohmBalance), 4);
  const formattedV1OhmBalance = trim(parseBigNumber(v1OhmBalance), 4);
  const formattedV1SohmBalance = trim(parseBigNumber(v1SohmBalance), 4);
  const formattedWsOhmBalance = trim(parseBigNumber(wsOhmBalance), 4);
  const formattedgOhmBalance = trim(
    parseBigNumber(gOhmBalance, 18) + parseBigNumber(fuseBalance, 18) + parseBigNumber(gohmTokemakBalance, 18),
    4,
  );
  const formattedSOhmBalance = trim(parseBigNumber(sOhmBalance), 4);
  const gOhmPriceChange = priceFeed.usd_24h_change * parseBigNumber(currentIndex);
  const gOhmPrice = ohmPrice * parseBigNumber(currentIndex);
  const rebaseAmountPerDay = rebaseRate * Number(formattedSOhmBalance) * 3;
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
      lineThreeValue: `${trim(rebaseAmountPerDay, 3)} sOHM / ${formatCurrency(rebaseAmountPerDay * ohmPrice, 2)}`,
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
    },
    {
      symbol: ["gOHM"] as OHMTokenStackProps["tokens"],
      balance: formattedgOhmBalance,
      assetValue: gOhmPrice * Number(formattedgOhmBalance),
      pnl: Number(gOhmBalance) === 0 ? 0 : formatCurrency(parseBigNumber(gOhmBalance, 18) * gOhmPriceChange, 2),
      alwaysShow: true,
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
  }));

  const classes = useStyles();

  const assets = [...tokenArray, ...bondsArray];
  const walletTotalValueUSD = Object.values(assets).reduce((totalValue, token) => totalValue + token.assetValue, 0);

  return (
    <>
      <WalletBalance
        title="Balance"
        usdBalance={formatCurrency(walletTotalValueUSD, 2)}
        underlyingBalance={`${trim(walletTotalValueUSD / ohmPrice, 2)} OHM`}
      />
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
          case "assets":
            return <Balances assets={assets} />;
          default:
            return <Balances assets={assets} />;
        }
      })()}
    </>
  );
};

export default AssetsIndex;
