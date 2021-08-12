import { Box, Typography } from "@material-ui/core";
import ConnectButton from "../../components/ConnectButton.jsx";
import { useWeb3Context } from "../../hooks";

export const PoolWithdraw = () => {
  const { provider, address } = useWeb3Context();

  return (
    <Box display="flex" justifyContent="center" className="pool-withdraw-ui">
      {!address ? <ConnectButton /> : <Typography>Withdraw sOHM</Typography>}
    </Box>
  );
};
