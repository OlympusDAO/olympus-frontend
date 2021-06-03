import React, { useState, useCallback, } from 'react';
import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { useSelector, useDispatch } from 'react-redux';
import Web3Modal from "web3modal";
import "./topbar.scss";
import { shorten, trim, getRebaseBlock, secondsUntilBlock, prettifySeconds } from '../../helpers';


function TopBar({ web3Modal, loadWeb3Modal, logoutOfWeb3Modal,  route, setRoute, address, mainnetProvider, blockExplorer }) {
	const currentBlock  = useSelector((state ) => { return state.app.currentBlock });

  const modalButtons = [];
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        <button type="button" className={`btn btn-dark btn-overwrite-primer m-2`} onClick={logoutOfWeb3Modal}>Disconnect</button>,
      );
    } else {
      modalButtons.push(
        <button type="button" className={`btn btn-dark btn-overwrite-primer m-2`} onClick={loadWeb3Modal}>Connect Wallet</button>,
      );
    }
  }

	const timeUntilRebase = () => {
    if (currentBlock) {
      const rebaseBlock = getRebaseBlock(currentBlock);
      const seconds     = secondsUntilBlock(currentBlock, rebaseBlock);
      return prettifySeconds(seconds);
    }
  }

  return (
    <div className="dapp-topbar">
				<div className="rebase-timer">
					<p>Next Rebase</p>
					<p>{timeUntilRebase() || "04:20:69"}</p>
				</div>

				<div className="wallet-menu">
					{address && <a href={`https://etherscan.io/address/${address}`} target="_blank">
						{shorten(address)}
					</a>}

					{modalButtons}
				</div>
    </div>
  );
}

export default TopBar;
