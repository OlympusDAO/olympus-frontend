import { Trans } from "@lingui/macro";
import { Box, Button, Link, Typography } from "@material-ui/core";
import { BigNumber } from "bignumber.js";
import { NavLink, useLocation } from "react-router-dom";
import { isSupportedChain } from "src/slices/GiveThunk";

type GiveHeaderProps = {
  isSmallScreen: boolean;
  isVerySmallScreen: boolean;
  redeemableBalance: BigNumber;
  networkId: number;
};

export function GiveHeader({ isSmallScreen, isVerySmallScreen, redeemableBalance, networkId }: GiveHeaderProps) {
  const location = useLocation();

  return (
    <Box className={`give-subnav ${isSmallScreen || isVerySmallScreen ? "smaller" : ""}`}>
      <Link
        component={NavLink}
        id="give-sub-dash"
        to="/give"
        className={`give-option ${
          location.pathname.replace("/", "") == "give" || location.pathname.replace("/", "").includes("give/projects")
            ? "give-active"
            : ""
        }`}
      >
        <Button color="secondary">
          <Typography variant="h6">
            <Trans>Projects</Trans>
          </Typography>
        </Button>
      </Link>
      <Link
        component={NavLink}
        id="give-sub-donations"
        to="/give/donations"
        className={`give-option ${location.pathname.replace("/", "") == "give/donations" ? "give-active" : ""}`}
      >
        <Button color="secondary">
          <Typography variant="h6">
            <Trans>My Donations</Trans>
          </Typography>
        </Button>
      </Link>
      {new BigNumber(redeemableBalance).gt(new BigNumber(0)) && isSupportedChain(networkId) ? (
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
