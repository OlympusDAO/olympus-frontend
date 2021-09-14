import { Button, Link, Typography } from "@material-ui/core";
import { useWeb3Context } from "../../hooks/web3Context";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

function NetworkMenu({ theme }) {
  const { chainID } = useWeb3Context();
  const [chainName, setChainName] = useState("");

  useEffect(() => {
    if (chainID === 1) {
      setChainName("Ethereum");
    } else if (chainID === 42161) {
      setChainName("Arbitrum");
    }
  }, [chainName]);

  return (
    <Button type="button" size="large" variant="contained" color="secondary" title="Change Network">
      <Link component={NavLink} to="/network" aria-label="change-network">
        <Typography>{chainName}</Typography>
      </Link>
    </Button>
  );
}

export default NetworkMenu;
