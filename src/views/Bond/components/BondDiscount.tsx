import { Box, useTheme } from "@mui/material";
import { Chip } from "@olympusdao/component-library";
import { formatNumber } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";

export const BondDiscount: React.VFC<{ discount: DecimalBigNumber; textOnly?: boolean }> = ({ discount, textOnly }) => {
  const theme = useTheme();
  const discountString = `${formatNumber(Number(discount.mul(new DecimalBigNumber("100").toString())), 2)}%`;
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
      label={`${formatNumber(Number(discount.mul(new DecimalBigNumber("100")).toString()), 2)}%`}
      template={new DecimalBigNumber("0").gt(discount) ? "error" : "success"}
    />
  );
};
