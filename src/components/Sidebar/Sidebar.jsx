<<<<<<< HEAD
import React, { useCallback, useState, useEffect } from "react";
=======
import React, { useCallback, useState, useEffect } from 'react';
<<<<<<< HEAD
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
import { Link, NavLink } from "react-router-dom";
=======
import { NavLink } from "react-router-dom";
>>>>>>> sidebar responsiveness tweaks and link styling, stake table replaced with mui table
import Social from "../Social";
import OlympusLogo from "../../assets/logo.svg";
import externalUrls from "./externalUrls";
import { ReactComponent as StakeIcon } from "../../assets/icons/stake-icon.svg";
import { ReactComponent as BondIcon } from "../../assets/icons/bond-icon.svg";
import { ReactComponent as DashboardIcon } from "../../assets/icons/dashboard-icon.svg";
import { shorten, trim } from "../../helpers";
import "./sidebar.scss";
<<<<<<< HEAD
import orderBy from "lodash/orderBy";
=======
>>>>>>> updated stake page to use paper and Button components, still need to override hover styles
import useBonds from "../../hooks/Bonds";
import { Paper, Drawer, Link, Button } from "@material-ui/core";

function Sidebar({ isExpanded, theme, currentIndex, address }) {
  const [isActive] = useState();
  const bonds = useBonds();

  const checkPage = useCallback((match, location, page) => {
    const currentPath = location.pathname.replace("/", "");
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
<<<<<<< HEAD
<<<<<<< HEAD
    <div className={`${isExpanded ? "show" : ""} d-lg-block sidebar collapse`} id="sidebarContent">
      <div className="dapp-sidebar">
=======
    // <div
    //   className={`${isExpanded ? 'show' : '' } d-lg-block sidebar collapse`}
    //   id="sidebarContent"
    // >
    <Drawer
      variant="permanent"
      anchor="left"
=======
    <div
      className={`${isExpanded ? 'show' : '' } d-lg-block sidebar collapse`}
      id="sidebarContent"
>>>>>>> sidebar almost finished, just need to overide link colors and hover styles, stake page started
    >
<<<<<<< HEAD
    <Drawer variant="permanent" anchor="left">
      <Paper className="dapp-sidebar">
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
        <div className="dapp-menu-top">
          <div className="branding-header">
            <a href="https://olympusdao.finance" target="_blank">
              <img className="branding-header-icon" src={OlympusLogo} alt="OlympusDAO" />
              <h3>Olympus</h3>
            </a>
          </div>
<<<<<<< HEAD
          {address && (
            <div className={`branding-header m-3`}>
              <a
                style={{ color: theme === "light" ? "black" : "white" }}
                href={`https://etherscan.io/address/${address}`}
                target="_blank"
              >
                {shorten(address)}
              </a>
            </div>
          )}
        </div>
=======
        
>>>>>>> sidebar almost finished, just need to overide link colors and hover styles, stake page started

        <div className="dapp-menu-links">
          <div className="dapp-nav" id="navbarNav">
            <NavLink
              id="dash-nav"
              to="/dashboard"
              isActive={(match, location) => {
                return checkPage(match, location, "dashboard");
              }}
              className={`button button-dapp-menu ${isActive ? "active" : ""}`}
            >
              <DashboardIcon className="me-3" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              id="stake-nav"
              to="/"
              isActive={(match, location) => {
                return checkPage(match, location, "stake");
              }}
              className={`button button-dapp-menu ${isActive ? "active" : ""}`}
            >
              <StakeIcon className="me-3" />
              <span>Stake</span>
            </NavLink>

            <NavLink
              id="bond-nav"
              to="/bonds"
              isActive={(match, location) => {
                return checkPage(match, location, "bonds");
              }}
              className={`button button-dapp-menu ${isActive ? "active" : ""}`}
            >
              <BondIcon className="me-3" />
              <span>Bond</span>
            </NavLink>

            {/* needs functions for discount calc */}
            <div className="dapp-menu-data discounts">
              <div className="bond-discounts">
                <p>Bond discounts</p>
                {bonds.map((bond, i) => (
<<<<<<< HEAD
                  <Link to={`/bonds/${bond.value}`} key={i} className={"bond"}>
                    {bond.name}
                    <span style={{ fontWeight: "bold" }}>{bond.discount ? trim(bond.discount * 100, 2) : ""} %</span>
                  </Link>
=======
                  <Link to={`/bonds/${bond.value}`} key={i} className={"bond"}>{bond.name}<span>{bond.discount ? trim(bond.discount * 100, 2) : ''}%</span></Link>
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
                ))}
=======
      <Drawer variant="permanent" anchor="left">
        <Paper className="dapp-sidebar">
          <div className="dapp-menu-top">
            <div className="branding-header">
              <a href="https://olympusdao.finance" target="_blank">
                <img className="branding-header-icon" src={OlympusLogo} alt="OlympusDAO" />
                <h3>Olympus</h3>
              </a>
            </div>
          
            <div className="dapp-menu-links">
              <div className="dapp-nav" id="navbarNav">
                <NavLink id="dash-nav" to="/dashboard" isActive={(match, location) => { return checkPage(match, location, "dashboard") }} className={`button-dapp-menu ${isActive ? "active" : ""}`}>
                  <DashboardIcon className="me-3" />
                  <span>Dashboard</span>
                </NavLink>

                <NavLink id="stake-nav" to="/" isActive={(match, location) => { return checkPage(match, location, "stake") }}  className={`button-dapp-menu ${isActive ? "active" : ""}`} >
                  <StakeIcon className="me-3" />
                  <span>Stake</span>
                </NavLink>

                <NavLink id="bond-nav" to="/bonds" isActive={(match, location) => { return checkPage(match, location, "bonds") }} className={`button-dapp-menu ${isActive ? "active" : ""}`}>
                  <BondIcon className="me-3" />
                  <span>Bond</span>
                </NavLink>

                <div className="dapp-menu-data discounts">
                  <div className="bond-discounts">
                    <p>Bond discounts</p>
                    {bonds.map((bond, i) => (
                      <Link component={NavLink} to={`/bonds/${bond.value}`} key={i} className={"bond"}>{bond.name}<span>{bond.discount ? trim(bond.discount * 100, 2) : ''}%</span></Link>
                    ))}
                  </div>
                </div>
>>>>>>> sidebar spacing, mobile bond views, typography. anext up link colors and table format
              </div>
            </div>
          </div>

<<<<<<< HEAD
<<<<<<< HEAD
        <div className="dapp-menu-external-links">
          {Object.keys(externalUrls).map((link, i) => {
            return (
              <a key={i} href={`${externalUrls[link].url}`} target="_blank" className="button button-dapp-menu">
                {externalUrls[link].icon}
                <span>{externalUrls[link].title}</span>
              </a>
            );
          })}
        </div>

        <div className="dapp-menu-data bottom">
          {theme === "girth" && (
=======
        <div className="dapp-menu-data bottom">
          <div className="dapp-menu-external-links">
            { Object.keys(externalUrls).map((link, i) => {
              return <a key={i} href={`${externalUrls[link].url}`} target="_blank" className="button button-dapp-menu">
                {externalUrls[link].icon}
                <span>{externalUrls[link].title}</span>
              </a>
              }
            )}
=======
          <hr />

          <div className="dapp-menu-data bottom">
            <div className="dapp-menu-external-links">
              { Object.keys(externalUrls).map((link, i) => {
                return <a key={i} href={`${externalUrls[link].url}`} target="_blank" className="button button-dapp-menu">
                  <span className="bond-pair-name">{externalUrls[link].icon}</span>
                  <span className="bond-pair-roi">{externalUrls[link].title}</span>
                </a>
                }
              )}
            </div>
>>>>>>> sidebar spacing, mobile bond views, typography. anext up link colors and table format
          </div>

          {theme === "girth" &&
>>>>>>> sidebar almost finished, just need to overide link colors and hover styles, stake page started
            <div className="data-ohm-index">
              <p>Current Index </p>
              <p>{trim(currentIndex, 4)} OHM</p>
            </div>
<<<<<<< HEAD
          )}
        </div>

        <div className="dapp-menu-social">
          <Social />
        </div>
<<<<<<< HEAD
      </div>
    </div>
=======

      </Paper>
      </Drawer>
    // </div>
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
=======
          }
          <div className="dapp-menu-social">
            <Social />
          </div>
          
        </Paper>
      </Drawer>
    </div>
>>>>>>> sidebar almost finished, just need to overide link colors and hover styles, stake page started
  );
}

export default Sidebar;
