import { Box, useTheme } from "@mui/material";
import { Chip } from "@olympusdao/component-library";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";

export const BondDiscount: React.VFC<{ discount: DecimalBigNumber; textOnly?: boolean }> = ({ discount, textOnly }) => {
  const theme = useTheme();
  const discountString = `${discount.mul(new DecimalBigNumber("100")).toString({ decimals: 2, trim: false })}%`;
  return textOnly ? (
    <Box
      style={{
        color: new DecimalBigNumber("0").gt(discount) ? theme.colors.feedback.error : theme.colors.feedback.pnlGain,
      }}
    >
      {discountString}
    </Box>
  ) : (
    <Chip
      label={`${discount.mul(new DecimalBigNumber("100")).toString({ decimals: 2, trim: false })}%`}
      template={new DecimalBigNumber("0").gt(discount) ? "error" : "success"}
    />
  );
};
