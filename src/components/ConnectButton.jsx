import { Button } from "@material-ui/core";
import { useWeb3Context } from "src/hooks/web3Context";

const ConnectButton = () => {
  const { connect } = useWeb3Context();
  return (
    <Button variant="contained" color="primary" className="connect-button" onClick={connect}>
      Connect Wallet
    </Button>
  );
};

export default ConnectButton;
