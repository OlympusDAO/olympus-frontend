import { Box, Divider, Typography } from "@material-ui/core";
import ConnectButton from "src/components/ConnectButton/ConnectButton";
import { useWeb3Context } from "src/hooks";

import { WrapBalances } from "./components/WrapBalances";
import { WrapInputArea } from "./components/WrapInputArea/WrapInputArea";
import { WrapSwitchNetwork } from "./components/WrapSwitchNetwork";

export const WrapActionArea = () => {
  const { address } = useWeb3Context();

  if (!address)
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={6}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <ConnectButton />
          <Typography variant="h6">Connect your wallet to wrap/unwrap your staked tokens</Typography>
        </Box>
      </Box>
    );

  return (
    <>
      <WrapInputArea />

      <WrapBalances />

      <Divider />

      <WrapSwitchNetwork />
    </>
  );
};
