import React, { useState, useCallback, } from 'react';
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import { Alert, Button, Col, Menu, Row } from "antd";
import Address from "./Address";
import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";
import { shorten } from '../helpers';

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
  const modalButtons = [];
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        <Button
          key="logoutbutton"
          shape="round"
          size="large"
          onClick={logoutOfWeb3Modal as any}
        >
          Disconnect
        </Button>,
      );
    } else {
      modalButtons.push(
        <Button
          key="loginbutton"
          shape="round"
          size="large"
          /* type={minimized ? "default" : "primary"}     too many people just defaulting to MM and having a bad time */
          onClick={loadWeb3Modal as any}
        >
          Connect
        </Button>,
      );
    }
  }


  const setMax = useCallback(() => {
    return null
  }, []);

  const seekApproval = useCallback(() => {
    return null
  }, []);

  const disconnectWallet = useCallback(() => {
    return null
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
            {modalButtons}

            {false && <a
              className="disconnect-button button-primary button"
              onClick={disconnectWallet}
              >Disconnect</a
            >}
            {address && <a className="dapp-sidebar-button-connected button button-info">
              {shorten(address)}

              {false && (address ? (
                <Address address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />
              ) : (
                "Connecting..."
              ))}
            </a>}




          </div>



        </div>

        <div className="dapp-menu-links">
          <div className="dapp-nav">
            <Link onClick={() => { setRoute("/" as any) }} to="/" className="button button-dapp-menu">
              Stake
            </Link>

            <Link onClick={() => { setRoute("/choose_bond" as any) }} to="/choose_bond" className="button button-dapp-menu">
              Bond
            </Link>
          </div>
        </div>


      </div>

    </div>

  );
}

export default Sidebar;
