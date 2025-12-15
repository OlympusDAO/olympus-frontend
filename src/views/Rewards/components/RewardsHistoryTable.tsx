import { formatUnits } from "@ethersproject/units";
import { Box, Button, SvgIcon, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import { Contract } from "ethers";
import { useMemo, useState } from "react";
import DepositRewardsDistributorABI from "src/abi/DepositRewardsDistributor.json";
import DrachmaIcon from "src/assets/icons/drachma.svg?react";
import USDSIcon from "src/assets/icons/USDS.svg?react";
import { DEPOSIT_REWARDS_DISTRIBUTOR_ADDRESSES } from "src/constants/addresses";
import { LibChainId, useGETUserUserHistory } from "src/generated/olympusUnits";
import { formatNumber } from "src/helpers";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { NetworkId } from "src/networkDetails";
import { ClaimRewardsModal } from "src/views/Rewards/components/ClaimRewardsModal";
import { useClaimRewards } from "src/views/Rewards/hooks/useClaimRewards";
import { useAccount, useNetwork } from "wagmi";

// Format token amount from wei to human-readable format
const formatTokenAmount = (amount: string, decimals: number): string => {
  const formatted = parseFloat(formatUnits(amount, decimals));
  if (formatted === 0) return "0";
  if (formatted < 0.0001) return "< 0.0001";
  if (formatted < 1) return formatted.toFixed(4);
  if (formatted < 1000) return formatted.toFixed(2);
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(formatted);
};

// Hook to check if user has claimed for a specific epoch
const useHasClaimed = (userAddress: string | undefined, epochEndDate: number) => {
  const { chain = { id: 11155111 } } = useNetwork();
  const networkId = chain.id as NetworkId;
  const contractAddress =
    DEPOSIT_REWARDS_DISTRIBUTOR_ADDRESSES[networkId as keyof typeof DEPOSIT_REWARDS_DISTRIBUTOR_ADDRESSES];

  const provider = Providers.getStaticProvider(networkId);

  const contract = useMemo(() => {
    if (!provider || !contractAddress) return null;
    return new Contract(contractAddress, DepositRewardsDistributorABI, provider);
  }, [provider, contractAddress]);

  return useQuery({
    queryKey: ["hasClaimed", userAddress, epochEndDate, networkId],
    queryFn: async () => {
      if (!contract || !userAddress) return false;
      const result = await contract.hasClaimed(userAddress, epochEndDate);
      return Boolean(result);
    },
    enabled: !!userAddress && !!contract,
  });
};

// Hook to check if merkle root is set for a specific epoch
const useHasMerkleRoot = (epochEndDate: number) => {
  const { chain = { id: 11155111 } } = useNetwork();
  const networkId = chain.id as NetworkId;
  const contractAddress =
    DEPOSIT_REWARDS_DISTRIBUTOR_ADDRESSES[networkId as keyof typeof DEPOSIT_REWARDS_DISTRIBUTOR_ADDRESSES];

  const provider = Providers.getStaticProvider(networkId);

  const contract = useMemo(() => {
    if (!provider || !contractAddress) return null;
    return new Contract(contractAddress, DepositRewardsDistributorABI, provider);
  }, [provider, contractAddress]);

  return useQuery({
    queryKey: ["hasMerkleRoot", epochEndDate, networkId],
    queryFn: async () => {
      if (!contract) return false;
      const result = await contract.weeklyMerkleRoots(epochEndDate);
      // Check if merkle root is not zero (bytes32(0))
      const zeroBytes32 = "0x0000000000000000000000000000000000000000000000000000000000000000";
      return result !== zeroBytes32 && result !== "0x0";
    },
    enabled: !!contract,
  });
};

// Component for individual claim button with status check
const ClaimButton = ({
  epochId,
  epochEndDate,
  userAddress,
  rewardAmount,
  merkleProof,
  rewardAssetDecimals,
  rewardAssetSymbol,
}: {
  epochId: number;
  epochEndDate: number;
  userAddress: string;
  rewardAmount: string;
  merkleProof: string[];
  rewardAssetDecimals: number;
  rewardAssetSymbol: string;
}) => {
  const { data: hasClaimed = false, isLoading: isCheckingClaim } = useHasClaimed(userAddress, epochEndDate);
  const { data: hasMerkleRoot = false, isLoading: isCheckingMerkleRoot } = useHasMerkleRoot(epochEndDate);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasNoRewards = parseFloat(formatUnits(rewardAmount, rewardAssetDecimals)) === 0;

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const claimMutation = useClaimRewards();

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

  const isDisabled = hasClaimed || isCheckingClaim || isCheckingMerkleRoot || hasNoRewards || !hasMerkleRoot;

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        size="small"
        disabled={isDisabled}
        onClick={handleOpenModal}
        sx={{
          textTransform: "none",
          fontSize: "13px",
          fontWeight: 500,
          padding: "6px 16px",
          opacity: hasClaimed || hasNoRewards || !hasMerkleRoot ? 0.5 : 1,
        }}
      >
        {hasClaimed ? "Claimed" : !hasMerkleRoot && !isCheckingMerkleRoot ? "Pending" : "Claim"}
      </Button>

      <ClaimRewardsModal
        open={isModalOpen}
        onClose={handleCloseModal}
        epochEndDates={[epochEndDate]}
        amounts={[rewardAmount]}
        proofs={[merkleProof]}
        totalAmount={parseFloat(formatUnits(rewardAmount, rewardAssetDecimals))}
        onClaim={handleClaim}
        isClaiming={claimMutation.isLoading}
        rewardAssetDecimals={rewardAssetDecimals}
        rewardAssetSymbol={rewardAssetSymbol}
      />
    </>
  );
};

