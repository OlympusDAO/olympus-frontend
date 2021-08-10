import React from "react";
import { Box, Button, Typography } from "@material-ui/core";
import ConnectButton from "../../components/ConnectButton.jsx";
import { useWeb3Context } from "../../hooks";

export const PoolDeposit = () => {
  const { provider, address } = useWeb3Context();

  return (
    <Box display="flex" justifyContent="center" className="pool-deposit-ui">
      {!address ? <ConnectButton /> : <Typography>Deposit sOHM</Typography>}
    </Box>
  );
};
