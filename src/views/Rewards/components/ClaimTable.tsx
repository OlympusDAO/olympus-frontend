import { Box, Button, SvgIcon, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useState } from "react";
import DrachmaIcon from "src/assets/icons/drachma.svg?react";
import ConvOhmSmIcon from "src/assets/tokens/convOHMsm.svg?react";
import { formatNumber } from "src/helpers";
import { RewardsTablePagination } from "src/views/Rewards/components/RewardsTablePagination";
import { MOCK_DATA } from "src/views/Rewards/constants";
import { useRewardsTableStyles } from "src/views/Rewards/hooks/useRewardsTableStyles";
import { useAccount } from "wagmi";

type RowStatus = "earning" | "claimable" | "claimed";

interface ClaimRow {
  epoch: number;
  drachmas: number;
  convOhm: number | null;
  price: number | null;
  conversionWindow: string | null;
  status: RowStatus;
}

const mockData: ClaimRow[] = [
  { epoch: 7, drachmas: 8357, convOhm: null, price: null, conversionWindow: null, status: "earning" },
  { epoch: 6, drachmas: 11240, convOhm: 56, price: 15.89, conversionWindow: null, status: "claimable" },
  { epoch: 5, drachmas: 9573, convOhm: 42, price: 16.01, conversionWindow: null, status: "claimable" },
  { epoch: 4, drachmas: 7810, convOhm: 31, price: 16.12, conversionWindow: null, status: "claimable" },
  {
    epoch: 3,
    drachmas: 6482,
    convOhm: 18,
    price: 16.04,
    conversionWindow: "May 1, 2026 - Jun 1, 2026",
    status: "claimed",
  },
  {
    epoch: 2,
    drachmas: 5120,
    convOhm: 14,
    price: 15.97,
    conversionWindow: "Apr 1, 2026 - May 1, 2026",
    status: "claimed",
  },
  {
    epoch: 1,
    drachmas: 3940,
    convOhm: 9,
    price: 16.2,
    conversionWindow: "Mar 1, 2026 - Apr 1, 2026",
    status: "claimed",
  },
];

const statusConfig: Record<RowStatus, { label: string; active: boolean }> = {
  earning: { label: "Earning", active: false },
  claimable: { label: "Claim convOHM", active: true },
  claimed: { label: "Claimed", active: false },
};

const ROWS_PER_PAGE = 20;

export const ClaimTable = () => {
  const { theme, colors, styles } = useRewardsTableStyles();
  const { isConnected } = useAccount();
  const [page, setPage] = useState(0);

  const { secondaryText } = colors;
  const { headerSx, cellSx, valueSx, containerSx, tableSx, rowHoverSx, actionButtonSx, emptyStateCellSx } = styles;

  // TODO: replace mockData with real API data
  const data = isConnected ? (MOCK_DATA ? mockData : []) : [];
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
                          <Typography sx={valueSx}>{row.convOhm}</Typography>
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
                        <Button variant="contained" color="primary" disabled={!active} sx={actionButtonSx(active)}>
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
