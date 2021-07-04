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
      const rebaseBlock = getRebaseBlock(currentBlock);
      const seconds = secondsUntilBlock(currentBlock, rebaseBlock);
      return prettifySeconds(seconds);
    }
<<<<<<< HEAD
  };

  return (
    <Box className="rebase-timer">
      <Typography variant="body2">
        <strong>{timeUntilRebase()}</strong> to next rebase
      </Typography>
    </Box>
=======
  }

  return (
		<div className="rebase-timer">
      <p><span style={{fontWeight: 'bold'}}>{timeUntilRebase()}</span> to next rebase</p>
		</div>
>>>>>>> Added more staking info and UI fixes
  );
}

export default RebaseTimer;
