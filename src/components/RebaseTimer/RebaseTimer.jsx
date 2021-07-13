<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import React from "react";
import { useSelector } from "react-redux";
=======
import React from 'react';
import { useSelector } from 'react-redux';
>>>>>>> dashboard tiles use graph queries from app state
import "./rebasetimer.scss";
import { getRebaseBlock, secondsUntilBlock, prettifySeconds } from "../../helpers";
=======
=======
>>>>>>> Linting fixes
=======
>>>>>>> rebased from develop. everything appears to work except rebase timer
import { useSelector } from "react-redux";
import { getRebaseBlock, secondsUntilBlock, prettifySeconds } from "../../helpers";
import { Box, Typography } from "@material-ui/core";
import "./rebasetimer.scss";
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> top bar nearly done, sidebar refactored (mostly) to use material ui drawer, bootstrap removed, sidebar styled, typography implemented
=======
=======
import React from "react";
import { useSelector } from "react-redux";
import "./rebasetimer.scss";
import { getRebaseBlock, secondsUntilBlock, prettifySeconds } from "../../helpers";
>>>>>>> Linting fixes
>>>>>>> Linting fixes
=======
>>>>>>> rebased from develop. everything appears to work except rebase timer

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
<<<<<<< HEAD
    <div className="rebase-timer">
      <p>
        <span style={{ fontWeight: "bold" }}>{timeUntilRebase()}</span> to next rebase
      </p>
    </div>
=======
    <Box className="rebase-timer">
      <Typography variant="body2">
        <strong>{timeUntilRebase()}</strong> to next rebase
      </Typography>
    </Box>
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> top bar nearly done, sidebar refactored (mostly) to use material ui drawer, bootstrap removed, sidebar styled, typography implemented
=======
=======
  }

  return (
		<div className="rebase-timer">
      <p><span style={{fontWeight: 'bold'}}>{timeUntilRebase()}</span> to next rebase</p>
		</div>
>>>>>>> Added more staking info and UI fixes
<<<<<<< HEAD
>>>>>>> Added more staking info and UI fixes
=======
=======
  };

  return (
    <div className="rebase-timer">
      <p>
        <span style={{ fontWeight: "bold" }}>{timeUntilRebase()}</span> to next rebase
      </p>
    </div>
>>>>>>> Linting fixes
>>>>>>> Linting fixes
=======
>>>>>>> rebased from develop. everything appears to work except rebase timer
  );
}

export default RebaseTimer;
