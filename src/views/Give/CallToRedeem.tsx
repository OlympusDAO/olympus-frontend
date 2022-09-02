import "src/views/Give/CallToRedeem.scss";

import { Trans } from "@lingui/macro";
import { Typography } from "@mui/material";
import { InfoNotification } from "@olympusdao/component-library";

export const CallToRedeem = () => {
  return (
    <InfoNotification dismissable="true">
      <Typography variant="h6">
        <Trans>You have redeemable rebases on the old contract</Trans>
      </Typography>
    </InfoNotification>
  );
};
