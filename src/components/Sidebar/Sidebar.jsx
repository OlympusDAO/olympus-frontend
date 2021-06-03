import React, { useState, useCallback, } from 'react';
import { BrowserRouter, NavLink, Route, Switch } from "react-router-dom";
import Address from "../Address";
import Social from "../Social";
import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";
import { useSelector, useDispatch } from 'react-redux';
import OlympusLogo from '../../assets/logo.svg';
import "./sidebar.scss";

import { shorten, trim, getRebaseBlock, secondsUntilBlock, prettifySeconds } from '../../helpers';


function Sidebar({ isExpanded, web3Modal, loadWeb3Modal, logoutOfWeb3Modal,  route, setRoute, address, mainnetProvider, blockExplorer }) {
  const currentBlock  = useSelector((state ) => { return state.app.currentBlock });

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
      <div className="dapp-sidebar">
        <div className="dapp-menu-top">
          <div className="branding-header">
            <a href="https://olympusdao.finance">
              <img className="branding-header-icon" src={OlympusLogo} alt="" />
              Olympus
            </a>
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
