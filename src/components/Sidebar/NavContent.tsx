import { t } from "@lingui/macro";
import { Box, Divider, Link, Paper, SvgIcon, Typography } from "@material-ui/core";
import { Icon, NavItem } from "@olympusdao/component-library";
import React from "react";
import { NavLink } from "react-router-dom";
import { BONDS } from "src/constants/bonds";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useWeb3Context } from "src/hooks/web3Context";
import { BondDiscount } from "src/views/Bond/components/BondList/components/BondDiscount";
import { useLiveBondData } from "src/views/Bond/hooks/useLiveBondData";
import { useLiveBondMarkets } from "src/views/Bond/hooks/useLiveBondMarkets";

import { ReactComponent as OlympusIcon } from "../../assets/icons/olympus-nav-header.svg";
import WalletAddressEns from "../TopBar/Wallet/WalletAddressEns";

const NavContent: React.VFC = () => {
  const { networkId } = useWeb3Context();
  const networks = useTestableNetworks();

  return (
    <Paper className="dapp-sidebar">
      <Box className="dapp-sidebar-inner" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
          <Box className="branding-header">
            <Link href="https://olympusdao.finance" target="_blank">
              <SvgIcon
                color="primary"
                viewBox="0 0 151 100"
                component={OlympusIcon}
                style={{ minWidth: "151px", minHeight: "98px", width: "151px" }}
              />
            </Link>

            <WalletAddressEns />
          </Box>

          <div className="dapp-menu-links">
            <div className="dapp-nav" id="navbarNav">
              {networkId === networks.MAINNET ? (
                <>
                  <NavItem to="/dashboard" icon="dashboard" label={t`Dashboard`} />

                  <NavItem to="/bonds" icon="bond" label={t`Bond`} />

                  <Bonds />

                  <NavItem to="/stake" icon="stake" label={t`Stake`} />

                  <NavItem to="/zap" icon="zap" label={t`Zap`} />

                  {Environment.isGiveEnabled() && <NavItem to="/give" icon="give" label={t`Give`} chip={t`New`} />}

                  <NavItem to="/wrap" icon="wrap" label={t`Wrap`} />

                  <NavItem
                    icon="bridge"
                    label={t`Bridge`}
                    href="https://synapseprotocol.com/?inputCurrency=gOHM&outputCurrency=gOHM&outputChain=43114"
                  />

                  <Box className="menu-divider">
                    <Divider />
                  </Box>

                  <NavItem href="https://pro.olympusdao.finance/" icon="olympus" label={t`Olympus Pro`} />

                  <Box className="menu-divider">
                    <Divider />
                  </Box>
                </>
              ) : (
                <>
                  <NavItem to="/wrap" icon="wrap" label={t`Wrap`} />

                  <NavItem
                    icon="bridge"
                    label={t`Bridge`}
                    href="https://synapseprotocol.com/?inputCurrency=gOHM&outputCurrency=gOHM&outputChain=43114"
                  />
                </>
              )}

              <NavItem href="https://forum.olympusdao.finance/" icon="forum" label={t`Forum`} />

              <NavItem href="https://vote.olympusdao.finance/" icon="governance" label={t`Governance`} />

              <NavItem href="https://docs.olympusdao.finance/" icon="docs" label={t`Docs`} />

              <NavItem href="https://immunefi.com/bounty/olympus/" icon="bug-report" label={t`Bug Bounty`} />

              <NavItem href="https://grants.olympusdao.finance/" icon="grants" label={t`Grants`} />
            </div>
          </div>
        </div>

        <Box display="flex" justifyContent="space-between" paddingX="50px" paddingY="24px">
          <Link href="https://github.com/OlympusDAO" target="_blank">
            <Icon name="github" />
          </Link>

          <Link href="https://olympusdao.medium.com/" target="_blank">
            <Icon name="medium" />
          </Link>

          <Link href="https://twitter.com/OlympusDAO" target="_blank">
            <Icon name="twitter" />
          </Link>

          <Link href="https://discord.gg/6QjjtUcfM4" target="_blank">
            <Icon name="discord" />
          </Link>
        </Box>
      </Box>
    </Paper>
  );
};

const Bonds: React.VFC = () => {
  const markets = useLiveBondMarkets().data;
  const inverseMarkets = useLiveBondMarkets({ isInverseBond: true }).data;

  if (!markets || !inverseMarkets) return null;

  return (
    <Box paddingLeft="62px" paddingRight="32px" paddingY="8px">
      {markets.length > 0 && markets.map(id => <BondInfo key={id} id={id} />)}

      {inverseMarkets.length > 0 && inverseMarkets.map(id => <BondInfo key={id} id={id} />)}
    </Box>
  );
};

const BondInfo: React.VFC<{ id: string }> = ({ id }) => {
  const bond = BONDS[id];
  const info = useLiveBondData(id).data;

  return (
    <Link component={NavLink} to={`/bonds/${id}`}>
      <Box display="flex" alignItems="center" justifyContent="space-between" paddingY="4px">
        <Typography variant="body2">{bond.quoteToken.name}</Typography>
        <BondDiscount isSmallText discount={info?.discount} />
      </Box>
    </Link>
  );
};

export default NavContent;
