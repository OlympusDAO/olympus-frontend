import { PrimaryButton } from "@olympusdao/component-library";
import React from "react";
import { useWeb3Context } from "src/hooks/web3Context";

const ConnectButton: React.FC = () => {
  const { connect } = useWeb3Context();
  return (
    <PrimaryButton className="connect-button" onClick={connect}>
      Connect Wallet
    </PrimaryButton>
  );
};

export default ConnectButton;
