import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { InfoNotification, Paper } from "@olympusdao/component-library";
import PageTitle from "src/components/PageTitle";
import { CHAIN_ID_TO_NAME, ChainId, EMERGENCY_ADDRESSES, EMERGENCY_COMPONENTS } from "src/generated/emergency";
import { EmergencyComponentCard } from "src/views/EmergencyShutdown/components/EmergencyComponentCard";
import { useComponentsStatus, useIsSafeSigner } from "src/views/EmergencyShutdown/hooks";
import { useAccount, useNetwork } from "wagmi";

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

  // Get current chain name for filtering
  const chainId = chain?.id || 1;
  const chainName = CHAIN_ID_TO_NAME[chainId];
  const chainAddresses = chainName ? EMERGENCY_ADDRESSES[chainName] : undefined;

  // Filter components that exist on current chain
  const availableComponents = EMERGENCY_COMPONENTS.filter(component =>
    chainName ? component.chains.includes(chainName as ChainId) : false,
  );

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
      <PageTitle name="Emergency Shutdown" />
      <Box width="97%" maxWidth="1200px">
        {/* Warning Banner */}
        <Box mb="21px">
          <InfoNotification>
            <Typography fontWeight={600} color="error">
              This dashboard is for emergency use only. Shutting down a component will disable critical protocol
              functionality.
            </Typography>
          </InfoNotification>
        </Box>

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
            <Box mb={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    Connected Network
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {chainName.charAt(0).toUpperCase() + chainName.slice(1)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    Emergency MS
                  </Typography>
                  <Typography variant="body2" fontFamily="monospace">
                    {chainAddresses?.emergency_ms
                      ? `${chainAddresses.emergency_ms.slice(0, 6)}...${chainAddresses.emergency_ms.slice(-4)}`
                      : "Not configured"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    DAO MS
                  </Typography>
                  <Typography variant="body2" fontFamily="monospace">
                    {chainAddresses?.dao_ms
                      ? `${chainAddresses.dao_ms.slice(0, 6)}...${chainAddresses.dao_ms.slice(-4)}`
                      : "Not configured"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {/* Signer Status */}
            {isConnected && (
              <Box p={2} borderRadius={1} bgcolor={isSigner ? "success.light" : "warning.light"} sx={{ opacity: 0.9 }}>
                {isSignerLoading ? (
                  <Box display="flex" alignItems="center" gap={1}>
                    <CircularProgress size={16} />
                    <Typography>Checking signer status...</Typography>
                  </Box>
                ) : (
                  <>
                    <Typography fontWeight={600}>
                      {isSigner
                        ? `You are a ${
                            isEmergencySigner && isDaoSigner
                              ? "Emergency MS & DAO MS"
                              : isEmergencySigner
                                ? "Emergency MS"
                                : "DAO MS"
                          } signer`
                        : "You are not a multisig signer on this network"}
                    </Typography>
                    {isSigner && (
                      <Typography variant="body2" color="textSecondary" mt={0.5}>
                        {isEmergencySigner &&
                          emergencyThreshold &&
                          `Emergency MS: ${emergencyThreshold}/${emergencyOwnerCount} signatures required`}
                        {isEmergencySigner && isDaoSigner && " • "}
                        {isDaoSigner && daoThreshold && `DAO MS: ${daoThreshold}/${daoOwnerCount} signatures required`}
                      </Typography>
                    )}
                    {!isSigner && (
                      <Typography variant="body2">
                        Connect with an address that is a signer on the Emergency MS or DAO MS to execute shutdown
                        transactions.
                      </Typography>
                    )}
                  </>
                )}
              </Box>
            )}
          </Paper>
        )}

        {/* Components Grid */}
        {chainName && availableComponents.length > 0 ? (
          <Box mt={3}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Protocol Components ({availableComponents.length})
            </Typography>
            <Grid container spacing={2}>
              {availableComponents.map(component => (
                <Grid item xs={12} md={6} lg={4} key={component.id}>
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
