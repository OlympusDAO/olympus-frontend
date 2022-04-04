import { formatCurrency } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";

export const BondPrice: React.VFC<{ price: DecimalBigNumber }> = ({ price }) => {
  return <>{formatCurrency(price.toApproxNumber(), 2)}</>;
};
