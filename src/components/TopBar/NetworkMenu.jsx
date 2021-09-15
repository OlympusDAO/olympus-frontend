import { Button, Link, Typography } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import Box from "@material-ui/core/Box";
import GetCurrentChain from "../../hooks/GetCurrentChain";

function NetworkMenu() {
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
        <Typography>{GetCurrentChain()}</Typography>
      </Button>
    </Box>
  );
}

export default NetworkMenu;
