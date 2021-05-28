import { PageHeader } from "antd";
import React from "react";

import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";

import { Button } from "antd";

import { useThemeSwitcher } from "react-css-theme-switcher";
import Address from "./Address";
import Balance from "./Balance";
import Wallet from "./Wallet";


type Props = {
  address: string,
  userProvider: Web3Provider,
  localProvider: StaticJsonRpcProvider,
  mainnetProvider: StaticJsonRpcProvider,
  web3Modal: Web3Modal,
  loadWeb3Modal: Function,
  logoutOfWeb3Modal: Function,
  blockExplorer: string,
};

export default function Header({ address, userProvider, localProvider, mainnetProvider, web3Modal, loadWeb3Modal, logoutOfWeb3Modal, blockExplorer }: Props) {
  const modalButtons = [];
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        <Button
          key="logoutbutton"
          style={{ verticalAlign: "top", marginLeft: 8, marginTop: 4 }}
          shape="round"
          size="large"
          onClick={logoutOfWeb3Modal as any}
        >
          logout
        </Button>,
      );
    } else {
      modalButtons.push(
        <Button
          key="loginbutton"
          style={{ verticalAlign: "top", marginLeft: 8, marginTop: 4 }}
          shape="round"
          size="large"
          /* type={minimized ? "default" : "primary"}     too many people just defaulting to MM and having a bad time */
          onClick={loadWeb3Modal as any}
        >
          connect
        </Button>,
      );
    }
  }

  const { currentTheme } = useThemeSwitcher();


  return (
    <React.Fragment>
      <nav className={`navbar sticky-top navbar-expand-lg navbar-light ${currentTheme === 'dark' ? 'bg-dark' : 'bg-light'}`}>
        <div className="container-fluid align-items-end">

          {false && <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>}

          <button
            className="navbar-toggler"
            type="button"
            onClick={() => {}}
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>




          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {false && <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Link</a>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Dropdown
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li><a className="dropdown-item" href="#">Action</a></li>
                  <li><a className="dropdown-item" href="#">Another action</a></li>

                  <li><a className="dropdown-item" href="#">Something else here</a></li>
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link disabled" href="#" aria-disabled="true">Disabled</a>
              </li>
            </ul>}

            <ul className="navbar-nav me-auto mb-3 mb-lg-0">
              <li className="nav-item">
                {modalButtons}
              </li>
            </ul>

          </div>
        </div>
      </nav>



    </React.Fragment>
  );
}
