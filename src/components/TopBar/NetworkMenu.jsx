import { Button, Typography } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./networkmenu.scss";
import Grid from "@material-ui/core/Grid";
import { useWeb3Context } from "src/hooks/web3Context";
import { NETWORKS } from "../../constants";

function NetworkMenu() {
  const { networkId, networkName } = useWeb3Context();
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
