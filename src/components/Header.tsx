import React, { useEffect, useCallback } from "react";
import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";
import { useSelector, } from 'react-redux';

import { useThemeSwitcher } from "react-css-theme-switcher";
import Address from "./Address";
import Balance from "./Balance";
import Wallet from "./Wallet";
import ThemeSwitch from "./ThemeSwitch";
import OlympusLogo from '../assets/olympus_logo.png';

import { shorten, trim, getRebaseBlock, secondsUntilBlock, prettifySeconds } from '../helpers';


type Props = {
  address: string,
  web3Modal: Web3Modal,
  loadWeb3Modal: Function,
  logoutOfWeb3Modal: Function,
};

export default function Header({ address, web3Modal, loadWeb3Modal, logoutOfWeb3Modal, }: Props) {
  const stakingAPY    = useSelector((state: any) => { return state.app.stakingAPY });
  const stakingRebase = useSelector((state: any) => { return state.app.stakingRebase });
  const currentBlock  = useSelector((state: any) => { return state.app.currentBlock });
  const daiBond       = useSelector((state: any) => { return state.bonding.dai });
  const ohmDaiBond       = useSelector((state: any) => { return state.bonding.ohm_dai_lp });

  const modalButtons = [];
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        <button type="button" className={`btn btn-dark btn-overwrite-primer m-2`} onClick={logoutOfWeb3Modal as any}>Disconnect</button>,
      );
    } else {
      modalButtons.push(
        <button type="button" className={`btn btn-dark btn-overwrite-primer m-2`} onClick={loadWeb3Modal as any}>Connect Wallet</button>,
      );
    }
  }

  const { currentTheme } = useThemeSwitcher();

  const timeUntilRebase = () => {
    if (currentBlock) {
      const rebaseBlock = getRebaseBlock(currentBlock);
      const seconds     = secondsUntilBlock(currentBlock, rebaseBlock);
      return prettifySeconds(seconds);
    }
  }

  const bestBondDiscount = useCallback(() => {
    if (daiBond && ohmDaiBond && daiBond.bondDiscount && ohmDaiBond.bondDiscount) {
      return Math.max(daiBond.bondDiscount, ohmDaiBond.bondDiscount)
    }
  }, [daiBond, ohmDaiBond]);


  return (
    <React.Fragment>
      <header className="d-flex sticky-top flex-wrap align-items-center justify-content-center justify-content-md-between py-3 border-bottom">
        <a href="/" className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
          <img className="branding-header-icon" src={OlympusLogo} alt="" />
        </a>

        {false && <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
          <li><a href="#" className="nav-link px-2 link-secondary">Home</a></li>
          <li><a href="#" className="nav-link px-2 link-dark">Features</a></li>
          <li><a href="#" className="nav-link px-2 link-dark">Pricing</a></li>
          <li><a href="#" className="nav-link px-2 link-dark">FAQs</a></li>
          <li><a href="#" className="nav-link px-2 link-dark">About</a></li>
        </ul>}

        <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
          <li className="mx-4">
            <p>Time until rebase</p>
            <p className="fw-bold">{ timeUntilRebase() }</p>
          </li>

          <li className="mx-4">
            <p>Bond Discount</p>
            <p className="fw-bold">{ bestBondDiscount() ? trim( (bestBondDiscount() as any) * 100, 1) : 0 }%</p>
          </li>

          <li className="mx-4">
            <p>APY</p>
            <p className="fw-bold">{ trim(stakingAPY * 100, 2) }%</p>
          </li>
        </ul>

        <div className="col-md-4 text-end">
          <ThemeSwitch />

          <a role="button" className="btn btn-dark btn-overwrite-primer mx-2" href="https://app.sushi.com/swap?inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&outputCurrency=0x383518188c0c6d7730d91b2c03a03c837814a899" target="_blank">
            Get OHM
          </a>

          {address && <a href={`https://etherscan.io/address/${address}`} target="_blank">
            {shorten(address)}
          </a>}

          {modalButtons}
        </div>
      </header>

    </React.Fragment>
  );
}
