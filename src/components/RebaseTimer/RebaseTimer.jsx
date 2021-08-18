import { useSelector } from "react-redux";
import { getRebaseBlock, secondsUntilBlock, prettifySeconds } from "../../helpers";
import { Box, Typography } from "@material-ui/core";
import "./rebasetimer.scss";
import { Skeleton } from "@material-ui/lab";
import { useMemo } from "react";

function RebaseTimer() {
  const currentBlock = useSelector(state => {
    return state.app.currentBlock;
  });

  const timeUntilRebase = useMemo(() => {
    if (currentBlock) {
      const rebaseBlock = getRebaseBlock(currentBlock);
      const seconds = secondsUntilBlock(currentBlock, rebaseBlock);
      return prettifySeconds(seconds);
    }
  }, [currentBlock]);

  return (
    <Box className="rebase-timer">
      <Typography variant="body2">
        {currentBlock ? (
          timeUntilRebase ? (
            <>
              <strong>{timeUntilRebase}</strong> to next rebase
            </>
          ) : (
            <strong>rebasing</strong>
          )
        ) : (
          <Skeleton width="200px" />
        )}
      </Typography>
    </Box>
  );
}

export default RebaseTimer;
