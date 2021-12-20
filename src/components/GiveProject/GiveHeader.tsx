import { Trans } from "@lingui/macro";
import { Box, Button, Link, Typography } from "@material-ui/core";
import { BigNumber } from "bignumber.js";
import { NavLink } from "react-router-dom";
import { isSupportedChain } from "src/slices/GiveThunk";

type GiveHeaderProps = {
  isSmallScreen: boolean;
  isVerySmallScreen: boolean;
  redeemableBalance: BigNumber;
  networkId: number;
};

export function GiveHeader({ isSmallScreen, isVerySmallScreen, redeemableBalance, networkId }: GiveHeaderProps) {
  return (
    <Box className={`give-subnav ${isSmallScreen && "smaller"}`}>
      <Link
        component={NavLink}
        id="give-sub-dash"
        to="/give"
        className={`give-option ${location.pathname.replace("/", "") == "give" ? "give-active" : ""}`}
      >
        <Button variant="contained" color="secondary">
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
        <Button variant="contained" color="secondary">
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
          className={`give-option ${location.pathname.replace("/", "") == "give/redeem" ? "active" : ""}`}
        >
          <Button variant="contained" color="secondary">
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
