import { Box, Grid, Skeleton, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Metric, Token } from "@olympusdao/component-library";
import { FC } from "react";
import { DevFaucet } from "src/components/DevFaucet";
import PageTitle from "src/components/PageTitle";
import WalletBalance from "src/components/WalletBalance/WalletBalance";
import { formatCurrency, formatNumber, isTestnet } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { nonNullable } from "src/helpers/types/nonNullable";
import {
  useGohmBalance,
  useOhmBalance,
  useSohmBalance,
  useV1OhmBalance,
  useV1SohmBalance,
  useWsohmBalance,
} from "src/hooks/useBalance";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { useOhmPrice } from "src/hooks/usePrices";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { NetworkId } from "src/networkDetails";
import { useGetClearingHouse } from "src/views/Lending/Cooler/hooks/useGetClearingHouse";
import { useGetCoolerBalance } from "src/views/Lending/Cooler/hooks/useGetCoolerBalance";
import { useGetCoolerForWallet } from "src/views/Lending/Cooler/hooks/useGetCoolerForWallet";
import { LearnAboutGohm } from "src/views/MyBalances/LearnAboutGohm";
import { LearnAboutOhm } from "src/views/MyBalances/LearnAboutOhm";
import { MyCoolerLoans } from "src/views/MyBalances/MyCoolerLoans";
import { MyGohmBalances } from "src/views/MyBalances/MyGohmBalances";
import { MyOhmBalances } from "src/views/MyBalances/MyOhmBalances";
import { useAccount, useNetwork } from "wagmi";

/**
 * Component for Displaying Assets
 */

