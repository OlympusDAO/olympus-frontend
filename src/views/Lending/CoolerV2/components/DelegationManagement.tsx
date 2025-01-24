import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, IconButton, Paper, TextField, Typography, useTheme } from "@mui/material";
import { DataRow } from "@olympusdao/component-library";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useMemo, useState } from "react";
import { useMonoCoolerDelegations } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerDelegations";
import { useMonoCoolerPosition } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerPosition";

interface DelegationInput {
  address: string;
  amount: string;
}

export const DelegationManagement = () => {
  const theme = useTheme();
  const { data: position } = useMonoCoolerPosition();
  const { delegations, applyDelegations } = useMonoCoolerDelegations();
  const [delegationInputs, setDelegationInputs] = useState<DelegationInput[]>([{ address: "", amount: "" }]);

  const totalDelegationAmount = useMemo(() => {
    return delegationInputs.reduce((sum, input) => {
      if (!input.amount || isNaN(Number(input.amount))) return sum;
      return sum + Number(input.amount);
    }, 0);
  }, [delegationInputs]);

  const availableCollateral = useMemo(() => {
    if (!position) return 0;
    return Number(formatUnits(position.collateral, 18));
  }, [position]);

  const maxDelegateAddresses = useMemo(() => {
    if (!position?.maxDelegateAddresses) return 0;
    return Number(position.maxDelegateAddresses);
  }, [position]);

  const isValid = useMemo(() => {
    if (!position) return false;

    // Check total delegation amount
    if (totalDelegationAmount > availableCollateral) return false;

    // Check each delegation input
    return delegationInputs.every(input => {
      if (!input.address || !input.amount) return false;
      if (isNaN(Number(input.amount)) || Number(input.amount) <= 0) return false;
      return true;
    });
  }, [delegationInputs, position, totalDelegationAmount, availableCollateral]);

  const handleAddDelegation = () => {
    setDelegationInputs([...delegationInputs, { address: "", amount: "" }]);
  };

  const handleRemoveDelegation = (index: number) => {
    setDelegationInputs(delegationInputs.filter((_, i) => i !== index));
  };

  const handleUpdateDelegation = (index: number, field: keyof DelegationInput, value: string) => {
    const newInputs = [...delegationInputs];
    newInputs[index] = { ...newInputs[index], [field]: value };
    setDelegationInputs(newInputs);
  };

  const handleApplyDelegations = async () => {
    if (!isValid) return;
    try {
      await applyDelegations.mutateAsync({
        delegationRequests: delegationInputs.map(input => ({
          delegate: input.address,
          amount: parseUnits(input.amount, 18).toString(),
        })),
      });
      setDelegationInputs([{ address: "", amount: "" }]);
    } catch (error) {
      console.error("Error applying delegations:", error);
    }
  };

  if (!position || !delegations.data) return null;

  return (
    <Paper>
      <Box p={2}>
        <Typography variant="h5">Manage Delegations</Typography>
        <Box mt={2}>
          <DataRow title="Available Collateral" balance={`${availableCollateral.toFixed(4)} gOHM`} />
          <DataRow title="Total Delegation Amount" balance={`${totalDelegationAmount.toFixed(4)} gOHM`} />
        </Box>
        <Box mt={2} display="flex" flexDirection="column" gap={2}>
          {delegationInputs.map((input, index) => (
            <Box key={index} display="flex" gap={1} alignItems="flex-start">
              <TextField
                value={input.address}
                onChange={e => handleUpdateDelegation(index, "address", e.target.value)}
                placeholder="Delegate Address"
                fullWidth
                error={input.address !== "" && !input.address.match(/^0x[a-fA-F0-9]{40}$/)}
                helperText={
                  input.address !== "" && !input.address.match(/^0x[a-fA-F0-9]{40}$/) ? "Invalid address" : ""
                }
              />
              <TextField
                type="number"
                value={input.amount}
                onChange={e => handleUpdateDelegation(index, "amount", e.target.value)}
                placeholder="Amount in gOHM"
                fullWidth
                error={input.amount !== "" && (isNaN(Number(input.amount)) || Number(input.amount) <= 0)}
                helperText={
                  input.amount !== "" && (isNaN(Number(input.amount)) || Number(input.amount) <= 0)
                    ? "Invalid amount"
                    : ""
                }
              />
              {delegationInputs.length > 1 && (
                <IconButton onClick={() => handleRemoveDelegation(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          ))}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddDelegation}
              disabled={delegationInputs.length >= maxDelegateAddresses}
            >
              Add Delegation
            </Button>
            <Typography variant="body2" color={theme.colors.gray[40]}>
              {delegationInputs.length} of {maxDelegateAddresses} delegations
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={handleApplyDelegations}
            disabled={!isValid || applyDelegations.isLoading}
            fullWidth
          >
            Apply Delegations
          </Button>
        </Box>
        {delegations.data.length > 0 && (
          <Box mt={3}>
            <Typography variant="h6" mb={1}>
              Current Delegations
            </Typography>
            {delegations.data.map((delegation, index) => (
              <Box key={index} mt={1}>
                <DataRow title={delegation.delegate} balance={`${formatUnits(delegation.totalAmount, 18)} gOHM`} />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
};
