import React, { useEffect, useCallback, useState } from 'react';
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Social from "../Social";
import OlympusLogo from '../../assets/logo.svg';
import RebaseTimer from '../RebaseTimer/RebaseTimer';
import externalUrls from './externalUrls';
import "./sidebar.scss";
import { calcBondDetails } from "../../actions/Bond.actions.js";
import { ReactComponent as StakeIcon } from "../../assets/icons/stake-icon.svg";
import { ReactComponent as BondIcon } from "../../assets/icons/bond-icon.svg";
import { ReactComponent as DashboardIcon } from "../../assets/icons/dashboard-icon.svg";
import { trim } from "../../helpers";
import { BONDS } from "../../constants";
import { useMediaQuery } from "@material-ui/core";


function Sidebar({ isExpanded, theme, ohmDaiBondDiscount, ohmFraxLpBondDiscount, daiBondDiscount, currentIndex }) {
  const dispatch = useDispatch();
  const [isActive, setIsActive] = useState();

  const checkPage = useCallback((match, location, page) => {
    console.log(match);
    const currentPath = location.pathname.replace("/", "");
    const currentURL = window.location.href;

    if (currentPath.indexOf("dashboard") >= 0 && page === "dashboard") {
      return true;
    }

    if (currentPath.indexOf("stake") >= 0 && page === "stake") {
      return true;
    }

    if ((currentPath.indexOf("bonds") >= 0 || currentPath.indexOf("choose_bond") >= 0) && page === "bonds") {
      return true;
    }

    return false;
  }, []);


  return (
    <div
      className={`${isExpanded ? 'show' : '' } d-lg-block sidebar collapse`}
      id="sidebarContent"
    >
      <div className="dapp-sidebar">
        <div className="dapp-menu-top">
          <div className="branding-header">
            <a href="https://olympusdao.finance" target="_blank">
              <img className="branding-header-icon" src={OlympusLogo} alt="OlympusDAO" />
              <h3>Olympus</h3>
            </a>
          </div>
        </div>

        <div className="dapp-menu-links">
          <div className="dapp-nav" id="navbarNav">
            <NavLink to="/dashboard" isActive={(match, location) => { return checkPage(match, location, "dashboard") }} className={`button button-dapp-menu ${isActive && "active"}`}>
              <DashboardIcon className="me-3" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/" isActive={(match, location) => { return checkPage(match, location, "stake") }}  className={`button button-dapp-menu ${isActive && "active"}`} >
              <StakeIcon className="me-3" />
              <span>Stake</span>
            </NavLink>

            <NavLink to="/bonds" isActive={(match, location) => { return checkPage(match, location, "bonds") }} className={`button button-dapp-menu ${isActive && "active"}`}>
              <BondIcon className="me-3" />
              <span>Bond</span>
            </NavLink>

            {/* needs functions for discount calc */}
            <div className="dapp-menu-data discounts">
              <div className="bond-discounts">
                <p>Bond discounts</p>
                <p>OHM-DAI LP<span>{trim(ohmDaiBondDiscount * 100, 2)}%</span></p>
                <p>OHM-FRAX LP<span>{trim(ohmFraxLpBondDiscount * 100, 2)}%</span></p>
                <p>DAI<span>{trim(daiBondDiscount * 100, 2)}%</span></p>
                <p>FRAX<span></span></p>
              </div>
            </div>
          </div>
        </div>

        <hr />

        <div className="dapp-menu-external-links">
          { Object.keys(externalUrls).map((link, i) => {
            return <a key={i} href={`${externalUrls[link].url}`} target="_blank" className="button button-dapp-menu">
              {externalUrls[link].icon}
              <span>{externalUrls[link].title}</span>
            </a>
            }
          )}
        </div>

        <div className="dapp-menu-data bottom">
          <div className="data-rebase">
            <RebaseTimer />
          </div>

        {theme === "girth" && 
          <div className="data-ohm-index">
            <p>Current Index </p>
            <p>{trim(currentIndex, 4)} OHM</p>
          </div>
        }
        </div>

        <div className="dapp-menu-social">
          <Social />
        </div>

      </div>
    </div>
  );
}

export default Sidebar;
