import { formatCurrency } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useOhmPrice } from "src/hooks/usePrices";

export const BondPrice: React.VFC<{ price: DecimalBigNumber; isInverseBond?: boolean; isV3Bond?: boolean }> = ({
  price,
  isInverseBond,
  isV3Bond,
}) => {
  const { data: ohmPrice = 0 } = useOhmPrice();
  const oneOHM = new DecimalBigNumber("1");
  const bondPrice =
    isInverseBond && !isV3Bond ? oneOHM.div(price).mul(new DecimalBigNumber(ohmPrice.toString())) : price;
  return <>{formatCurrency(bondPrice.toApproxNumber(), 2)}</>;
};
