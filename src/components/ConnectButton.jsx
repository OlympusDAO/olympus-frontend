import React from "react";
import { Button } from "@material-ui/core";
import { useWeb3Context } from "../hooks";

const ConnectButton = () => {
  const { connect } = useWeb3Context();

  return (
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} fullWidth>
      Connect Wallet
    </Button>
  );
};

export default ConnectButton;
