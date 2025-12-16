import { formatUnits } from "@ethersproject/units";
import { Box, Button, Paper, SvgIcon, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Icon } from "@olympusdao/component-library";
import { useMemo, useState } from "react";
import RewardDistributorABI from "src/abi/RewardDistributor.json";
import DrachmaIcon from "src/assets/icons/drachma.svg?react";
import USDSIcon from "src/assets/icons/USDS.svg?react";
import { DEPOSIT_REWARDS_DISTRIBUTOR_ADDRESSES } from "src/constants/addresses";
import { LibChainId, useGETUserUserHistory, useGETUserUserUnits } from "src/generated/olympusUnits";
import { formatNumber } from "src/helpers";
import { NetworkId } from "src/networkDetails";
import { ClaimRewardsModal } from "src/views/Rewards/components/ClaimRewardsModal";
import { useClaimRewards } from "src/views/Rewards/hooks/useClaimRewards";
import { useAccount, useContractReads, useNetwork } from "wagmi";

export const UserRewards = () => {
  const theme = useTheme();
  const { address } = useAccount();
  const { chain = { id: 11155111 } } = useNetwork();
  const networkId = chain.id as NetworkId;

  const chainId = (chain?.id || LibChainId.NUMBER_11155111) as LibChainId;

  // Fetch user units data from API
  const { data: userUnitsData } = useGETUserUserUnits(
    address || "",
    {
      chainId,
    },
    {
      query: {
        enabled: !!address,
      },
    },
  );

  // Fetch user history data from API
  const { data: userHistoryData, error: historyError } = useGETUserUserHistory(
    address || "",
    {
      chainId,
    },
    {
      query: {
        enabled: !!address,
        onError: (error: any) => {
          console.error("Error fetching user history:", error);
        },
      },
    },
  );

  // Log error if exists
  if (historyError) {
    console.error("User history error:", historyError);
  }

  const totalUnits = userUnitsData?.units?.totalUnits ? parseFloat(userUnitsData.units.totalUnits) : 0;

  // Get contract address for checking claim status
  const contractAddress =
    DEPOSIT_REWARDS_DISTRIBUTOR_ADDRESSES[networkId as keyof typeof DEPOSIT_REWARDS_DISTRIBUTOR_ADDRESSES];

  // Get all epochs from history with their end dates
  const epochData = useMemo(
    () =>
      userHistoryData?.rewards?.entries?.map(entry => ({
        epochId: entry.epochId,
        // endDate is already in Unix timestamp (seconds) from API
        epochEndDate: entry.endDate,
      })) || [],
    [userHistoryData?.rewards?.entries],
  );

  // Prepare contracts array for multicall - hasClaimed
  const hasClaimedContracts = useMemo(
    () =>
      epochData.map(({ epochEndDate }) => ({
        address: contractAddress as `0x${string}`,
        abi: RewardDistributorABI,
        functionName: "hasClaimed",
        args: [address, epochEndDate],
      })),
    [epochData, contractAddress, address],
  );

  // Prepare contracts array for multicall - epochMerkleRoots
  const merkleRootContracts = useMemo(
    () =>
      epochData.map(({ epochEndDate }) => ({
        address: contractAddress as `0x${string}`,
        abi: RewardDistributorABI,
        functionName: "epochMerkleRoots",
        args: [epochEndDate],
      })),
    [epochData, contractAddress],
  );

  const { data: claimStatusData } = useContractReads({
    contracts: hasClaimedContracts,
    enabled: !!address && !!contractAddress && epochData.length > 0,
  });

  const { data: merkleRootData } = useContractReads({
    contracts: merkleRootContracts,
    enabled: !!contractAddress && epochData.length > 0,
  });

  // Map claim status and merkle root results to epoch data
  const claimStatuses = useMemo(() => {
    if (!claimStatusData || !merkleRootData) return [];

    const zeroBytes32 = "0x0000000000000000000000000000000000000000000000000000000000000000";

    return epochData.map((epoch, index) => {
      // In wagmi v0.12, useContractReads returns array where each item can be the result directly
      // or an object with { result, status, error }
      const statusResult = claimStatusData[index] as any;
      const claimed = statusResult?.result !== undefined ? Boolean(statusResult.result) : Boolean(statusResult);

      // Check if merkle root is set (not zero)
      const merkleResult = merkleRootData[index] as any;
      const merkleRoot = merkleResult?.result !== undefined ? merkleResult.result : merkleResult;
      const hasMerkleRoot = merkleRoot && merkleRoot !== zeroBytes32 && merkleRoot !== "0x0";

      return {
        epochId: epoch.epochId,
        epochEndDate: epoch.epochEndDate,
        claimed,
        hasMerkleRoot,
      };
    });
  }, [claimStatusData, merkleRootData, epochData]);

  // Get reward asset info from first entry (assuming all entries use same asset)
  const firstEntry = userHistoryData?.rewards?.entries?.[0];
  const rewardAssetDecimals = firstEntry?.rewardAssetDecimals ?? 18;
  const rewardAssetSymbol = firstEntry?.rewardAssetSymbol ?? "USDS";

  // Calculate claimed and unclaimed rewards (only epochs with active merkle roots are claimable)
  const { totalClaimed, totalUnclaimedDrachmas, totalUnclaimedRewards, unclaimedEntries, claimableEntries } =
    useMemo(() => {
      const entries = userHistoryData?.rewards?.entries || [];

      let claimed = 0;
      let unclaimedDrachmas = 0;
      let unclaimedRewards = 0;
      const unclaimed: typeof entries = [];
      const claimable: typeof entries = [];

      entries.forEach(entry => {
        const claimStatus = claimStatuses.find(s => s.epochId === entry.epochId);
        const rewardAmount = parseFloat(formatUnits(entry.rewardAmount, entry.rewardAssetDecimals));
        const drachmas = parseFloat(entry.totalUnits);

        if (claimStatus?.claimed) {
          claimed += rewardAmount;
        } else {
          unclaimedDrachmas += drachmas;
          unclaimedRewards += rewardAmount;
          unclaimed.push(entry);

          // Only add to claimable if merkle root is set and reward amount > 0
          if (claimStatus?.hasMerkleRoot && rewardAmount > 0) {
            claimable.push(entry);
          }
        }
      });

      return {
        totalClaimed: claimed,
        totalUnclaimedDrachmas: unclaimedDrachmas,
        totalUnclaimedRewards: unclaimedRewards,
        unclaimedEntries: unclaimed,
        claimableEntries: claimable,
      };
    }, [userHistoryData?.rewards?.entries, claimStatuses]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const claimMutation = useClaimRewards();

  const handleOpenModal = () => {
    if (claimableEntries.length > 0) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleClaim = async (params: {
    epochEndDates: number[];
    amounts: string[];
    proofs: string[][];
    asVaultToken: boolean;
  }) => {
    try {
      await claimMutation.mutateAsync(params);
      handleCloseModal();
    } catch (error) {
      console.error("Failed to claim:", error);
    }
  };

  return (
    <Paper
      sx={{
        minWidth: "400px",
        background: theme.palette.mode === "dark" ? "#20222A" : "#EFEAE0",
        padding: "24px",
        borderRadius: "24px",
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography fontSize="15px" fontWeight={400} sx={{ color: theme.colors.gray[10] }}>
            Your Rewards
          </Typography>
        </Box>
        <Box
          my="24px"
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          <Box
            sx={{
              bgcolor: theme.palette.mode === "dark" ? "#2C2E37" : "#FFF",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            <Typography fontSize="12px" fontWeight={400} sx={{ color: theme.colors.gray[40], textAlign: "center" }}>
              Total Earned
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="center" gap="4px" mt="8px">
              <SvgIcon sx={{ fontSize: "16px" }} component={DrachmaIcon} />
              <Typography fontSize="15px" fontWeight={500} sx={{ color: theme.colors.gray[10] }}>
                {formatNumber(totalUnits, 0)}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              bgcolor: theme.palette.mode === "dark" ? "#2C2E37" : "#FFF",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            <Typography fontSize="12px" fontWeight={400} sx={{ color: theme.colors.gray[40], textAlign: "center" }}>
              Total Claimed
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="center" gap="4px" mt="8px">
              <SvgIcon sx={{ height: "16px", width: "16px" }} component={USDSIcon} />
              <Typography fontSize="15px" fontWeight={500} sx={{ color: theme.colors.gray[10] }}>
                {formatNumber(totalClaimed, 2)} {rewardAssetSymbol}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              bgcolor: theme.palette.mode === "dark" ? "#2C2E37" : "#FFF",
              borderRadius: "12px",
              padding: "16px",
              gridColumn: "1 / -1",
            }}
          >
            <Typography fontSize="12px" fontWeight={400} sx={{ color: theme.colors.gray[40], textAlign: "center" }}>
              Available to Claim
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="center" mt="8px" gap="4px">
              <Box display="flex" alignItems="center" justifyContent="center" gap="4px">
                <SvgIcon sx={{ fontSize: "20px" }} component={DrachmaIcon} />
                <Typography fontSize="15px" fontWeight={500} sx={{ color: theme.colors.gray[10] }}>
                  {formatNumber(totalUnclaimedDrachmas, 0)}
                </Typography>
              </Box>
              <Icon name="arrow-right" sx={{ fontSize: "12px", color: theme.colors.gray[40] }} />
              <Box display="flex" alignItems="center" justifyContent="center" gap="4px">
                <SvgIcon sx={{ fontSize: "20px" }} component={USDSIcon} />
                <Typography fontSize="15px" fontWeight={500} sx={{ color: theme.colors.gray[10] }}>
                  {formatNumber(totalUnclaimedRewards, 2)} {rewardAssetSymbol}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenModal}
          disabled={claimableEntries.length === 0 || !address}
          sx={{
            width: "100%",
            marginTop: "auto",
            textTransform: "none",
            fontSize: "15px",
            fontWeight: 500,
            padding: "12px 24px",
          }}
        >
          Claim Rewards
        </Button>

        <ClaimRewardsModal
          open={isModalOpen}
          onClose={handleCloseModal}
          epochEndDates={claimableEntries.map(entry => entry.endDate)}
          amounts={claimableEntries.map(entry => entry.rewardAmount)}
          proofs={claimableEntries.map(entry => entry.merkleProof)}
          totalAmount={claimableEntries.reduce(
            (sum, entry) => sum + parseFloat(formatUnits(entry.rewardAmount, entry.rewardAssetDecimals)),
            0,
          )}
          onClaim={handleClaim}
          isClaiming={claimMutation.isLoading}
          rewardAssetDecimals={rewardAssetDecimals}
          rewardAssetSymbol={rewardAssetSymbol}
        />
      </Box>
    </Paper>
  );
};
