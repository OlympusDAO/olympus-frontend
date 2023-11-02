import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";
import { SecondaryButton } from "@olympusdao/component-library";
import { useState } from "react";
import { useFaucet } from "src/components/TopBar/Wallet/hooks/useFaucet";

export const DevFaucet = () => {
  const PREFIX = "AssetsIndex";
  const [faucetToken, setFaucetToken] = useState("OHM V2");
  const faucetMutation = useFaucet();

  const classes = {
    selector: `${PREFIX}-selector`,
    forecast: `${PREFIX}-forecast`,
    faucet: `${PREFIX}-faucet`,
  };
  const isFaucetLoading = faucetMutation.isLoading;

  return (
    <>
      <Typography variant="h5">Dev Faucet</Typography>
      <Box display="flex" flexDirection="row" justifyContent="space-between" mt="18px">
        <FormControl className={classes.faucet}>
          <Select
            label="Contract"
            id="contract-select"
            value={faucetToken}
            onChange={event => setFaucetToken(event.target.value)}
          >
            <MenuItem value="OHM V1">OHM V1</MenuItem>
            <MenuItem value="OHM V2">OHM V2</MenuItem>
            <MenuItem value="sOHM V1">sOHM V1</MenuItem>
            <MenuItem value="sOHM V2">sOHM V2</MenuItem>
            <MenuItem value="wsOHM">wsOHM</MenuItem>
            <MenuItem value="gOHM">gOHM</MenuItem>
            <MenuItem value="DAI">DAI</MenuItem>
            <MenuItem value="ETH">ETH</MenuItem>
          </Select>
        </FormControl>
        <SecondaryButton onClick={() => faucetMutation.mutate(faucetToken)}>
          {isFaucetLoading ? "Loading..." : "Get Tokens"}
        </SecondaryButton>
      </Box>
    </>
  );
};
