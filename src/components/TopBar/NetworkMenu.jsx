import { Button, Typography } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { useWeb3Context } from "../../hooks/web3Context";
import React, { useEffect, useState } from "react";
import "./networkmenu.scss";
import ethereum from "../../assets/tokens/wETH.svg";
import arbitrum from "../../assets/arbitrum.png";
import Grid from "@material-ui/core/Grid";

function NetworkMenu() {
  const { chainName } = useWeb3Context();
  const [name, setName] = useState("");
  const [image, setImage] = useState();

  const setChain = () => {
    setName(chainName);
    switch (chainName) {
      case "Ethereum":
        setImage(ethereum);
        break;
      case "Arbitrum":
        setImage(arbitrum);
        break;
    }
  };

  useEffect(() => {
    setChain();
  }, [chainName]);

  return (
    <Grid container className="network-menu-container">
      <Button
        aria-label="change-network"
        size="large"
        variant="contained"
        color="secondary"
        title="Change Network"
        component={NavLink}
        to="/network"
        className="network-menu-button"
      >
        <img src={image} alt={chainName} />
        <Typography className="network-menu-button-text">{name}</Typography>
      </Button>
    </Grid>
  );
}

export default NetworkMenu;
