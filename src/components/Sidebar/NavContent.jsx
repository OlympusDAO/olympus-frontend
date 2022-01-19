import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Social from "./Social";
import externalUrls from "./externalUrls";
import { ReactComponent as OlympusIcon } from "../../assets/icons/olympus-nav-header.svg";
import { t, Trans } from "@lingui/macro";
import { trim } from "../../helpers";
import { useWeb3Context } from "src/hooks/web3Context";
import useBonds from "../../hooks/Bonds";
import { EnvHelper } from "src/helpers/Environment";
import WalletAddressEns from "../TopBar/Wallet/WalletAddressEns";
import { NetworkId } from "src/constants";
import {
  Paper,
  Link,
  Box,
  Typography,
  SvgIcon,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import { getAllBonds, getUserNotes } from "src/slices/BondSliceV2";
import { Skeleton } from "@material-ui/lab";
import "./sidebar.scss";
import { useDispatch } from "react-redux";
import { ExpandMore } from "@material-ui/icons";
import { useAppSelector } from "src/hooks";
import { NavItem } from "@olympusdao/component-library";

function NavContent({ handleDrawerToggle }) {
  const [isActive] = useState();
  const { networkId, address, provider } = useWeb3Context();
  const { bonds } = useBonds(networkId);
  const location = useLocation();
  const dispatch = useDispatch();

  const bondsV2 = useAppSelector(state => {
    return state.bondingV2.indexes.map(index => state.bondingV2.bonds[index]);
  });

  useEffect(() => {
    const interval = setTimeout(() => {
      dispatch(getAllBonds({ address, networkID: networkId, provider }));
      dispatch(getUserNotes({ address, networkID: networkId, provider }));
    }, 60000);
    return () => clearTimeout(interval);
  });
  const sortedBonds = bondsV2
    .filter(bond => bond.soldOut === false)
    .sort((a, b) => {
      return a.discount > b.discount ? -1 : b.discount > a.discount ? 1 : 0;
    });

  bonds.sort((a, b) => b.bondDiscount - a.bondDiscount);

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
                style={{ minWdth: "151px", minHeight: "98px", width: "151px" }}
              />
            </Link>

            <WalletAddressEns />
          </Box>

          <div className="dapp-menu-links">
            <div className="dapp-nav" id="navbarNav">
              {networkId === NetworkId.MAINNET || networkId === NetworkId.TESTNET_RINKEBY ? (
                <>
                  <NavItem to="/dashboard" icon={"dashboard"} label={t`Dashboard`} onClick={handleDrawerToggle} />
                  <NavItem to="/bonds" icon="bond" label={t`Bond`} onClick={handleDrawerToggle} />
                  <div className="dapp-menu-data discounts">
                    <div className="bond-discounts">
                      <Accordion className="discounts-accordion" square defaultExpanded="true">
                        <AccordionSummary
                          expandIcon={
                            <ExpandMore
                              className="discounts-expand"
                              viewbox="0 0 12 12"
                              style={{ width: "18px", height: "18px" }}
                            />
                          }
                        >
                          <Typography variant="body2">
                            <Trans>Highest ROI</Trans>
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {sortedBonds.map((bond, i) => {
                            return (
                              <Link
                                component={NavLink}
                                to={`/bonds/${bond.index}`}
                                key={i}
                                className={"bond"}
                                onClick={handleDrawerToggle}
                              >
                                <Typography variant="body2">
                                  {bond.displayName}
                                  <span className="bond-pair-roi">
                                    {`${bond.discount && trim(bond.discount * 100, 2)}%`}
                                  </span>
                                </Typography>
                              </Link>
                            );
                          })}
                          {sortedBonds.length > 0 && (
                            <Box className="menu-divider">
                              <Divider />
                            </Box>
                          )}
                          {bonds.map((bond, i) => {
                            if (bond.getBondability(networkId) || bond.getLOLability(networkId)) {
                              return (
                                <Link
                                  component={NavLink}
                                  to={`/bonds-v1/${bond.name}`}
                                  key={i}
                                  className={"bond"}
                                  onClick={handleDrawerToggle}
                                >
                                  {!bond.bondDiscount ? (
                                    <Skeleton variant="text" width={"150px"} />
                                  ) : (
                                    <Typography variant="body2">
                                      {`${bond.displayName} (v1)`}

                                      <span className="bond-pair-roi">
                                        {bond.isLOLable[networkId]
                                          ? "--"
                                          : !bond.isBondable[networkId]
                                          ? "Sold Out"
                                          : `${bond.bondDiscount && trim(bond.bondDiscount * 100, 2)}%`}
                                        {/* {!bond.isBondable[networkId]
                                              ? "Sold Out"
                                              : `${bond.bondDiscount && trim(bond.bondDiscount * 100, 2)}%`} */}
                                      </span>
                                    </Typography>
                                  )}
                                </Link>
                              );
                            }
                          })}
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  </div>
                  <NavItem to="/stake" icon="stake" label={t`Stake`} onClick={handleDrawerToggle} />

                  {/* NOTE (appleseed-olyzaps): OlyZaps disabled until v2 contracts */}
                  {/*<NavItem to="/zap" icon="zap" label={t`Zap`} /> */}

                  {EnvHelper.isGiveEnabled(location.search) && (
                    <NavItem to="/give" icon="give" label={t`Give`} chip={t`New`} onClick={handleDrawerToggle} />
                  )}
                  <NavItem to="/wrap" icon="wrap" label={t`Wrap`} onClick={handleDrawerToggle} />
                  <NavItem
                    href={"https://synapseprotocol.com/?inputCurrency=gOHM&outputCurrency=gOHM&outputChain=43114"}
                    icon="bridge"
                    label={t`Bridge`}
                    onClick={handleDrawerToggle}
                  />
                  <Box className="menu-divider">
                    <Divider />
                  </Box>
                  <NavItem
                    href="https://pro.olympusdao.finance/"
                    icon="olympus"
                    label={t`Olympus Pro`}
                    onClick={handleDrawerToggle}
                  />
                  {/* <NavItem to="/33-together" icon="33-together" label={t`3,3 Together`} /> */}
                  <Box className="menu-divider">
                    <Divider />
                  </Box>
                </>
              ) : (
                <>
                  <NavItem to="/wrap" icon="wrap" label={t`Wrap`} onClick={handleDrawerToggle} />
                  <NavItem
                    href="https://synapseprotocol.com/?inputCurrency=gOHM&outputCurrency=gOHM&outputChain=43114"
                    icon="bridge"
                    label={t`Bridge`}
                    onClick={handleDrawerToggle}
                  />
                </>
              )}
              {Object.keys(externalUrls).map((link, i) => {
                return (
                  <NavItem
                    href={`${externalUrls[link].url}`}
                    icon={externalUrls[link].icon}
                    label={externalUrls[link].title}
                    onClick={handleDrawerToggle}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <Box className="dapp-menu-social" display="flex" justifyContent="space-between" flexDirection="column">
          <Social />
        </Box>
      </Box>
    </Paper>
  );
}

export default NavContent;
