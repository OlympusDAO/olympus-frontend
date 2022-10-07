import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";

export const BondPrice: React.VFC<{
  price: DecimalBigNumber;
  isInverseBond?: boolean;
  isV3Bond?: boolean;
  symbol: string;
}> = ({ price, isInverseBond, isV3Bond, symbol }) => {
  const oneOHM = new DecimalBigNumber("1");
  const bondPrice = isInverseBond && !isV3Bond ? oneOHM.div(price) : price;
  return (
    <>
      {bondPrice.toString({ decimals: 2, format: true, trim: false })} {symbol}
    </>
  );
};
