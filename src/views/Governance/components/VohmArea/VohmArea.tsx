import { Box, Divider } from "@mui/material";
import { MetricCollection } from "@olympusdao/component-library";
import { useState } from "react";
import { VohmInputArea } from "src/views/Governance/components/VohmArea/VohmInputArea/VohmInputArea";
import { StakeBalances } from "src/views/Stake/components/StakeArea/components/StakeBalances";
import { StakeFiveDayYield } from "src/views/Stake/components/StakeArea/components/StakeFiveDayYield";
import { StakeNextRebaseAmount } from "src/views/Stake/components/StakeArea/components/StakeNextRebaseAmount";
import { StakeRebaseYield } from "src/views/Stake/components/StakeArea/components/StakeRebaseYield";
import { useAccount } from "wagmi";

export const VohmArea: React.FC = () => {
  const [isZoomed, setIsZoomed] = useState(false);
  const { isConnected } = useAccount();

  return (
    <>
      {/* <PageTitle name="vOHM" /> */}
      <Box width="100%">
        <Box display="flex" flexDirection="row" width="100%" justifyContent="center">
          <Box display="flex" flexDirection="column" width="100%" maxWidth="521px" mb="28px">
            <MetricCollection>{/* <VotingPowerMetrics /> */}</MetricCollection>
          </Box>
        </Box>

        <VohmInputArea isZoomed={isZoomed} />
        {isConnected && (
          <Box display="flex" flexDirection="row" width="100%" justifyContent="center" mt="24px">
            <Box display="flex" flexDirection="column" width="100%" maxWidth="476px">
              <StakeBalances />
              <Divider />
              <StakeNextRebaseAmount />
              <StakeRebaseYield />
              <StakeFiveDayYield />
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};
