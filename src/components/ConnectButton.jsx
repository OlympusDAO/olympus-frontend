import { Button } from "@material-ui/core";
import { useWeb3Context } from "src/hooks/web3Context";
import { Trans } from "@lingui/macro";

const ConnectButton = () => {
  const { connect } = useWeb3Context();
  return (
    <Button variant="contained" color="primary" className="connect-button" onClick={connect}>
      <Trans>Connect Wallet</Trans>
    </Button>
  );
};

export default ConnectButton;
