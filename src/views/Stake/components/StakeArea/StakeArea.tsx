import { Box } from "@mui/material";
import { useState } from "react";
import { StakeInputArea } from "src/views/Stake/components/StakeArea/components/StakeInputArea/StakeInputArea";
import { useAccount } from "wagmi";

export const StakeArea: React.FC = () => {
  const [isZoomed, setIsZoomed] = useState(false);
  const { isConnected } = useAccount();

  return (
    <>
      <Box width="100%">
        <StakeInputArea isZoomed={isZoomed} />
      </Box>
    </>
  );
};
