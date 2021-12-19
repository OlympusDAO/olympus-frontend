import { useWeb3Context } from "src/hooks/web3Context";
import { Trans } from "@lingui/macro";
import ButtonComponent from "./Button/ButtonComponent";
const ConnectButton = () => {
  const { connect } = useWeb3Context();
  return (
    <ButtonComponent size="large" onClick={connect}>
      <Trans>Connect Wallet</Trans>
    </ButtonComponent>
  );
};

export default ConnectButton;
