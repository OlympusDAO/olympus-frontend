import { Box, Typography } from "@material-ui/core";
import { useWeb3Context } from "src/hooks";

import ConnectButton from "./ConnectButton/ConnectButton";

export const WalletConnectedGuard: React.FC<{ message: string }> = props => {
  const { connected } = useWeb3Context();

  if (!connected)
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={6}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <ConnectButton />
          <Typography variant="h6">{props.message}</Typography>
        </Box>
      </Box>
    );

  return <>{props.children}</>;
};
