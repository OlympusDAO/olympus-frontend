import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, IconButton, Paper, TextField, Typography, useTheme } from "@mui/material";
import { DataRow, InfoNotification, PrimaryButton, SecondaryButton } from "@olympusdao/component-library";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { useMonoCoolerDelegations } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerDelegations";
import { useMonoCoolerPosition } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerPosition";
import { useAccount } from "wagmi";

interface DelegationInput {
  address: string;
  amount: string;
}

export const DelegationManagement = () => {
  const theme = useTheme();
  const { address = "" } = useAccount();
  const { data: position } = useMonoCoolerPosition();
  const { delegations, applyDelegations } = useMonoCoolerDelegations();

  const [delegationInputs, setDelegationInputs] = useState<DelegationInput[]>([{ address: "", amount: "" }]);
  // Track initial state for comparison
  const [initialDelegations, setInitialDelegations] = useState<Map<string, string>>(new Map());

  // Populate form with current delegations when they load
  useEffect(() => {
    if (delegations.data && delegations.data.length > 0) {
      const currentDelegations = delegations.data.map(delegation => ({
        address: delegation.delegate,
        amount: formatUnits(delegation.totalAmount, 18),
      }));
      setDelegationInputs(currentDelegations);

      // Store initial state
      const initialMap = new Map(
        delegations.data.map(delegation => [
          delegation.delegate.toLowerCase(),
          formatUnits(delegation.totalAmount, 18),
        ]),
      );
      setInitialDelegations(initialMap);
    }
  }, [delegations.data]);

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

  // Check if current state matches initial state
  const hasStateChanged = useMemo(() => {
    const currentDelegationsMap = new Map(
      delegationInputs
        .filter(input => input.address && input.amount && !isNaN(Number(input.amount)))
        .map(input => [input.address.toLowerCase(), input.amount]),
    );

    // Different number of delegations
    if (currentDelegationsMap.size !== initialDelegations.size) return true;

    // Check if any values have changed
    for (const [address, amount] of currentDelegationsMap) {
      const initialAmount = initialDelegations.get(address);
      if (!initialAmount || initialAmount !== amount) return true;
    }

    // Check if any initial delegations were removed
    for (const address of initialDelegations.keys()) {
      if (!currentDelegationsMap.has(address)) return true;
    }

    return false;
  }, [delegationInputs, initialDelegations]);

  // Add duplicate address check to isValid
  const isValid = useMemo(() => {
    if (!position) return false;

    // If we have initial delegations and all inputs are empty, this is valid (complete undelegation)
    const hasInitialDelegations = initialDelegations.size > 0;
    const allInputsEmpty = delegationInputs.every(input => !input.address && !input.amount);
    if (hasInitialDelegations && allInputsEmpty) return true;

    // Check total delegation amount
    if (totalDelegationAmount > availableCollateral) return false;

    // Check for duplicate addresses
    const addresses = new Set<string>();
    for (const input of delegationInputs) {
      if (input.address) {
        const lowercaseAddress = input.address.toLowerCase();
        if (addresses.has(lowercaseAddress)) return false;
        addresses.add(lowercaseAddress);
      }
    }

    // Check each non-empty delegation input is valid
    return delegationInputs.every(input => {
      // Skip empty inputs
      if (!input.address && !input.amount) return true;
      // If either field is filled, both must be valid
      if (input.address || input.amount) {
        if (!input.address || !input.amount) return false;
        if (isNaN(Number(input.amount)) || Number(input.amount) <= 0) return false;
      }
      return true;
    });
  }, [delegationInputs, position, totalDelegationAmount, availableCollateral, initialDelegations]);

  const handleAddDelegation = () => {
    setDelegationInputs([...delegationInputs, { address: "", amount: "" }]);
  };

  const handleRemoveDelegation = (index: number) => {
    const newInputs = delegationInputs.filter((_, i) => i !== index);
    // If we're removing the last input, add an empty one
    if (newInputs.length === 0) {
      newInputs.push({ address: "", amount: "" });
    }
    setDelegationInputs(newInputs);
  };

  const handleUpdateDelegation = (index: number, field: keyof DelegationInput, value: string) => {
    const newInputs = [...delegationInputs];

    // If updating address, check for duplicates
    if (field === "address" && value) {
      const lowercaseValue = value.toLowerCase();
      const isDuplicate = delegationInputs.some(
        (input, i) => i !== index && input.address.toLowerCase() === lowercaseValue,
      );
      if (isDuplicate) return; // Don't update if it's a duplicate
    }

    newInputs[index] = { ...newInputs[index], [field]: value };
    setDelegationInputs(newInputs);
  };

  const handleApplyDelegations = async () => {
    if (!isValid) return;
    try {
      // Create a map of current delegations for easy lookup (keep in wei as BigInt strings)
      const currentDelegations = new Map(
        (delegations.data || []).map(delegation => [
          delegation.delegate.toLowerCase(),
          delegation.totalAmount.toString(), // Keep as BigInt string in wei
        ]),
      );

      // Create a map of new delegations for comparison (convert to wei)
      const newDelegations = new Map(
        delegationInputs
          .filter(input => input.address && input.amount && !isNaN(Number(input.amount)))
          .map(input => [input.address.toLowerCase(), parseUnits(input.amount, 18).toString()]),
      );

      const delegationRequests: Array<{ delegate: string; amount: string }> = [];

      // Handle all addresses that appear in either current or new delegations
      const allAddresses = new Set([...currentDelegations.keys(), ...newDelegations.keys()]);

      for (const address of allAddresses) {
        const currentAmount = currentDelegations.get(address) || "0";
        const newAmount = newDelegations.get(address) || "0";

        if (currentAmount !== newAmount) {
          // Calculate the delta: newAmount - currentAmount
          const currentBN = BigInt(currentAmount);
          const newBN = BigInt(newAmount);
          const delta = newBN - currentBN;

          if (delta !== 0n) {
            delegationRequests.push({
              delegate: address,
              amount: delta.toString(), // Will be negative for removals
            });
          }
        }
      }

      // Sort delegation requests by amount (highest negative values first)
      delegationRequests.sort((a, b) => {
        const amountA = BigInt(a.amount);
        const amountB = BigInt(b.amount);
        // If both are negative, we want the more negative one first
        if (amountA < 0n && amountB < 0n) {
          return amountA < amountB ? -1 : 1;
        }
        // If only one is negative, it should go first
        if (amountA < 0n) return -1;
        if (amountB < 0n) return 1;
        // For positive values, smaller ones first
        return amountA < amountB ? -1 : 1;
      });

      if (delegationRequests.length > 0) {
        await applyDelegations.mutateAsync({
          delegationRequests,
        });
      }
    } catch (error) {
      console.error("Error applying delegations:", error);
    }
  };

  const handleSetToMyWallet = () => {
    if (!address || !position) return;

    // Set a single delegation to the user's wallet with all available collateral
    setDelegationInputs([
      {
        address: address,
        amount: formatUnits(position.collateral, 18),
      },
    ]);
  };

  if (!position || !delegations.data) return null;

  return (
    <Paper>
      <Box p={2}>
        <InfoNotification>
          You can delegate your Cooler position to up to {maxDelegateAddresses} unique addresses.
        </InfoNotification>
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
              <IconButton onClick={() => handleRemoveDelegation(index)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddDelegation}
              disabled={delegationInputs.length >= maxDelegateAddresses}
              size="small"
            >
              Add Additional Delegation Address
            </Button>
            <Typography variant="body2" color={theme.colors.gray[40]}>
              {delegationInputs.length} of {maxDelegateAddresses} delegations
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column">
            <SecondaryButton onClick={handleSetToMyWallet} disabled={!address}>
              Set to My Wallet
            </SecondaryButton>
            <PrimaryButton
              onClick={handleApplyDelegations}
              disabled={!isValid || applyDelegations.isLoading || !hasStateChanged}
              loading={applyDelegations.isLoading}
              fullWidth
            >
              Delegate Voting
            </PrimaryButton>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
