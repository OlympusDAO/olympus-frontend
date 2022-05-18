import { Box, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import { WarningNotification } from "@olympusdao/component-library";
import { Environment } from "src/helpers/environment/Environment/Environment";

const PREFIX = "StagingNotification";

const classes = {
  contentShift: `${PREFIX}-contentShift`,
  notification: `${PREFIX}-notification`,
};

const StyledNotification = styled("div")(() => ({
  [`& .${classes.contentShift}`]: {
    marginLeft: 0,
  },

  [`& .${classes.notification}`]: {
    marginLeft: "312px",
  },
}));

const StagingNotification = () => {
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  return (
    <StyledNotification>
      {Environment.getStagingFlag() === "true" && (
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
    </StyledNotification>
  );
};

export default StagingNotification;
