import { t, Trans } from "@lingui/macro";
import { Box, FormControl, Grid, MenuItem, Select, Typography } from "@material-ui/core";
import { Input, PrimaryButton } from "@olympusdao/component-library";
import { formatUnits } from "ethers/lib/utils";
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

  assert(
    networkId === networks.ARBITRUM || networkId === networks.AVALANCHE,
    "Component should only be mounted when connected to Arbitrum or Avalanche",
  );
  const balance = useBalance(WSOHM_ADDRESSES)[networkId].data;

  const migrateMutation = useMigrateWsohm();
  const handleSubmit = (event: React.FormEvent<WrapFormElement>) => {
    event.preventDefault();
    migrateMutation.mutate();
  };

  return (
    <Box mt={2} mb={4}>
      <Box display="flex" alignItems="center">
        <Typography>Migrate</Typography>

        <FormControl style={{ margin: "0 10px" }}>
          <Select label="Asset" disableUnderline id="asset-select" value="wsOHM">
            <MenuItem value="wsOHM">wsOHM</MenuItem>
          </Select>
        </FormControl>

        <Typography>
          <span className="asset-select-label"> to </span>
        </Typography>

        <FormControl style={{ margin: "0 10px" }}>
          <Select value="gOHM" label="Asset" disableUnderline id="asset-select">
            <MenuItem value="gOHM">gOHM</MenuItem>
          </Select>
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
                  disabled
                  labelWidth={0}
                  id="amount-input"
                  endString={t`Max`}
                  name="amount-input"
                  label={t`Enter an amount of wsOHM`}
                  value={balance && formatUnits(balance)}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box mt={[1, 0]}>
                  <PrimaryButton fullWidth type="submit" className="" disabled={migrateMutation.isLoading}>
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
