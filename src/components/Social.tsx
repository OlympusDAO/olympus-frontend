import React, { useState, useCallback, } from 'react';
import { BrowserRouter, NavLink, Route, Switch } from "react-router-dom";
import Address from "./Address";
import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";
import OlympusLogo from '../assets/logo.svg';
import GitHubImg from '../assets/github.svg';
import MediumImg from '../assets/medium.svg';
import TwitterImg from '../assets/twitter.svg';
import DiscordImg from '../assets/discord.svg';


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

function Social() {
  // isBondPage and isDashboard arent DRY, this can be optimized
  const isBondPage = useCallback((match, location) => {
    if (!match) {
      return false;
    }

    return match.url.indexOf('bonds') >= 0 || match.url.indexOf('choose_bond') >= 0
  }, []);


  return (
    <div className="social-row">
      <a href="https://github.com/OlympusDAO/olympus-frontend"
        ><img src={GitHubImg} alt="" className="social-icon-small"
      /></a>
      <a href="https://olympusdao.medium.com/"
        ><img src={MediumImg} alt="" className="social-icon-small"
      /></a>
      <a href="https://twitter.com/OlympusDAO"
        ><img src={TwitterImg} alt="" className="social-icon-small"
      /></a>
      <a href="https://discord.gg/6QjjtUcfM4"
        ><img src={DiscordImg} alt="" className="social-icon-small"
      /></a>
    </div>
  );
}

export default Social;
