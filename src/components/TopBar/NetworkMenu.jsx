import { Button, Link, Typography } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import Box from "@material-ui/core/Box";
import { useWeb3Context } from "../../hooks/web3Context";
import { useEffect, useState } from "react";

function NetworkMenu() {
  const { chainName } = useWeb3Context();
  const [name, setName] = useState("");

  useEffect(() => {
    setName(chainName);
  }, [chainName]);

  return (
    <Box component="div">
      <Button
        aria-label="change-network"
        size="large"
        variant="contained"
        color="secondary"
        title="Change Network"
        component={NavLink}
        to="/network"
      >
        <Typography>{name}</Typography>
      </Button>
    </Box>
  );
}

export default NetworkMenu;
