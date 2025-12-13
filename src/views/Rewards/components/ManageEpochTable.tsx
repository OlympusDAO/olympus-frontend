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
import usdsIcon from "src/assets/icons/usds.svg?react";
import { EpochsEpochRewardUser } from "src/generated/olympusUnits";
import { abbreviatedNumber, formatNumber, shorten } from "src/helpers";

interface ManageEpochTableProps {
  users: EpochsEpochRewardUser[];
  totalUserCount: number;
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
        <Typography fontSize="15px" fontWeight={500}>
          {shorten(address)}
        </Typography>
        <Icon name="arrow-up" sx={{ fontSize: "14px", color: theme.colors.gray[10] }} />
      </Link>
    </Box>
  );
};

export const ManageEpochTable = ({ users, totalUserCount }: ManageEpochTableProps) => {
  const theme = useTheme();

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

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
        borderRadius: "24px",
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 4px 16px rgba(255,255,255,0.05), 0 0 0 0.5px rgba(255,255,255,0.1), inset 1px 1px 2px rgba(20, 23, 34, 0.1)"
            : "0 4px 16px rgba(20,23,34,0.05), 0 0 0 0.5px rgba(20,23,34,0.1), inset 1px 1px 2px #FFFFFF",
      }}
    >
      <Box
        sx={{
          overflowX: "auto",
          borderRadius: "24px 24px 0 0",
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
                User
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
                  textAlign: "left",
                  whiteSpace: "nowrap",
                  borderBottom:
                    theme.palette.mode === "dark"
                      ? "1px solid rgba(255, 255, 255, 0.05)"
                      : "1px solid rgba(20, 23, 34, 0.05)",
                }}
              >
                Yield
              </TableCell>
              <TableCell
                sx={{
                  color: theme.colors.gray[40],
                  fontSize: "12px",
                  fontWeight: 400,
                  height: "40px",
                  padding: "12px",
                  textAlign: "right",
                  whiteSpace: "nowrap",
                  borderBottom:
                    theme.palette.mode === "dark"
                      ? "1px solid rgba(255, 255, 255, 0.05)"
                      : "1px solid rgba(20, 23, 34, 0.05)",
                }}
              >
                Share %
              </TableCell>
              <TableCell
                sx={{
                  color: theme.colors.gray[40],
                  fontSize: "12px",
                  fontWeight: 400,
                  height: "40px",
                  padding: "12px",
                  paddingRight: "24px",
                  textAlign: "left",
                  whiteSpace: "nowrap",
                  borderBottom:
                    theme.palette.mode === "dark"
                      ? "1px solid rgba(255, 255, 255, 0.05)"
                      : "1px solid rgba(20, 23, 34, 0.05)",
                }}
              >
                Merkle Leaf
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                const paginatedEntries = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

                return (
                  <TableRow
                    key={row.userAddress + row.rewardAssetId}
                    sx={{
                      bgcolor: theme.palette.mode === "dark" ? "#20222A" : "#EFEAE0",
                      transition: "background-color 0.2s",
                      height: "64px",
                      "&:hover": {
                        bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(20, 23, 34, 0.1)",
                      },
                      borderBottom:
                        index === paginatedEntries.length - 1
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
                      <AddressCell address={row.userAddress} theme={theme} />
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
                          {formatNumber(parseFloat(row.units), 0)}
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
                        <SvgIcon sx={{ fontSize: "14px" }} component={usdsIcon} />
                        <Typography fontSize="15px" fontWeight={500} sx={{ color: theme.colors.gray[10] }}>
                          {abbreviatedNumber.format(parseFloat(row.rewardAmount))}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "12px",
                        whiteSpace: "nowrap",
                        borderBottom: "none",
                        textAlign: "right",
                      }}
                    >
                      <Typography fontSize="15px" fontWeight={500} sx={{ color: theme.colors.gray[10] }}>
                        {new Intl.NumberFormat("en-US", {
                          style: "percent",
                          maximumFractionDigits: 1,
                        }).format(parseFloat(row.rewardShare))}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "12px",
                        paddingRight: "24px",
                        whiteSpace: "nowrap",
                        borderBottom: "none",
                      }}
                    >
                      <Typography
                        fontSize="15px"
                        fontWeight={500}
                        sx={{
                          color: theme.colors.gray[10],
                          fontFamily: "monospace",
                        }}
                      >
                        {typeof row.merkleLeaf === "string" ? shorten(row.merkleLeaf) : "N/A"}
                      </Typography>
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
                  colSpan={5}
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
      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={totalUserCount}
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
