import { Box, Typography } from "@mui/material";
import { useConnect } from "wagmi";

import { InPageConnectButton } from "./ConnectButton/ConnectButton";

export const WalletConnectedGuard: React.FC<{ message?: string }> = props => {
  const { isConnected } = useConnect();
  if (!isConnected)
    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box mb="12px">
          <InPageConnectButton />
        </Box>

        <Typography variant="h6">{props.message}</Typography>
      </Box>
    );

  return <>{props.children}</>;
};
