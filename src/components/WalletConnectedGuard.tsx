import { Box, Typography } from "@mui/material";
import { useWeb3Context } from "src/hooks";

import ConnectButton from "./ConnectButton/ConnectButton";

export const WalletConnectedGuard: React.FC<{ message?: string }> = props => {
  const { connected } = useWeb3Context();

  if (!connected)
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
