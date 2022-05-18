import "./CallToRedeem.scss";

import { Trans } from "@lingui/macro";
import { Box, Typography } from "@mui/material";

export const CallToRedeem = () => {
  return (
    <Box className="call-to-redeem">
      <Typography variant="h6">
        <Trans>You have redeemable yield on the old contract</Trans>
      </Typography>
    </Box>
  );
};
