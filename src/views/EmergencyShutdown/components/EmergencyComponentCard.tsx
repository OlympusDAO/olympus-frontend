import { Box, Chip, CircularProgress, Typography } from "@mui/material";
import { Paper, PrimaryButton } from "@olympusdao/component-library";
import { useState } from "react";
import { ChainAddresses, EmergencyComponent } from "src/generated/emergency";
import { ShutdownConfirmModal } from "src/views/EmergencyShutdown/components/ShutdownConfirmModal";
import { ComponentStatus } from "src/views/EmergencyShutdown/hooks";

interface EmergencyComponentCardProps {
  component: EmergencyComponent;
  chainName: string;
  chainAddresses: ChainAddresses | undefined;
  userAddress: string | undefined;
  isEmergencySigner: boolean;
  isDaoSigner: boolean;
  /** On-chain status of the component */
  status: ComponentStatus;
}

/**
 * Card displaying an emergency component with its status and shutdown button
 */
export const EmergencyComponentCard = ({
  component,
  chainName,
  chainAddresses,
  isEmergencySigner,
  isDaoSigner,
  status,
}: EmergencyComponentCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if user can execute this component's shutdown
  const canExecute =
    (component.owner === "emergency_ms" && isEmergencySigner) || (component.owner === "dao_ms" && isDaoSigner);

  // Get the owner label
  const ownerLabel = component.owner === "emergency_ms" ? "Emergency MS" : "DAO MS";

  // Determine status display
  const getStatusChip = () => {
    if (status.isLoading) {
      return (
        <Chip
          label={<CircularProgress size={12} color="inherit" />}
          size="small"
          variant="outlined"
          sx={{ minWidth: 70 }}
        />
      );
    }

    if (status.isShutdown) {
      return <Chip label="Disabled" size="small" color="error" />;
    }

    return <Chip label="Active" size="small" color="success" variant="outlined" />;
  };

  return (
    <>
      <Paper enableBackground>
        <Box display="flex" flexDirection="column" gap={2} p={1}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {component.name}
              </Typography>
              <Chip
                label={ownerLabel}
                size="small"
                color={component.owner === "emergency_ms" ? "error" : "warning"}
                sx={{ mt: 0.5 }}
              />
            </Box>
            {getStatusChip()}
          </Box>

          {/* Description */}
          <Typography variant="body2" color="textSecondary">
            {component.description}
          </Typography>

          {/* Calls Info */}
          <Box>
            <Typography variant="caption" color="textSecondary">
              Shutdown Actions: {component.calls.length}
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
              {component.calls.map((call, index) => (
                <Chip
                  key={index}
                  label={`${call.functionName}()`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "10px" }}
                />
              ))}
            </Box>
          </Box>

          {/* Shutdown Button */}
          <Box mt={1}>
            <PrimaryButton
              fullWidth
              disabled={!canExecute || status.isShutdown || status.isLoading}
              onClick={() => setIsModalOpen(true)}
              sx={{
                backgroundColor: canExecute && !status.isShutdown ? "error.main" : undefined,
                "&:hover": {
                  backgroundColor: canExecute && !status.isShutdown ? "error.dark" : undefined,
                },
              }}
            >
              {status.isShutdown
                ? "Already Disabled"
                : canExecute
                  ? "Initiate Shutdown"
                  : `Requires ${ownerLabel} Signer`}
            </PrimaryButton>
          </Box>
        </Box>
      </Paper>

      {/* Confirmation Modal */}
      <ShutdownConfirmModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        component={component}
        chainName={chainName}
        chainAddresses={chainAddresses}
      />
    </>
  );
};
