import { useTheme } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";

export const BondDiscount: React.VFC<{ discount?: DecimalBigNumber }> = ({ discount }) => {
  const theme = useTheme();

  if (!discount) return <Skeleton width={60} />;

  return (
    <span
      style={{
        color: new DecimalBigNumber("0", 0).gt(discount) ? theme.colors.feedback.error : theme.colors.feedback.pnlGain,
      }}
    >
      {discount.mul(new DecimalBigNumber("100", 0), 9).toFormattedString(2)}%
    </span>
  );
};
