import { Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";

export const BondDiscount: React.VFC<{ discount?: DecimalBigNumber; isSmallText?: boolean }> = props => {
  if (!props.discount) return <Skeleton width={60} />;

  return (
    <Typography
      variant={props.isSmallText ? "body2" : "body1"}
      style={new DecimalBigNumber("0", 0).gt(props.discount) ? { color: "red" } : {}}
    >
      {props.discount.mul(new DecimalBigNumber("100", 0), 9).toFormattedString(2)}%
    </Typography>
  );
};
