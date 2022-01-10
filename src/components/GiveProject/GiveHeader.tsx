import { Trans } from "@lingui/macro";
import { Box, Button, Link, Typography, useTheme } from "@material-ui/core";
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
  const theme = useTheme();
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
        <Button color="secondary">
          <Typography variant="h6">
            <Trans>Give</Trans>
          </Typography>
        </Button>
      </Link>
      <Link
        component={NavLink}
        id="give-sub-donations"
        to="/give/donations"
        className={`give-option ${isDonationsTabActive ? "give-active" : ""}`}
      >
        <Button color="secondary">
          <Typography variant="h6">
            <Trans>My Donations</Trans>
          </Typography>
        </Button>
      </Link>
      {new BigNumber(totalDebt).gt(new BigNumber(0)) && isSupportedChain(networkId) ? (
        <Link
          component={NavLink}
          id="give-sub-redeem"
          to="/give/redeem"
          className={`give-option ${location.pathname.replace("/", "") == "give/redeem" ? "give-active" : ""}`}
        >
          <Button color="secondary">
            <Typography variant="h6">
              <Trans>Redeem</Trans>
            </Typography>
          </Button>
        </Link>
      ) : (
        <></>
      )}
    </Box>
  );
}
