import { Box, Typography } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export const WalletConnectedGuard: React.FC<{ message?: string }> = props => {
  const { data: account } = useAccount();

  if (!account)
    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box mb="12px">
          <ConnectButton />
        </Box>

        <Typography variant="h6">{props.message}</Typography>
      </Box>
    );

  return <>{props.children}</>;
};
