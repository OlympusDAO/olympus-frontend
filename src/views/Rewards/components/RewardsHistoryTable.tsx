import { Box, Button, SvgIcon, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DrachmaIcon from "src/assets/icons/drachma.svg?react";
import OhmIcon from "src/assets/tokens/token_OHM.svg?react";
import { formatNumber } from "src/helpers";

type RowStatus = "earning" | "claimable" | "claimed" | "convertible" | "converted";

interface MockRow {
  epoch: number;
  drachmas: number;
  convOhm: number;
  price: number;
  conversionWindow: string | null;
  netValue: string;
  status: RowStatus;
}

const mockData: MockRow[] = [
  {
    epoch: 5,
    drachmas: 8357,
    convOhm: 29,
    price: 17.53,
    conversionWindow: null,
    netValue: "$12.3M",
    status: "earning",
  },
  {
    epoch: 4,
    drachmas: 9573,
    convOhm: 42,
    price: 1.01,
    conversionWindow: null,
    netValue: "$12.3M",
    status: "claimable",
  },
  {
    epoch: 3,
    drachmas: 6482,
    convOhm: 18,
    price: 1.04,
    conversionWindow: "May 1, 2026 - Jun 1, 2026",
    netValue: "$12.3M",
    status: "claimed",
  },
  {
    epoch: 2,
    drachmas: 7593,
    convOhm: 35,
    price: 0.99,
    conversionWindow: "May 1, 2026 - Jun 1, 2026",
    netValue: "$12.3M",
    status: "convertible",
  },
  {
    epoch: 1,
    drachmas: 1357,
    convOhm: 12,
    price: 1.03,
    conversionWindow: "May 1, 2026 - Jun 1, 2026",
    netValue: "$12.3M",
    status: "converted",
  },
];

const statusConfig: Record<RowStatus, { label: string; active: boolean }> = {
  earning: { label: "Earning", active: false },
  claimable: { label: "Claim convOHM", active: true },
  claimed: { label: "Claimed", active: false },
  convertible: { label: "Convert to OHM", active: true },
  converted: { label: "Converted", active: false },
};

export const RewardsHistoryTable = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const headerCellSx = {
    color: theme.colors.gray[40],
    fontSize: "12px",
    fontWeight: 400,
    height: "40px",
    padding: "12px",
    textAlign: "left" as const,
    whiteSpace: "nowrap" as const,
    borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(20, 23, 34, 0.05)",
  };

  const bodyCellSx = {
    padding: "12px",
    whiteSpace: "nowrap" as const,
    borderBottom: "none",
  };

  return (
    <Box
      sx={{
        margin: "0",
        position: "relative",
        width: "100%",
        overflowX: "auto",
        borderRadius: "24px",
        boxShadow: isDark
          ? "0 4px 16px rgba(255,255,255,0.05), 0 0 0 0.5px rgba(255,255,255,0.1), inset 1px 1px 2px rgba(20, 23, 34, 0.1)"
          : "0 4px 16px rgba(20,23,34,0.05), 0 0 0 0.5px rgba(20,23,34,0.1), inset 1px 1px 2px #FFFFFF",
      }}
    >
      <Table
        sx={{
          width: "100%",
          minWidth: "900px",
          background: theme.colors.paper.card,
          borderCollapse: "separate",
          borderSpacing: 0,
          margin: "0",
        }}
      >
        <TableHead>
          <TableRow sx={{ bgcolor: isDark ? "#20222A" : "#EFEAE0" }}>
            <TableCell sx={{ ...headerCellSx, paddingLeft: "24px" }}>Epoch</TableCell>
            <TableCell sx={headerCellSx}>Drachmas Earned</TableCell>
            <TableCell sx={headerCellSx}>Convertible OHM</TableCell>
            <TableCell sx={headerCellSx}>Convertible Price</TableCell>
            <TableCell sx={headerCellSx}>Conversion Window</TableCell>
            <TableCell sx={headerCellSx}>Net Value</TableCell>
            <TableCell sx={{ ...headerCellSx, paddingRight: "24px" }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {mockData.map((row, index) => {
            const { label, active } = statusConfig[row.status];
            const priceColor = row.price >= 1 ? "#4CAF50" : "#F44336";

            return (
              <TableRow
                key={row.epoch}
                sx={{
                  bgcolor: isDark ? "#20222A" : "#EFEAE0",
                  transition: "background-color 0.2s",
                  "&:hover": {
                    bgcolor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(20, 23, 34, 0.05)",
                  },
                  borderBottom:
                    index === mockData.length - 1
                      ? "none"
                      : isDark
                        ? "1px solid rgba(255, 255, 255, 0.05)"
                        : "1px solid rgba(20, 23, 34, 0.05)",
                }}
              >
                {/* Epoch */}
                <TableCell sx={{ ...bodyCellSx, paddingLeft: "24px" }}>
                  <Typography fontSize="15px" fontWeight={600} sx={{ color: theme.colors.gray[10] }}>
                    {row.epoch}
                  </Typography>
                </TableCell>

                {/* Drachmas Earned */}
                <TableCell sx={bodyCellSx}>
                  <Box display="flex" alignItems="center" gap="6px">
                    <SvgIcon sx={{ fontSize: "18px" }} component={DrachmaIcon} />
                    <Typography fontSize="15px" fontWeight={600} sx={{ color: theme.colors.gray[10] }}>
                      {formatNumber(row.drachmas, 0)}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Convertible OHM */}
                <TableCell sx={bodyCellSx}>
                  <Box display="flex" alignItems="center" gap="6px">
                    <SvgIcon sx={{ fontSize: "18px" }} component={OhmIcon} viewBox="0 0 32 32" />
                    <Typography fontSize="15px" fontWeight={600} sx={{ color: theme.colors.gray[10] }}>
                      {row.convOhm}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Convertible Price */}
                <TableCell sx={bodyCellSx}>
                  <Box display="flex" alignItems="center" gap="4px">
                    <Typography fontSize="15px" fontWeight={600} sx={{ color: priceColor }}>
                      {row.price.toFixed(2)}
                    </Typography>
                    <Typography fontSize="15px" fontWeight={400} sx={{ color: theme.colors.gray[10] }}>
                      USDS/OHM
                    </Typography>
                  </Box>
                </TableCell>

                {/* Conversion Window */}
                <TableCell sx={bodyCellSx}>
                  <Typography fontSize="15px" fontWeight={400} sx={{ color: theme.colors.gray[10] }}>
                    {row.conversionWindow || "-"}
                  </Typography>
                </TableCell>

                {/* Net Value */}
                <TableCell sx={bodyCellSx}>
                  <Typography fontSize="15px" fontWeight={600} sx={{ color: theme.colors.gray[10] }}>
                    {row.netValue}
                  </Typography>
                </TableCell>

                {/* Action */}
                <TableCell sx={{ ...bodyCellSx, paddingRight: "24px" }}>
                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      variant={active ? "contained" : "outlined"}
                      size="small"
                      disabled={!active}
                      sx={{
                        textTransform: "none",
                        fontSize: "13px",
                        fontWeight: 500,
                        padding: "6px 16px",
                        borderRadius: "8px",
                        ...(active
                          ? {
                              bgcolor: "#C4A24E",
                              color: "#1A1C23",
                              "&:hover": { bgcolor: "#D4B25E" },
                            }
                          : {
                              borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(20,23,34,0.15)",
                              color: theme.colors.gray[40],
                              "&.Mui-disabled": {
                                borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(20,23,34,0.1)",
                                color: theme.colors.gray[40],
                              },
                            }),
                      }}
                    >
                      {label}
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
};
