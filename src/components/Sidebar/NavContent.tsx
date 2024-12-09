import { Box, Link, Paper, SvgIcon, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Icon } from "@olympusdao/component-library";
import React from "react";
import lendAndBorrowIcon from "src/assets/icons/lendAndBorrow.svg?react";
import OlympusIcon from "src/assets/icons/olympus-nav-header.svg?react";
import NavItem from "src/components/library/NavItem";
import { formatCurrency } from "src/helpers";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { useGohmPriceDefiLlama, useOhmPriceDefillama } from "src/hooks/usePrices";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
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
  const { data: ohmPrice } = useOhmPriceDefillama();
  const { data: gohmPrice } = useGohmPriceDefiLlama();

  const protocolMetricsEnabled = Boolean(Environment.getWundergraphNodeUrl());
  const emissionsManagerEnabled = Environment.getEmissionsManagerEnabled();
  const rbsDisabled = Environment.getRbsDisabled();
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
            <Box display="flex" flexDirection="column" mt="10px">
              <Box fontSize="12px" fontWeight="500" lineHeight={"15px"}>
                OHM Price: {formatCurrency(ohmPrice || 0, 2)}
              </Box>
              <Box fontSize="12px" fontWeight="500" lineHeight="15px">
                gOHM Price: {formatCurrency(gohmPrice || 0, 2)}
              </Box>
            </Box>
          </Box>

          <div className="dapp-menu-links">
            <div className="dapp-nav" id="navbarNav">
              <NavItem to="/my-balances" icon="stake" label={`My Balances`} />
              {protocolMetricsEnabled && <NavItem to="/dashboard" icon="dashboard" label={`Protocol Metrics`} />}
              {chain.id === networks.MAINNET ? (
                <>
                  <NavItem
                    customIcon={<SvgIcon component={lendAndBorrowIcon} viewBox="0 0 21 21" />}
                    label={`Cooler Loans`}
                    to="/lending/cooler"
                  />
                  {emissionsManagerEnabled && <NavItem to="/emission" icon="range" label={`Emission Manager`} />}
                  {!rbsDisabled && <NavItem to="/range" icon="range" label={`RBS`} />}
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

export default NavContent;
