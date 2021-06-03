import React, { useState, useCallback, } from 'react';
import { BrowserRouter, NavLink, Route, Switch } from "react-router-dom";
import Social from "../Social";
import { useSelector, useDispatch } from 'react-redux';
import OlympusLogo from '../../assets/logo.svg';
import RebaseTimer from '../RebaseTimer/RebaseTimer';
import externalUrls from './externalUrls';
import "./sidebar.scss";


function Sidebar({ isExpanded, setRoute, address, mainnetProvider, blockExplorer }) {
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
            <NavLink onClick={() => { setRoute("/dashboard" ) }} to="/dashboard" className="button button-dapp-menu" isActive={(match, location) => { return !!match && ['/dashboard'].includes(match.url) }}>
              <i className="fa fa-chart-line me-3" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink onClick={() => { setRoute("/" ) }} to="/" className="button button-dapp-menu" isActive={(match, location) => { return !isBondPage(match, location) }}>
              <i className="fa fa-gem me-3" />
              <span>Stake</span>
            </NavLink>

            <NavLink onClick={() => { setRoute("/bonds" ) }} to="/bonds" className="button button-dapp-menu" isActive={(match, location) => { return isBondPage(match, location) }}>
              <i className="fa fa-clock me-3" />
              <span>Bond</span>
            </NavLink>

            <a href="https://olympusdao.finance/#/lpstake" className="button button-dapp-menu">
              <i className="fa fa-water me-3" />
              <span>LP Staking</span>
            </a>
          </div>
        </div>

        <hr />

        <div className="dapp-menu-external-links">
          { Object.keys(externalUrls).map((link, i) => {
            return <a key={i} href={externalUrls[link].url} className="button button-dapp-menu">
              <i className={externalUrls[link].icon} />
              <span>{externalUrls[link].title}</span>
            </a>
            }
          )}
        </div>

        <div className="dapp-menu-data">
          <RebaseTimer />
        </div>

        <div className="dapp-menu-social">
          <Social />
        </div>

      </div>
    </div>
  );
}

export default Sidebar;
