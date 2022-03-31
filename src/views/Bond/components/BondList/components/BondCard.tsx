import { t, Trans } from "@lingui/macro";
import { Box, Link, SvgIcon, Typography } from "@material-ui/core";
import { TertiaryButton, TokenStack } from "@olympusdao/component-library";
import { NavLink } from "react-router-dom";
import { ReactComponent as ArrowUp } from "src/assets/icons/arrow-up.svg";
import { Bond } from "src/helpers/bonds/Bond";
import { useBondData } from "src/views/Bond/hooks/useBondData";

import { BondDiscount } from "../../BondDiscount";
import { BondDuration } from "../../BondDuration";
import { BondPrice } from "../../BondPrice";

export const BondCard: React.VFC<{ bond: Bond; isInverseBond?: boolean }> = props => {
  const info = useBondData(props.bond).data;

  return (
    <Box id={props.bond.id + `--bond`}>
      <Box display="flex" alignItems="center" mb="16px">
        <TokenStack tokens={props.bond.quoteToken.icons} />

        <Box display="flex" flexDirection="column" ml="8px">
          <Typography>{props.bond.quoteToken.name}</Typography>

          <Link href={props.bond.quoteToken.purchaseUrl} target="_blank">
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

      <Box display="flex" justifyContent="space-between" mt="8px">
        <Typography>
          <Trans>Price</Trans>
        </Typography>

        <Typography>
          <BondPrice price={info?.price.inUsd} />
        </Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" mt="8px">
        <Typography>
          <Trans>Discount</Trans>
        </Typography>

        <Typography>
          <BondDiscount discount={info?.discount} />
        </Typography>
      </Box>

      {props.isInverseBond && (
        <Box display="flex" justifyContent="space-between" mt="8px">
          <Typography>
            <Trans>Payout</Trans>
          </Typography>

          <Typography>{props.bond.baseToken.name}</Typography>
        </Box>
      )}

      {!props.isInverseBond && (
        <Box display="flex" justifyContent="space-between" mt="8px">
          <Typography>
            <Trans>Duration</Trans>
          </Typography>

          <BondDuration duration={info?.duration} />
        </Box>
      )}

      <Box mt="16px">
        <Link
          component={NavLink}
          to={props.isInverseBond ? `/bonds/inverse/${props.bond.id}` : `/bonds/${props.bond.id}`}
        >
          <TertiaryButton fullWidth>
            {props.isInverseBond
              ? `${t`Bond`} ${props.bond.quoteToken.name} ${t`for`} ${props.bond.baseToken.name}`
              : `${t`Bond`} ${props.bond.quoteToken.name}`}
          </TertiaryButton>
        </Link>
      </Box>
    </Box>
  );
};
