import { formatUnits } from "@ethersproject/units";
import { Box, Paper, SvgIcon, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMemo } from "react";
import RewardDistributorABI from "src/abi/RewardDistributor.json";
import DrachmaIcon from "src/assets/icons/drachma.svg?react";
import OhmIcon from "src/assets/tokens/token_OHM.svg?react";
import { DEPOSIT_REWARDS_DISTRIBUTOR_ADDRESSES } from "src/constants/addresses";
import {
  LibChainId,
  useGETEpochsCurrentEpoch,
  useGETUserUserHistory,
  useGETUserUserUnits,
} from "src/generated/olympusUnits";
import { formatNumber } from "src/helpers";
import { NetworkId } from "src/networkDetails";
import { useAccount, useContractReads, useNetwork } from "wagmi";

export const UserRewards = () => {
  const theme = useTheme();
  const { address } = useAccount();
  const { chain = { id: 11155111 } } = useNetwork();
  const networkId = chain.id as NetworkId;

  const chainId = (chain?.id || LibChainId.NUMBER_11155111) as LibChainId;

  // Fetch current epoch data
  const { data: currentEpochData } = useGETEpochsCurrentEpoch(
    { chainId },
    {
      query: {
        enabled: true,
      },
    },
  );

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

  // Calculate drachmas earned in the current epoch
  const currentEpochDrachmas = useMemo(() => {
    if (!userUnitsData?.units?.entries || !currentEpochData?.epochId) return 0;
    return userUnitsData.units.entries
      .filter(entry => entry.epochId === currentEpochData.epochId)
      .reduce((sum, entry) => sum + parseFloat(entry.units), 0);
  }, [userUnitsData?.units?.entries, currentEpochData?.epochId]);

  // Get contract address for checking claim status
  const contractAddress =
    DEPOSIT_REWARDS_DISTRIBUTOR_ADDRESSES[networkId as keyof typeof DEPOSIT_REWARDS_DISTRIBUTOR_ADDRESSES];

  // Get all epochs from history with their end dates
  const epochData = useMemo(
    () =>
      userHistoryData?.rewards?.entries?.map(entry => ({
        epochId: entry.epochId,
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
      const statusResult = claimStatusData[index] as any;
      const claimed = statusResult?.result !== undefined ? Boolean(statusResult.result) : Boolean(statusResult);

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

  // Calculate claimed and unclaimed rewards
  const { totalClaimed, totalUnclaimedRewards } = useMemo(() => {
    const entries = userHistoryData?.rewards?.entries || [];

    let claimed = 0;
    let unclaimedRewards = 0;

    entries.forEach(entry => {
      const claimStatus = claimStatuses.find(s => s.epochId === entry.epochId);
      const rewardAmount = parseFloat(formatUnits(entry.rewardAmount, entry.rewardAssetDecimals));

      if (claimStatus?.claimed) {
        claimed += rewardAmount;
      } else {
        unclaimedRewards += rewardAmount;
      }
    });

    return {
      totalClaimed: claimed,
      totalUnclaimedRewards: unclaimedRewards,
    };
  }, [userHistoryData?.rewards?.entries, claimStatuses]);

  const isDark = theme.palette.mode === "dark";

  const cardSx = {
    bgcolor: isDark ? "#2C2E37" : "#FFF",
    borderRadius: "12px",
    padding: "16px",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(20,23,34,0.1)"}`,
  };

  const iconBadgeSx = {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(20,23,34,0.1)"}`,
    bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(20,23,34,0.03)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <Paper
      sx={{
        minWidth: "400px",
        background: isDark ? "#20222A" : "#EFEAE0",
        padding: "24px",
        borderRadius: "24px",
        boxShadow: "none",
        flexShrink: 0,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Typography fontSize="24px" fontWeight={700} sx={{ color: theme.colors.gray[10], mb: "4px" }}>
          Your Stats
        </Typography>

        {/* Card 1 — Drachmas */}
        <Box sx={cardSx}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb="12px">
            <Typography fontSize="15px" fontWeight={700} sx={{ color: theme.colors.gray[10] }}>
              Drachmas
            </Typography>
            <Box sx={iconBadgeSx}>
              <SvgIcon sx={{ fontSize: "20px" }} component={DrachmaIcon} />
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" gap="8px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography fontSize="15px" fontWeight={400} sx={{ color: theme.colors.gray[40] }}>
                This Epoch
              </Typography>
              <Typography fontSize="15px" fontWeight={600} sx={{ color: theme.colors.gray[10] }}>
                {formatNumber(currentEpochDrachmas, 0)}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography fontSize="15px" fontWeight={400} sx={{ color: theme.colors.gray[40] }}>
                Total
              </Typography>
              <Typography fontSize="15px" fontWeight={600} sx={{ color: theme.colors.gray[10] }}>
                {formatNumber(totalUnits, 0)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Card 2 — Convertible OHM */}
        <Box sx={cardSx}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb="12px">
            <Typography fontSize="15px" fontWeight={700} sx={{ color: theme.colors.gray[10] }}>
              Convertible OHM
            </Typography>
            <Box sx={iconBadgeSx}>
              <SvgIcon sx={{ fontSize: "20px" }} component={OhmIcon} viewBox="0 0 32 32" />
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" gap="8px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography fontSize="15px" fontWeight={400} sx={{ color: theme.colors.gray[40] }}>
                Available to Claim
              </Typography>
              <Typography fontSize="15px" fontWeight={600} sx={{ color: theme.colors.gray[10] }}>
                {formatNumber(totalUnclaimedRewards, 2)}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography fontSize="15px" fontWeight={400} sx={{ color: theme.colors.gray[40] }}>
                Claimed
              </Typography>
              <Typography fontSize="15px" fontWeight={600} sx={{ color: theme.colors.gray[10] }}>
                {formatNumber(totalClaimed, 2)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Card 3 — OHM */}
        <Box sx={cardSx}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb="12px">
            <Typography fontSize="15px" fontWeight={700} sx={{ color: theme.colors.gray[10] }}>
              OHM
            </Typography>
            <Box sx={iconBadgeSx}>
              <SvgIcon sx={{ fontSize: "20px" }} component={OhmIcon} viewBox="0 0 32 32" />
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" gap="8px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography fontSize="15px" fontWeight={400} sx={{ color: theme.colors.gray[40] }}>
                Available to Convert
              </Typography>
              <Typography fontSize="15px" fontWeight={600} sx={{ color: theme.colors.gray[10] }}>
                0
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography fontSize="15px" fontWeight={400} sx={{ color: theme.colors.gray[40] }}>
                Converted
              </Typography>
              <Typography fontSize="15px" fontWeight={600} sx={{ color: theme.colors.gray[10] }}>
                0
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
