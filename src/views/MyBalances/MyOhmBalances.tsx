import { Box, Divider, Link, SvgIcon, Typography } from "@mui/material";
import { PrimaryButton, SecondaryButton, Token } from "@olympusdao/component-library";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { ReactComponent as WalletIcon } from "src/assets/icons/wallet.svg";
import { MigrationNotification } from "src/components/MigrationNotification";
import { isTestnet } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { nonNullable } from "src/helpers/types/nonNullable";
import {
  useOhmBalance,
  useSohmBalance,
  useV1OhmBalance,
  useV1SohmBalance,
  useWsohmBalance,
} from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { NetworkId } from "src/networkDetails";
import { useNetwork } from "wagmi";

export const MyOhmBalances = ({ walletBalance }: { walletBalance?: DecimalBigNumber }) => {
  const { chain = { id: 1 } } = useNetwork();
  const networks = useTestableNetworks();
  const ohmBalances = useOhmBalance();
  const wsohmBalances = useWsohmBalance();
  const { data: v1OhmBalance = new DecimalBigNumber("0", 9) } = useV1OhmBalance()[networks.MAINNET];
  const { data: v1SohmBalance = new DecimalBigNumber("0", 9) } = useV1SohmBalance()[networks.MAINNET];
  const { data: sOhmBalance = new DecimalBigNumber("0", 9) } = useSohmBalance()[networks.MAINNET];
  const ohmTokens = isTestnet(chain.id)
    ? [ohmBalances[NetworkId.TESTNET_GOERLI].data, ohmBalances[NetworkId.ARBITRUM_GOERLI].data]
    : [ohmBalances[NetworkId.MAINNET].data, ohmBalances[NetworkId.ARBITRUM].data];

  const wsohmTokens = [
    wsohmBalances[NetworkId.MAINNET].data,
    wsohmBalances[NetworkId.ARBITRUM].data,
    wsohmBalances[NetworkId.AVALANCHE].data,
  ];

  const totalOhmBalance = ohmTokens
    .filter(nonNullable)
    .reduce((res, bal) => res.add(bal), new DecimalBigNumber("0", 18));

  const totalWsohmBalance = wsohmTokens
    .filter(nonNullable)
    .reduce((res, bal) => res.add(bal), new DecimalBigNumber("0", 18));

  const [modalOpen, setModalOpen] = useState(false);
  return (
    <Box mt="18px">
      <Box display="flex" gap={"3px"} alignItems="center" justifyContent="space-between">
        <Box display="flex" gap="6px">
          <SvgIcon component={WalletIcon} />
          <Typography fontWeight="500" fontSize="15px" lineHeight="24px">
            In Wallet
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
            <Token name="OHM" style={{ fontSize: "33px" }} />
          </Box>
          <Typography fontSize="15px" fontWeight="500" lineHeight="24px">
            {Number(ohmBalances[networks.MAINNET].data?.toString()).toFixed(4) || "0.00"} OHM
          </Typography>
        </Box>
        <Link component={RouterLink} to="/stake">
          <PrimaryButton>Wrap</PrimaryButton>
        </Link>
      </Box>
      {ohmBalances[networks.ARBITRUM].data?.gt(new DecimalBigNumber("0")) && (
        <Box display="flex" gap="3px" justifyContent="space-between" mt={"9px"}>
          <Box display="flex" alignItems="center" gap="9px">
            <Box>
              <Token
                name={"ARBITRUM"}
                style={{ zIndex: 3, position: "absolute", marginLeft: "-3px", marginTop: "-3px", fontSize: "16px" }}
              />
              <Token name="OHM" style={{ fontSize: "33px" }} />
            </Box>
            <Typography fontSize="15px" fontWeight="500" lineHeight="24px">
              {Number(ohmBalances[networks.ARBITRUM].data?.toString()).toFixed(4) || "0.00"} OHM
            </Typography>
          </Box>
          <Link component={RouterLink} to="/bridge">
            <SecondaryButton>Bridge</SecondaryButton>
          </Link>
        </Box>
      )}
      {sOhmBalance.gt(new DecimalBigNumber("0")) && (
        <Box display="flex" gap="3px" justifyContent="space-between" mt={"9px"}>
          <Box display="flex" alignItems="center" gap="9px">
            <Box>
              <Token
                name={"ETH"}
                style={{ zIndex: 3, position: "absolute", marginLeft: "-3px", marginTop: "-3px", fontSize: "16px" }}
              />
              <Token name="sOHM" style={{ fontSize: "33px" }} />
            </Box>
            <Typography fontSize="15px" fontWeight="500" lineHeight="24px">
              {Number(sOhmBalance.toString()).toFixed(4) || "0.00"} sOHM
            </Typography>
          </Box>
          <Link component={RouterLink} to="/stake">
            <SecondaryButton>Wrap</SecondaryButton>
          </Link>
        </Box>
      )}
      {v1OhmBalance.gt(new DecimalBigNumber("0")) && (
        <Box display="flex" gap="3px" justifyContent="space-between" mt={"9px"}>
          <Box display="flex" alignItems="center" gap="9px">
            <Box>
              <Token
                name={"ETH"}
                style={{ zIndex: 3, position: "absolute", marginLeft: "-3px", marginTop: "-3px", fontSize: "16px" }}
              />
              <Token name="OHM" style={{ fontSize: "33px" }} />
            </Box>
            <Typography fontSize="15px" fontWeight="500" lineHeight="24px">
              {Number(v1OhmBalance.toString()).toFixed(4) || "0.00"} OHM (v1)
            </Typography>
          </Box>
          <SecondaryButton
            onClick={() => {
              setModalOpen(true);
            }}
          >
            Migrate
          </SecondaryButton>
        </Box>
      )}
      {v1SohmBalance.gt(new DecimalBigNumber("0")) && (
        <Box display="flex" gap="3px" justifyContent="space-between" mt={"9px"}>
          <Box display="flex" alignItems="center" gap="9px">
            <Box>
              <Token
                name={"ETH"}
                style={{ zIndex: 3, position: "absolute", marginLeft: "-3px", marginTop: "-3px", fontSize: "16px" }}
              />
              <Token name="sOHM" style={{ fontSize: "33px" }} />
            </Box>
            <Typography fontSize="15px" fontWeight="500" lineHeight="24px">
              {Number(v1SohmBalance.toString()).toFixed(4) || "0.00"} sOHM (v1)
            </Typography>
          </Box>
          <SecondaryButton
            onClick={() => {
              setModalOpen(true);
            }}
          >
            Migrate
          </SecondaryButton>
        </Box>
      )}
      <MigrationNotification isModalOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  );
};
