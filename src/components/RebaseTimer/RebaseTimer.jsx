import React, { useState, useEffect, } from 'react';
import { useSelector } from 'react-redux';
import "./rebasetimer.scss";
import { getRebaseBlock, secondsUntilBlock, prettifySeconds } from '../../helpers';


function RebaseTimer() {
	const currentBlock  = useSelector((state ) => { return state.app.currentBlock });

  
	const timeUntilRebase = () => {
    if (currentBlock) {
      const rebaseBlock = getRebaseBlock(currentBlock);
      const seconds     = secondsUntilBlock(currentBlock, rebaseBlock);
      return prettifySeconds(seconds);
    }
  }

  return (
		<div className="rebase-timer">
			<p>Next Rebase</p>
			<p>{timeUntilRebase() || "04:20:69"}</p>
		</div>
  );
}

export default RebaseTimer;
