import React, { useState, useCallback, } from 'react';
import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { useSelector, useDispatch } from 'react-redux';
import Web3Modal from "web3modal";
import "./topbar.scss";
import { shorten } from '../../helpers';
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";
import { Flex, Box, Button } from "rimble-ui";

function TopBar({ web3Modal, loadWeb3Modal, logoutOfWeb3Modal, address, mainnetProvider }) {

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

  return (
    <div className="dapp-topbar">
			<Flex className="dapp-topbar-items">		
				<ThemeSwitch />
					
				<a href="https://app.sushi.com/swap?inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&outputCurrency=0x383518188c0c6d7730d91b2c03a03c837814a899"
					target="_blank">
					<button
						className="get-ohm-button btn btn-dark btn-overwrite-primer m-2"
						title="Get OHM"
					>			
						Get OHM
					</button>
				</a>
					

				<div className="wallet-menu">
					{address && <a href={`https://etherscan.io/address/${address}`} target="_blank">
						{shorten(address)}
					</a>}

					{modalButtons}
				</div>
			</Flex>
    </div>
  );
}

export default TopBar;
