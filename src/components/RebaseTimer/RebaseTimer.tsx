import "./RebaseTimer.scss";

import { Trans } from "@lingui/macro";
import { Box, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import { getRebaseBlock, prettifySeconds } from "../../helpers";
import { useAppSelector } from "../../hooks";
import { useWeb3Context } from "../../hooks/web3Context";
import { loadAppDetails } from "../../slices/AppSlice";

const SECONDS_TO_REFRESH = 60;

const RebaseTimer: React.FC = () => {
  const dispatch = useDispatch();
  const { provider, networkId } = useWeb3Context();

  const [secondsToRebase, setSecondsToRebase] = useState<number>(0);
  const [rebaseString, setRebaseString] = useState<string | React.ReactElement>("");
  const [secondsToRefresh, setSecondsToRefresh] = useState<number>(SECONDS_TO_REFRESH);

  const currentBlock = useAppSelector(state => state.app.currentBlock);
  const secondsToEpoch = useAppSelector(state => state.app.secondsToEpoch);

  // This initializes secondsToRebase as soon as currentBlock becomes available
  useMemo(() => {
    if (secondsToEpoch && currentBlock) {
      const rebaseBlock = getRebaseBlock(currentBlock);
      setSecondsToRebase(secondsToEpoch);
      const prettified = prettifySeconds(secondsToEpoch);
      setRebaseString(prettified !== "" ? prettified : <Trans>Less than a minute</Trans>);
    }
  }, [secondsToEpoch]);

  // After every period SECONDS_TO_REFRESH, decrement secondsToRebase by SECONDS_TO_REFRESH,
  // keeping the display up to date without requiring an on chain request to update currentBlock.
  useEffect(() => {
    let interval = 0;
    if (secondsToRefresh > 0) {
      interval = window.setInterval(() => {
        setSecondsToRefresh(secondsToRefresh => secondsToRefresh - 1);
      }, 1000);
    } else {
      // When the countdown goes negative, reload the app details and reinitialize the timer
      if (secondsToRebase < 0) {
        async function reload() {
          await dispatch(loadAppDetails({ networkID: networkId, provider: provider }));
        }
        reload();
        setRebaseString("");
      } else {
        window.clearInterval(interval);
        setSecondsToRebase(secondsToRebase => secondsToRebase - SECONDS_TO_REFRESH);
        setSecondsToRefresh(SECONDS_TO_REFRESH);
        const prettified = prettifySeconds(secondsToRebase);
        setRebaseString(prettified !== "" ? prettified : <Trans>Less than a minute</Trans>);
      }
    }
    return () => window.clearInterval(interval);
  }, [secondsToRebase, secondsToRefresh]);

  return (
    <Box className="rebase-timer">
      <Typography variant="body2">
        {currentBlock ? (
          secondsToRebase > 0 ? (
            <>
              <strong>{rebaseString}&nbsp;</strong>
              <Trans>to next rebase</Trans>
            </>
          ) : (
            <strong>rebasing</strong>
          )
        ) : (
          <Skeleton width="155px" />
        )}
      </Typography>
    </Box>
  );
};

export default RebaseTimer;
