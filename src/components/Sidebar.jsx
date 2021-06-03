import React, { useState, useCallback, } from 'react';
import { BrowserRouter, NavLink, Route, Switch } from "react-router-dom";
import Address from "./Address";
import Social from "./Social";
import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";
import OlympusLogo from '../assets/logo.svg';

import { shorten, trim, getRebaseBlock, secondsUntilBlock, prettifySeconds } from '../helpers';



function Sidebar({ isExpanded, web3Modal, loadWeb3Modal, logoutOfWeb3Modal,  route, setRoute, address, mainnetProvider, blockExplorer }) {

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

  // isBondPage and isDashboard arent DRY, this can be optimized
  const isBondPage = useCallback((match, location) => {
    if (!match) {
      return false;
    }

    return match.url.indexOf('bonds') >= 0 || match.url.indexOf('choose_bond') >= 0
  }, []);


  return (
    <div
      className={`${isExpanded ? 'show' : '' } col-lg-2 col-2 d-md-block sidebar collapse`}
      id="sidebarContent"
    >
      <div className="dapp-sidebar d-flex flex-column">
        <div className="dapp-menu-top">
          <div className="branding-header text-center">
            <a href="https://olympusdao.finance">
              <img className="branding-header-icon" src={OlympusLogo} alt="" />
            </a>
          </div>

          <div className="wallet-menu">
            {address && <a href={`https://etherscan.io/address/${address}`} target="_blank">
              {shorten(address)}
            </a>}

            {modalButtons}
          </div>
        </div>

        <div className="dapp-menu-links">
          <div className="dapp-nav">

            <NavLink onClick={() => { setRoute("/dashboard" ) }} to="/dashboard" className="button button-dapp-menu align-items-center" isActive={(match, location) => { return !!match && ['/dashboard'].includes(match.url) }}>
              <i className="fa fa-chart-line me-3" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink onClick={() => { setRoute("/" ) }} to="/" className="button button-dapp-menu align-items-center" isActive={(match, location) => { return !isBondPage(match, location) }}>
              <i className="fa fa-gem me-3" />
              <span>Stake</span>
            </NavLink>

            <NavLink onClick={() => { setRoute("/bonds" ) }} to="/bonds" className="button button-dapp-menu align-items-center" isActive={(match, location) => { return isBondPage(match, location) }}>
              <i className="fa fa-clock me-3" />
              <span>Bond</span>
            </NavLink>

            <a href="https://olympusdao.finance/#/lpstake" className="button button-dapp-menu align-items-center">
              <i className="fa fa-water me-3" />
              <span>LP Staking</span>
            </a>
          </div>
        </div>


        <div className="dapp-menu-social">
          <Social />
        </div>


      </div>

    </div>

  );
}

export default Sidebar;
