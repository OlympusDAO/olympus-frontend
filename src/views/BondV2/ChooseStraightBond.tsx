import { Trans } from "@lingui/macro";
import { Box, Grid, Typography, useMediaQuery } from "@material-ui/core";
import { assert } from "src/helpers/types/assert";
import { useWeb3Context } from "src/hooks";

import { BondTableContainer } from "../Bond/components/BondTable/BondTable";
import { BondRow } from "../Bond/components/BondTable/components/BondRow/BondRow";
import { useLiveBondMarkets } from "../Bond/hooks/useLiveBondMarkets";

function ChooseStraightBond() {
  const { networkId } = useWeb3Context();
  const markets = useLiveBondMarkets().data;
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query

  assert(markets, "Markets should be caught by a <Suspense /> boundary");

  if (markets.length === 0)
    return (
      <Box display="flex" justifyContent="center" marginY="24px">
        <Typography variant="h4">
          <Trans>No active bonds</Trans>
        </Typography>
      </Box>
    );

  // if (isSmallScreen)
  //   return (
  //     <Box className="ohm-card-container">
  //       <Grid container item spacing={2}>
  //         {bondsV2.map(bond => (
  //           <Grid item xs={12} key={bond.index}>
  //             <BondDataCard key={bond.index} bond={bond} networkId={networkId} inverseBond={false} />
  //           </Grid>
  //         ))}
  //       </Grid>
  //     </Box>
  //   );

  return (
    <Grid container item>
      <BondTableContainer>
        {markets.map(id => (
          <BondRow key={id} id={id} />
        ))}
      </BondTableContainer>
    </Grid>
  );
}

export default ChooseStraightBond;
