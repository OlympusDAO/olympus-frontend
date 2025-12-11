import {
  Box,
  Link,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Theme, useTheme } from "@mui/material/styles";
import { Icon } from "@olympusdao/component-library";
import { useState } from "react";
import DrachmaIcon from "src/assets/icons/drachma.svg?react";
import Medal1Icon from "src/assets/icons/medal-1.svg?react";
import Medal2Icon from "src/assets/icons/medal-2.svg?react";
import Medal3Icon from "src/assets/icons/medal-3.svg?react";
import { LibChainId, useGETUsersLeaderboard } from "src/generated/olympusUnits";
import { formatNumber, shorten } from "src/helpers";
import { useAccount, useNetwork } from "wagmi";

const RankCell = ({ rank, theme }: { rank: number; theme: Theme }) => {
  // Medal emojis for top 3
  const medals = [
    <SvgIcon sx={{ fontSize: "24px", overflow: "visible" }} component={Medal1Icon} />,
    <SvgIcon sx={{ fontSize: "24px", overflow: "visible" }} component={Medal2Icon} />,
    <SvgIcon sx={{ fontSize: "24px", overflow: "visible" }} component={Medal3Icon} />,
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

const AddressCell = ({ address, theme }: { address: string; theme: Theme }) => {
  const { address: userAddress } = useAccount();

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
        <Typography fontSize="15px" fontWeight={500}>
          {shorten(address)}
        </Typography>
        <Icon name="arrow-up" sx={{ fontSize: "14px", color: theme.colors.gray[10] }} />
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

export const RewardsLeaderboardTable = () => {
  const theme = useTheme();
  const { address: userAddress } = useAccount();
  const { chain } = useNetwork();

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const chainId = (chain?.id || LibChainId.NUMBER_11155111) as LibChainId;
  // Fetch leaderboard data from API
  const {
    data: leaderboardData,
    isLoading,
    error,
  } = useGETUsersLeaderboard({
    userAddress,
    chainId,
    limit: rowsPerPage,
    offset: page * rowsPerPage,
    daysAgo: 1, // Compare with 1 day ago
  });

  const entries = leaderboardData?.entries || [];
  const totalEntries = leaderboardData?.total || 0;

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };

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
              Rank
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
              Address
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
              Drachmas
            </TableCell>
            <TableCell
              sx={{
                color: theme.colors.gray[40],
                fontSize: "12px",
                fontWeight: 400,
                height: "40px",
                padding: "12px",
                paddingRight: "24px",
                textAlign: "right",
                whiteSpace: "nowrap",
                borderBottom:
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.05)"
                    : "1px solid rgba(20, 23, 34, 0.05)",
              }}
            >
              1D Change
            </TableCell>
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
          ) : error ? (
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
                  color: theme.palette.mode === "dark" ? "#f87171" : "#dc2626",
                  borderBottom: "none",
                  padding: "12px",
                }}
              >
                Error loading leaderboard
              </TableCell>
            </TableRow>
          ) : entries.length > 0 ? (
            entries.map((row, index) => {
              const isPositionUp = row.positionChange > 0;
              const positionChangeAbs = Math.abs(row.positionChange);
              const isCurrentUser = userAddress?.toLowerCase() === row.address.toLowerCase();

              return (
                <TableRow
                  key={`${row.address}-${row.rank}`}
                  sx={{
                    bgcolor: isCurrentUser
                      ? theme.palette.mode === "dark"
                        ? "rgba(248, 204, 130, 0.20)"
                        : "rgba(248, 204, 130, 0.40)"
                      : theme.palette.mode === "dark"
                        ? "#20222A"
                        : "#EFEAE0",
                    transition: "background-color 0.2s",
                    height: "64px",
                    "&:hover": {
                      bgcolor: isCurrentUser
                        ? theme.palette.mode === "dark"
                          ? "rgba(248, 204, 130, 0.30)"
                          : "rgba(248, 204, 130, 0.50)"
                        : theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(20, 23, 34, 0.1)",
                    },
                    borderBottom:
                      index === entries.length - 1
                        ? "none"
                        : theme.palette.mode === "dark"
                          ? "1px solid rgba(255, 255, 255, 0.05)"
                          : "1px solid rgba(20, 23, 34, 0.05)",
                  }}
                >
                  <TableCell
                    sx={{
                      padding: "12px",
                      paddingLeft: "24px",
                      whiteSpace: "nowrap",
                      borderBottom: "none",
                    }}
                  >
                    <RankCell rank={row.rank} theme={theme} />
                  </TableCell>
                  <TableCell
                    sx={{
                      padding: "12px",
                      whiteSpace: "nowrap",
                      borderBottom: "none",
                    }}
                  >
                    <AddressCell address={row.address} theme={theme} />
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
                        {formatNumber(parseFloat(row.totalUnits), 0)}
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
                    <Box display="flex" justifyContent="flex-end" alignItems="center" gap="4px">
                      {row.positionChange !== 0 && (
                        <Icon
                          name={isPositionUp ? "arrow-up" : "arrow-down"}
                          sx={{
                            fontSize: "14px",
                            color: isPositionUp
                              ? theme.palette.mode === "dark"
                                ? "#4ade80"
                                : "#16a34a"
                              : theme.palette.mode === "dark"
                                ? "#f87171"
                                : "#dc2626",
                          }}
                        />
                      )}
                      <Typography
                        fontSize="15px"
                        fontWeight={500}
                        sx={{
                          color:
                            row.positionChange === 0
                              ? theme.colors.gray[40]
                              : isPositionUp
                                ? theme.palette.mode === "dark"
                                  ? "#4ade80"
                                  : "#16a34a"
                                : theme.palette.mode === "dark"
                                  ? "#f87171"
                                  : "#dc2626",
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
            <TableRow
              sx={{
                bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(20, 23, 34, 0.1)",
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
      <TablePagination
        rowsPerPageOptions={[2, 3, 4, 100]}
        component="div"
        count={totalEntries}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop:
            theme.palette.mode === "dark" ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(20, 23, 34, 0.05)",
          "& .MuiTablePagination-toolbar": {
            color: theme.colors.gray[40],
          },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-input, & .MuiTablePagination-select, & .MuiTablePagination-selectIcon":
            {
              display: "none",
            },
          "& .MuiTablePagination-actions button": {
            color: theme.colors.gray[40],
            "&.Mui-disabled": {
              color: theme.colors.gray[40],
              opacity: 0.3,
            },
          },
        }}
      />
    </Box>
  );
};
