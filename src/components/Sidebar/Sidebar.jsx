import React, { useEffect, useCallback, } from 'react';
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



function Sidebar({ isExpanded, setRoute, address, provider, blockExplorer, theme }) {
  const dispatch = useDispatch();

  const currentBlock  = useSelector((state ) => { return state.app.currentBlock });
  const currentIndex = useSelector((state) => { return state.app.currentIndex });

  // ohm_dai: "ohm_dai_lp",
  // dai: "dai",
  // dai_v1: "dai_v1",
  // ohm_dai_v1: "ohm_dai_lp_v1",

  const isSmallScreen = useMediaQuery("(max-width: 1200px)");


  const daiBondDiscount = useSelector(state => {
    return state.bonding['dai'] && state.bonding['dai'].bondDiscount;
  });

  const ohmDaiBondDiscount = useSelector(state => {
    return state.bonding['ohm_dai_lp'] && state.bonding['ohm_dai_lp'].bondDiscount;
  });

  const isBondPage = useCallback((match, location) => {
    if (!match) {
      return false;
    }

    return match.url.indexOf('bonds') >= 0 || match.url.indexOf('choose_bond') >= 0
  }, []);


  const checkPage = useCallback((match, location, page) => {
    // console.log(match);
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

  useEffect(() => {
    
  }, [])


  return (
    <div
      className={`${isExpanded ? 'show' : '' } ${isSmallScreen && "mobile" } d-md-block sidebar collapse`}
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
            <NavLink onClick={() => { setRoute("/dashboard" ) }} to="/dashboard" className="button button-dapp-menu " isActive={(match, location) => { return checkPage(match, location, "dashboard") }}>
              <DashboardIcon className="me-3" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink onClick={() => { setRoute("/" ) }} to="/" className="button button-dapp-menu" isActive={(match, location) => { return checkPage(match, location, "stake") }}>
              <StakeIcon className="me-3" />
              <span>Stake</span>
            </NavLink>

            <NavLink onClick={() => { setRoute("/bonds" ) }} to="/bonds" className="button button-dapp-menu" isActive={(match, location) => { return checkPage(match, location, "bonds") }}>
              <BondIcon className="me-3" />
              <span>Bond</span>
            </NavLink>

            {/* needs functions for discount calc */}
            <div className="dapp-menu-data discounts">
              <div className="bond-discounts">
                <p>Bond discounts</p>
                <p>OHM-DAI LP<span>{trim(ohmDaiBondDiscount * 100, 2)}%</span></p>
                <p>OHM-FRAX LP<span>12%</span></p>
                <p>DAI<span>{trim(daiBondDiscount * 100, 2)}%</span></p>
                <p>FRAX<span>9.5%</span></p>
              </div>
            </div>

            {/* <a href="https://olympusdao.finance/#/lpstake" className="button button-dapp-menu">
              <i className="fa fa-water me-3" />
              <span>LP Staking</span>
            </a> */}
          </div>
        </div>

        <hr />

        <div className="dapp-menu-external-links">
          { Object.keys(externalUrls).map((link, i) => {
            return <a key={i} href={externalUrls[link].url} target="_blank" className="button button-dapp-menu">
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
