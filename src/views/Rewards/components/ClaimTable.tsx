import { formatUnits } from "@ethersproject/units";
import { Box, Button, SvgIcon, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import RewardDistributorABI from "src/abi/RewardDistributor.json";
import DrachmaIcon from "src/assets/icons/drachma.svg?react";
import ConvOhmSmIcon from "src/assets/tokens/convOHMsm.svg?react";
import { DEPOSIT_REWARDS_DISTRIBUTOR_ADDRESSES } from "src/constants/addresses";
import {
  LibChainId,
  useGETEpochsCurrentEpoch,
  useGETUserUserHistory,
  useGETUserUserUnits,
} from "src/generated/olympusUnits";
import { formatNumber } from "src/helpers";
import { NetworkId } from "src/networkDetails";
import { RewardsTablePagination } from "src/views/Rewards/components/RewardsTablePagination";
import { useClaimRewards } from "src/views/Rewards/hooks/useClaimRewards";
import { useRewardsTableStyles } from "src/views/Rewards/hooks/useRewardsTableStyles";
import { useAccount, useContractReads, useNetwork } from "wagmi";

type RowStatus = "earning" | "claimable" | "claimed";

interface ClaimRow {
  epoch: number;
  drachmas: number;
  convOhm: number | null;
  price: number | null;
  conversionWindow: string | null;
  status: RowStatus;
  // Raw data for claim action
  endDate?: number;
  rewardAmount?: string;
  merkleProof?: string[];
}

const statusConfig: Record<RowStatus, { label: string; active: boolean }> = {
  earning: { label: "Earning", active: false },
  claimable: { label: "Claim convOHM", active: true },
  claimed: { label: "Claimed", active: false },
};

const ROWS_PER_PAGE = 20;

export const ClaimTable = () => {
  const { theme, colors, styles } = useRewardsTableStyles();
  const { address, isConnected } = useAccount();
  const { chain = { id: 11155111 } } = useNetwork();
  const [page, setPage] = useState(0);

  const { secondaryText } = colors;
  const { headerSx, cellSx, valueSx, containerSx, tableSx, rowHoverSx, actionButtonSx, emptyStateCellSx } = styles;

  const networkId = chain.id as NetworkId;
  const chainId = (chain?.id || LibChainId.NUMBER_11155111) as LibChainId;

  const contractAddress =
    DEPOSIT_REWARDS_DISTRIBUTOR_ADDRESSES[networkId as keyof typeof DEPOSIT_REWARDS_DISTRIBUTOR_ADDRESSES];

  // Fetch current epoch
  const { data: currentEpochData } = useGETEpochsCurrentEpoch({ chainId });

  // Fetch user units
  const { data: userUnitsData } = useGETUserUserUnits(address || "", { chainId }, { query: { enabled: !!address } });

  // Fetch user history
  const { data: userHistoryData } = useGETUserUserHistory(
    address || "",
    { chainId },
    { query: { enabled: !!address } },
  );

  const historyEntries = useMemo(() => userHistoryData?.rewards?.entries || [], [userHistoryData]);

  // hasClaimed multicall
  const hasClaimedContracts = useMemo(
    () =>
      historyEntries.map(entry => ({
        address: contractAddress as `0x${string}`,
        abi: RewardDistributorABI,
        functionName: "hasClaimed",
        args: [address, entry.endDate],
      })),
    [historyEntries, contractAddress, address],
  );

  // epochMerkleRoots multicall
  const merkleRootContracts = useMemo(
    () =>
      historyEntries.map(entry => ({
        address: contractAddress as `0x${string}`,
        abi: RewardDistributorABI,
        functionName: "epochMerkleRoots",
        args: [entry.endDate],
      })),
    [historyEntries, contractAddress],
  );

  const { data: claimStatusData } = useContractReads({
    contracts: hasClaimedContracts,
    enabled: !!address && !!contractAddress && historyEntries.length > 0,
  });

  const { data: merkleRootData } = useContractReads({
    contracts: merkleRootContracts,
    enabled: !!contractAddress && historyEntries.length > 0,
  });

  const claimRewards = useClaimRewards();

  // Build the rows
  const data = useMemo<ClaimRow[]>(() => {
    if (!isConnected) return [];

    const rows: ClaimRow[] = [];
    const zeroBytes32 = "0x0000000000000000000000000000000000000000000000000000000000000000";

    // Current epoch (earning row)
    if (currentEpochData) {
      const drachmas = (userUnitsData?.units?.entries || [])
        .filter(entry => entry.epochId === currentEpochData.epochId)
        .reduce((sum, entry) => sum + parseFloat(entry.units), 0);

      rows.push({
        epoch: currentEpochData.epochNumber,
        drachmas,
        convOhm: null,
        price: null,
        conversionWindow: null,
        status: "earning",
      });
    }

    // Past epochs from history
    historyEntries.forEach((entry, index) => {
      const statusResult = claimStatusData?.[index] as any;
      const claimed = statusResult?.result !== undefined ? Boolean(statusResult.result) : Boolean(statusResult);

      const merkleResult = merkleRootData?.[index] as any;
      const merkleRoot = merkleResult?.result !== undefined ? merkleResult.result : merkleResult;
      const hasMerkleRoot = merkleRoot && merkleRoot !== zeroBytes32 && merkleRoot !== "0x0";

      const drachmas = (userUnitsData?.units?.entries || [])
        .filter(e => e.epochId === entry.epochId)
        .reduce((sum, e) => sum + parseFloat(e.units), 0);

      const convOhm = parseFloat(formatUnits(entry.rewardAmount, entry.rewardAssetDecimals));

      const conversionWindow =
        format(new Date(entry.startDate * 1000), "MMM d, yyyy") +
        " - " +
        format(new Date(entry.endDate * 1000), "MMM d, yyyy");

      const status: RowStatus = claimed ? "claimed" : hasMerkleRoot ? "claimable" : "earning";

      rows.push({
        epoch: entry.epochNumber,
        drachmas,
        convOhm,
        price: null,
        conversionWindow,
        status,
        endDate: entry.endDate,
        rewardAmount: entry.rewardAmount,
        merkleProof: entry.merkleProof,
      });
    });

    return rows;
  }, [isConnected, currentEpochData, userUnitsData, historyEntries, claimStatusData, merkleRootData]);

  const totalRows = data.length;
  const pageData = data.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

  return (
    <Box display="flex" flexDirection="column" gap="24px">
      <Box sx={containerSx}>
        <Table
          sx={{
            ...tableSx,
            minWidth: "800px",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...headerSx, width: "64px", textAlign: "center", pl: "24px" }}>Epoch</TableCell>
              <TableCell sx={{ ...headerSx }}>Drachmas Earned</TableCell>
              <TableCell sx={{ ...headerSx }}>convOHM Earned</TableCell>
              <TableCell sx={{ ...headerSx }}>Convertible Price</TableCell>
              <TableCell sx={{ ...headerSx }}>Conversion Window</TableCell>
              <TableCell sx={{ ...headerSx, width: "144px", pr: "24px" }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {pageData.length > 0 ? (
              pageData.map(row => {
                const { label, active } = statusConfig[row.status];
                return (
                  <TableRow key={row.epoch} sx={rowHoverSx}>
                    {/* Epoch */}
                    <TableCell sx={{ ...cellSx, width: "64px", textAlign: "center", pl: "24px" }}>
                      <Typography sx={valueSx}>{row.epoch}</Typography>
                    </TableCell>

                    {/* Drachmas Earned */}
                    <TableCell sx={cellSx}>
                      <Box display="flex" alignItems="center" gap="4px">
                        <SvgIcon sx={{ fontSize: "16px" }} component={DrachmaIcon} />
                        <Typography sx={valueSx}>{formatNumber(row.drachmas, 0)}</Typography>
                      </Box>
                    </TableCell>

                    {/* convOHM Earned */}
                    <TableCell sx={cellSx}>
                      {row.convOhm !== null ? (
                        <Box display="flex" alignItems="center" gap="4px">
                          <SvgIcon sx={{ fontSize: "16px" }} component={ConvOhmSmIcon} inheritViewBox />
                          <Typography sx={valueSx}>{formatNumber(row.convOhm, 4)}</Typography>
                        </Box>
                      ) : (
                        <Typography sx={valueSx}>-</Typography>
                      )}
                    </TableCell>

                    {/* Convertible Price */}
                    <TableCell sx={cellSx}>
                      {row.price !== null ? (
                        <Box display="flex" alignItems="center" gap="4px">
                          <Typography sx={{ ...valueSx, color: "#45BB78" }}>{row.price.toFixed(2)}</Typography>
                          <Typography sx={valueSx}>USDS/OHM</Typography>
                        </Box>
                      ) : (
                        <Typography sx={valueSx}>-</Typography>
                      )}
                    </TableCell>

                    {/* Conversion Window */}
                    <TableCell sx={cellSx}>
                      <Typography sx={valueSx}>{row.conversionWindow || "-"}</Typography>
                    </TableCell>

                    {/* Action */}
                    <TableCell sx={{ ...cellSx, width: "144px", pr: "24px" }}>
                      <Box display="flex" justifyContent="flex-end">
                        <Button
                          variant="contained"
                          color="primary"
                          disabled={!active || claimRewards.isLoading}
                          sx={actionButtonSx(active)}
                          onClick={() => {
                            if (active && row.endDate !== undefined && row.rewardAmount && row.merkleProof) {
                              claimRewards.mutate({
                                epochEndDates: [row.endDate],
                                amounts: [row.rewardAmount],
                                proofs: [row.merkleProof],
                                asVaultToken: false,
                              });
                            }
                          }}
                        >
                          {label}
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} sx={emptyStateCellSx}>
                  <Box display="flex" flexDirection="column" alignItems="center" gap="4px" textAlign="center">
                    <Typography
                      sx={{ fontSize: "15px", fontWeight: 600, lineHeight: "20px", color: theme.colors.gray[10] }}
                    >
                      {!isConnected ? "Wallet Not Connected" : "No Activity Yet"}
                    </Typography>
                    <Typography sx={{ fontSize: "12px", fontWeight: 500, lineHeight: "16px", color: secondaryText }}>
                      {!isConnected
                        ? "Please connect your wallet to see your activity."
                        : "Once the first epoch is complete, your history will appear here."}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      {/* Pagination */}
      <RewardsTablePagination
        page={page}
        totalRows={totalRows}
        rowsPerPage={ROWS_PER_PAGE}
        onPageChange={setPage}
        secondaryText={colors.secondaryText}
        paginationBtnBg={colors.paginationBtnBg}
        arrowColor={colors.arrowColor}
      />
    </Box>
  );
};
