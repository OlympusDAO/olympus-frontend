import { t, Trans } from "@lingui/macro";
import { Box, Link, SvgIcon, Typography } from "@material-ui/core";
import { TertiaryButton, TokenStack } from "@olympusdao/component-library";
import { NavLink } from "react-router-dom";
import { ReactComponent as ArrowUp } from "src/assets/icons/arrow-up.svg";
import { BONDS } from "src/constants/bonds";
import { useLiveBondData } from "src/views/Bond/hooks/useLiveBondData";

import { BondDiscount } from "./BondDiscount";
import { BondDuration } from "./BondDuration";
import { BondPrice } from "./BondPrice";

export const BondCard: React.VFC<{ id: string; isInverseBond?: boolean }> = ({ id, isInverseBond = false }) => {
  const bond = BONDS[id];
  const info = useLiveBondData(id).data;

  return (
    <Box id={`${id}--bond`}>
      <Box display="flex" alignItems="center" mb="16px">
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

      <Box display="flex" justifyContent="space-between" mt="8px">
        <Typography>
          <Trans>Price</Trans>
        </Typography>

        <BondPrice price={info?.price} />
      </Box>

      <Box display="flex" justifyContent="space-between" mt="8px">
        <Typography>
          <Trans>Discount</Trans>
        </Typography>

        <BondDiscount discount={info?.discount} />
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

          <BondDuration duration={info?.duration} />
        </Box>
      )}

      <Box mt="16px">
        <Link component={NavLink} to={isInverseBond ? `/bonds/inverse/${id}` : `/bonds/${id}`}>
          <TertiaryButton fullWidth>
            {isInverseBond
              ? `${t`Bond`} ${bond.quoteToken.name} ${t`for`} ${bond.baseToken.name}`
              : `${t`Bond`} ${bond.quoteToken.name}`}
          </TertiaryButton>
        </Link>
      </Box>
    </Box>
  );
};
