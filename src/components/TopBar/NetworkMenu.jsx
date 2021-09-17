import { Button, Typography } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { useWeb3Context } from "../../hooks/web3Context";
import React, { useEffect, useState } from "react";
import "./networkmenu.scss";
import ethereum from "../../assets/ethereum.png";
import arbitrum from "../../assets/arbitrum.png";
import Grid from "@material-ui/core/Grid";

function NetworkMenu() {
  const { chainName } = useWeb3Context();
  const [name, setName] = useState("");
  const [image, setImage] = useState();

  useEffect(() => {
    setName(chainName);
    if (chainName === "Ethereum") {
      setImage(ethereum);
    } else if (chainName === "Arbitrum") {
      setImage(arbitrum);
    }
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
        <Typography className="network-menu-button-content">{name}</Typography>
      </Button>
    </Grid>
  );
}

export default NetworkMenu;
