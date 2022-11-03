import { t, Trans } from "@lingui/macro";
import { Box, Divider, Link, Paper, SvgIcon, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Icon, NavItem } from "@olympusdao/component-library";
import React from "react";
import { NavLink } from "react-router-dom";
import { ReactComponent as OlympusIcon } from "src/assets/icons/olympus-nav-header.svg";
import { sortByDiscount } from "src/helpers/bonds/sortByDiscount";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { NetworkId } from "src/networkDetails";
import { BondDiscount } from "src/views/Bond/components/BondDiscount";
import { useLiveBonds, useLiveBondsV3 } from "src/views/Bond/hooks/useLiveBonds";
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
              {chain.id === networks.MAINNET && (
                <>
                  <NavItem to="/dashboard" icon="dashboard" label={t`Dashboard`} />
                  <Box className="menu-divider">
                    <Divider sx={{ borderColor: theme.colors.gray[600] }} />
                  </Box>
                  <NavItem to="/bonds" icon="bond" label={t`Bond`}>
                    <Bonds />
                    <InverseBonds />
                  </NavItem>
                  {/* TODO: Replace w/ mainnet when contracts are on more than one network. */}
                  {chain.id === NetworkId.TESTNET_GOERLI && (
                    <NavItem to="/range" icon="range" label={t`Range`}>
                      <RangePrice bidOrAsk="ask" />
                      <RangePrice bidOrAsk="bid" />
                    </NavItem>
                  )}
                  <NavItem to="/stake" icon="stake" label={t`Stake`} />
                  {chain.id === NetworkId.TESTNET_GOERLI && (
                    <NavItem to="/governance" icon="governance" label={t`Governance`} />
                  )}
                  {/* <NavItem href="https://vote.olympusdao.finance/" icon="voting" label={t`Governance`} /> */}
                </>
              )}
              <Box className="menu-divider">
                <Divider sx={{ borderColor: theme.colors.gray[600] }} />
              </Box>
              <NavItem icon="bridge" label={t`Bridge`} to="/bridge" />
              <NavItem icon="transparency" label={t`Transparency`} href="https://www.olympusdao.finance/transparency" />
              <Box className="menu-divider">
                <Divider sx={{ borderColor: theme.colors.gray[600] }} />
              </Box>
            </div>
          </div>
        </div>
        <Box>
          <NavItem href="https://forum.olympusdao.finance/" icon="forum" label={t`Forum`} />
          <NavItem href="https://docs.olympusdao.finance/" icon="docs" label={t`Docs`} />
          <NavItem href="https://immunefi.com/bounty/olympus/" icon="alert-circle" label={t`Bug Bounty`} />
          <NavItem href="https://grants.olympusdao.finance/" icon="grants" label={t`Grants`} />
          <StyledBox display="flex" justifyContent="space-around" paddingY="24px">
            <Link href="https://github.com/OlympusDAO" target="_blank" rel="noopener noreferrer">
              <Icon name="github" className={classes.gray} />
            </Link>

            <Link href="https://olympusdao.medium.com/" target="_blank" rel="noopener noreferrer">
              <Icon name="medium" className={classes.gray} />
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

const Bonds: React.VFC = () => {
  const { data: bondsV2 = [] } = useLiveBonds();
  const { data: bondsV3 = [] } = useLiveBondsV3();

  const bonds = bondsV2.concat(bondsV3);

  if (!bonds || bonds.length === 0) return null;

  return (
    <Box ml="26px" mb="12px" mr="18px">
      {sortByDiscount(bonds)
        .filter(bond => !bond.isSoldOut)
        .map(bond => (
          <Box mt="8px" key={bond.id}>
            <Link key={bond.id} component={NavLink} to={`/bonds/${bond.isV3Bond ? `v3/` : ""}${bond.id}`}>
              <Box display="flex" flexDirection="row" justifyContent="space-between">
                <Typography variant="body1">{bond.quoteToken.name}</Typography>
                <BondDiscount discount={bond.discount} />
              </Box>
            </Link>
          </Box>
        ))}
    </Box>
  );
};

const RangePrice = (props: { bidOrAsk: "bid" | "ask" }) => {
  const { data, isFetched } = DetermineRangeDiscount(props.bidOrAsk);
  return (
    <>
      {isFetched && (
        <Box ml="26px" mt="12px" mb="12px" mr="18px">
          <Typography variant="body2" color="textSecondary">
            {props.bidOrAsk === "bid" ? t`Bid` : t`Ask`}
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

const InverseBonds: React.VFC = () => {
  const { data: bondsV2 = [] } = useLiveBonds({ isInverseBond: true });
  const { data: bondsV3 = [] } = useLiveBondsV3({ isInverseBond: true });

  const bonds = bondsV2.concat(bondsV3);

  if (!bonds || bonds.length === 0) return null;

  return (
    <Box ml="26px" mt="12px" mb="12px" mr="18px">
      <Typography variant="body2" color="textSecondary">
        <Trans>Inverse Bonds</Trans>
      </Typography>

      <Box mt="12px">
        {sortByDiscount(bonds)
          .filter(bond => !bond.isSoldOut)
          .map(bond => (
            <Box mt="8px" key={bond.id}>
              <Link component={NavLink} to={`/bonds/${bond.isV3Bond ? `v3/` : ""}inverse/${bond.id}`}>
                <Box display="flex" flexDirection="row" justifyContent="space-between">
                  <Typography variant="body1">{bond.quoteToken.name}</Typography>
                  <BondDiscount discount={bond.discount} />
                </Box>
              </Link>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default NavContent;
