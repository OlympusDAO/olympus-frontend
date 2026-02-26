import { Box, Link, SvgIcon, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { useState } from "react";
import ArrowDownLineIcon from "src/assets/icons/arrow-down-line.svg?react";
import ArrowUpLineIcon from "src/assets/icons/arrow-up-line.svg?react";
import DrachmaIcon from "src/assets/icons/drachma.svg?react";
import ExternalLinkLineIcon from "src/assets/icons/external-link-line.svg?react";
import Medal1Icon from "src/assets/icons/medal-1.svg?react";
import Medal2Icon from "src/assets/icons/medal-2.svg?react";
import Medal3Icon from "src/assets/icons/medal-3.svg?react";
import { LibChainId, useGETSeasonsLeaderboard } from "src/generated/olympusUnits";
import { formatNumber, shorten } from "src/helpers";
import { RewardsTablePagination } from "src/views/Rewards/components/RewardsTablePagination";
import { MOCK_DATA } from "src/views/Rewards/constants";
import { useRewardsTableStyles } from "src/views/Rewards/hooks/useRewardsTableStyles";
import { useAccount, useNetwork } from "wagmi";

const RankCell = ({ rank, theme }: { rank: number; theme: Theme }) => {
  const medals = [
    <SvgIcon key="medal-1" sx={{ fontSize: "24px", overflow: "visible" }} component={Medal1Icon} />,
    <SvgIcon key="medal-2" sx={{ fontSize: "24px", overflow: "visible" }} component={Medal2Icon} />,
    <SvgIcon key="medal-3" sx={{ fontSize: "24px", overflow: "visible" }} component={Medal3Icon} />,
  ];

  if (rank <= 3) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "24px",
          height: "24px",
          fontSize: "16px",
        }}
      >
        {medals[rank - 1]}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "24px",
        height: "24px",
      }}
    >
      <Typography fontSize="12px" fontWeight={600} sx={{ color: theme.colors.gray[10] }}>
        {formatNumber(rank, 0)}
      </Typography>
    </Box>
  );
};

