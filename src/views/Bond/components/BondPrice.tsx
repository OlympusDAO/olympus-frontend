import { formatCurrency } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useOhmPrice } from "src/hooks/usePrices";

export const BondPrice: React.VFC<{ price: DecimalBigNumber; isInverseBond?: boolean }> = ({
  price,
  isInverseBond,
}) => {
  const { data: ohmPrice = 0 } = useOhmPrice();
  const bondPrice = isInverseBond ? price.mul(new DecimalBigNumber(ohmPrice.toString())) : price;
  return <>{formatCurrency(bondPrice.toApproxNumber(), 2)}</>;
};
