import { Box } from "@material-ui/core";
import { Trans } from "@lingui/macro";
import { InfoNotification } from "@olympusdao/component-library";

function Announcement() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Box width={"100%"} maxWidth={833}>
        <InfoNotification dismissible>
          <Trans>
            Treasury stats may be inaccurate during the migration. Please check discord if you have any questions.
          </Trans>
        </InfoNotification>
      </Box>
    </Box>
  );
}

export default Announcement;
