import { Box, Link } from "@material-ui/core";
import { Icon, InfoNotification } from "@olympusdao/component-library";

export const NotificationMessage = () => (
  <Box width="97%" maxWidth="833px">
    <InfoNotification>
      <Link
        href="https://forum.olympusdao.finance/d/1096-oip-82a-amendment-to-tender-offer-for-spartacus-finance"
        target="_blank"
      >
        Learn More about the Spartacus Finance Tender Offer
        <Icon name="arrow-up" style={{ marginLeft: "2px", verticalAlign: "bottom" }} />
      </Link>
    </InfoNotification>
  </Box>
);
