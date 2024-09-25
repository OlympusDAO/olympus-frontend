import { Box, Typography } from "@mui/material";
import { InPageConnectButton } from "src/components/ConnectButton/ConnectButton";
import { useAccount } from "wagmi";

export const WalletConnectedGuard: React.FC<{
  message?: string;
  fullWidth?: boolean;
  children: any;
  buttonText?: string;
}> = props => {
  const { isConnected } = useAccount();
  if (!isConnected)
    return (
      <>
        <InPageConnectButton fullWidth={props.fullWidth} buttonText={props.buttonText} />

        {props.message && (
          <Box mt="12px">
            <Typography variant="h6">{props.message}</Typography>
          </Box>
        )}
      </>
    );

  return <>{props.children}</>;
};
