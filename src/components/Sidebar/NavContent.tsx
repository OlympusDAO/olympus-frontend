/* eslint-disable */
import "./Sidebar.scss";

import { t, Trans } from "@lingui/macro";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Link,
  Paper,
  SvgIcon,
  Typography,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { NavItem } from "@olympusdao/component-library";
import React from "react";
import { NavLink } from "react-router-dom";
import { NetworkId } from "src/constants";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { useAppSelector } from "src/hooks";
import { useWeb3Context } from "src/hooks/web3Context";
import { Bond } from "src/lib/Bond";
import { IBondDetails } from "src/slices/BondSlice";
import { getAllBonds, getUserNotes } from "src/slices/BondSliceV2";
import { DisplayBondDiscount } from "src/views/BondV2/BondV2";

import { ReactComponent as OlympusIcon } from "../../assets/icons/olympus-nav-header.svg";
import useBonds from "../../hooks/useBonds";
import WalletAddressEns from "../TopBar/Wallet/WalletAddressEns";
import externalUrls from "./externalUrls";
import Social from "./Social";
import { trim } from "src/helpers";

type NavContentProps = {
  handleDrawerToggle?: () => void;
};

type CustomBond = Bond & Partial<IBondDetails>;

const NavContent: React.FC<NavContentProps> = ({ handleDrawerToggle }) => {
  const { networkId, address, provider } = useWeb3Context();
  // const { bonds } = useBonds(networkId);

  const bondsV2 = useAppSelector(state => state.bondingV2.indexes.map(index => state.bondingV2.bonds[index]));
  const inverseBonds = useAppSelector(state =>
    state.inverseBonds.indexes.map(index => state.inverseBonds.bonds[index]),
  );

  const sortedBonds = bondsV2
    .filter(bond => bond.soldOut === false)
    .sort((a, b) => {
      return a.discount > b.discount ? -1 : b.discount > a.discount ? 1 : 0;
    });

  const sortedInverseBonds = inverseBonds
    .filter(bond => bond.soldOut === false)
    .sort((a, b) => {
      return a.discount > b.discount ? -1 : b.discount > a.discount ? 1 : 0;
    });

  // bonds.sort((a: CustomBond, b: CustomBond) => b.bondDiscount! - a.bondDiscount!);

  return (
    <Paper className="dapp-sidebar">
      <Box className="dapp-sidebar-inner" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
          <Box className="branding-header">
            <Link href="https://olympusdao.finance" target="_blank">
              <SvgIcon
                color="primary"
                component={OlympusIcon}
                viewBox="0 0 151 100"
                style={{ minWidth: "151px", minHeight: "98px", width: "151px" }}
              />
            </Link>
            <WalletAddressEns />
          </Box>

          <div className="dapp-menu-links">
            <div className="dapp-nav" id="navbarNav">
              {networkId === NetworkId.MAINNET || networkId === NetworkId.TESTNET_RINKEBY ? (
                <>
                  <NavItem to="/dashboard" icon="dashboard" label={t`Dashboard`} />
                  <NavItem to="/bonds" icon="bond" label={t`Bond`}>
                    {sortedBonds.map((bond, i) => (
                      <NavItem
                        to={`/bonds/${bond.index}`}
                        key={i}
                        onClick={handleDrawerToggle}
                        label={bond.displayName}
                        chip={`${bond.discount && trim(bond.discount * 100, 2)}%`}
                        chipColor={bond.discount && bond.discount < 0 ? "error" : "success"}
                      />
                    ))}
                    {sortedInverseBonds.map((bond, i) => (
                      <NavItem
                        to={`/bonds/inverse/${bond.index}`}
                        key={i}
                        onClick={handleDrawerToggle}
                        label={bond.displayName}
                        chip={`${bond.discount && trim(bond.discount * 100, 2)}%`}
                        chipColor={bond.discount && bond.discount < 0 ? "error" : "success"}
                      />
                    ))}
                  </NavItem>
                  <NavItem to="/stake" icon="stake" label={t`Stake`} />

                  {/* NOTE (appleseed-olyzaps): OlyZaps disabled until v2 contracts */}
                  <NavItem to="/zap" icon="zap" label={t`Zap`} />

                  {Environment.isGiveEnabled() && <NavItem to="/give" icon="give" label={t`Give`} />}
                  <NavItem to="/wrap" icon="wrap" label={t`Wrap`} />
                  <NavItem
                    href={"https://synapseprotocol.com/?inputCurrency=gOHM&outputCurrency=gOHM&outputChain=43114"}
                    icon="bridge"
                    label={t`Bridge`}
                  />
                  <Box className="menu-divider">
                    <Divider />
                  </Box>
                  <NavItem href="https://pro.olympusdao.finance/" icon="olympus" label={t`Olympus Pro`} />
                  {/* <NavItem to="/33-together" icon="33-together" label={t`3,3 Together`} /> */}
                  <Box className="menu-divider">
                    <Divider />
                  </Box>
                </>
              ) : (
                <>
                  <NavItem to="/wrap" icon="wrap" label={t`Wrap`} />
                  <NavItem
                    href="https://synapseprotocol.com/?inputCurrency=gOHM&outputCurrency=gOHM&outputChain=43114"
                    icon="bridge"
                    label={t`Bridge`}
                  />
                </>
              )}
              {}
              {Object.keys(externalUrls).map((link: any, i: number) => (
                <NavItem
                  key={i}
                  href={`${externalUrls[link].url}`}
                  icon={externalUrls[link].icon as any}
                  label={externalUrls[link].title as any}
                />
              ))}
            </div>
          </div>
        </div>
        <Box className="dapp-menu-social" display="flex" justifyContent="space-between" flexDirection="column">
          <Social />
        </Box>
      </Box>
    </Paper>
  );
};

export default NavContent;
