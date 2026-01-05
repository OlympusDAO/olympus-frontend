import { Box, CircularProgress, Divider, Link, Typography } from "@mui/material";
import { Modal, PrimaryButton, SecondaryButton } from "@olympusdao/component-library";
import { useState } from "react";
import { ChainAddresses, EmergencyComponent } from "src/generated/emergency";
import { useEmergencyShutdown } from "src/views/EmergencyShutdown/hooks/useEmergencyShutdown";

interface ShutdownConfirmModalProps {
  open: boolean;
  onClose: () => void;
  component: EmergencyComponent;
  chainName: string;
  chainAddresses: ChainAddresses | undefined;
}

/**
 * Modal for confirming emergency shutdown action
 *
 * Shows detailed information about what will happen and requires explicit confirmation.
 * Uses the Safe Transaction Service to propose the shutdown transaction.
 */
export const ShutdownConfirmModal = ({
  open,
  onClose,
  component,
  chainName,
  chainAddresses,
}: ShutdownConfirmModalProps) => {
  const [safeTxResult, setSafeTxResult] = useState<{ safeTxHash: string; safeAppUrl: string } | null>(null);

  // Determine which Safe to use based on component owner
  const safeAddress = component.owner === "emergency_ms" ? chainAddresses?.emergency_ms : chainAddresses?.dao_ms;

  const { mutate: executeShutdown, isLoading } = useEmergencyShutdown({
    component,
    chainAddresses,
    safeAddress: safeAddress || "",
  });

  const handleConfirm = () => {
    executeShutdown(undefined, {
      onSuccess: result => {
        setSafeTxResult(result);
      },
    });
  };

  const handleClose = () => {
    setSafeTxResult(null);
    onClose();
  };

  // Show success state after transaction is proposed
  if (safeTxResult) {
    return (
      <Modal open={open} onClose={handleClose} headerText="Transaction Proposed" minHeight="200px">
        <Box display="flex" flexDirection="column" gap={2} alignItems="center" textAlign="center">
          <Box bgcolor="success.light" p={2} borderRadius={1} width="100%">
            <Typography fontWeight={600} color="success.dark">
              Shutdown transaction has been proposed to the Safe!
            </Typography>
          </Box>

          <Typography variant="body2" color="textSecondary">
            The transaction needs to be signed by other Safe owners and then executed.
          </Typography>

          <Box bgcolor="grey.100" p={2} borderRadius={1} width="100%">
            <Typography variant="caption" display="block" color="textSecondary">
              Safe Transaction Hash:
            </Typography>
            <Typography variant="body2" fontFamily="monospace" sx={{ wordBreak: "break-all" }}>
              {safeTxResult.safeTxHash}
            </Typography>
          </Box>

          <Link href={safeTxResult.safeAppUrl} target="_blank" rel="noopener noreferrer">
            <PrimaryButton>View in Safe App</PrimaryButton>
          </Link>

          <SecondaryButton onClick={handleClose}>Close</SecondaryButton>
        </Box>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={handleClose} headerText={`Shutdown ${component.name}?`} minHeight="300px">
      <Box display="flex" flexDirection="column" gap={2}>
        {/* Warning */}
        <Box bgcolor="error.light" p={2} borderRadius={1}>
          <Typography fontWeight={600} color="error.dark">
            This action will disable critical protocol functionality
          </Typography>
          <Typography variant="body2" color="error.dark">
            Only proceed if you are certain this is necessary for protocol safety.
          </Typography>
        </Box>

        {/* Component Info */}
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            Component
          </Typography>
          <Typography>{component.name}</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            Description
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {component.description}
          </Typography>
        </Box>

        {/* Target Safe */}
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            Target Safe ({component.owner === "emergency_ms" ? "Emergency MS" : "DAO MS"})
          </Typography>
          <Typography variant="body2" fontFamily="monospace" color="textSecondary">
            {safeAddress || "Not configured"}
          </Typography>
        </Box>

        {/* Shutdown Criteria */}
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            When to Shutdown
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            {component.shutdownCriteria.map((criteria, index) => (
              <li key={index}>
                <Typography variant="body2" color="textSecondary">
                  {criteria}
                </Typography>
              </li>
            ))}
          </Box>
        </Box>

        <Divider />

        {/* Transactions to be executed */}
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            Transactions ({component.calls.length})
          </Typography>
          {component.calls.map((call, index) => (
            <Box key={index} bgcolor="grey.100" p={1} borderRadius={1} mt={1} fontFamily="monospace" fontSize="12px">
              <Typography variant="caption" display="block">
                Contract: {call.contractKey}
              </Typography>
              <Typography variant="caption" display="block">
                Function: {call.functionName}({call.args.join(", ")})
              </Typography>
              {chainAddresses && chainAddresses[call.contractKey] && (
                <Typography variant="caption" display="block" color="textSecondary">
                  Address: {chainAddresses[call.contractKey]}
                </Typography>
              )}
            </Box>
          ))}
        </Box>

        <Divider />

        {/* Actions */}
        <Box display="flex" gap={2} justifyContent="flex-end" alignItems="center">
          {isLoading && (
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="textSecondary">
                Signing...
              </Typography>
            </Box>
          )}
          <SecondaryButton onClick={handleClose} disabled={isLoading}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            onClick={handleConfirm}
            disabled={isLoading || !safeAddress}
            sx={{
              backgroundColor: "error.main",
              "&:hover": {
                backgroundColor: "error.dark",
              },
            }}
          >
            {isLoading ? "Signing..." : "Confirm Shutdown"}
          </PrimaryButton>
        </Box>
      </Box>
    </Modal>
  );
};
