import CheckIcon from "@mui/icons-material/Check";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, Button, Chip, Grid, Link, Typography } from "@mui/material";
import { InfoNotification, Paper } from "@olympusdao/component-library";
import { useState } from "react";
import PageTitle from "src/components/PageTitle";
import {
  CHAIN_ID_TO_NAME,
  ChainId,
  EMERGENCY_ADDRESSES,
  EMERGENCY_COMPONENTS,
  MultisigOwner,
} from "src/generated/emergency";
import { EmergencyComponentCard } from "src/views/EmergencyShutdown/components/EmergencyComponentCard";
import { useComponentsStatus, useIsSafeSigner } from "src/views/EmergencyShutdown/hooks";
import { useAccount, useNetwork } from "wagmi";

type OwnerFilter = "all" | MultisigOwner;

/**
 * Emergency Shutdown Dashboard
 *
 * This page allows authorized signers (Emergency MS or DAO MS) to quickly
 * shutdown protocol components during an emergency.
 *
 * Components are filtered by the current connected network and displayed
 * with their status and shutdown controls.
 */
export const EmergencyShutdown = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const [ownerFilter, setOwnerFilter] = useState<OwnerFilter>("all");
  const [showWarning, setShowWarning] = useState(() => {
    return localStorage.getItem("emergency-warning-dismissed") !== "true";
  });

  const handleDismissWarning = () => {
    setShowWarning(false);
    localStorage.setItem("emergency-warning-dismissed", "true");
  };

  // Get current chain name for filtering
  const chainId = chain?.id || 1;
  const chainName = CHAIN_ID_TO_NAME[chainId];
  const chainAddresses = chainName ? EMERGENCY_ADDRESSES[chainName] : undefined;

  // Filter components that exist on current chain
  const availableComponents = EMERGENCY_COMPONENTS.filter(component =>
    chainName ? component.chains.includes(chainName as ChainId) : false,
  );

  // Apply owner filter
  const filteredComponents =
    ownerFilter === "all" ? availableComponents : availableComponents.filter(c => c.owner === ownerFilter);

  // Fetch on-chain status for all components
  const componentStatuses = useComponentsStatus(availableComponents, chainAddresses, chainId);

  // Check if user is a Safe signer via Safe API
  const {
    isEmergencySigner,
    isDaoSigner,
    isLoading: isSignerLoading,
    emergencyThreshold,
    emergencyOwnerCount,
    daoThreshold,
    daoOwnerCount,
  } = useIsSafeSigner(address, chainAddresses?.emergency_ms, chainAddresses?.dao_ms, chainId);

  const isSigner = isEmergencySigner || isDaoSigner;

  return (
    <div id="emergency-shutdown-view">
      <PageTitle name="Emergency Shutdown" noMargin />
      <Box maxWidth="1200px">
        {/* Warning Banner */}
        {showWarning && (
          <Box
            mb="21px"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: theme => `${theme.colors.primary[300]}0D`,
              borderRadius: "8px",
              padding: "12px 20px",
              overflow: "visible",
            }}
          >
            <Box display="flex" alignItems="center" gap={1.5} sx={{ overflow: "visible" }}>
              <ErrorOutlineIcon viewBox="0 0 25 25" sx={{ color: "#F8CC82", fontSize: 20, flexShrink: 0 }} />
              <Typography fontSize={14}>
                This dashboard is for emergency use only. Shutting down a component will disable critical protocol
                functionality.
              </Typography>
            </Box>
            <Button
              variant="text"
              onClick={handleDismissWarning}
              sx={{
                color: "text.primary",
                textTransform: "none",
                fontWeight: 400,
                fontSize: 14,
                whiteSpace: "nowrap",
                "&:hover": {
                  backgroundColor: "transparent",
                  textDecoration: "underline",
                },
              }}
            >
              I Understand
            </Button>
          </Box>
        )}

        {/* Connection Status */}
        {!isConnected && (
          <Box mb="21px">
            <InfoNotification>
              <Typography>Please connect your wallet to use the Emergency Shutdown Dashboard.</Typography>
            </InfoNotification>
          </Box>
        )}

        {/* Network Info */}
        {isConnected && chainName && (
          <Paper enableBackground fullWidth>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography fontSize={15} color="textSecondary" mb={1}>
                  Connected Network
                </Typography>
                <Typography fontSize={18} fontWeight={600}>
                  {chainName.charAt(0).toUpperCase() + chainName.slice(1)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography fontSize={15} color="textSecondary" mb={1}>
                  Emergency MS
                </Typography>
                {chainAddresses?.emergency_ms ? (
                  <Link
                    href={`https://etherscan.io/address/${chainAddresses.emergency_ms}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.5,
                      color: "text.primary",
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    <Typography fontSize={18} fontWeight={600} component="span">
                      {`${chainAddresses.emergency_ms.slice(0, 6)}...${chainAddresses.emergency_ms.slice(-4)}`}
                    </Typography>
                    <OpenInNewIcon sx={{ fontSize: 16 }} />
                  </Link>
                ) : (
                  <Typography fontSize={18} fontWeight={600}>
                    Not configured
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography fontSize={15} color="textSecondary" mb={1}>
                  DAO MS
                </Typography>
                {chainAddresses?.dao_ms ? (
                  <Link
                    href={`https://etherscan.io/address/${chainAddresses.dao_ms}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.5,
                      color: "text.primary",
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    <Typography fontSize={18} fontWeight={600} component="span">
                      {`${chainAddresses.dao_ms.slice(0, 6)}...${chainAddresses.dao_ms.slice(-4)}`}
                    </Typography>
                    <OpenInNewIcon sx={{ fontSize: 16 }} />
                  </Link>
                ) : (
                  <Typography variant="h6" fontWeight={600}>
                    Not configured
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Components Grid */}
        {chainName && availableComponents.length > 0 ? (
          <Box mt={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight={600}>
                Protocol Components
              </Typography>
              <Box display="flex" gap={1}>
                <Chip
                  label="All"
                  size="small"
                  onClick={() => setOwnerFilter("all")}
                  variant={ownerFilter === "all" ? "filled" : "outlined"}
                  icon={ownerFilter === "all" ? <CheckIcon fontSize="small" /> : undefined}
                  sx={{ cursor: "pointer" }}
                />
                <Chip
                  label="DAO MS"
                  size="small"
                  onClick={() => setOwnerFilter("dao_ms")}
                  variant={ownerFilter === "dao_ms" ? "filled" : "outlined"}
                  icon={ownerFilter === "dao_ms" ? <CheckIcon fontSize="small" /> : undefined}
                  sx={{ cursor: "pointer" }}
                />
                <Chip
                  label="Emergency MS"
                  size="small"
                  onClick={() => setOwnerFilter("emergency_ms")}
                  variant={ownerFilter === "emergency_ms" ? "filled" : "outlined"}
                  icon={ownerFilter === "emergency_ms" ? <CheckIcon fontSize="small" /> : undefined}
                  sx={{ cursor: "pointer" }}
                />
              </Box>
            </Box>
            <Grid container spacing={2}>
              {filteredComponents.map(component => (
                <Grid item xs={12} key={component.id}>
                  <EmergencyComponentCard
                    component={component}
                    chainName={chainName}
                    chainAddresses={chainAddresses}
                    userAddress={address}
                    isEmergencySigner={isEmergencySigner}
                    isDaoSigner={isDaoSigner}
                    status={componentStatuses[component.id] || { isShutdown: false, isLoading: true, error: null }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : chainName ? (
          <Box mt={3}>
            <Paper enableBackground fullWidth>
              <Typography textAlign="center" py={4}>
                No emergency components available on {chainName}
              </Typography>
            </Paper>
          </Box>
        ) : (
          <Box mt={3}>
            <Paper enableBackground fullWidth>
              <Typography textAlign="center" py={4}>
                Unsupported network. Please switch to a supported network.
              </Typography>
            </Paper>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default EmergencyShutdown;
