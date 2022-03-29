import { Skeleton } from "@material-ui/lab";
import { formatCurrency } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";

export const BondPrice: React.VFC<{ price?: DecimalBigNumber }> = ({ price }) => {
  return price ? <>{formatCurrency(price.toApproxNumber(), 2)}</> : <Skeleton width={60} />;
};
