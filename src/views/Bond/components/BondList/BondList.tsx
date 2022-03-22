import { Trans } from "@lingui/macro";
import { Box, Grid, Typography, useMediaQuery } from "@material-ui/core";
import { assert } from "src/helpers/types/assert";

import { useLiveBondMarkets } from "../../hooks/useLiveBondMarkets";
import { BondCard } from "./components/BondCard";
import { BondTable } from "./components/BondTable/BondTable";
import { BondRow } from "./components/BondTable/components/BondRow";

export const BondList: React.VFC<{ isInverseBond?: boolean }> = ({ isInverseBond = false }) => {
  const markets = useLiveBondMarkets({ isInverseBond, shouldSuspend: true }).data;
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query

  assert(markets, "Markets should be caught by a <Suspense /> boundary");

  if (markets.length === 0)
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
        {markets.map(id => (
          <Grid item xs={12}>
            <BondCard key={id} id={id} />
          </Grid>
        ))}
      </Grid>
    );

  return (
    <BondTable>
      {markets.map(id => (
        <BondRow key={id} id={id} />
      ))}
    </BondTable>
  );
};
