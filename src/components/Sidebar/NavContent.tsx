import { Box, Link, Paper, SvgIcon, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { Icon } from "@olympusdao/component-library";
import React from "react";
import { cdIcon } from "src/assets/cdIcon";
import lendAndBorrowIcon from "src/assets/icons/lendAndBorrow.svg?react";
import OlympusIcon from "src/assets/icons/olympus-nav-header.svg?react";
import rewardsIcon from "src/assets/icons/rewards.svg?react";
import managerRewardsIcon from "src/assets/icons/rewards-manager.svg?react";
import NavItem from "src/components/library/NavItem";
import { SAFE_REWARDS_ADDRESSES } from "src/constants/addresses";
import { LibChainId, useGETAdminMultisigMembers } from "src/generated/olympusUnits";
import { formatCurrency } from "src/helpers";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { useGohmPriceContract } from "src/hooks/usePrices";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { usePriceContractPrice } from "src/views/Range/hooks";
import { useAccount, useNetwork } from "wagmi";

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
  const { chain = { id: 1 } } = useNetwork();
  const { address: userAddress } = useAccount();
  const networks = useTestableNetworks();
  const { data: ohmPrice } = usePriceContractPrice();
  const { data: gohmPrice } = useGohmPriceContract();
  const theme = useTheme();

  const chainId = (chain?.id || LibChainId.NUMBER_11155111) as LibChainId;

  const safeAddress = SAFE_REWARDS_ADDRESSES[chainId as keyof typeof SAFE_REWARDS_ADDRESSES];

  // Check if user is a Safe owner
  const { data: multisigData } = useGETAdminMultisigMembers(
    {
      chainId,
      safeAddress,
    },
    {
      query: {
        enabled: !!userAddress,
      },
    },
  );

  const isRewardsManager =
    userAddress && multisigData?.owners.some(owner => owner.toLowerCase() === userAddress.toLowerCase());

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
              <NavItem
                href="https://deposit.olympusdao.finance"
                customIcon={<SvgIcon component={cdIcon} viewBox="0 0 24 24" />}
                label={`Convertible Deposits`}
                rel="noopener noreferrer"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  window.open("https://deposit.olympusdao.finance", "_blank", "noopener,noreferrer");
                }}
              />
              {protocolMetricsEnabled && <NavItem to="/dashboard" icon="dashboard" label={`Protocol Metrics`} />}
              {chain.id === networks.MAINNET_SEPOLIA ? (
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
              <NavItem
                customIcon={<SvgIcon component={rewardsIcon} viewBox="0 0 21 21" />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    Rewards
                    <Box
                      sx={{
                        width: "30px",
                        height: "16px",
                        border: `1px solid`,
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography fontSize="10px" fontWeight={600}>
                        Soon
                      </Typography>
                    </Box>
                  </Box>
                }
                to="/rewards"
              />
              {isRewardsManager && (
                <NavItem
                  customIcon={<SvgIcon component={managerRewardsIcon} viewBox="0 0 21 21" />}
                  label="Rewards Manager"
                  to="/manager-rewards"
                />
              )}
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
