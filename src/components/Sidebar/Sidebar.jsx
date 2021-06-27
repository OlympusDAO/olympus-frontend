import React, { useCallback, useState, useEffect } from 'react';
import { Link, NavLink } from "react-router-dom";
import Social from "../Social";
import OlympusLogo from '../../assets/logo.svg';
import externalUrls from './externalUrls';
import { ReactComponent as StakeIcon } from "../../assets/icons/stake-icon.svg";
import { ReactComponent as BondIcon } from "../../assets/icons/bond-icon.svg";
import { ReactComponent as DashboardIcon } from "../../assets/icons/dashboard-icon.svg";
import { trim } from "../../helpers";
import "./sidebar.scss";
import orderBy from 'lodash/orderBy'
import useBonds from "../../hooks/Bonds";

function Sidebar({ isExpanded, theme, currentIndex }) {
  const [isActive] = useState();
  const bonds = useBonds();

  const checkPage = useCallback((match, location, page) => {
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
            <NavLink id="dash-nav" to="/dashboard" isActive={(match, location) => { return checkPage(match, location, "dashboard") }} className={`button button-dapp-menu ${isActive ? "active" : ""}`}>
              <DashboardIcon className="me-3" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink id="stake-nav" to="/" isActive={(match, location) => { return checkPage(match, location, "stake") }}  className={`button button-dapp-menu ${isActive ? "active" : ""}`} >
              <StakeIcon className="me-3" />
              <span>Stake</span>
            </NavLink>

            <NavLink id="bond-nav" to="/bonds" isActive={(match, location) => { return checkPage(match, location, "bonds") }} className={`button button-dapp-menu ${isActive ? "active" : ""}`}>
              <BondIcon className="me-3" />
              <span>Bond</span>
            </NavLink>

            {/* needs functions for discount calc */}
            <div className="dapp-menu-data discounts">
              <div className="bond-discounts">
                <p>Bond discounts</p>
                {bonds.map((bond, i) => (
                  <Link to={`/bonds/${bond.value}`} key={i} className={"bond"}>{bond.name}<span>{bond.discount ? trim(bond.discount * 100, 2) : ''}%</span></Link>
                ))}
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