export interface OHMAssetsProps {
  path?: string;
}
export const MyBalances: FC<OHMAssetsProps> = () => {
  const { address } = useAccount();
  const networks = useTestableNetworks();
  const { chain = { id: 1 } } = useNetwork();
  const { data: ohmPrice = 0 } = useOhmPrice();
  const { data: currentIndex = new DecimalBigNumber("0", 9) } = useCurrentIndex();
  const { data: v1OhmBalance = new DecimalBigNumber("0", 9) } = useV1OhmBalance()[networks.MAINNET];
  const { data: v1SohmBalance = new DecimalBigNumber("0", 9) } = useV1SohmBalance()[networks.MAINNET];
  const { data: sOhmBalance = new DecimalBigNumber("0", 9) } = useSohmBalance()[networks.MAINNET];
  const wsohmBalances = useWsohmBalance();
  const gohmBalances = useGohmBalance();
  const ohmBalances = useOhmBalance();
  const { data: clearingHouseV1 } = useGetClearingHouse({ clearingHouse: "clearingHouseV1" });
  const { data: clearingHouseV2 } = useGetClearingHouse({ clearingHouse: "clearingHouseV2" });
  const { data: coolerAddressV1 } = useGetCoolerForWallet({
    walletAddress: address,
    factoryAddress: clearingHouseV1?.factory,
    collateralAddress: clearingHouseV1?.collateralAddress,
    debtAddress: clearingHouseV1?.debtAddress,
    clearingHouseVersion: "clearingHouseV1",
  });
  const { data: coolerAddressV2 } = useGetCoolerForWallet({
    walletAddress: address,
    factoryAddress: clearingHouseV2?.factory,
    collateralAddress: clearingHouseV2?.collateralAddress,
    debtAddress: clearingHouseV2?.debtAddress,
    clearingHouseVersion: "clearingHouseV2",
  });

  const { data: coolerV1Balance } = useGetCoolerBalance({ coolerAddress: coolerAddressV1 });
  const { data: coolerV2Balance } = useGetCoolerBalance({ coolerAddress: coolerAddressV2 });

  const ohmTokens = isTestnet(chain.id)
    ? [ohmBalances[NetworkId.TESTNET_GOERLI].data, ohmBalances[NetworkId.ARBITRUM_GOERLI].data]
    : [ohmBalances[NetworkId.MAINNET].data, ohmBalances[NetworkId.ARBITRUM].data];

  const coolerTokens = [coolerV1Balance, coolerV2Balance];

  const gohmTokens = [
    gohmBalances[networks.MAINNET].data,
    gohmBalances[NetworkId.ARBITRUM].data,
    gohmBalances[NetworkId.AVALANCHE].data,
    gohmBalances[NetworkId.POLYGON].data,
    gohmBalances[NetworkId.FANTOM].data,
    gohmBalances[NetworkId.OPTIMISM].data,
  ];

  const gOHMAndCoolerTokens = [...gohmTokens, ...coolerTokens];
  const wsohmTokens = [
    wsohmBalances[NetworkId.MAINNET].data,
    wsohmBalances[NetworkId.ARBITRUM].data,
    wsohmBalances[NetworkId.AVALANCHE].data,
  ];

  const totalOhmBalance = ohmTokens
    .filter(nonNullable)
    .reduce((res, bal) => res.add(bal), new DecimalBigNumber("0", 18));

  const totalGohmBalance = gOHMAndCoolerTokens
    .filter(nonNullable)
    .reduce((res, bal) => res.add(bal), new DecimalBigNumber("0", 18));

  const gOhmWalletBalance = gohmTokens
    .filter(nonNullable)
    .reduce((res, bal) => res.add(bal), new DecimalBigNumber("0", 18));

  const totalWsohmBalance = wsohmTokens
    .filter(nonNullable)
    .reduce((res, bal) => res.add(bal), new DecimalBigNumber("0", 18));

  const totalCoolerBalance = coolerTokens
    .filter(nonNullable)
    .reduce((res, bal) => res.add(bal), new DecimalBigNumber("0", 18));

  const formattedohmBalance = totalOhmBalance.toString({ decimals: 4, trim: false, format: true });
  const formattedgOhmBalance = totalGohmBalance.toString({ decimals: 4, trim: false, format: true });
  const gOhmPrice = ohmPrice * currentIndex.toApproxNumber();
  const coolerBalance = totalCoolerBalance.toString({ decimals: 4, trim: false, format: true });

  const tokenArray = [
    {
      assetValue: totalOhmBalance.toApproxNumber() * ohmPrice,
    },
    {
      assetValue: v1OhmBalance.toApproxNumber() * ohmPrice,
    },
    {
      assetValue: sOhmBalance.toApproxNumber() * ohmPrice,
    },
    {
      assetValue: v1SohmBalance.toApproxNumber() * ohmPrice,
    },
    {
      assetValue: gOhmPrice * totalWsohmBalance.toApproxNumber(),
    },
    {
      assetValue: gOhmPrice * totalGohmBalance.toApproxNumber(),
    },
  ];

  const walletTotalValueUSD = Object.values(tokenArray).reduce((totalValue, token) => totalValue + token.assetValue, 0);
  const isMobileScreen = useMediaQuery("(max-width: 513px)");
  const theme = useTheme();
  const { isConnected } = useAccount();

  return (
    <div id="stake-view">
      <PageTitle name="My Balances" subtitle="Manage your OHM and gOHM balances" />
      <Box width="97%" maxWidth="974px">
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
          <Box display="flex" flexDirection="row" width="100%" justifyContent="center" mt="24px">
            <Box display="flex" flexDirection="column" width="100%">
              <Box>
                <Grid container spacing={2} justifyContent={"center"}>
                  <Grid item xs={6} sm={4}>
                    <Box display="flex" flexDirection="column" alignItems="center" gap="3px">
                      <Typography fontSize="18px" lineHeight="28px" color={theme.colors.gray["40"]}>
                        My Balances
                      </Typography>
                      <Box mt="-12px">
                        <WalletBalance
                          title=""
                          usdBalance={formatCurrency(walletTotalValueUSD, 2)}
                          underlyingBalance={`${formatNumber(
                            walletTotalValueUSD / (ohmPrice !== 0 ? ohmPrice : 1),
                            2,
                          )} OHM`}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Metric label="OHM Price" metric={ohmPrice ? formatCurrency(ohmPrice, 2) : <Skeleton />} />
                  </Grid>
                </Grid>
                <Box display="flex" flexDirection="row" justifyContent="space-between"></Box>
                <Box display="flex" flexWrap="wrap" justifyContent="space-between" mt="50px" gap="20px">
                  <Box position="relative" width={`${isMobileScreen ? "100%" : "48%"}`}>
                    <Box
                      borderRadius="9px"
                      padding="12px"
                      sx={{ backgroundColor: theme.colors.gray[700] }}
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                    >
                      <Box display="flex" gap={"3px"} alignItems="center" justifyContent="space-between">
                        <Box display="flex" gap="3px" alignItems="center">
                          <Token name="OHM" />
                          <Typography fontSize="24px" fontWeight="500" lineHeight="33px">
                            OHM
                          </Typography>
                        </Box>
                        <Box display="flex" flexDirection="column" alignItems="end" gap="3px">
                          <Typography fontSize="24px" fontWeight="500" lineHeight="33px">
                            {formattedohmBalance} OHM
                          </Typography>
                          <Typography fontSize="12px" fontWeight="450" lineHeight="12px" color={theme.colors.gray[40]}>
                            {formatCurrency(ohmPrice * Number(totalOhmBalance.toString()), 2)}
                          </Typography>
                        </Box>
                      </Box>
                      {Number(totalOhmBalance.toString()) > 0 ? <MyOhmBalances /> : <LearnAboutOhm />}
                    </Box>
                  </Box>
                  <Box position="relative" width={`${isMobileScreen ? "100%" : "48%"}`}>
                    <Box
                      borderRadius="12px"
                      padding="12px"
                      sx={{ backgroundColor: theme.colors.gray[700] }}
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                    >
                      <Box display="flex" gap={"3px"} alignItems="center" justifyContent="space-between">
                        <Box display="flex" gap="3px" alignItems="center">
                          <Token name="gOHM" />
                          <Typography fontSize="24px" fontWeight="500" lineHeight="33px">
                            gOHM
                          </Typography>
                        </Box>
                        <Box display="flex" flexDirection="column" alignItems="end" gap="3px">
                          <Typography fontSize="24px" fontWeight="500" lineHeight="33px">
                            {formattedgOhmBalance} gOHM
                          </Typography>
                          <Typography fontSize="12px" fontWeight="450" lineHeight="12px" color={theme.colors.gray[40]}>
                            {formatCurrency(gOhmPrice * Number(totalGohmBalance.toString()), 2)}
                          </Typography>
                        </Box>
                      </Box>
                      {Number(totalGohmBalance.toString()) > 0 ? (
                        <>
                          {Number(Number(gOhmWalletBalance.toString()).toFixed(4)) > 0 && (
                            <MyGohmBalances walletBalance={gOhmWalletBalance} />
                          )}
                          <MyCoolerLoans
                            balance={coolerBalance}
                            balanceUSD={formatCurrency(gOhmPrice * Number(totalCoolerBalance.toString()), 2)}
                          />
                        </>
                      ) : (
                        <LearnAboutGohm />
                      )}
                    </Box>
                  </Box>
                </Box>
                {chain.id === NetworkId.TESTNET_GOERLI && <DevFaucet />}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
};
