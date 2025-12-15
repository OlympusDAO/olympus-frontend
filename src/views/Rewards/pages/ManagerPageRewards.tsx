import { Box, Button, CircularProgress, Paper, Tab, Tabs, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import {
  AdminEpochStatus,
  LibChainId,
  useGETAdminPendingEpochs,
  useGETEpochsEpochRewardUsers,
  usePOSTAdminPrepareEpochTransactionApi,
} from "src/generated/olympusUnits";
import { ManageEpochStats } from "src/views/Rewards/components/ManageEpochStats";
import { ManageEpochTable } from "src/views/Rewards/components/ManageEpochTable";
import { useAuth } from "src/views/Rewards/hooks/useAuth";
import { useAccount, useNetwork } from "wagmi";

export const ManagerPageRewards = () => {
  const theme = useTheme();
  const { chain } = useNetwork();
  const { address: userAddress } = useAccount();
  const [selectedEpochIndex, setSelectedEpochIndex] = useState(0);

  // Authentication
  const { isAuthenticated, isAuthenticating, signIn } = useAuth();

  const chainId = (chain?.id || LibChainId.NUMBER_11155111) as LibChainId;

  // Mutation for preparing transaction
  const prepareMutation = usePOSTAdminPrepareEpochTransactionApi();

  // Fetch list of pending epochs
  const { data: pendingEpochsData, isLoading: isLoadingEpochs } = useGETAdminPendingEpochs({
    chainId,
  });

  const epochs = pendingEpochsData?.epochs || [];
  const selectedEpoch = epochs[selectedEpochIndex];
  const safeAddress = pendingEpochsData?.safeAddress;

  // Fetch users for selected epoch
  // Note: We need both epochId and rewardAssetId. For now, we'll use the first asset
  const firstRewardAssetId = selectedEpoch?.epochRewardsId;

  const { data: epochUsersData, isLoading: isLoadingUsers } = useGETEpochsEpochRewardUsers(
    selectedEpoch?.epochId || 0,
    firstRewardAssetId || 0,
    {
      limit: 100, // Get top 100 users
      sortOrder: "desc" as const,
    },
    {
      query: {
        enabled: !!selectedEpoch && !!firstRewardAssetId,
      },
    },
  );

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedEpochIndex(newValue);
  };

  const getStatusColor = (status: AdminEpochStatus) => {
    switch (status) {
      case AdminEpochStatus.pending:
        return theme.colors.gray[40];
      case AdminEpochStatus.calculated:
        return theme.palette.mode === "dark" ? "#F8CC82" : "#F8CC82";
      case AdminEpochStatus.distributed:
        return theme.palette.mode === "dark" ? "#6FCF97" : "#6FCF97";
      default:
        return theme.colors.gray[40];
    }
  };

  const handleSubmitProposal = () => {
    if (!selectedEpoch) return;

    // Call prepare transaction API
    prepareMutation.mutate({
      epochRewardsId: selectedEpoch.epochRewardsId,
    });
  };

  // Show authentication UI if not authenticated
  if (!isAuthenticated) {
    return (
      <section>
        <Box mb="23px" pl="31px">
          <Typography component="h1" fontSize="32px" lineHeight="36px" m={0} fontWeight={600}>
            Rewards Manager
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Paper
            sx={{
              background: theme.palette.mode === "dark" ? "#20222A" : "#EFEAE0",
              padding: "48px",
              borderRadius: "24px",
              textAlign: "center",
              maxWidth: "500px",
            }}
          >
            <Typography fontSize="18px" fontWeight={600} mb="16px" sx={{ color: theme.colors.gray[10] }}>
              Authentication Required
            </Typography>
            <Typography fontSize="15px" mb="32px" sx={{ color: theme.colors.gray[40] }}>
              {userAddress
                ? "Sign in with your wallet to access the Rewards Manager."
                : "Please connect your wallet to continue."}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={signIn}
              disabled={!userAddress || isAuthenticating}
              sx={{
                textTransform: "none",
                fontSize: "15px",
                fontWeight: 500,
                padding: "12px 32px",
              }}
            >
              {isAuthenticating ? "Signing In..." : "Sign In with Wallet"}
            </Button>
          </Paper>
        </Box>
      </section>
    );
  }

  if (isLoadingEpochs) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!epochs.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>No epochs found</Typography>
      </Box>
    );
  }

  return (
    <section>
      <Box mb="23px" pl="31px">
        <Typography component="h1" fontSize="32px" lineHeight="36px" m={0} fontWeight={600}>
          Rewards Manager
        </Typography>
      </Box>
      <Box display="flex" alignItems="center">
        <Box py="8px" px={{ xs: "16px", sm: "32px" }} width="100%" margin="auto">
          <Box>
            <Tabs
              value={selectedEpochIndex}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
              sx={{
                "& .MuiTabScrollButton-root.Mui-disabled": {
                  opacity: 0.5,
                },
                "& .MuiTab-root.Mui-selected": {
                  textDecoration: "none",
                },
                "& .MuiTab-root:hover": {
                  textDecoration: "none",
                },
              }}
            >
              {epochs.map((epoch, index) => (
                <Tab
                  key={epoch.epochId + epoch.endTimestamp + epoch.startTimestamp}
                  label={
                    <Box display="flex" flexDirection="column" alignItems="center" gap="4px">
                      <Box width="6px" height="6px" bgcolor={getStatusColor(epoch.status)} borderRadius="100%" />
                      <Typography variant="body1" fontWeight={500}>
                        Epoch {epoch.epochId}
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </Tabs>
          </Box>
          <Box mt="16px" display="flex" flexDirection={{ xs: "column", md: "row" }} gap="16px">
            <Box width={{ xs: "100%", md: "344px" }} flexShrink={0}>
              {selectedEpoch ? (
                <ManageEpochStats
                  epochId={selectedEpoch.epochId}
                  startTimestamp={selectedEpoch.startTimestamp}
                  endTimestamp={selectedEpoch.endTimestamp}
                  totalUnits={selectedEpoch.totalUnits}
                  totalYield={selectedEpoch.totalRewardsDistributed}
                  status={selectedEpoch.status}
                  chainId={chainId}
                  onSubmitProposal={handleSubmitProposal}
                  isSubmitting={prepareMutation.isLoading}
                  userCount={selectedEpoch.userCount || 0}
                />
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                  <Typography>Select an epoch</Typography>
                </Box>
              )}
            </Box>
            <Box flex={1} minWidth={0} overflow="hidden">
              {isLoadingUsers ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                  <CircularProgress size={24} />
                </Box>
              ) : epochUsersData ? (
                <ManageEpochTable users={epochUsersData.users} totalUserCount={selectedEpoch?.userCount || 0} />
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                  <Typography>No user data available</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </section>
  );
};
