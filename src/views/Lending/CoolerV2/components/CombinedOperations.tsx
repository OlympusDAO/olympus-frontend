import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useMemo, useState } from "react";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { COOLER_V2_MONOCOOLER_ADDRESSES, GOHM_ADDRESSES } from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useMonoCoolerCombined } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerCombined";
import { useMonoCoolerPosition } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerPosition";

export const CombinedOperations = () => {
  const { data: position } = useMonoCoolerPosition();
  const { addCollateralAndBorrow } = useMonoCoolerCombined();
  const [collateralAmount, setCollateralAmount] = useState("");
  const [borrowAmount, setBorrowAmount] = useState("");

  // Calculate max borrow amount based on collateral
  const maxBorrowAmount = useMemo(() => {
    if (!position || !collateralAmount) return "0";
    try {
      // Convert collateral to same unit as maxOriginationLtv
      const collateralInWei = parseUnits(collateralAmount, 18);
      // Calculate max borrow based on the collateral amount
      // The contract's _maxDebt function calculates this as: collateral * maxOriginationLtv
      // where maxOriginationLtv is in WAD format (18 decimals)
      const maxBorrowInWei = collateralInWei.mul(position.maxOriginationLtv).div(parseUnits("1", 18));
      return formatUnits(maxBorrowInWei, 18);
    } catch (error) {
      console.error("Error calculating max borrow:", error);
      return "0";
    }
  }, [position, collateralAmount]);

  const handleCombinedOperation = async () => {
    if (!collateralAmount || !borrowAmount) return;
    try {
      await addCollateralAndBorrow.mutateAsync({
        collateralAmount: parseUnits(collateralAmount, 18).toString(),
        borrowAmount: parseUnits(borrowAmount, 18).toString(),
      });
      setCollateralAmount("");
      setBorrowAmount("");
    } catch (error) {
      console.error("Error in combined operation:", error);
    }
  };

  const isValidBorrowAmount = useMemo(() => {
    if (!borrowAmount || !maxBorrowAmount) return false;
    try {
      return parseFloat(borrowAmount) <= parseFloat(maxBorrowAmount);
    } catch {
      return false;
    }
  }, [borrowAmount, maxBorrowAmount]);

  return (
    <Paper>
      <Box p={2}>
        <Typography variant="h5">Quick Position</Typography>
        <Typography variant="body2" color="textSecondary" mb={2}>
          Add collateral and borrow in one transaction
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <Box>
            <Typography variant="body1" mb={1}>
              Collateral Amount
            </Typography>
            <TextField
              type="number"
              value={collateralAmount}
              onChange={e => {
                setCollateralAmount(e.target.value);
                // Reset borrow amount when collateral changes to prevent invalid states
                setBorrowAmount("");
              }}
              placeholder="Amount in gOHM"
              fullWidth
            />
          </Box>

          <Box>
            <Typography variant="body1" mb={1}>
              Borrow Amount
            </Typography>
            <TextField
              type="number"
              value={borrowAmount}
              onChange={e => setBorrowAmount(e.target.value)}
              placeholder="Amount in USDS"
              fullWidth
              error={!!borrowAmount && !isValidBorrowAmount}
              helperText={collateralAmount ? `Max borrow: ${Number(maxBorrowAmount).toFixed(2)} USDS` : undefined}
            />
          </Box>

          <TokenAllowanceGuard
            tokenAddressMap={GOHM_ADDRESSES}
            spenderAddressMap={COOLER_V2_MONOCOOLER_ADDRESSES}
            message="Please approve MonoCooler to use your gOHM"
            spendAmount={collateralAmount ? new DecimalBigNumber(collateralAmount, 18) : undefined}
          >
            <Button
              variant="contained"
              onClick={handleCombinedOperation}
              disabled={!collateralAmount || !borrowAmount || !isValidBorrowAmount || addCollateralAndBorrow.isLoading}
              fullWidth
            >
              Add Collateral & Borrow
            </Button>
          </TokenAllowanceGuard>
        </Box>
      </Box>
    </Paper>
  );
};
