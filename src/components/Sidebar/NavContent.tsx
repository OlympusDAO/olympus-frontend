import { Box, Link, Paper, SvgIcon, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Icon } from "@olympusdao/component-library";
import React from "react";
import { NavLink } from "react-router-dom";
import lendAndBorrowIcon from "src/assets/icons/lendAndBorrow.svg?react";
import OlympusIcon from "src/assets/icons/olympus-nav-header.svg?react";
import NavItem from "src/components/library/NavItem";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { BondDiscount } from "src/views/Bond/components/BondDiscount";
import { DetermineRangeDiscount } from "src/views/Range/hooks";
import { useNetwork } from "wagmi";

const PREFIX = "NavContent";

const classes = {
  gray: `${PREFIX}-gray`,
};

const StyledBox = styled(Box)(({ theme }) => ({
  [`& .${classes.gray}`]: {
    color: theme.colors.gray[90],
  },
}));

const NavContent: React.VFC = () => {
  const theme = useTheme();
  const { chain = { id: 1 } } = useNetwork();
  const networks = useTestableNetworks();

  return (
    <Paper className="dapp-sidebar">
      <Box className="dapp-sidebar-inner" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
          <Box className="branding-header">
            <Link href="https://olympusdao.finance" target="_blank" rel="noopener noreferrer">
              <SvgIcon
                color="primary"
                viewBox="0 0 50 50"
                component={OlympusIcon}
                style={{ minWidth: "51px", minHeight: "51px", width: "51px" }}
              />
              <Typography fontSize="24px" fontWeight="700" lineHeight="32px">
                Olympus
              </Typography>
            </Link>
          </Box>

          <div className="dapp-menu-links">
            <div className="dapp-nav" id="navbarNav">
              <NavItem to="/my-balances" icon="stake" label={`My Balances`} />
              <NavItem to="/dashboard" icon="dashboard" label={`Protocol Metrics`} />
              {chain.id === networks.MAINNET ? (
                <>
                  <NavItem
                    customIcon={<SvgIcon component={lendAndBorrowIcon} viewBox="0 0 21 21" />}
                    label={`Cooler Loans`}
                    to="/lending/cooler"
                  />
                  <NavItem to="/range" icon="range" label={`RBS`} />
                  <NavItem icon="settings" label={`Utility`} to="/utility" />
                  <NavItem to="/governance" icon="voting" label={`Govern`} />
                </>
              ) : (
                <>
                  <NavItem icon="settings" label={`Utility`} to="/utility" />
                  <NavItem href="https://vote.olympusdao.finance/" icon="voting" label={`Govern`} />
                </>
              )}
              <NavItem icon="bridge" label={`Bridge`} to="/bridge" />
            </div>
          </div>
        </div>
        <Box>
          <NavItem href="https://forum.olympusdao.finance/" icon="forum" label={`Forum`} />
          <NavItem href="https://docs.olympusdao.finance/" icon="docs" label={`Docs`} />
          <NavItem href="https://immunefi.com/bounty/olympus/" icon="alert-circle" label={`Bug Bounty`} />
          <StyledBox display="flex" justifyContent="space-around" paddingY="24px">
            <Link href="https://github.com/OlympusDAO" target="_blank" rel="noopener noreferrer">
              <Icon name="github" className={classes.gray} />
            </Link>
            <Link href="https://twitter.com/OlympusDAO" target="_blank" rel="noopener noreferrer">
              <Icon name="twitter" className={classes.gray} />
            </Link>
            <Link href="https://discord-invite.olympusdao.finance" target="_blank" rel="noopener noreferrer">
              <Icon name="discord" className={classes.gray} />
            </Link>
          </StyledBox>
        </Box>
      </Box>
    </Paper>
  );
};

const RangePrice = (props: { bidOrAsk: "bid" | "ask" }) => {
  const { data, isFetched } = DetermineRangeDiscount(props.bidOrAsk);
  return (
    <>
      {isFetched && (
        <Box ml="26px" mt="12px" mb="12px" mr="18px">
          <Typography variant="body2" color="textSecondary">
            {props.bidOrAsk === "bid" ? `Bid` : `Ask`}
          </Typography>
          <Box mt="12px">
            <Box mt="8px">
              <Link component={NavLink} to={`/range`}>
                <Box display="flex" flexDirection="row" justifyContent="space-between">
                  <Typography variant="body1">{data.quoteToken}</Typography>
                  <BondDiscount discount={new DecimalBigNumber(data.discount.toString())} />
                </Box>
              </Link>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default NavContent;
