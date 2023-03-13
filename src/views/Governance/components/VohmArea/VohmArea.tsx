import { Box } from "@mui/material";
import { useState } from "react";
import { VohmInputArea } from "src/views/Governance/components/VohmArea/VohmInputArea/VohmInputArea";
import { useAccount } from "wagmi";

export const VohmArea: React.FC = () => {
  const [isZoomed, setIsZoomed] = useState(false);
  const { isConnected } = useAccount();

  return (
    <>
      {/* <PageTitle name="vOHM" /> */}
      <Box width="100%">
        <VohmInputArea isZoomed={isZoomed} />
        {isConnected && (
          <Box display="flex" flexDirection="row" width="100%" justifyContent="center" mt="24px">
            <Box display="flex" flexDirection="column" width="100%" maxWidth="476px">
              {/* <StakeBalances />
              <Divider />
              <StakeNextRebaseAmount />
              <StakeRebaseYield />
              <StakeFiveDayYield /> */}
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};
