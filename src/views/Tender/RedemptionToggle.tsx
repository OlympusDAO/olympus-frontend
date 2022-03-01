import { Box, Divider, Switch, Typography } from "@material-ui/core";
import { FC } from "react";

import { WrappedToStaked } from "./queries";
interface RedemptionToggleProps {
  quantity: number;
  daiExchangeRate: number;
  redeemToken: number;
  onChange: () => void;
  gOhmExchangeRate: number;
  gOhmPrice: number;
  depositTokenValue: number;
  depositTokenLabel: string;
}
export const RedemptionToggle: FC<RedemptionToggleProps> = ({
  quantity,
  daiExchangeRate,
  redeemToken,
  onChange,
  gOhmExchangeRate,
  gOhmPrice,
  depositTokenValue,
  depositTokenLabel,
}) => {
  const amount = depositTokenValue === 2 ? WrappedToStaked(quantity) : quantity;
  const USD = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
  const gOhmValue = (amount * gOhmExchangeRate) / gOhmPrice;
  const daiValue = amount * daiExchangeRate;
  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        marginTop="15px"
        marginBottom="25px"
        textAlign="center"
      >
        <Typography>Deposit for DAI</Typography>
        <Switch checked={redeemToken ? true : false} onChange={onChange} color="default" />
        <Typography>Deposit for gOHM</Typography>
      </Box>
      <Divider color="secondary" />
    </>
  );
};
