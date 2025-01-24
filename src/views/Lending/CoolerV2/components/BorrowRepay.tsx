import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useState } from "react";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { COOLER_V2_MONOCOOLER_ADDRESSES, USDS_ADDRESSES } from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useMonoCoolerDebt } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerDebt";
import { useMonoCoolerPosition } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerPosition";

export const BorrowRepay = () => {
  const { data: position } = useMonoCoolerPosition();
  const { borrow, repay } = useMonoCoolerDebt();
  const [borrowAmount, setBorrowAmount] = useState("");
  const [repayAmount, setRepayAmount] = useState("");

  const handleBorrow = async () => {
    if (!borrowAmount) return;
    try {
      await borrow.mutateAsync({
        amount: parseUnits(borrowAmount, 18).toString(),
      });
      setBorrowAmount("");
    } catch (error) {
      console.error("Error borrowing:", error);
    }
  };

  const handleRepay = async () => {
    if (!repayAmount) return;
    try {
      await repay.mutateAsync({
        amount: parseUnits(repayAmount, 18).toString(),
      });
      setRepayAmount("");
    } catch (error) {
      console.error("Error repaying:", error);
    }
  };

  if (!position) return null;

  return (
    <Paper>
      <Box p={2}>
        <Typography variant="h5">Borrow & Repay</Typography>
        <Box mt={2} display="flex" flexDirection="column" gap={2}>
          <Box>
            <Typography variant="body1" mb={1}>
              Borrow USDS
            </Typography>
            <Box display="flex" gap={1}>
              <TextField
                type="number"
                value={borrowAmount}
                onChange={e => setBorrowAmount(e.target.value)}
                placeholder="Amount in USDS"
                fullWidth
              />
              <Button variant="contained" onClick={handleBorrow} disabled={!borrowAmount || borrow.isLoading}>
                Borrow
              </Button>
            </Box>
            <Typography variant="body2" color="textSecondary" mt={1}>
              Available to borrow: {formatUnits(position.maxOriginationDebtAmount.sub(position.currentDebt), 18)} USDS
            </Typography>
          </Box>

          <Box>
            <Typography variant="body1" mb={1}>
              Repay USDS
            </Typography>
            <Box display="flex" gap={1}>
              <TextField
                type="number"
                value={repayAmount}
                onChange={e => setRepayAmount(e.target.value)}
                placeholder="Amount in USDS"
                fullWidth
              />
              <TokenAllowanceGuard
                tokenAddressMap={USDS_ADDRESSES}
                spenderAddressMap={COOLER_V2_MONOCOOLER_ADDRESSES}
                message="Please approve MonoCooler to use your USDS"
                spendAmount={repayAmount ? new DecimalBigNumber(repayAmount, 18) : undefined}
              >
                <Button variant="contained" onClick={handleRepay} disabled={!repayAmount || repay.isLoading}>
                  Repay
                </Button>
              </TokenAllowanceGuard>
            </Box>
            <Typography variant="body2" color="textSecondary" mt={1}>
              Outstanding debt: {formatUnits(position.currentDebt, 18)} USDS
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
