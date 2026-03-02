import { formatUnits } from "@ethersproject/units";
import { Box, Link, SvgIcon, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { Icon } from "@olympusdao/component-library";
import { useState } from "react";
import DrachmaIcon from "src/assets/icons/drachma.svg?react";
import ConvOhmSmIcon from "src/assets/tokens/convOHMsm.svg?react";
import { EpochsEpochRewardUser } from "src/generated/olympusUnits";
import { formatNumber, shorten } from "src/helpers";
import { RewardsTablePagination } from "src/views/Rewards/components/RewardsTablePagination";
import { useRewardsTableStyles } from "src/views/Rewards/hooks/useRewardsTableStyles";

// Format token amount from wei to human-readable format
const formatTokenAmount = (amount: string, decimals: number): string => {
  const formatted = parseFloat(formatUnits(amount, decimals));
  if (formatted === 0) return "0";
  if (formatted < 0.0001) return "< 0.0001";
  if (formatted < 1) return formatted.toFixed(4);
  if (formatted < 1000) return formatted.toFixed(2);
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(formatted);
};

interface ManageEpochTableProps {
  users: EpochsEpochRewardUser[];
  totalUserCount: number;
  rewardAssetDecimals: number;
  rewardAssetSymbol: string;
}

const AddressCell = ({ address, theme }: { address: string; theme: Theme }) => {
  return (
    <Box display="flex" alignItems="center" gap="4px">
      <Link
        href={`https://etherscan.io/address/${address}`}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          textDecoration: "none",
          color: theme.colors.gray[10],
          "&:hover": {
            textDecoration: "underline",
          },
        }}
      >
        <Typography sx={{ fontSize: "12px", fontWeight: 600, lineHeight: "16px", letterSpacing: "0.12px" }}>
          {shorten(address)}
        </Typography>
        <Icon name="arrow-up" sx={{ fontSize: "14px", color: theme.colors.gray[10] }} />
      </Link>
    </Box>
  );
};

const ROWS_PER_PAGE = 20;

export const ManageEpochTable = ({ users, totalUserCount, rewardAssetDecimals }: ManageEpochTableProps) => {
  const { theme, colors, styles } = useRewardsTableStyles();
  const [page, setPage] = useState(0);

  const { headerSx, cellSx, valueSx, containerSx, tableSx, rowHoverSx, emptyStateCellSx } = styles;

  const pageData = users.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

  return (
    <Box display="flex" flexDirection="column" gap="24px">
      <Box sx={containerSx}>
        <Table sx={{ ...tableSx, minWidth: "600px" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...headerSx, pl: "24px" }}>User</TableCell>
              <TableCell sx={headerSx}>Drachmas</TableCell>
              <TableCell sx={headerSx}>convOHM</TableCell>
              <TableCell sx={{ ...headerSx, textAlign: "right" }}>Share</TableCell>
              <TableCell sx={{ ...headerSx, pr: "24px" }}>Merkle Leaf</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageData.length > 0 ? (
              pageData.map(row => (
                <TableRow key={row.userAddress + row.rewardAssetId} sx={rowHoverSx}>
                  <TableCell sx={{ ...cellSx, pl: "24px" }}>
                    <AddressCell address={row.userAddress} theme={theme} />
                  </TableCell>
                  <TableCell sx={cellSx}>
                    <Box display="flex" alignItems="center" gap="4px">
                      <SvgIcon sx={{ fontSize: "14px" }} component={DrachmaIcon} />
                      <Typography sx={valueSx}>{formatNumber(parseFloat(row.units), 0)}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={cellSx}>
                    <Box display="flex" alignItems="center" gap="4px">
                      <SvgIcon sx={{ fontSize: "14px" }} component={ConvOhmSmIcon} inheritViewBox />
                      <Typography sx={valueSx}>{formatTokenAmount(row.rewardAmount, rewardAssetDecimals)}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ ...cellSx, textAlign: "right" }}>
                    <Typography sx={valueSx}>
                      {new Intl.NumberFormat("en-US", {
                        style: "percent",
                        maximumFractionDigits: 1,
                      }).format(parseFloat(row.rewardShare))}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ ...cellSx, pr: "24px" }}>
                    <Typography sx={{ ...valueSx, fontFamily: "monospace" }}>
                      {typeof row.merkleLeaf === "string" ? row.merkleLeaf : "N/A"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} sx={emptyStateCellSx}>
                  <Box display="flex" flexDirection="column" alignItems="center" gap="4px" textAlign="center">
                    <Typography
                      sx={{ fontSize: "15px", fontWeight: 600, lineHeight: "20px", color: theme.colors.gray[10] }}
                    >
                      No results.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      <RewardsTablePagination
        page={page}
        totalRows={totalUserCount}
        rowsPerPage={ROWS_PER_PAGE}
        onPageChange={setPage}
        secondaryText={colors.secondaryText}
        paginationBtnBg={colors.paginationBtnBg}
        arrowColor={colors.arrowColor}
      />
    </Box>
  );
};
