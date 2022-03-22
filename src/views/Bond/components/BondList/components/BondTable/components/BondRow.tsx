import { t, Trans } from "@lingui/macro";
import { Box, Link, SvgIcon, TableCell, TableRow, Typography } from "@material-ui/core";
import { TertiaryButton, TokenStack } from "@olympusdao/component-library";
import { NavLink } from "react-router-dom";
import { ReactComponent as ArrowUp } from "src/assets/icons/arrow-up.svg";
import { BONDS } from "src/constants/bonds";
import { useLiveBondData } from "src/views/Bond/hooks/useLiveBondData";

import { BondDiscount } from "../../BondDiscount";
import { BondDuration } from "../../BondDuration";
import { BondPrice } from "../../BondPrice";

export const BondRow: React.VFC<{ id: string; isInverseBond?: boolean }> = ({ id, isInverseBond = false }) => {
  const bond = BONDS[id];
  const info = useLiveBondData(id).data;

  return (
    <TableRow id={id + `--bond`}>
      <TableCell style={{ padding: "8px 0" }}>
        <Box display="flex" alignItems="center">
          <TokenStack tokens={bond.quoteToken.icons} />

          <Box display="flex" flexDirection="column" ml="16px">
            <Typography>{bond.quoteToken.name}</Typography>

            <Link color="primary" target="_blank" href={bond.quoteToken.purchaseUrl}>
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
      </TableCell>

      {isInverseBond && (
        <TableCell style={{ padding: "8px 0" }}>
          <Box display="flex" alignItems="center">
            <TokenStack tokens={bond.baseToken.icons} />

            <Box display="flex" flexDirection="column" ml="16px">
              <Typography>{bond.baseToken.name}</Typography>

              <Link color="primary" target="_blank" href={bond.baseToken.purchaseUrl}>
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
        </TableCell>
      )}

      <TableCell style={{ padding: "8px 0" }}>
        <BondPrice price={info?.price} />
      </TableCell>

      <TableCell style={{ padding: "8px 0" }}>
        <BondDiscount discount={info?.discount} />
      </TableCell>

      <TableCell style={{ padding: "8px 0" }}>
        <BondDuration duration={info?.duration} />
      </TableCell>

      <TableCell style={{ padding: "8px 0" }}>
        <Link component={NavLink} to={isInverseBond ? `/bonds/inverse/${id}` : `/bonds/${id}`}>
          <TertiaryButton fullWidth>{t`do_bond`}</TertiaryButton>
        </Link>
      </TableCell>
    </TableRow>
  );
};
