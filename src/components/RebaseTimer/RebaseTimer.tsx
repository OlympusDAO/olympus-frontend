import "./RebaseTimer.scss";

import { Trans } from "@lingui/macro";
import { Box, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React from "react";
import { prettifySeconds } from "src/helpers";
import { useNextRebaseDate } from "src/views/Stake/hooks/useNextRebaseDate";

const RebaseTimer: React.FC = () => {
  const { data: nextRebaseDate } = useNextRebaseDate();

  if (!nextRebaseDate) {
    return (
      <Box className="rebase-timer">
        <Typography variant="body2">
          <Skeleton width="155px" />
        </Typography>
      </Box>
    );
  }

  const secondsToRebase = (nextRebaseDate.getTime() - new Date().getTime()) / 1000;

  return (
    <Box className="rebase-timer">
      <Typography variant="body2">
        <strong>{prettifySeconds(secondsToRebase)}&nbsp;</strong>
        <Trans>to next rebase</Trans>
      </Typography>
    </Box>
  );
};

export default RebaseTimer;
