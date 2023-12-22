import { Box, Divider, Link, SvgIcon, Typography, useTheme } from "@mui/material";
import { PrimaryButton, SecondaryButton, TextButton, Token } from "@olympusdao/component-library";
import { Link as RouterLink } from "react-router-dom";
import WalletIcon from "src/assets/icons/wallet.svg?react";
import { formatCurrency } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useGohmBalance } from "src/hooks/useBalance";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { useOhmPrice } from "src/hooks/usePrices";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { NetworkId } from "src/networkDetails";

export const MyGohmBalances = ({ walletBalance }: { walletBalance?: DecimalBigNumber }) => {
  const gohmBalances = useGohmBalance();
  const { data: currentIndex = new DecimalBigNumber("0", 9) } = useCurrentIndex();
  const { data: ohmPrice = 0 } = useOhmPrice();
  const gOhmPrice = ohmPrice * currentIndex.toApproxNumber();

  const networks = useTestableNetworks();

  const crossChain = [
    {
      network: "ARBITRUM",
      balance: gohmBalances[NetworkId.ARBITRUM].data,
    },
    {
      network: "AVALANCHE",
      balance: gohmBalances[NetworkId.AVALANCHE].data,
    },
    {
      network: "POLYGON",
      balance: gohmBalances[NetworkId.POLYGON].data,
    },
    {
      network: "FANTOM",
      balance: gohmBalances[NetworkId.FANTOM].data,
    },
    {
      network: "OPTIMISM",
      balance: gohmBalances[NetworkId.OPTIMISM].data,
    },
    {
      network: "BOBA",
      balance: gohmBalances[NetworkId.BOBA].data,
    },
  ];
  const crossChainWithBalances = crossChain.filter(chain => chain.balance?.gt(new DecimalBigNumber("0")));
  const theme = useTheme();
  return (
    <Box mt="18px">
      <Box display="flex" gap={"3px"} alignItems="center" justifyContent="space-between">
        <Box display="flex" gap="6px">
          <SvgIcon component={WalletIcon} />
          <Typography fontWeight="500" fontSize="15px" lineHeight="24px">
            In Wallet
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="end" gap="3px">
          <Typography fontSize="15px" fontWeight="500" lineHeight="24px">
            {(walletBalance && Number(walletBalance.toString()).toFixed(4)) || "0.00 "}
            gOHM
          </Typography>
          <Typography fontSize="12px" fontWeight="450" lineHeight="12px" color={theme.colors.gray[40]}>
            {walletBalance ? formatCurrency(gOhmPrice * Number(walletBalance.toString()), 2) : "$0.00"}
          </Typography>
        </Box>
      </Box>
      <Box mt="3px">
        <Divider />
      </Box>
      <Box display="flex" gap="3px" justifyContent="space-between" mt={"9px"}>
        <Box display="flex" alignItems="center" gap="9px">
          <Box>
            <Token
              name={"ETH"}
              style={{ zIndex: 3, position: "absolute", marginLeft: "-3px", marginTop: "-3px", fontSize: "16px" }}
            />
            <Token name="gOHM" style={{ fontSize: "33px" }} />
          </Box>
          <Typography fontSize="15px" fontWeight="500" lineHeight="24px">
            {Number(gohmBalances[networks.MAINNET].data?.toString()).toFixed(4) || "0.00"} gOHM
          </Typography>
        </Box>
        <Link component={RouterLink} to="/stake?unstake=true">
          <PrimaryButton>Unwrap</PrimaryButton>
        </Link>
      </Box>
      {crossChainWithBalances.map(chain => {
        return (
          <Box display="flex" gap="3px" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap="9px">
              <Box>
                <Token
                  name={chain.network as any}
                  style={{ zIndex: 3, position: "absolute", marginLeft: "-3px", marginTop: "-3px", fontSize: "16px" }}
                />
                <Token name="gOHM" style={{ fontSize: "33px" }} />
              </Box>
              <Typography fontSize="15px" fontWeight="500" lineHeight="24px">
                {Number((chain.balance || new DecimalBigNumber("0")).toString()).toFixed(4) || "0.00"}
              </Typography>
            </Box>
            <Link component={RouterLink} to="/bridge">
              <SecondaryButton>Bridge</SecondaryButton>
            </Link>
          </Box>
        );
      })}
      <Box display="flex " justifyContent="center">
        <TextButton href="https://vote.olympusdao.finance/">Vote with gOHM</TextButton>
      </Box>
    </Box>
  );
};
