<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import React, { useCallback, useState, useEffect } from "react";
=======
import React, { useCallback, useState, useEffect } from 'react';
<<<<<<< HEAD
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
import { Link, NavLink } from "react-router-dom";
=======
=======
import React, { useCallback, useState, useEffect } from "react";
>>>>>>> fixed dep issues, updated formatting, styled mobile nav, styled migrate page
=======
import { useCallback, useState } from "react";
>>>>>>> top bar nearly done, sidebar refactored (mostly) to use material ui drawer, bootstrap removed, sidebar styled, typography implemented
import { NavLink } from "react-router-dom";
>>>>>>> sidebar responsiveness tweaks and link styling, stake table replaced with mui table
import Social from "../Social";
import OlympusLogo from "../../assets/logo.svg";
import externalUrls from "./externalUrls";
import { ReactComponent as StakeIcon } from "../../assets/icons/stake-icon.svg";
import { ReactComponent as BondIcon } from "../../assets/icons/bond-icon.svg";
import { ReactComponent as DashboardIcon } from "../../assets/icons/dashboard-icon.svg";
<<<<<<< HEAD
import { shorten, trim } from "../../helpers";
import "./sidebar.scss";
<<<<<<< HEAD
import orderBy from "lodash/orderBy";
=======
>>>>>>> updated stake page to use paper and Button components, still need to override hover styles
=======
import { trim } from "../../helpers";
>>>>>>> top bar nearly done, sidebar refactored (mostly) to use material ui drawer, bootstrap removed, sidebar styled, typography implemented
import useBonds from "../../hooks/Bonds";
import { Paper, Drawer, Link, Box, Button, Typography } from "@material-ui/core";
=======
=======
>>>>>>> Implement new menu design and only show add token when eth api is available
import { Drawer } from "@material-ui/core";
import NavContent from "./NavContent.jsx";
>>>>>>> fixed topbar, stake mobile buttons, bond view, bond modal
import "./sidebar.scss";
=======
import React, { useCallback, useState, useEffect } from 'react';
import { Link, NavLink } from "react-router-dom";
import Social from "../Social";
import OlympusLogo from '../../assets/logo.svg';
import externalUrls from './externalUrls';
import { ReactComponent as StakeIcon } from "../../assets/icons/stake-icon.svg";
import { ReactComponent as BondIcon } from "../../assets/icons/bond-icon.svg";
import { ReactComponent as DashboardIcon } from "../../assets/icons/dashboard-icon.svg";
import { shorten, trim } from "../../helpers";
import "./sidebar.scss";
import orderBy from 'lodash/orderBy'
import useBonds from "../../hooks/Bonds";

