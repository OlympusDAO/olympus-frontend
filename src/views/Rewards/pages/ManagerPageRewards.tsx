import { Box, CircularProgress, Tab, Tabs, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { DEPOSIT_REWARDS_DISTRIBUTOR_ADDRESSES, SAFE_REWARDS_ADDRESSES } from "src/constants/addresses";
import {
  AdminEpochStatus,
  LibChainId,
  useGETAdminEpochDetails,
  useGETAdminPendingEpochs,
  usePOSTAdminProposeEpochTransaction,
} from "src/generated/olympusUnits";
import { ManageEpochStats } from "src/views/Rewards/components/ManageEpochStats";
import { ManageEpochTable } from "src/views/Rewards/components/ManageEpochTable";
import { useAccount, useNetwork } from "wagmi";

export const ManagerPageRewards = () => {
  const theme = useTheme();
  const { chain } = useNetwork();
  const { address: userAddress } = useAccount();
  const [selectedEpochIndex, setSelectedEpochIndex] = useState(0);

  const chainId = (chain?.id || LibChainId.NUMBER_11155111) as LibChainId;

  // Mutation for submitting proposal
  const proposeMutation = usePOSTAdminProposeEpochTransaction();

  const safeAddress = SAFE_REWARDS_ADDRESSES[chainId as keyof typeof SAFE_REWARDS_ADDRESSES];
  const rewardDistributorAddress =
    DEPOSIT_REWARDS_DISTRIBUTOR_ADDRESSES[chainId as keyof typeof DEPOSIT_REWARDS_DISTRIBUTOR_ADDRESSES];

  // Fetch list of epochs
  const { data: pendingEpochsData, isLoading: isLoadingEpochs } = useGETAdminPendingEpochs({
    chainId,
    safeAddress,
    rewardDistributorAddress,
  });

  const epochs = pendingEpochsData?.epochs || [];
  const selectedEpoch = epochs[selectedEpochIndex];

  // Fetch details for selected epoch
  const { data: epochDetails, isLoading: isLoadingDetails } = useGETAdminEpochDetails(
    selectedEpoch?.startTimestamp || 0,
    {
      chainId,
    },
    {
      query: {
        enabled: !!selectedEpoch,
      },
    },
  );

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedEpochIndex(newValue);
  };

  const getStatusColor = (status: AdminEpochStatus) => {
    switch (status) {
      case AdminEpochStatus.NOT_SUBMITTED:
        return theme.palette.mode === "dark" ? "#F8CC82" : "#F8CC82";
      case AdminEpochStatus.PENDING_SIGNATURES:
        return theme.palette.mode === "dark" ? "#4A9EFF" : "#4A9EFF";
      case AdminEpochStatus.EXECUTED:
        return theme.palette.mode === "dark" ? "#6FCF97" : "#6FCF97";
      default:
        return theme.colors.gray[40];
    }
  };

  const handleSubmitProposal = () => {
    if (!userAddress || !selectedEpoch) return;

    proposeMutation.mutate({
      startTimestamp: selectedEpoch.startTimestamp,
      data: {
        chainId,
        safeAddress,
        rewardDistributorAddress,
        callerAddress: userAddress,
      },
    });
  };

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
        <Box py="8px" px="32px" maxWidth="930px" margin="auto">
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
                      Epoch {epoch.epochId}
                    </Box>
                  }
                />
              ))}
            </Tabs>
          </Box>
          <Box mt="16px" display="flex" gap="16px">
            <Box width="344px" flexShrink={0}>
              {isLoadingDetails ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                  <CircularProgress size={24} />
                </Box>
              ) : (
                epochDetails && (
                  <ManageEpochStats
                    epochId={epochDetails.epochId}
                    startTimestamp={epochDetails.startTimestamp}
                    endTimestamp={epochDetails.endTimestamp}
                    totalUnits={epochDetails.totalUnits}
                    totalYield={epochDetails.totalYield}
                    status={selectedEpoch.status}
                    chainId={chainId}
                    onSubmitProposal={handleSubmitProposal}
                    isSubmitting={proposeMutation.isLoading}
                  />
                )
              )}
            </Box>
            <Box flex={1} minWidth={0}>
              {isLoadingDetails ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                  <CircularProgress size={24} />
                </Box>
              ) : (
                epochDetails && <ManageEpochTable users={epochDetails.users} totalUserCount={epochDetails.userCount} />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </section>
  );
};
