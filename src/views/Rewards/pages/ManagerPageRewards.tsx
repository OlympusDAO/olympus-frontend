import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Alert, Box, Button, CircularProgress, Paper, Snackbar, Tab, Tabs, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Modal, PrimaryButton, SecondaryButton } from "@olympusdao/component-library";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import {
  AdminProposalStatus,
  EpochsEpochRewardsStatus,
  LibChainId,
  POSTAdminPrepareEpochTransactionApi200,
  useGETEpochsEpochRewards,
  useGETEpochsEpochRewardUsers,
  useGETEpochsEpochsList,
  usePOSTAdminPrepareEpochTransactionApi,
  usePOSTAdminSubmitEpochTransactionApi,
} from "src/generated/olympusUnits";
import { ManageEpochStats } from "src/views/Rewards/components/ManageEpochStats";
import { ManageEpochTable } from "src/views/Rewards/components/ManageEpochTable";
import { useAuth } from "src/views/Rewards/hooks/useAuth";
import { useSignSafeTransaction } from "src/views/Rewards/hooks/useSignSafeTransaction";
import { useAccount, useNetwork } from "wagmi";

// Submission flow states
type SubmissionStep = "idle" | "preparing" | "signing" | "submitting" | "success" | "error";

export const ManagerPageRewards = () => {
  const theme = useTheme();
  const { chain } = useNetwork();
  const { address: userAddress } = useAccount();
  const queryClient = useQueryClient();
  const [selectedEpochIndex, setSelectedEpochIndex] = useState(0);

  // Submission flow state
  const [submissionStep, setSubmissionStep] = useState<SubmissionStep>("idle");
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [safeUrl, setSafeUrl] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [resubmitDialogOpen, setResubmitDialogOpen] = useState(false);

  // Authentication
  const { isAuthenticated, isAuthenticating, signIn } = useAuth();

  // Safe transaction signing
  const { signSafeTxHash } = useSignSafeTransaction();

  const chainId = (chain?.id || LibChainId.NUMBER_11155111) as LibChainId;

  // Mutation for preparing transaction
  const prepareMutation = usePOSTAdminPrepareEpochTransactionApi();

  // Mutation for submitting signed transaction
  const submitMutation = usePOSTAdminSubmitEpochTransactionApi();

  // Fetch list of epochs (only when authenticated)
  const { data: epochsListData, isLoading: isLoadingEpochs } = useGETEpochsEpochsList(
    {
      chainId,
      sortOrder: "desc",
    },
    {
      query: {
        enabled: isAuthenticated,
      },
    },
  );

  const epochs = epochsListData?.epochs || [];
  const selectedEpoch = epochs[selectedEpochIndex];

  // Fetch epoch rewards to get the rewardAssetId and epochRewardsId (which is the table PK)
  const { data: epochRewardsData, isLoading: isLoadingRewards } = useGETEpochsEpochRewards(selectedEpoch?.id || 0, {
    query: {
      enabled: !!selectedEpoch?.id && isAuthenticated,
    },
  });

  // Get the reward asset info from the epoch rewards response
  const rewardAsset = epochRewardsData?.rewards?.[0];
  const rewardAssetId = rewardAsset?.rewardAssetId;
  const rewardAssetDecimals = rewardAsset?.tokenDecimals ?? 18;
  const rewardAssetSymbol = rewardAsset?.tokenSymbol ?? "USDS";
  // epochRewardsId is the primary key from epoch_rewards table, used for submitting transactions
  const epochRewardsId = rewardAsset?.id;

  // Fetch users for selected epoch using the correct rewardAssetId
  const { data: epochUsersData, isLoading: isLoadingUsers } = useGETEpochsEpochRewardUsers(
    selectedEpoch?.id || 0,
    rewardAssetId || 0,
    {
      limit: 100, // Get top 100 users
      sortOrder: "desc" as const,
    },
    {
      query: {
        enabled: !!selectedEpoch && !!rewardAssetId,
      },
    },
  );

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedEpochIndex(newValue);
  };

  // Derive the primary status from rewardStatuses array
  // Priority: distributed > calculated > pending
  const getPrimaryStatus = (rewardStatuses: string[]): string => {
    if (rewardStatuses.includes(EpochsEpochRewardsStatus.distributed)) {
      return EpochsEpochRewardsStatus.distributed;
    }
    if (rewardStatuses.includes(EpochsEpochRewardsStatus.calculated)) {
      return EpochsEpochRewardsStatus.calculated;
    }
    return EpochsEpochRewardsStatus.pending;
  };

  const getStatusColor = (rewardStatuses: string[]) => {
    const primaryStatus = getPrimaryStatus(rewardStatuses);
    switch (primaryStatus) {
      case EpochsEpochRewardsStatus.pending:
        return theme.colors.gray[40];
      case EpochsEpochRewardsStatus.calculated:
        return theme.palette.mode === "dark" ? "#F8CC82" : "#F8CC82";
      case EpochsEpochRewardsStatus.distributed:
        return theme.palette.mode === "dark" ? "#6FCF97" : "#6FCF97";
      default:
        return theme.colors.gray[40];
    }
  };

  // Handle the full proposal submission flow: prepare -> sign -> submit
  const handleSubmitProposal = useCallback(async () => {
    if (!selectedEpoch || !epochRewardsId) return;

    setSubmissionStep("preparing");
    setSubmissionError(null);
    setSafeUrl(null);

    try {
      // Step 1: Prepare the transaction (backend creates Safe tx and returns safeTxHash)
      const prepareResult: POSTAdminPrepareEpochTransactionApi200 = await prepareMutation.mutateAsync({
        epochRewardsId,
      });

      // If the transaction was already executed, no need to sign
      if (prepareResult.safeStatus === AdminProposalStatus.ALREADY_EXECUTED) {
        setSubmissionStep("success");
        setSafeUrl(prepareResult.safeUrl || null);
        setSnackbarOpen(true);
        return;
      }

      // Backend must provide safeTxHash
      if (!prepareResult.safeTxHash) {
        throw new Error("Backend did not return safeTxHash. Please try again.");
      }

      // Step 2: Sign the safeTxHash
      setSubmissionStep("signing");
      const signature = await signSafeTxHash(prepareResult.safeTxHash);

      // Step 3: Submit the signature to backend
      setSubmissionStep("submitting");
      const submitResult = await submitMutation.mutateAsync({
        epochRewardsId,
        data: {
          safeTxHash: prepareResult.safeTxHash,
          senderSignature: signature,
        },
      });

      // Success!
      setSubmissionStep("success");
      setSafeUrl(submitResult.safeUrl || null);
      setSnackbarOpen(true);

      // Refresh the epochs data
      await queryClient.invalidateQueries({ queryKey: ["/epochs"] });
      await queryClient.invalidateQueries({
        predicate: query => {
          const key = query.queryKey[0];
          return typeof key === "string" && key.startsWith("/epochs/");
        },
      });
    } catch (err) {
      console.error("Proposal submission failed:", err);
      setSubmissionStep("error");
      setSubmissionError(err instanceof Error ? err.message : "Failed to submit proposal");
      setSnackbarOpen(true);
    }
  }, [selectedEpoch, epochRewardsId, prepareMutation, signSafeTxHash, submitMutation, queryClient]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Handle button click - show confirmation if resubmitting
  const handleButtonClick = () => {
    if (submissionStep === "success" || rewardAsset?.safeUrl) {
      setResubmitDialogOpen(true);
    } else {
      handleSubmitProposal();
    }
  };

  const handleConfirmResubmit = () => {
    setResubmitDialogOpen(false);
    handleSubmitProposal();
  };

  const handleCancelResubmit = () => {
    setResubmitDialogOpen(false);
  };

  // Check if currently in submission flow
  const isSubmitting = submissionStep !== "idle" && submissionStep !== "success" && submissionStep !== "error";

  // Get submission step label for button
  const getSubmissionLabel = () => {
    switch (submissionStep) {
      case "preparing":
        return "Preparing Transaction...";
      case "signing":
        return "Sign in Wallet...";
      case "submitting":
        return "Submitting Transaction...";
      case "success":
        return "Resubmit Transaction";
      default:
        // If epoch already has a safeUrl (was previously submitted), show resubmit
        if (rewardAsset?.safeUrl) {
          return "Resubmit Transaction";
        }
        return "Prepare Transaction";
    }
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
              {epochs.map(epoch => (
                <Tab
                  key={epoch.id + epoch.endTimestamp + epoch.startTimestamp}
                  label={
                    <Box display="flex" flexDirection="column" alignItems="center" gap="4px">
                      <Box
                        width="6px"
                        height="6px"
                        bgcolor={getStatusColor(epoch.rewardStatuses)}
                        borderRadius="100%"
                      />
                      <Typography variant="body1" fontWeight={500}>
                        Epoch {epoch.id}
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
                  epochId={selectedEpoch.id}
                  startTimestamp={selectedEpoch.startTimestamp}
                  endTimestamp={selectedEpoch.endTimestamp}
                  totalUnits={
                    epochUsersData?.users?.reduce((sum, user) => sum + BigInt(user.units), BigInt(0)).toString() || "0"
                  }
                  totalYield={rewardAsset?.rewardAmount || "0"}
                  rewardStatuses={selectedEpoch.rewardStatuses}
                  chainId={chainId}
                  onSubmitProposal={handleButtonClick}
                  isSubmitting={isSubmitting}
                  submissionLabel={getSubmissionLabel()}
                  submissionSuccess={submissionStep === "success" || !!rewardAsset?.safeUrl}
                  safeUrl={safeUrl || (rewardAsset?.safeUrl as string | null) || null}
                  userCount={epochUsersData?.pagination?.total || 0}
                  rewardAssetDecimals={rewardAssetDecimals}
                  rewardAssetSymbol={rewardAssetSymbol}
                />
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                  <Typography>Select an epoch</Typography>
                </Box>
              )}
            </Box>
            <Box flex={1} minWidth={0} overflow="hidden">
              {isLoadingRewards || isLoadingUsers ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                  <CircularProgress size={24} />
                </Box>
              ) : epochUsersData ? (
                <ManageEpochTable
                  users={epochUsersData.users}
                  totalUserCount={epochUsersData.pagination?.total || 0}
                  rewardAssetDecimals={epochUsersData.rewardAssetDecimals}
                  rewardAssetSymbol={epochUsersData.rewardAssetSymbol}
                />
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                  <Typography>No user data available</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Submission feedback snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={submissionStep === "success" ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {submissionStep === "success" ? (
            <>
              Transaction submitted to Safe!
              {safeUrl && (
                <Box component="span" ml={1}>
                  <a href={safeUrl} target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>
                    View in Safe →
                  </a>
                </Box>
              )}
            </>
          ) : (
            submissionError || "An error occurred"
          )}
        </Alert>
      </Snackbar>

      {/* Resubmit confirmation modal */}
      <Modal
        maxWidth="476px"
        headerContent={
          <Typography variant="h5" fontWeight={600}>
            Resubmit Transaction?
          </Typography>
        }
        open={resubmitDialogOpen}
        onClose={handleCancelResubmit}
        minHeight="200px"
      >
        <Box display="flex" flexDirection="column" gap="24px">
          {/* Warning message */}
          <Box
            sx={{
              padding: "16px",
              borderRadius: "12px",
              bgcolor: theme.palette.mode === "dark" ? "#2C2E37" : "#F5F5F5",
            }}
          >
            <Typography fontSize="15px" fontWeight={400} color={theme.colors.gray[40]}>
              If the transaction has already been executed on-chain, nothing will happen.
            </Typography>
          </Box>

          {/* View in Safe link */}
          {(safeUrl || rewardAsset?.safeUrl) && (
            <Button
              component="a"
              href={safeUrl || (rewardAsset?.safeUrl as string)}
              target="_blank"
              rel="noopener noreferrer"
              variant="text"
              color="primary"
              endIcon={<OpenInNewIcon fontSize="small" />}
              sx={{
                textTransform: "none",
                padding: 0,
                minWidth: "auto",
                alignSelf: "flex-start",
                "&:hover": {
                  backgroundColor: "transparent",
                  textDecoration: "underline",
                },
              }}
            >
              View current transaction in Safe
            </Button>
          )}

          {/* Action buttons */}
          <Box display="flex" gap="12px">
            <SecondaryButton fullWidth onClick={handleCancelResubmit}>
              Cancel
            </SecondaryButton>
            <PrimaryButton fullWidth onClick={handleConfirmResubmit}>
              Resubmit
            </PrimaryButton>
          </Box>
        </Box>
      </Modal>
    </section>
  );
};
