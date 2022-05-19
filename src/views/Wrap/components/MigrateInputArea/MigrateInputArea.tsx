import { t, Trans } from "@lingui/macro";
import { Box, FormControl, Grid, MenuItem, Select, styled, Typography } from "@mui/material";
import { Input, PrimaryButton } from "@olympusdao/component-library";
import { useState } from "react";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { MIGRATOR_ADDRESSES, WSOHM_ADDRESSES } from "src/constants/addresses";
import { assert } from "src/helpers/types/assert";
import { useWeb3Context } from "src/hooks";
import { useBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";

import { useMigrateWsohm } from "./hooks/useMigrateWsohm";

export const MigrateInputArea = () => {
  const networks = useTestableNetworks();
  const { networkId } = useWeb3Context();

  // Max balance stuff
  assert(
    networkId === networks.ARBITRUM || networkId === networks.AVALANCHE,
    "Component should only be mounted when connected to Arbitrum or Avalanche",
  );
  const [amount, setAmount] = useState("");
  const balance = useBalance(WSOHM_ADDRESSES)[networkId].data;
  const setMax = () => balance && setAmount(balance.toString());

  // Mutation stuff
  const migrateMutation = useMigrateWsohm();
  const handleSubmit = (event: React.FormEvent<WrapFormElement>) => {
    event.preventDefault();
    migrateMutation.mutate(amount);
  };

  const StyledSelect = styled(Select)(() => ({
    "& .MuiSelect-icon": {
      marginTop: "-2px",
    },
  }));

  return (
    <Box mt={2} mb={4}>
      <Box display="flex" alignItems="center">
        <Typography>Migrate</Typography>

        <FormControl style={{ margin: "0 10px" }} variant="standard">
          <StyledSelect label="Asset" disableUnderline id="asset-select" value="wsOHM">
            <MenuItem value="wsOHM">wsOHM</MenuItem>
          </StyledSelect>
        </FormControl>

        <Typography>
          <span className="asset-select-label"> to </span>
        </Typography>

        <FormControl style={{ margin: "0 10px" }} variant="standard">
          <StyledSelect value="gOHM" label="Asset" disableUnderline id="asset-select">
            <MenuItem value="gOHM">gOHM</MenuItem>
          </StyledSelect>
        </FormControl>
      </Box>

      <Box my={1}>
        <TokenAllowanceGuard
          tokenAddressMap={WSOHM_ADDRESSES}
          spenderAddressMap={MIGRATOR_ADDRESSES}
          message={
            <>
              <Trans>Please approve Olympus DAO to use your</Trans> <b>wsOHM</b> <Trans>for migrating</Trans>.
            </>
          }
        >
          <form onSubmit={handleSubmit} className="stake-tab-panel wrap-page">
            <Grid container>
              <Grid item xs={12} sm={8} style={{ paddingRight: "4px" }}>
                <Input
                  value={amount}
                  id="amount-input"
                  endString={t`Max`}
                  name="amount-input"
                  endStringOnClick={setMax}
                  placeholder={t`Enter an amount of wsOHM`}
                  disabled={migrateMutation.isLoading}
                  onChange={event => setAmount(event.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box mt={[1, 0]}>
                  <PrimaryButton
                    fullWidth
                    type="submit"
                    className=""
                    disabled={migrateMutation.isLoading}
                    data-testid="migrate-button"
                    style={{ height: "43px" }}
                  >
                    {migrateMutation.isLoading ? "Migrating..." : "Migrate"}
                  </PrimaryButton>
                </Box>
              </Grid>
            </Grid>
          </form>
        </TokenAllowanceGuard>
      </Box>
    </Box>
  );
};

interface WrapFormElement extends HTMLFormElement {
  elements: HTMLFormControlsCollection & { "amount-input": HTMLInputElement };
}
