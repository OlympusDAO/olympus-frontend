import "./networkmenu.scss";

import { Button, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import { NETWORKS } from "../../constants";

function NetworkMenu() {
  const networkId = useSelector(state => state.network.networkId);
  const networkName = useSelector(state => state.network.networkName);
  const [image, setImage] = useState();

  useEffect(() => {
    if (NETWORKS[networkId]) setImage(NETWORKS[networkId].image);
  }, [networkId]);

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
        <Typography className="network-menu-button-text">{networkName}</Typography>
      </Button>
    </Grid>
  );
}

export default NetworkMenu;