export const RewardsHistoryTable = () => {
  const theme = useTheme();
  const { address } = useAccount();
  const { chain = { id: 11155111 } } = useNetwork();

  const chainId = (chain?.id || LibChainId.NUMBER_11155111) as LibChainId;
  // Fetch user history data from API
  const { data: userHistoryData, isLoading } = useGETUserUserHistory(
    address || "",
    {
      chainId,
    },
    {
      query: {
        enabled: !!address, // Only fetch if address is available
      },
    },
  );

  // Map API data to table format with all necessary data
  const data =
    userHistoryData?.rewards?.entries?.map(entry => ({
      id: entry.epochId,
      epochId: entry.epochId,
      epochEndDate: entry.endDate, // Unix timestamp from API
      drachmas_earned: parseFloat(entry.totalUnits),
      rewardAmount: entry.rewardAmount,
      merkleProof: entry.merkleProof,
      rewardAssetDecimals: entry.rewardAssetDecimals,
      rewardAssetSymbol: entry.rewardAssetSymbol,
    })) || [];

  return (
    <Box
      sx={{
        margin: "0",
        position: "relative",
        width: "100%",
        overflowX: "auto",
        borderRadius: "24px",
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 4px 16px rgba(255,255,255,0.05), 0 0 0 0.5px rgba(255,255,255,0.1), inset 1px 1px 2px rgba(20, 23, 34, 0.1)"
            : "0 4px 16px rgba(20,23,34,0.05), 0 0 0 0.5px rgba(20,23,34,0.1), inset 1px 1px 2px #FFFFFF",
      }}
    >
      <Table
        sx={{
          width: "100%",
          minWidth: "600px",
          background: theme.colors.paper.card,
          borderCollapse: "separate",
          borderSpacing: 0,
          margin: "0",
        }}
      >
        <TableHead>
          <TableRow
            sx={{
              bgcolor: theme.palette.mode === "dark" ? "#20222A" : "#EFEAE0",
            }}
          >
            <TableCell
              sx={{
                color: theme.colors.gray[40],
                fontSize: "12px",
                fontWeight: 400,
                height: "40px",
                padding: "12px",
                paddingLeft: "24px",
                textAlign: "left",
                whiteSpace: "nowrap",
                borderBottom:
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.05)"
                    : "1px solid rgba(20, 23, 34, 0.05)",
              }}
            >
              Epoch
            </TableCell>
            <TableCell
              sx={{
                color: theme.colors.gray[40],
                fontSize: "12px",
                fontWeight: 400,
                height: "40px",
                padding: "12px",
                textAlign: "left",
                whiteSpace: "nowrap",
                borderBottom:
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.05)"
                    : "1px solid rgba(20, 23, 34, 0.05)",
              }}
            >
              Drachmas Earned
            </TableCell>
            <TableCell
              sx={{
                color: theme.colors.gray[40],
                fontSize: "12px",
                fontWeight: 400,
                height: "40px",
                padding: "12px",
                textAlign: "left",
                whiteSpace: "nowrap",
                borderBottom:
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.05)"
                    : "1px solid rgba(20, 23, 34, 0.05)",
              }}
            >
              Your Rewards
            </TableCell>
            <TableCell
              sx={{
                height: "40px",
                padding: "12px",
                paddingRight: "24px",
                borderBottom:
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.05)"
                    : "1px solid rgba(20, 23, 34, 0.05)",
              }}
            />
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow
              sx={{
                bgcolor: theme.palette.mode === "dark" ? "#20222A" : "#EFEAE0",
                borderBottom: "none",
              }}
            >
              <TableCell
                colSpan={4}
                sx={{
                  textAlign: "center",
                  height: "96px",
                  color: theme.colors.gray[40],
                  borderBottom: "none",
                  padding: "12px",
                }}
              >
                Loading...
              </TableCell>
            </TableRow>
          ) : !address ? (
            <TableRow
              sx={{
                bgcolor: theme.palette.mode === "dark" ? "#20222A" : "#EFEAE0",
                borderBottom: "none",
              }}
            >
              <TableCell
                colSpan={4}
                sx={{
                  textAlign: "center",
                  height: "96px",
                  color: theme.colors.gray[40],
                  borderBottom: "none",
                  padding: "12px",
                }}
              >
                Connect your wallet to view rewards history.
              </TableCell>
            </TableRow>
          ) : data.length > 0 ? (
            data.map((row, index) => (
              <TableRow
                key={row.id}
                sx={{
                  bgcolor: theme.palette.mode === "dark" ? "#20222A" : "#EFEAE0",
                  transition: "background-color 0.2s",
                  "&:hover": {
                    bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(20, 23, 34, 0.1)",
                  },
                  borderBottom:
                    index === data.length - 1
                      ? "none"
                      : theme.palette.mode === "dark"
                        ? "1px solid rgba(255, 255, 255, 0.05)"
                        : "1px solid rgba(20, 23, 34, 0.05)",
                }}
              >
                <TableCell
                  sx={{
                    color: theme.colors.gray[10],
                    fontSize: "14px",
                    padding: "12px",
                    paddingLeft: "24px",
                    whiteSpace: "nowrap",
                    borderBottom: "none",
                  }}
                >
                  <Typography fontSize="12px" fontWeight={600} sx={{ color: theme.colors.gray[10] }}>
                    {formatNumber(row.epochId, 0)}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    padding: "12px",
                    whiteSpace: "nowrap",
                    borderBottom: "none",
                  }}
                >
                  <Box display="flex" alignItems="center" gap="4px">
                    <SvgIcon sx={{ fontSize: "14px" }} component={DrachmaIcon} />
                    <Typography fontSize="15px" fontWeight={500} sx={{ color: theme.colors.gray[10] }}>
                      {formatNumber(row.drachmas_earned, 0)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    padding: "12px",
                    whiteSpace: "nowrap",
                    borderBottom: "none",
                  }}
                >
                  <Box display="flex" alignItems="center" gap="4px">
                    <SvgIcon sx={{ fontSize: "14px" }} component={USDSIcon} />
                    <Typography fontSize="15px" fontWeight={500} sx={{ color: theme.colors.gray[10] }}>
                      {formatTokenAmount(row.rewardAmount, row.rewardAssetDecimals)} {row.rewardAssetSymbol}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    padding: "12px",
                    paddingRight: "24px",
                    whiteSpace: "nowrap",
                    borderBottom: "none",
                  }}
                >
                  <Box display="flex" justifyContent="flex-end">
                    {address && (
                      <ClaimButton
                        epochId={row.epochId}
                        epochEndDate={row.epochEndDate}
                        userAddress={address}
                        rewardAmount={row.rewardAmount}
                        merkleProof={row.merkleProof}
                        rewardAssetDecimals={row.rewardAssetDecimals}
                        rewardAssetSymbol={row.rewardAssetSymbol}
                      />
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow
              sx={{
                bgcolor: theme.palette.mode === "dark" ? "#20222A" : "#EFEAE0",
                borderBottom: "none",
              }}
            >
              <TableCell
                colSpan={4}
                sx={{
                  textAlign: "center",
                  height: "96px",
                  color: theme.colors.gray[40],
                  borderBottom: "none",
                  padding: "12px",
                }}
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};
