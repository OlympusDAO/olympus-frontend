import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import Social from "../Social";
import OlympusLogo from "../../assets/logo.svg";
import externalUrls from "./externalUrls";
import { ReactComponent as StakeIcon } from "../../assets/icons/stake-icon.svg";
import { ReactComponent as BondIcon } from "../../assets/icons/bond-icon.svg";
import { ReactComponent as DashboardIcon } from "../../assets/icons/dashboard-icon.svg";
import { trim } from "../../helpers";
import useBonds from "../../hooks/Bonds";
import { Paper, Link, Box, Button, Typography } from "@material-ui/core";
import "./sidebar.scss";

function NavContent() {
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
          </div>
        </div>
      </div>
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
      </div>

      <div className="dapp-menu-social">
        <Social />
      </div>
    </Paper>
  );
}

export default NavContent;
