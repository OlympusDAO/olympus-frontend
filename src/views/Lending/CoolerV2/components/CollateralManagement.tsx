import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useState } from "react";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { COOLER_V2_MONOCOOLER_ADDRESSES, GOHM_ADDRESSES } from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useMonoCoolerCollateral } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerCollateral";
import { useMonoCoolerPosition } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerPosition";

export const CollateralManagement = () => {
  const { data: position } = useMonoCoolerPosition();
  const { addCollateral, withdrawCollateral } = useMonoCoolerCollateral();
  const [addAmount, setAddAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleAddCollateral = async () => {
    if (!addAmount) return;
    try {
      await addCollateral.mutateAsync({
        amount: parseUnits(addAmount, 18).toString(),
      });
      setAddAmount("");
    } catch (error) {
      console.error("Error adding collateral:", error);
    }
  };

  const handleWithdrawCollateral = async () => {
    if (!withdrawAmount) return;
    try {
      await withdrawCollateral.mutateAsync({
        amount: parseUnits(withdrawAmount, 18).toString(),
      });
      setWithdrawAmount("");
    } catch (error) {
      console.error("Error withdrawing collateral:", error);
    }
  };

  return (
    <Paper>
      <Box p={2}>
        <Typography variant="h5">Manage Collateral</Typography>
        <Box mt={2} display="flex" flexDirection="column" gap={2}>
          <Box>
            <Typography variant="body1" mb={1}>
              Add Collateral
            </Typography>
            <Box display="flex" gap={1}>
              <TextField
                type="number"
                value={addAmount}
                onChange={e => setAddAmount(e.target.value)}
                placeholder="Amount in gOHM"
                fullWidth
              />
              <TokenAllowanceGuard
                tokenAddressMap={GOHM_ADDRESSES}
                spenderAddressMap={COOLER_V2_MONOCOOLER_ADDRESSES}
                message="Please approve MonoCooler to use your gOHM"
                spendAmount={addAmount ? new DecimalBigNumber(addAmount, 18) : undefined}
              >
                <Button
                  variant="contained"
                  onClick={handleAddCollateral}
                  disabled={!addAmount || addCollateral.isLoading}
                >
                  Add
                </Button>
              </TokenAllowanceGuard>
            </Box>
          </Box>

          {position && (
            <Box>
              <Typography variant="body1" mb={1}>
                Withdraw Collateral
              </Typography>
              <Box display="flex" gap={1}>
                <TextField
                  type="number"
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(e.target.value)}
                  placeholder="Amount in gOHM"
                  fullWidth
                />
                <Button
                  variant="contained"
                  onClick={handleWithdrawCollateral}
                  disabled={!withdrawAmount || withdrawCollateral.isLoading}
                >
                  Withdraw
                </Button>
              </Box>
              <Typography variant="body2" color="textSecondary" mt={1}>
                Available to withdraw: {formatUnits(position.collateral, 18)} gOHM
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
};
