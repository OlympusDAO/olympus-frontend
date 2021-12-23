import { useWeb3Context } from "src/hooks/web3Context";
import { Trans } from "@lingui/macro";
import { PrimaryButton } from "@olympusdao/component-library";
const ConnectButton = () => {
  const { connect } = useWeb3Context();
  return (
    <PrimaryButton size="large" onClick={connect}>
      <Trans>Connect Wallet</Trans>
    </PrimaryButton>
  );
};

export default ConnectButton;
