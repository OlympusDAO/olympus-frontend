import "./RebaseTimer.scss";

import { Trans } from "@lingui/macro";
import { Box, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React from "react";
import { timeToDate } from "src/helpers";
import { useNextRebaseDate } from "src/views/Stake/hooks/useNextRebaseDate";

const RebaseTimer: React.FC = () => {
  const { data: nextRebaseDate } = useNextRebaseDate();

  return (
    <Box className="rebase-timer">
      <Typography variant="body2">
        {nextRebaseDate ? (
          <>
            <Trans>Next rebase</Trans>
            <strong>&nbsp;{timeToDate(nextRebaseDate)}</strong>
          </>
        ) : (
          <Skeleton width="155px" />
        )}
      </Typography>
    </Box>
  );
};

export default RebaseTimer;
