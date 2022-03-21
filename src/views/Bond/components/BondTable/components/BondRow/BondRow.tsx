import { t, Trans } from "@lingui/macro";
import { Link, SvgIcon, TableCell, TableRow, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { TertiaryButton, TokenStack } from "@olympusdao/component-library";
import { NavLink } from "react-router-dom";
import { ReactComponent as ArrowUp } from "src/assets/icons/arrow-up.svg";
import { formatCurrency } from "src/helpers";
import { getBondById } from "src/helpers/bonds/getBondById";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { prettifySecondsInDays } from "src/helpers/timeUtil";
import { useLiveBondData } from "src/views/Bond/hooks/useLiveBondData";

export const BondRow: React.VFC<{ id: string; isInverseBond?: boolean }> = ({ id, isInverseBond = false }) => {
  const bond = getBondById(id);
  const info = useLiveBondData(id).data;

  return (
    <TableRow id={id + `--bond`}>
      <TableCell className="bond-logo-cell">
        <TokenStack tokens={bond.quoteToken.icons} />
      </TableCell>

      <TableCell className="bond-logo-cell">
        <Typography>{bond.quoteToken.name}</Typography>

        <Link color="primary" target="_blank" href={bond.quoteToken.purchaseUrl}>
          <Typography>
            <Trans>Get Asset</Trans>

            <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
          </Typography>
        </Link>
      </TableCell>

      {isInverseBond && (
        <TableCell className="bond-logo-cell">
          <div className="logo-container">
            <TokenStack tokens={bond.quoteToken.icons} />

            <div className="bond-name">
              <Typography>{bond.quoteToken.name}</Typography>

              <Link color="primary" target="_blank" href={bond.quoteToken.purchaseUrl}>
                <Typography>
                  <Trans>Get Asset</Trans>

                  <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
                </Typography>
              </Link>
            </div>
          </div>
        </TableCell>
      )}

      <TableCell>
        <BondPrice price={info?.price} />
      </TableCell>

      <TableCell>
        <BondDiscount discount={info?.discount} />
      </TableCell>

      <TableCell>
        <BondDuration duration={info?.duration} />
      </TableCell>

      <TableCell>
        <Link component={NavLink} to={isInverseBond ? `/bonds/inverse/${id}` : `/bonds/${id}`}>
          <TertiaryButton fullWidth>{t`do_bond`}</TertiaryButton>
        </Link>
      </TableCell>
    </TableRow>
  );
};

const BondPrice: React.VFC<{ price?: DecimalBigNumber }> = props => {
  if (!props.price) return <Skeleton width={80} />;

  return <Typography>{formatCurrency(props.price.toApproxNumber(), 2)}</Typography>;
};

const BondDiscount: React.VFC<{ discount?: DecimalBigNumber }> = props => {
  if (!props.discount) return <Skeleton width={80} />;

  return (
    <Typography style={new DecimalBigNumber("0", 0).gt(props.discount) ? { color: "red" } : {}}>
      {props.discount.mul(new DecimalBigNumber("100", 0), 9).toFormattedString(2)}%
    </Typography>
  );
};

const BondDuration: React.VFC<{ duration?: number }> = props => {
  if (!props.duration) return <Skeleton width={80} />;

  return <Typography>{prettifySecondsInDays(props.duration)}</Typography>;
};
