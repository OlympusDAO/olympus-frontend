import { Box, Button, SvgIcon, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useState } from "react";
import ConvOhmSmIcon from "src/assets/tokens/convOHMsm.svg?react";
import { RewardsTablePagination } from "src/views/Rewards/components/RewardsTablePagination";
import { MOCK_DATA } from "src/views/Rewards/constants";
import { useRewardsTableStyles } from "src/views/Rewards/hooks/useRewardsTableStyles";
import { useAccount } from "wagmi";

type RowStatus = "convertible" | "converted";

interface ConvertRow {
  id: number;
  availableToConvert: number;
  convertiblePrice: number;
  discount: number | null;
  conversionWindow: string;
  netValue: number | null;
  status: RowStatus;
}

const mockData: ConvertRow[] = [
  {
    id: 1,
    availableToConvert: 56,
    convertiblePrice: 19.5,
    discount: null,
    conversionWindow: "Jun 1, 2026 - Jul 1, 2026",
    netValue: -840,
    status: "convertible",
  },
  {
    id: 2,
    availableToConvert: 35,
    convertiblePrice: 18.99,
    discount: null,
    conversionWindow: "May 1, 2026 - Jun 1, 2026",
    netValue: -600,
    status: "convertible",
  },
  {
    id: 3,
    availableToConvert: 42,
    convertiblePrice: 17.2,
    discount: 8,
    conversionWindow: "May 1, 2026 - Jun 1, 2026",
    netValue: 320,
    status: "convertible",
  },
  {
    id: 4,
    availableToConvert: 12,
    convertiblePrice: 16.99,
    discount: 13,
    conversionWindow: "Apr 1, 2026 - May 1, 2026",
    netValue: 600,
    status: "converted",
  },
  {
    id: 5,
    availableToConvert: 9,
    convertiblePrice: 16.5,
    discount: 10,
    conversionWindow: "Mar 1, 2026 - Apr 1, 2026",
    netValue: 450,
    status: "converted",
  },
];

const statusConfig: Record<RowStatus, { label: string; active: boolean }> = {
  convertible: { label: "Convert to OHM", active: true },
  converted: { label: "Converted", active: false },
};

const ROWS_PER_PAGE = 20;

export const ConvertTable = () => {
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
                        <Typography sx={valueSx}>{row.availableToConvert}</Typography>
                      </Box>
                    </TableCell>

                    {/* Convertible Price */}
                    <TableCell sx={cellSx}>
                      <Box display="flex" alignItems="center" gap="4px">
                        <Typography sx={{ ...valueSx, color: "#45BB78" }}>{row.convertiblePrice.toFixed(2)}</Typography>
                        <Typography sx={valueSx}>USDS/OHM</Typography>
                      </Box>
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