const AddressCell = ({ address, theme, userAddress }: { address: string; theme: Theme; userAddress?: string }) => {
  return (
    <Box display="flex" alignItems="center" gap="16px">
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
        <Typography fontSize="12px" fontWeight={600}>
          {shorten(address)}
        </Typography>
        <SvgIcon sx={{ fontSize: "14px" }} component={ExternalLinkLineIcon} inheritViewBox />
      </Link>
      {userAddress?.toLowerCase() === address.toLowerCase() && (
        <Box
          sx={{
            height: "17px",
            padding: "0 8px",
            bgcolor: theme.colors.gray[10],
            borderRadius: "999px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            fontSize="10px"
            fontWeight={600}
            sx={{ color: theme.colors.paper.card, textTransform: "uppercase" }}
          >
            You
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const mockEntries = [
  { rank: 1, address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", totalUnits: "125430", positionChange: 0 },
  { rank: 2, address: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B", totalUnits: "98210", positionChange: 2 },
  { rank: 3, address: "0x1Db3439a222C519ab44bb1144fC28167b4Fa6EE6", totalUnits: "87654", positionChange: -1 },
  { rank: 4, address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", totalUnits: "72100", positionChange: 1 },
  { rank: 5, address: "0xDA9dfA130Df4dE4673b89022EE50ff26f6EA73Cf", totalUnits: "65430", positionChange: -2 },
  { rank: 6, address: "0x0716a17FBAeE714f1E6aB0f9d59edbC5f09815C0", totalUnits: "54320", positionChange: 0 },
  { rank: 7, address: "0x7Be8076f4EA4A4AD08075C2508e481d6C946D12b", totalUnits: "43210", positionChange: 3 },
  { rank: 8, address: "0xF977814e90dA44bFA03b6295A0616a897441aceC", totalUnits: "38900", positionChange: -1 },
];

const ROWS_PER_PAGE = 25;

export const RewardsLeaderboardTable = () => {
  const { theme, isDark, colors, styles } = useRewardsTableStyles();
  const { address: userAddress } = useAccount();
  const { chain } = useNetwork();
  const [page, setPage] = useState(0);

  const { secondaryText } = colors;
  const { headerSx, cellSx, valueSx } = styles;

  const chainId = (chain?.id || LibChainId.NUMBER_11155111) as LibChainId;

  const {
    data: leaderboardData,
    isLoading,
    error,
  } = useGETSeasonsLeaderboard({
    userAddress,
    chainId,
    limit: ROWS_PER_PAGE,
    offset: page * ROWS_PER_PAGE,
    daysAgo: 1,
  });

  const hasApiData = !!leaderboardData?.entries?.length;
  const entries = hasApiData ? leaderboardData.entries : MOCK_DATA ? mockEntries : [];
  const totalEntries = hasApiData ? leaderboardData.total || 0 : MOCK_DATA ? mockEntries.length : 0;

  return (
    <Box display="flex" flexDirection="column" gap="24px">
      <Box
        sx={{
          width: "100%",
          background: isDark ? "#20222A" : "#EFEAE0",
          borderRadius: "12px",
          overflowX: "auto",
        }}
      >
        <Table
          sx={{
            width: "100%",
            minWidth: "600px",
            borderCollapse: "collapse",
            margin: 0,
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...headerSx, pl: "24px" }}>Rank</TableCell>
              <TableCell sx={{ ...headerSx }}>Address</TableCell>
              <TableCell sx={{ ...headerSx }}>Drachmas</TableCell>
              <TableCell sx={{ ...headerSx, textAlign: "right", pr: "24px" }}>1D Change</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && !entries.length ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  sx={{
                    textAlign: "center",
                    height: "96px",
                    color: secondaryText,
                    borderBottom: "none",
                    padding: "12px",
                  }}
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : error && !entries.length ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  sx={{
                    textAlign: "center",
                    height: "96px",
                    color: isDark ? "#f87171" : "#dc2626",
                    borderBottom: "none",
                    padding: "12px",
                  }}
                >
                  Error loading leaderboard
                </TableCell>
              </TableRow>
            ) : entries.length > 0 ? (
              entries.map(row => {
                const isPositionUp = row.positionChange > 0;
                const positionChangeAbs = Math.abs(row.positionChange);
                const isCurrentUser = userAddress?.toLowerCase() === row.address.toLowerCase();

                return (
                  <TableRow
                    key={`${row.address}-${row.rank}`}
                    sx={{
                      bgcolor: isCurrentUser
                        ? isDark
                          ? "rgba(248, 204, 130, 0.20)"
                          : "rgba(248, 204, 130, 0.40)"
                        : "transparent",
                      transition: "background-color 0.2s",
                      "&:hover": {
                        bgcolor: isCurrentUser
                          ? isDark
                            ? "rgba(248, 204, 130, 0.30)"
                            : "rgba(248, 204, 130, 0.50)"
                          : isDark
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(20, 23, 34, 0.05)",
                      },
                      "&:last-child td": { borderBottom: "none" },
                    }}
                  >
                    <TableCell sx={{ ...cellSx, pl: "24px" }}>
                      <RankCell rank={row.rank} theme={theme} />
                    </TableCell>
                    <TableCell sx={cellSx}>
                      <AddressCell address={row.address} theme={theme} userAddress={userAddress} />
                    </TableCell>
                    <TableCell sx={cellSx}>
                      <Box display="flex" alignItems="center" gap="4px">
                        <SvgIcon sx={{ fontSize: "14px" }} component={DrachmaIcon} />
                        <Typography sx={valueSx}>{formatNumber(parseFloat(row.totalUnits), 0)}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ ...cellSx, pr: "24px" }}>
                      <Box display="flex" justifyContent="flex-end" alignItems="center" gap="4px">
                        {row.positionChange !== 0 && (
                          <SvgIcon
                            sx={{ fontSize: "14px" }}
                            component={isPositionUp ? ArrowUpLineIcon : ArrowDownLineIcon}
                            inheritViewBox
                          />
                        )}
                        <Typography
                          sx={{
                            ...valueSx,
                            color: row.positionChange === 0 ? secondaryText : isPositionUp ? "#45BB78" : "#F55B5B",
                          }}
                        >
                          {row.positionChange === 0 ? "-" : positionChangeAbs}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  sx={{
                    borderBottom: "none",
                    padding: "56px 12px",
                  }}
                >
                  <Box display="flex" flexDirection="column" alignItems="center" gap="4px" textAlign="center">
                    <Typography
                      sx={{ fontSize: "15px", fontWeight: 600, lineHeight: "20px", color: theme.colors.gray[10] }}
                    >
                      No Activity Yet
                    </Typography>
                    <Typography sx={{ fontSize: "12px", fontWeight: 500, lineHeight: "16px", color: secondaryText }}>
                      Once the first epoch is complete, the leaderboard will appear here.
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
        totalRows={totalEntries}
        rowsPerPage={ROWS_PER_PAGE}
        onPageChange={setPage}
        secondaryText={colors.secondaryText}
        paginationBtnBg={colors.paginationBtnBg}
        arrowColor={colors.arrowColor}
      />
    </Box>
  );
};
