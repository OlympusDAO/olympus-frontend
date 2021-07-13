import { useSelector } from "react-redux";
import { getRebaseBlock, secondsUntilBlock, prettifySeconds } from "../../helpers";
import { Box, Typography } from "@material-ui/core";
import "./rebasetimer.scss";

function RebaseTimer() {
  const currentBlock = useSelector(state => {
    return state.app.currentBlock;
  });

  const timeUntilRebase = () => {
    if (currentBlock) {
      console.log(currentBlock);
      const rebaseBlock = getRebaseBlock(currentBlock);
      console.log(rebaseBlock);
      const seconds = secondsUntilBlock(currentBlock, rebaseBlock);
      console.log(seconds);
      console.log(prettifySeconds(seconds));
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
