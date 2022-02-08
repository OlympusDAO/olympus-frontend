import { Box, Link } from "@material-ui/core";
import { Icon, InfoNotification } from "@olympusdao/component-library";

export const NotificationMessage = () => (
  <Box width="97%" maxWidth="833px">
    <InfoNotification>
      This is a very important message about redeeming your Chicken Tender Offer.
      <Link href="#" style={{ marginLeft: "10px" }}>
        Learn More
        <Icon name="arrow-up" style={{ marginLeft: "2px", verticalAlign: "bottom" }} />
      </Link>
    </InfoNotification>
  </Box>
);
