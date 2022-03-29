import { Trans } from "@lingui/macro";
import { Box, Grid, Typography, useMediaQuery } from "@material-ui/core";
import { assert } from "src/helpers/types/assert";

import { useActiveBonds } from "../../hooks/useActiveBonds";
import { BondCard } from "./components/BondCard";
import { BondTable } from "./components/BondTable/BondTable";
import { BondRow } from "./components/BondTable/components/BondRow";

export const BondList: React.VFC<{ isInverseBond?: boolean }> = ({ isInverseBond = false }) => {
  const bonds = useActiveBonds({ isInverseBond, shouldSuspend: true }).data;
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query

  assert(bonds, "Bonds should be caught by a <Suspense /> boundary");

  if (bonds.length === 0)
    return (
      <Box display="flex" justifyContent="center" my="24px">
        <Typography variant="h4">
          <Trans>No active bonds</Trans>
        </Typography>
      </Box>
    );

  if (isSmallScreen)
    return (
      <Grid container spacing={5}>
        {bonds.map(bond => (
          <Grid item xs={12}>
            <BondCard key={bond.id} bond={bond} />
          </Grid>
        ))}
      </Grid>
    );

  return (
    <BondTable>
      {bonds.map(bond => (
        <BondRow key={bond.id} bond={bond} />
      ))}
    </BondTable>
  );
};
