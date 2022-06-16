import { Trans } from "@lingui/macro";
import { PrimaryButton } from "@olympusdao/component-library";
import React from "react";
import { useWeb3Context } from "src/hooks/web3Context";

const ConnectButton: React.FC = () => {
  const { connect } = useWeb3Context();
  return (
    <PrimaryButton size="large" onClick={connect}>
      <Trans>Connect Wallet</Trans>
    </PrimaryButton>
  );
};

export default ConnectButton;