function Sidebar({ isExpanded, theme, currentIndex, address }) {
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

>>>>>>> Implement new menu design and only show add token when eth api is available

<<<<<<< HEAD
<<<<<<< HEAD
function Sidebar({ isExpanded, theme, currentIndex, address }) {
=======
function Sidebar() {
<<<<<<< HEAD
>>>>>>> top bar nearly done, sidebar refactored (mostly) to use material ui drawer, bootstrap removed, sidebar styled, typography implemented
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

=======
>>>>>>> fixed topbar, stake mobile buttons, bond view, bond modal
=======
function Sidebar({ address }) {
>>>>>>> refactored bond views
  return (
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
    <div className={`${isExpanded ? "show" : ""} d-lg-block sidebar collapse`} id="sidebarContent">
>>>>>>> fixed dep issues, updated formatting, styled mobile nav, styled migrate page
=======
=======
>>>>>>> Implement new menu design and only show add token when eth api is available
    <div className={`sidebar`} id="sidebarContent">
>>>>>>> top bar nearly done, sidebar refactored (mostly) to use material ui drawer, bootstrap removed, sidebar styled, typography implemented
      <Drawer variant="permanent" anchor="left">
<<<<<<< HEAD
<<<<<<< HEAD
        <Paper className="dapp-sidebar">
          <div className="dapp-menu-top">
            <Box className="branding-header">
              <Link href="https://olympusdao.finance" target="_blank">
                <img className="branding-header-icon" src={OlympusLogo} alt="OlympusDAO" />
                <Typography variant="h2" color="primary">
                  Olympus
                </Typography>
              </Link>
            </Box>

            <div className="dapp-menu-links">
              <div className="dapp-nav" id="navbarNav">
                <Link
                  component={NavLink}
                  id="dash-nav"
                  to="/dashboard"
                  isActive={(match, location) => {
                    return checkPage(match, location, "dashboard");
                  }}
                  className={`button-dapp-menu ${isActive ? "active" : ""}`}
                >
                  <Typography>
                    <DashboardIcon />
                    Dashboard
                  </Typography>
                </Link>

                <Link
                  component={NavLink}
                  id="stake-nav"
                  to="/"
                  isActive={(match, location) => {
                    return checkPage(match, location, "stake");
                  }}
                  className={`button-dapp-menu ${isActive ? "active" : ""}`}
                >
                  <Typography>
                    <StakeIcon />
                    Stake
                  </Typography>
                </Link>

                <Link
                  component={NavLink}
                  id="bond-nav"
                  to="/bonds"
                  isActive={(match, location) => {
                    return checkPage(match, location, "bonds");
                  }}
                  className={`button-dapp-menu ${isActive ? "active" : ""}`}
                >
                  <Typography>
                    <BondIcon />
                    Bond
                  </Typography>
                </Link>

                <div className="dapp-menu-data discounts">
                  <div className="bond-discounts">
                    <Typography variant="body2">Bond discounts</Typography>
                    {bonds.map((bond, i) => (
                      <Link component={NavLink} to={`/bonds/${bond.value}`} key={i} className={"bond"}>
                        <Typography variant="body2">
                          {bond.name}
                          <span>{bond.discount ? trim(bond.discount * 100, 2) : ""}%</span>
                        </Typography>
                      </Link>
                    ))}
                  </div>
                </div>
>>>>>>> sidebar spacing, mobile bond views, typography. anext up link colors and table format
              </div>
            </div>
          </div>
<<<<<<< HEAD

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

=======
>>>>>>> top bar nearly done, sidebar refactored (mostly) to use material ui drawer, bootstrap removed, sidebar styled, typography implemented
          <div className="dapp-menu-data bottom">
            <div className="dapp-menu-external-links">
              {Object.keys(externalUrls).map((link, i) => {
                return (
                  <Link key={i} href={`${externalUrls[link].url}`} target="_blank">
                    <Typography className="bond-pair-name">{externalUrls[link].icon}</Typography>
                    <Typography className="bond-pair-roi">{externalUrls[link].title}</Typography>
                  </Link>
                );
              })}
            </div>
>>>>>>> sidebar spacing, mobile bond views, typography. anext up link colors and table format
          </div>

<<<<<<< HEAD
<<<<<<< HEAD
          {theme === "girth" &&
>>>>>>> sidebar almost finished, just need to overide link colors and hover styles, stake page started
=======
          {theme === "girth" && (
>>>>>>> fixed dep issues, updated formatting, styled mobile nav, styled migrate page
            <div className="data-ohm-index">
              <p>Current Index </p>
              <p>{trim(currentIndex, 4)} OHM</p>
            </div>
<<<<<<< HEAD
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
=======
          )}
>>>>>>> fixed dep issues, updated formatting, styled mobile nav, styled migrate page
=======
>>>>>>> top bar nearly done, sidebar refactored (mostly) to use material ui drawer, bootstrap removed, sidebar styled, typography implemented
          <div className="dapp-menu-social">
            <Social />
          </div>
        </Paper>
=======
        <NavContent />
>>>>>>> fixed topbar, stake mobile buttons, bond view, bond modal
=======
        <NavContent address={address} />
>>>>>>> refactored bond views
      </Drawer>
=======
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
          {address && <div className={`branding-header m-3`}>
            <a href={`https://etherscan.io/address/${address}`} target="_blank">
              {shorten(address)}
            </a>
          </div>
          }
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
>>>>>>> Implement new menu design and only show add token when eth api is available
    </div>
>>>>>>> sidebar almost finished, just need to overide link colors and hover styles, stake page started
  );
}

export default Sidebar;
