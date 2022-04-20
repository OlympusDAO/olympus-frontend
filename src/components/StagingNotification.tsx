import { Box, makeStyles, useMediaQuery } from "@material-ui/core";
import { WarningNotification } from "@olympusdao/component-library";

/**
 * Component for Displaying Staging Notification Banner
 */

const useStyles = makeStyles(theme => ({
  contentShift: {
    marginLeft: 0,
  },
  notification: {
    marginLeft: "312px",
  },
}));
const StagingNotification = () => {
  const classes = useStyles();
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  return (
    <>
      {window.location.hostname === "staging.olympusdao.finance" && (
        <Box
          style={{ marginTop: "0px" }}
          className={`${isSmallScreen ? classes.contentShift : classes.notification}`}
          data-testid="staging-notification"
        >
          <WarningNotification dismissible={true}>
            You are on the staging site. Any interaction could result in loss of assets.{" "}
            <a href="https://app.olympusdao.finance">Exit Here</a>
          </WarningNotification>
        </Box>
      )}
    </>
  );
};

export default StagingNotification;
