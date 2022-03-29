import { t, Trans } from "@lingui/macro";
import { Box, Link, SvgIcon, TableCell, TableRow, Typography } from "@material-ui/core";
import { TertiaryButton, TokenStack } from "@olympusdao/component-library";
import { NavLink } from "react-router-dom";
import { ReactComponent as ArrowUp } from "src/assets/icons/arrow-up.svg";
import { Bond } from "src/helpers/bonds/Bond";
import { useBondData } from "src/views/Bond/hooks/useBondData";

import { BondDiscount } from "../../../../BondDiscount";
import { BondDuration } from "../../../../BondDuration";
import { BondPrice } from "../../../../BondPrice";

export const BondRow: React.VFC<{ bond: Bond; isInverseBond?: boolean }> = props => {
  const info = useBondData(props.bond).data;

  return (
    <TableRow id={props.bond.id + `--bond`}>
      <TableCell style={{ padding: "8px 0" }}>
        <Box display="flex" alignItems="center">
          <TokenStack tokens={props.bond.quoteToken.icons} />

          <Box display="flex" flexDirection="column" ml="16px">
            <Typography>{props.bond.quoteToken.name}</Typography>

            <Link color="primary" target="_blank" href={props.bond.quoteToken.purchaseUrl}>
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

      {props.isInverseBond && (
        <TableCell style={{ padding: "8px 0" }}>
          <Box display="flex" alignItems="center">
            <TokenStack tokens={props.bond.baseToken.icons} />

            <Box display="flex" flexDirection="column" ml="16px">
              <Typography>{props.bond.baseToken.name}</Typography>

              <Link color="primary" target="_blank" href={props.bond.baseToken.purchaseUrl}>
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
        <Typography>
          <BondPrice price={info?.price} />
        </Typography>
      </TableCell>

      <TableCell style={{ padding: "8px 0" }}>
        <Typography>
          <BondDiscount discount={info?.discount} />
        </Typography>
      </TableCell>

      <TableCell style={{ padding: "8px 0" }}>
        <BondDuration duration={info?.duration} />
      </TableCell>

      <TableCell style={{ padding: "8px 0" }}>
        <Link
          component={NavLink}
          to={props.isInverseBond ? `/bonds/inverse/${props.bond.id}` : `/bonds/${props.bond.id}`}
        >
          <TertiaryButton fullWidth>{t`do_bond`}</TertiaryButton>
        </Link>
      </TableCell>
    </TableRow>
  );
};
