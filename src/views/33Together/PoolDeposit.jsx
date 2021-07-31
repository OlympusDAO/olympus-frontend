import React from "react";
import { Button } from "@material-ui/core";
import { useWeb3Context } from "../../hooks";

export const PoolDeposit = () => {
  const { provider, address, web3Modal, loadWeb3Modal } = useWeb3Context();

  let ConnectButton;
  if (web3Modal) {
    ConnectButton = (
      <Button variant="contained" color="primary" className="connect-button" onClick={loadWeb3Modal} key={1} fullWidth>
        Connect Wallet
      </Button>
    );
  }

  if (!address) {
    return ConnectButton;
  }

  return <div className="pool-deposit-ui">Deposite sOHM</div>;
};
