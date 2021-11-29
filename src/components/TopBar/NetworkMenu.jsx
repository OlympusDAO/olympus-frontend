import { Button, Typography } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./networkmenu.scss";
import ethereum from "../../assets/tokens/wETH.svg";
import arbitrum from "../../assets/arbitrum.png";
import avalanche from "../../assets/tokens/AVAX.svg";
import Grid from "@material-ui/core/Grid";
import { useSelector } from "react-redux";

function NetworkMenu() {
  const networkId = useSelector(state => state.network.networkId);
  const networkName = useSelector(state => state.network.networkName);
  const [image, setImage] = useState();

  useEffect(() => {
    switch (networkId) {
      case 1:
      case 4:
        setImage(ethereum);
        break;
      case 42161:
      case 421611:
        setImage(arbitrum);
        break;
      case 43113:
      case 43114:
        setImage(avalanche);
        break;
    }
  }, [networkName]);

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
        <img src={image} alt={networkName} />
        <Typography className="network-menu-button-text">{name}</Typography>
      </Button>
    </Grid>
  );
}

export default NetworkMenu;
