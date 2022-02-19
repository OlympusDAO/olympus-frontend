
import { Box, Link } from "@material-ui/core";
import { TextButton } from "@olympusdao/component-library";
import { Trans } from "@lingui/macro";
import { Box, Button, Link, Typography } from "@material-ui/core";
import { BigNumber } from "bignumber.js";
import { NavLink, useLocation } from "react-router-dom";
import { NetworkId } from "src/constants";
import { isSupportedChain } from "src/slices/GiveThunk";

type GiveHeaderProps = {
  isSmallScreen: boolean;
  isVerySmallScreen: boolean;
  totalDebt: BigNumber;
  networkId: NetworkId;
};

export function GiveHeader({ isSmallScreen, isVerySmallScreen, totalDebt, networkId }: GiveHeaderProps) {
  const location = useLocation();
  const isDonationsTabActive = location.pathname.replace("/", "") == "give/donations";
  const isGiveTabActive =
    location.pathname.replace("/", "") == "give" || location.pathname.replace("/", "").includes("give/projects");

  return (
    <Box className={`give-subnav ${isSmallScreen || isVerySmallScreen ? "smaller" : ""}`}>
      <Link
        component={NavLink}
        id="give-sub-dash"
        to="/give"
        className={`give-option ${isGiveTabActive ? "give-active" : ""}`}
      >
        <TextButton>Give</TextButton>
      </Link>
      <Link
        component={NavLink}
        id="give-sub-donations"
        to="/give/donations"
        className={`give-option ${isDonationsTabActive ? "give-active" : ""}`}
      >
        <TextButton>My Donations</TextButton>
      </Link>
      {new BigNumber(totalDebt).gt(new BigNumber(0)) && isSupportedChain(networkId) ? (
        <Link
          component={NavLink}
          id="give-sub-redeem"
          to="/give/redeem"
          className={`give-option ${location.pathname.replace("/", "") == "give/redeem" ? "give-active" : ""}`}
        >
          <TextButton>Redeem</TextButton>
        </Link>
      ) : (
        <></>
      )}
    </Box>
  );
}
