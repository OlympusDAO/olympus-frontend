import React, { useState, useCallback, } from 'react';
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import { Alert, Button, Col, Menu, Row } from "antd";
import Address from "./Address";
import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";

// displays a page header

type Props = {
  isExpanded: boolean,
  route: any,
  address: string,
  setRoute: Function,
  mainnetProvider: StaticJsonRpcProvider,
  blockExplorer: string,
};

function Sidebar({ isExpanded, route, setRoute, address, mainnetProvider, blockExplorer }: Props) {

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
            {false && <a
              className="disconnect-button button-primary button"
              onClick={disconnectWallet}
              >Disconnect</a
            >}
            <a className="dapp-sidebar-button-connected button button-info">
              {address ? (
                <Address address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />
              ) : (
                "Connecting..."
              )}
            </a>

            <div className="dapp-menu-links">
              <Menu className="dapp-nav" style={{ textAlign: "center" }} selectedKeys={[route!]} mode="vertical">
                <Menu.Item key="/" className="button button-dapp-menu">
                  <Link
                    onClick={() => {
                      setRoute("/" as any);
                    }}
                    to="/"
                  >
                    Stake
                  </Link>
                </Menu.Item>
                <Menu.Item key="/hints" className="button button-dapp-menu">
                  <Link
                    onClick={() => {
                      setRoute("/choose_bond" as any);
                    }}
                    to="/choose_bond"
                  >
                    Bond
                  </Link>
                </Menu.Item>
              </Menu>
            </div>



          </div>
        </div>

      </div>

    </div>

  );
}

export default Sidebar;
