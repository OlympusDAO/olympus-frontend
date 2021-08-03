import { getRebaseBlock, secondsUntilBlock, prettifySeconds } from "../../helpers";
import { Box, Typography } from "@material-ui/core";
import "./rebasetimer.scss";
import { useAppSelector } from "src/hooks";

function RebaseTimer() {
  const currentBlock = useAppSelector(state => {
    return state.app.currentBlock;
  });

  const timeUntilRebase = () => {
    if (currentBlock) {
      const rebaseBlock = getRebaseBlock(currentBlock);
      const seconds = secondsUntilBlock(currentBlock, rebaseBlock);
      return prettifySeconds(seconds);
    }
  };

  return (
    <Box className="rebase-timer">
      <Typography variant="body2">
        <strong>{timeUntilRebase()}</strong> to next rebase
      </Typography>
    </Box>
  );
}

export default RebaseTimer;
