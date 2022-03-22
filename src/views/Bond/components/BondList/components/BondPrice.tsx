import { Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { formatCurrency } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";

export const BondPrice: React.VFC<{ price?: DecimalBigNumber }> = props => {
  if (!props.price) return <Skeleton width={60} />;

  return <Typography>{formatCurrency(props.price.toApproxNumber(), 2)}</Typography>;
};
