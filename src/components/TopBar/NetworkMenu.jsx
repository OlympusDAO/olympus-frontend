import { Button, Link, Typography } from "@material-ui/core";
import { useWeb3Context } from "../../hooks/web3Context";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

function NetworkMenu({ theme }) {
  const { chainName } = useWeb3Context();
  const [name, setName] = useState("");

  useEffect(() => {
    setName(chainName);
  }, [chainName]);

  return (
    <Button type="button" size="large" variant="contained" color="secondary" title="Change Network">
      <Link component={NavLink} to="/network" aria-label="change-network">
        <Typography>{name}</Typography>
      </Link>
    </Button>
  );
}

export default NetworkMenu;
