import { formatUnits } from "@ethersproject/units";
import { Box, Button, SvgIcon, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import RewardDistributorABI from "src/abi/RewardDistributor.json";
import ConvOhmSmIcon from "src/assets/tokens/convOHMsm.svg?react";
import { DEPOSIT_REWARDS_DISTRIBUTOR_ADDRESSES } from "src/constants/addresses";
import { LibChainId, useGETUserUserHistory } from "src/generated/olympusUnits";
import { formatNumber } from "src/helpers";
import { NetworkId } from "src/networkDetails";
import { ConvertModal } from "src/views/Rewards/components/ConvertModal";
import { RewardsTablePagination } from "src/views/Rewards/components/RewardsTablePagination";
import { useRewardsTableStyles } from "src/views/Rewards/hooks/useRewardsTableStyles";
import { useAccount, useContractReads, useNetwork } from "wagmi";

type RowStatus = "convertible" | "converted";

export interface ConvertRow {
  id: number;
  availableToConvert: number;
  convertiblePrice: number | null;
  discount: number | null;
  conversionWindow: string;
  netValue: number | null;
  status: RowStatus;
}

const statusConfig: Record<RowStatus, { label: string; active: boolean }> = {
  convertible: { label: "Convert to OHM", active: true },
  converted: { label: "Converted", active: false },
};

const ROWS_PER_PAGE = 20;

export const ConvertTable = () => {
  const { theme, colors, styles } = useRewardsTableStyles();
  const { address, isConnected } = useAccount();
  const { chain = { id: 11155111 } } = useNetwork();
  const [page, setPage] = useState(0);
  const [selectedRow, setSelectedRow] = useState<ConvertRow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { secondaryText } = colors;
  const { headerSx, cellSx, valueSx, containerSx, tableSx, rowHoverSx, actionButtonSx, emptyStateCellSx } = styles;

  const networkId = chain.id as NetworkId;
  const chainId = (chain?.id || LibChainId.NUMBER_11155111) as LibChainId;

  const contractAddress =
    DEPOSIT_REWARDS_DISTRIBUTOR_ADDRESSES[networkId as keyof typeof DEPOSIT_REWARDS_DISTRIBUTOR_ADDRESSES];

  const { data: userHistoryData } = useGETUserUserHistory(
    address || "",
    { chainId },
    { query: { enabled: !!address } },
  );

  const historyEntries = useMemo(() => userHistoryData?.rewards?.entries || [], [userHistoryData]);

  // hasClaimed multicall to identify claimed (convertible) entries
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

  const { data: claimStatusData } = useContractReads({
    contracts: hasClaimedContracts,
    enabled: !!address && !!contractAddress && historyEntries.length > 0,
  });

  const data = useMemo<ConvertRow[]>(() => {
    if (!isConnected) return [];

    const rows: ConvertRow[] = [];

    historyEntries.forEach((entry, index) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const statusResult = claimStatusData?.[index] as any;
      const claimed = statusResult?.result !== undefined ? Boolean(statusResult.result) : Boolean(statusResult);
      if (!claimed) return;

      const availableToConvert = parseFloat(formatUnits(entry.rewardAmount, entry.rewardAssetDecimals));
      const conversionWindow =
        format(new Date(entry.startDate * 1000), "MMM d, yyyy") +
        " - " +
        format(new Date(entry.endDate * 1000), "MMM d, yyyy");

      rows.push({
        id: entry.epochId,
        availableToConvert,
        convertiblePrice: null,
        discount: null,
        conversionWindow,
        netValue: null,
        status: "convertible",
      });
    });

    return rows;
  }, [isConnected, historyEntries, claimStatusData]);

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
              <TableCell sx={{ ...headerSx, width: "160px", pl: "24px" }}>Available to Convert</TableCell>
              <TableCell sx={{ ...headerSx }}>Convertible Price</TableCell>
              <TableCell sx={{ ...headerSx, width: "144px" }}>Discount</TableCell>
              <TableCell sx={{ ...headerSx }}>Conversion Window</TableCell>
              <TableCell sx={{ ...headerSx, width: "120px" }}>Net Value</TableCell>
              <TableCell sx={{ ...headerSx, width: "144px", pr: "24px" }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {pageData.length > 0 ? (
              pageData.map(row => {
                const { label, active } = statusConfig[row.status];
                return (
                  <TableRow key={row.id} sx={rowHoverSx}>
                    {/* Available to Convert */}
                    <TableCell sx={{ ...cellSx, width: "160px", pl: "24px" }}>
                      <Box display="flex" alignItems="center" gap="4px">
                        <SvgIcon sx={{ fontSize: "16px" }} component={ConvOhmSmIcon} inheritViewBox />
                        <Typography sx={valueSx}>{formatNumber(row.availableToConvert, 4)}</Typography>
                      </Box>
                    </TableCell>

                    {/* Convertible Price */}
                    <TableCell sx={cellSx}>
                      {row.convertiblePrice !== null ? (
                        <Box display="flex" alignItems="center" gap="4px">
                          <Typography sx={{ ...valueSx, color: "#45BB78" }}>
                            {row.convertiblePrice.toFixed(2)}
                          </Typography>
                          <Typography sx={valueSx}>USDS/OHM</Typography>
                        </Box>
                      ) : (
                        <Typography sx={valueSx}>-</Typography>
                      )}
                    </TableCell>

                    {/* Discount */}
                    <TableCell sx={{ ...cellSx, width: "144px" }}>
                      {row.discount !== null ? (
                        <Typography sx={{ ...valueSx, color: row.discount >= 0 ? "#45BB78" : "#F55B5B" }}>
                          {row.discount}%
                        </Typography>
                      ) : (
                        <Typography sx={valueSx}>-</Typography>
                      )}
                    </TableCell>

                    {/* Conversion Window */}
                    <TableCell sx={cellSx}>
                      <Typography sx={valueSx}>{row.conversionWindow}</Typography>
                    </TableCell>

                    {/* Net Value */}
                    <TableCell sx={{ ...cellSx, width: "120px" }}>
                      {row.netValue !== null ? (
                        <Typography sx={{ ...valueSx, color: row.netValue >= 0 ? "#45BB78" : "#F55B5B" }}>
                          {row.netValue >= 0 ? "+" : ""}${Math.abs(row.netValue).toLocaleString()}
                        </Typography>
                      ) : (
                        <Typography sx={valueSx}>-</Typography>
                      )}
                    </TableCell>

                    {/* Action */}
                    <TableCell sx={{ ...cellSx, width: "144px", pr: "24px" }}>
                      <Box display="flex" justifyContent="flex-end">
                        <Button
                          variant="contained"
                          color="primary"
                          disabled={!active}
                          sx={actionButtonSx(active)}
                          onClick={() => {
                            if (active) {
                              setSelectedRow(row);
                              setModalOpen(true);
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

      {/* Convert Modal */}
      {selectedRow && (
        <ConvertModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedRow(null);
          }}
          row={selectedRow}
        />
      )}
    </Box>
  );
};
