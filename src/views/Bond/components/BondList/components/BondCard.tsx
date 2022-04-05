import { t, Trans } from "@lingui/macro";
import { Box, Link, SvgIcon, Typography } from "@material-ui/core";
import { TertiaryButton, TokenStack } from "@olympusdao/component-library";
import { NavLink } from "react-router-dom";
import { ReactComponent as ArrowUp } from "src/assets/icons/arrow-up.svg";
import { Bond } from "src/views/Bond/hooks/useBonds";

import { BondDiscount } from "../../BondDiscount";
import { BondDuration } from "../../BondDuration";
import { BondPrice } from "../../BondPrice";

export const BondCard: React.VFC<{ bond: Bond; isInverseBond?: boolean }> = ({ bond, isInverseBond }) => (
  <Box id={bond.id + `--bond`} mt="32px">
    <Box display="flex" alignItems="center">
      <TokenStack tokens={bond.quoteToken.icons} />

      <Box display="flex" flexDirection="column" ml="8px">
        <Typography>{bond.quoteToken.name}</Typography>

        <Link href={bond.quoteToken.purchaseUrl} target="_blank">
          <Box display="flex" alignItems="center">
            <Typography>
              <Trans>Get Asset</Trans>
            </Typography>

            <Box ml="4px">
              <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
            </Box>
          </Box>
        </Link>
      </Box>
    </Box>

    <Box display="flex" justifyContent="space-between" mt="16px">
      <Typography>
        <Trans>Price</Trans>
      </Typography>

      <Typography>{bond.isSoldOut ? "--" : <BondPrice price={bond.price.inUsd} />}</Typography>
    </Box>

    <Box display="flex" justifyContent="space-between" mt="8px">
      <Typography>
        <Trans>Discount</Trans>
      </Typography>

      <Typography>{bond.isSoldOut ? "--" : <BondDiscount discount={bond.discount} />}</Typography>
    </Box>

    {isInverseBond && (
      <Box display="flex" justifyContent="space-between" mt="8px">
        <Typography>
          <Trans>Payout</Trans>
        </Typography>

        <Typography>{bond.baseToken.name}</Typography>
      </Box>
    )}

    {!isInverseBond && (
      <Box display="flex" justifyContent="space-between" mt="8px">
        <Typography>
          <Trans>Duration</Trans>
        </Typography>

        <Typography>
          <BondDuration duration={bond.duration} />
        </Typography>
      </Box>
    )}

    <Box mt="16px">
      <Link component={NavLink} to={isInverseBond ? `/bonds/inverse/${bond.id}` : `/bonds/${bond.id}`}>
        <TertiaryButton fullWidth>
          {isInverseBond
            ? `${t`Bond`} ${bond.quoteToken.name} ${t`for`} ${bond.baseToken.name}`
            : `${t`Bond`} ${bond.quoteToken.name}`}
        </TertiaryButton>
      </Link>
    </Box>
  </Box>
);
