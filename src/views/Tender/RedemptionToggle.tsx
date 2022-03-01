import { Box, Divider, Switch, Typography } from "@material-ui/core";
import { FC } from "react";

interface RedemptionToggleProps {
  redeemToken: number;
  onChange: () => void;
}
export const RedemptionToggle: FC<RedemptionToggleProps> = ({ redeemToken, onChange }) => {
  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        marginTop="15px"
        marginBottom="25px"
        textAlign="center"
      >
        <Typography>Deposit for DAI</Typography>
        <Box style={{ paddingLeft: "10px", paddingRight: "10px" }}>
          <Switch checked={redeemToken ? true : false} onChange={onChange} color="default" />
        </Box>
        <Typography>Deposit for gOHM</Typography>
      </Box>
      <Divider color="secondary" />
    </>
  );
};
