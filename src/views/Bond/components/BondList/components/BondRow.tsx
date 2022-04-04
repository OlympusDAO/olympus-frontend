import { t, Trans } from "@lingui/macro";
import { Box, Link, SvgIcon, TableCell, TableRow, Typography } from "@material-ui/core";
import { TertiaryButton, TokenStack } from "@olympusdao/component-library";
import { NavLink } from "react-router-dom";
import { ReactComponent as ArrowUp } from "src/assets/icons/arrow-up.svg";
import { Token } from "src/helpers/contracts/Token";
import { Bond } from "src/views/Bond/hooks/useBonds";

import { BondDiscount } from "../../BondDiscount";
import { BondDuration } from "../../BondDuration";
import { BondPrice } from "../../BondPrice";

export const BondRow: React.VFC<{ bond: Bond; isInverseBond?: boolean }> = ({ bond, isInverseBond }) => (
  <TableRow id={bond.id + `--bond`}>
    <TableCell style={{ padding: "8px 0" }}>
      <TokenIcons token={bond.quoteToken} />
    </TableCell>

    {isInverseBond && (
      <TableCell style={{ padding: "8px 0" }}>
        <TokenIcons token={bond.baseToken} />
      </TableCell>
    )}

    <TableCell style={{ padding: "8px 0" }}>
      <Typography>{bond.isSoldOut ? "--" : <BondPrice price={bond.price.inUsd} />}</Typography>
    </TableCell>

    <TableCell style={{ padding: "8px 0" }}>
      <Typography>{bond.isSoldOut ? "--" : <BondDiscount discount={bond.discount} />}</Typography>
    </TableCell>

    <TableCell style={{ padding: "8px 0" }}>
      <Typography>{bond.isSoldOut ? "--" : <BondDuration duration={bond.duration} />}</Typography>
    </TableCell>

    <TableCell style={{ padding: "8px 0" }}>
      <Link component={NavLink} to={isInverseBond ? `/bonds/inverse/${bond.id}` : `/bonds/${bond.id}`}>
        <TertiaryButton fullWidth disabled={bond.isSoldOut}>
          {bond.isSoldOut ? "Sold Out" : t`do_bond`}
        </TertiaryButton>
      </Link>
    </TableCell>
  </TableRow>
);

const TokenIcons: React.VFC<{ token: Token }> = ({ token }) => (
  <Box display="flex" alignItems="center">
    <TokenStack tokens={token.icons} />

    <Box display="flex" flexDirection="column" ml="16px">
      <Typography>{token.name}</Typography>

      <Link color="primary" target="_blank" href={token.purchaseUrl}>
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
);
