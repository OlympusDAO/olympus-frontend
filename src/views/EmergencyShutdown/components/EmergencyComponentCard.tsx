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
 * Horizontal card displaying an emergency component with networks, status and shutdown button
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

  // Format chain name for display
  const formatChainName = (chain: string) => {
    return chain
      .split("-")
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join("-");
  };

  return (
    <>
      <Paper enableBackground fullWidth>
        <Box display="flex" flexDirection="column" gap={1.5} p={{ xs: 2, md: 1 }}>
          {/* Mobile Layout */}
          <Box display={{ xs: "flex", md: "none" }} flexDirection="column" gap={1.5}>
            {/* Title */}
            <Typography variant="h6" fontWeight={600}>
              {component.name}
            </Typography>
            {/* Chips */}
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
              <Chip
                label={ownerLabel}
                size="small"
                color={component.owner === "emergency_ms" ? "error" : undefined}
                sx={component.owner === "dao_ms" ? { backgroundColor: "#A269D7", color: "white" } : undefined}
              />
              {getStatusChip()}
            </Box>
            {/* Description */}
            <Typography variant="body2" color="textSecondary">
              {component.description}
            </Typography>
            {/* Networks */}
            <Box>
              <Typography variant="body2" color="textSecondary" mb={0.5}>
                Networks: {component.chains.length}
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={0.5}>
                {component.chains.map(chain => (
                  <Chip
                    key={chain}
                    label={formatChainName(chain)}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: "11px" }}
                  />
                ))}
              </Box>
            </Box>
            {/* Shutdown Actions */}
            <Box>
              <Typography variant="body2" color="textSecondary" mb={0.5}>
                Shutdown Actions: {component.calls.length}
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={0.5}>
                {component.calls.map((call, index) => (
                  <Chip
                    key={index}
                    label={`${call.functionName}()`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: "11px" }}
                  />
                ))}
              </Box>
            </Box>
            {/* Mobile button */}
            <PrimaryButton
              fullWidth
              disabled={!canExecute || status.isShutdown || status.isLoading}
              onClick={() => setIsModalOpen(true)}
              sx={{
                mt: 1,
                backgroundColor: status.isShutdown ? "action.disabledBackground" : canExecute ? "#F8CC82" : undefined,
                color: status.isShutdown ? "text.secondary" : canExecute ? "#000" : undefined,
                "&:hover": {
                  backgroundColor: status.isShutdown ? "action.disabledBackground" : canExecute ? "#e6b96e" : undefined,
                },
              }}
            >
              {status.isShutdown ? "Disabled" : "Disable"}
            </PrimaryButton>
          </Box>

          {/* Desktop Layout */}
          <Box display={{ xs: "none", md: "flex" }} flexDirection="column" gap={1.5}>
            {/* Header Row */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                <Typography variant="h6" fontWeight={600}>
                  {component.name}
                </Typography>
                <Chip
                  label={ownerLabel}
                  size="small"
                  color={component.owner === "emergency_ms" ? "error" : undefined}
                  sx={component.owner === "dao_ms" ? { backgroundColor: "#A269D7", color: "white" } : undefined}
                />
                {getStatusChip()}
              </Box>
              <PrimaryButton
                disabled={!canExecute || status.isShutdown || status.isLoading}
                onClick={() => setIsModalOpen(true)}
                sx={{
                  minWidth: "100px",
                  backgroundColor: status.isShutdown
                    ? "action.disabledBackground"
                    : canExecute
                      ? "warning.main"
                      : undefined,
                  color: status.isShutdown ? "text.secondary" : canExecute ? "warning.contrastText" : undefined,
                  "&:hover": {
                    backgroundColor: status.isShutdown
                      ? "action.disabledBackground"
                      : canExecute
                        ? "warning.dark"
                        : undefined,
                  },
                }}
              >
                {status.isShutdown ? "Disabled" : "Disable"}
              </PrimaryButton>
            </Box>

            {/* Description */}
            <Typography variant="body2" color="textSecondary">
              {component.description}
            </Typography>

            {/* Networks and Shutdown Actions Row */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
              {/* Networks */}
              <Box flex={1}>
                <Typography variant="caption" color="textSecondary">
                  Networks: {component.chains.length}
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
                  {component.chains.map(chain => (
                    <Chip
                      key={chain}
                      label={formatChainName(chain)}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "11px" }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Shutdown Actions */}
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Shutdown Actions: {component.calls.length}
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5} justifyContent="flex-end">
                  {component.calls.map((call, index) => (
                    <Chip
                      key={index}
                      label={`${call.functionName}()`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "11px" }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Confirmation Modal - only mount when open to avoid FocusTrap ref warning */}
      {isModalOpen && (
        <ShutdownConfirmModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          component={component}
          chainName={chainName}
          chainAddresses={chainAddresses}
        />
      )}
    </>
  );
};
