import { Box, Divider, Switch, Typography } from "@material-ui/core";
import { FC } from "react";

interface RedemptionToggleProps {
  quantity: number;
  daiValue: number;
  redeemToken: number;
  onChange: () => void;
  gOhmValue: number;
}
export const RedemptionToggle: FC<RedemptionToggleProps> = ({
  quantity,
  daiValue,
  redeemToken,
  onChange,
  gOhmValue,
}) => {
  //Currency formatters for the token balances
  const usdValue = quantity ? new Intl.NumberFormat("en-US").format(Number(quantity) * 55) : 0;
  const gOhm = new Intl.NumberFormat("en-US").format(gOhmValue);
  const dai = new Intl.NumberFormat("en-US").format(daiValue);
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
        <Typography>
          Deposit {quantity} Chicken for ${dai} DAI
        </Typography>
        <Switch checked={redeemToken ? true : false} onChange={onChange} color="default" />
        <Typography>
          Deposit {quantity} Chicken for {gOhm} gOHM (~${usdValue})
        </Typography>
      </Box>
      <Divider color="secondary" />
    </>
  );
};
