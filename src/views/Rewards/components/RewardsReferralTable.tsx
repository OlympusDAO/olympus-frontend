import { Box, Link, SvgIcon, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Icon } from "@olympusdao/component-library";
import DrachmaIcon from "src/assets/icons/drachma.svg?react";
import { formatNumber, shorten } from "src/helpers";
import { Address, useAccount } from "wagmi";

export type RewardsHistory = {
  id: string;
  referredAddress: Address;
  earned: number;
  bonus: number;
  lastEarned: number;
  allEarned: number;
};

const MOCK_DATA = [
  {
    id: "1",
    referredAddress: "0x1234567890123456789012345678901234567890",
    earned: 1000,
    bonus: 0.1,
    lastEarned: 1647296000,
    allEarned: 1647296000,
  },
  {
    id: "2",
    referredAddress: "0x1234567890123456789012345678901234567890",
    earned: 1000,
    bonus: 0.1,
    lastEarned: 1647296000,
    allEarned: 1647296000,
  },
  {
    id: "3",
    referredAddress: "0x1234567890123456789012345678901234567890",
    earned: 1000,
    bonus: 0.2,
    lastEarned: 1647296000,
    allEarned: 1647296000,
  },
];

const isLoading = false;

export const RewardsReferralTable = () => {
  const theme = useTheme();
  const { address } = useAccount();

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
              Referred Address
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
              Earned by Referral
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
              Referral Bonus
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
              Last Epoch Earned
            </TableCell>
            <TableCell
              sx={{
                color: theme.colors.gray[40],
                fontSize: "12px",
                fontWeight: 400,
                height: "40px",
                padding: "12px",
                whiteSpace: "nowrap",
                textAlign: "right",
                borderBottom:
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.05)"
                    : "1px solid rgba(20, 23, 34, 0.05)",
              }}
            >
              All Time Earned
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
                Connect your wallet to view referral stats.
              </TableCell>
            </TableRow>
          ) : MOCK_DATA.length > 0 ? (
            MOCK_DATA.map((row, index) => (
              <TableRow
                key={row.id}
                sx={{
                  bgcolor: theme.palette.mode === "dark" ? "#20222A" : "#EFEAE0",
                  transition: "background-color 0.2s",
                  "&:hover": {
                    bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(20, 23, 34, 0.1)",
                  },
                  borderBottom:
                    index === MOCK_DATA.length - 1
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
                  <Link
                    href={`https://etherscan.io/address/${row.referredAddress}`}
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
                      {shorten(row.referredAddress)}
                    </Typography>
                    <Icon name="arrow-up" sx={{ fontSize: "14px", color: theme.colors.gray[10] }} />
                  </Link>
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
                      {formatNumber(row.earned, 0)}
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
                    <Typography fontSize="15px" fontWeight={500} sx={{ color: theme.colors.gray[10] }}>
                      {row.bonus * 100} %
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
                  <Box display="flex" alignItems="center" gap="4px">
                    <SvgIcon sx={{ fontSize: "14px" }} component={DrachmaIcon} />
                    <Typography fontSize="15px" fontWeight={500} sx={{ color: theme.colors.gray[10] }}>
                      {formatNumber(row.lastEarned, 0)}
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
                    <Box display="flex" alignItems="center" gap="4px">
                      <SvgIcon sx={{ fontSize: "14px" }} component={DrachmaIcon} />
                      <Typography fontSize="15px" fontWeight={500} sx={{ color: theme.colors.gray[10] }}>
                        {formatNumber(row.allEarned, 0)}
                      </Typography>
                    </Box>
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
