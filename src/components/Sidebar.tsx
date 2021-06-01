import React, { useState, useCallback, } from 'react';
import { BrowserRouter, NavLink, Route, Switch } from "react-router-dom";
import Address from "./Address";
import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";


// displays a page header

type Props = {
  isExpanded: boolean,
  route: any,
  address: string,
  setRoute: Function,
  mainnetProvider: StaticJsonRpcProvider,
  blockExplorer: string,
  web3Modal: Web3Modal,
  loadWeb3Modal: Function,
  logoutOfWeb3Modal: Function,
};

function Sidebar({ isExpanded, web3Modal, loadWeb3Modal, logoutOfWeb3Modal,  route, setRoute, address, mainnetProvider, blockExplorer }: Props) {



  const setMax = useCallback(() => {
    return null
  }, []);

  const seekApproval = useCallback(() => {
    return null
  }, []);

  const disconnectWallet = useCallback(() => {
    return null
  }, []);

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
          <div className="branding-header">
            <img className="branding-header-icon" src="~/@/assets/logo.svg" alt="" />
          </div>

          <div className="wallet-menu">

            {false && <a
              className="disconnect-button button-primary button"
              onClick={disconnectWallet}
              >Disconnect</a
            >}

          </div>



        </div>

        <div className="dapp-menu-links">
          <div className="dapp-nav">
            <NavLink onClick={() => { setRoute("/" as any) }} to="/" className="button button-dapp-menu align-items-center" isActive={(match, location) => { return !isBondPage(match, location) }}>
              <i className="fa fa-gem me-3" />
              <span>Stake</span>
            </NavLink>

            <NavLink onClick={() => { setRoute("/bonds" as any) }} to="/bonds" className="button button-dapp-menu align-items-center" isActive={(match, location) => { return isBondPage(match, location) }}>
              <i className="fa fa-clock me-3" />
              <span>Bond</span>
            </NavLink>
          </div>
        </div>


      </div>

    </div>

  );
}

export default Sidebar;
