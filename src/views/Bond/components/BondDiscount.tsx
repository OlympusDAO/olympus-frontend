import { useTheme } from "@material-ui/core";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";

export const BondDiscount: React.VFC<{ discount: DecimalBigNumber }> = ({ discount }) => {
  const theme = useTheme();

  return (
    <span
      style={{
        color: new DecimalBigNumber("0").gt(discount) ? theme.colors.feedback.error : theme.colors.feedback.pnlGain,
      }}
    >
      {discount.mul(new DecimalBigNumber("100")).toString({ decimals: 2, trim: false })}%
    </span>
  );
};
