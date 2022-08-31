import { Box, Typography } from "@mui/material";
import { InPageConnectButton } from "src/components/ConnectButton/ConnectButton";
import { useAccount } from "wagmi";

export const WalletConnectedGuard: React.FC<{ message?: string }> = props => {
  const { isConnected } = useAccount();
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
