import { Box, Divider } from "@mui/material";
import { useState } from "react";
import PageTitle from "src/components/PageTitle";
import { StakeBalances } from "src/views/Stake/components/StakeArea/components/StakeBalances";
import { StakeInputArea } from "src/views/Stake/components/StakeArea/components/StakeInputArea/StakeInputArea";
import { useAccount } from "wagmi";

export const StakeArea: React.FC = () => {
  const [isZoomed, setIsZoomed] = useState(false);
  const { isConnected } = useAccount();

  return (
    <>
      <PageTitle name="Wrap" />
      <Box width="100%">
        <StakeInputArea isZoomed={isZoomed} />
        {isConnected && (
          <Box display="flex" flexDirection="row" width="100%" justifyContent="center" mt="24px">
            <Box display="flex" flexDirection="column" width="100%" maxWidth="476px">
              <StakeBalances />
              <Divider />
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};
