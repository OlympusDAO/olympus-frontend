import { Box } from "@mui/material";
import { WarningNotification } from "@olympusdao/component-library";
import { Environment } from "src/helpers/environment/Environment/Environment";

const StagingNotification = () => {
  return (
    <>
      {Environment.getStagingFlag() === "true" && (
        <Box style={{ marginTop: "0px" }} data-testid="staging-notification">
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
