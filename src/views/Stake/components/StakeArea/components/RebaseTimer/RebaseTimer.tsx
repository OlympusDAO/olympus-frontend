import "./RebaseTimer.scss";

import { Trans } from "@lingui/macro";
import { Box, Skeleton, Typography } from "@mui/material";
import React from "react";
import { useNextRebaseDate } from "src/views/Stake/components/StakeArea/components/RebaseTimer/hooks/useNextRebaseDate";

import { prettifySeconds } from "../../../../../../helpers/timeUtil";

const RebaseTimer: React.FC = () => {
  const { data: nextRebaseDate } = useNextRebaseDate();

  return (
    <Box className="rebase-timer">
      <Typography variant="body2">
        {nextRebaseDate ? (
          <>
            <strong>{prettifySeconds((nextRebaseDate.getTime() - new Date().getTime()) / 1000)}&nbsp;</strong>
            <Trans>to next rebase</Trans>
          </>
        ) : (
          <Skeleton width="155px" />
        )}
      </Typography>
    </Box>
  );
};

export default RebaseTimer;
