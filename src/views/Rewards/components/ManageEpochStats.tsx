import { formatUnits } from "@ethersproject/units";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, Button, Paper, SvgIcon, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DrachmaIcon from "src/assets/icons/drachma.svg?react";
import usdsIcon from "src/assets/icons/usds.svg?react";
import ConvOhmSmIcon from "src/assets/tokens/convOHMsm.svg?react";
import { LibChainId, SharedEpochRewardsStatus } from "src/generated/olympusUnits";
import { formatNumber } from "src/helpers";

// Format token amount from wei to human-readable format
const formatTokenAmount = (amount: string, decimals: number): string => {
  const formatted = parseFloat(formatUnits(amount, decimals));
  if (formatted === 0) return "0";
  if (formatted < 0.0001) return "< 0.0001";
  if (formatted < 1) return formatted.toFixed(4);
  if (formatted < 1000) return formatted.toFixed(2);
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(formatted);
};

interface ManageEpochStatsProps {
  epochNumber: number;
  startTimestamp: number;
  endTimestamp: number;
  totalUnits: string;
  totalYield: string;
  totalConvOhm: string;
  strikePrice: string;
  eligibleDate: string;
  expiryDate: string;
  rewardStatuses: string[];
  chainId: LibChainId;
  onSubmitProposal: () => void;
  isSubmitting: boolean;
  submissionLabel?: string;
  submissionSuccess?: boolean;
  safeUrl?: string | null;
  userCount: number;
  rewardAssetDecimals: number;
  rewardAssetSymbol: string;
}

export const ManageEpochStats = ({
  epochNumber,
  startTimestamp,
  endTimestamp,
  totalUnits,
  totalYield,
  totalConvOhm,
  strikePrice,
  eligibleDate,
  expiryDate,
  rewardStatuses,
  onSubmitProposal,
  isSubmitting,
  submissionLabel,
  submissionSuccess,
  safeUrl,
  userCount,
  rewardAssetDecimals,
  rewardAssetSymbol,
}: ManageEpochStatsProps) => {
  const theme = useTheme();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      }),
      time:
        date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "UTC",
        }) + " UTC",
    };
  };

  // Derive the primary status from rewardStatuses array
  // Priority: distributed > calculated > pending
  const getPrimaryStatus = (statuses: string[]): string => {
    if (statuses.includes("executed")) return "executed";
    if (statuses.includes(SharedEpochRewardsStatus.distributed)) return SharedEpochRewardsStatus.distributed;
    if (statuses.includes("pending_signatures")) return "pending_signatures";
    if (statuses.includes("not_submitted")) return "not_submitted";
    if (statuses.includes(SharedEpochRewardsStatus.calculated)) return SharedEpochRewardsStatus.calculated;
    return SharedEpochRewardsStatus.pending;
  };

  const getStatusLabel = (statuses: string[]) => {
    const primaryStatus = getPrimaryStatus(statuses);
    switch (primaryStatus) {
      case SharedEpochRewardsStatus.pending:
        return "Pending";
      case SharedEpochRewardsStatus.calculated:
        return "Calculated";
      case SharedEpochRewardsStatus.distributed:
        return "Distributed";
      case "not_submitted":
        return "Not Submitted";
      case "pending_signatures":
        return "Pending Signatures";
      case "executed":
        return "Executed";
      default:
        return primaryStatus;
    }
  };

  const getStatusColor = (statuses: string[]): string => {
    const primaryStatus = getPrimaryStatus(statuses);
    switch (primaryStatus) {
      case "not_submitted":
        return "#EB5757";
      case "pending_signatures":
      case SharedEpochRewardsStatus.calculated:
        return "#F8CC82";
      case "executed":
      case SharedEpochRewardsStatus.distributed:
        return "#6FCF97";
      default:
        return theme.colors.gray[40];
    }
  };

  const statusColor = getStatusColor(rewardStatuses);
  const startDate = formatDate(startTimestamp);
  const endDate = formatDate(endTimestamp);

  return (
    <Paper
      sx={{
        background: theme.palette.mode === "dark" ? "#20222A" : "#EFEAE0",
        padding: "24px",
        borderRadius: "24px",
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" mb="12px">
        <Typography fontSize="18px" fontWeight={600}>
          Epoch {epochNumber}
        </Typography>
        <Box
          border="1px solid"
          minWidth="92px"
          height="24px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="4px"
          px="8px"
          borderColor={statusColor}
        >
          <Typography fontSize="12px" fontWeight={400} sx={{ color: statusColor }}>
            {getStatusLabel(rewardStatuses)}
          </Typography>
        </Box>
      </Box>
      <Typography fontSize="15px" fontWeight={400} mb="16px">
        Submit the proposal to the multisig to distribute rewards to the user.
      </Typography>
      <Box>
        <Box
          sx={{
            bgcolor: theme.palette.mode === "dark" ? "#2C2E37" : "#FFF",
            borderRadius: "12px",
            padding: "16px",
          }}
        >
          <Typography fontSize="15px" mb="8px" fontWeight={400} sx={{ color: theme.colors.gray[40] }}>
            Epoch Period
          </Typography>
          <Box display="flex" alignItems="center" gap="4px">
            <Box
              sx={{
                flex: 1,
                border:
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(20, 23, 34, 0.1)",
                px: "10px",
                py: "8px",
                bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(20, 23, 34, 0.03)",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <Typography fontSize="13px" fontWeight={600} lineHeight="18px">
                {startDate.date}
              </Typography>
              <Typography fontSize="12px" fontWeight={400} lineHeight="16px" sx={{ color: theme.colors.gray[40] }}>
                {startDate.time}
              </Typography>
            </Box>
            -
            <Box
              sx={{
                flex: 1,
                border:
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(20, 23, 34, 0.1)",
                px: "10px",
                py: "8px",
                bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(20, 23, 34, 0.03)",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <Typography fontSize="13px" fontWeight={600} lineHeight="18px">
                {endDate.date}
              </Typography>
              <Typography fontSize="12px" fontWeight={400} lineHeight="16px" sx={{ color: theme.colors.gray[40] }}>
                {endDate.time}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            bgcolor: theme.palette.mode === "dark" ? "#2C2E37" : "#FFF",
            borderRadius: "12px",
            padding: "16px",
            my: "12px",
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography fontSize="15px" fontWeight={400} sx={{ color: theme.colors.gray[40] }}>
              Epoch Drachmas
            </Typography>
            <Box display="flex" alignItems="center" gap="4px">
              <SvgIcon sx={{ fontSize: "20px" }} component={DrachmaIcon} />
              <Typography fontSize="15px" fontWeight={500} sx={{ color: theme.colors.gray[10] }}>
                {formatNumber(parseFloat(totalUnits), 0)}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            bgcolor: theme.palette.mode === "dark" ? "#2C2E37" : "#FFF",
            borderRadius: "12px",
            padding: "16px",
            mb: "12px",
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography fontSize="15px" fontWeight={400} sx={{ color: theme.colors.gray[40] }}>
              Epoch Yield
            </Typography>
            <Box display="flex" alignItems="center" gap="4px">
              <SvgIcon sx={{ fontSize: "20px" }} component={usdsIcon} />
              <Typography fontSize="15px" fontWeight={500} sx={{ color: theme.colors.gray[10] }}>
                {formatTokenAmount(totalYield, rewardAssetDecimals)} {rewardAssetSymbol}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            bgcolor: theme.palette.mode === "dark" ? "#2C2E37" : "#FFF",
            borderRadius: "12px",
            padding: "16px",
            mb: "12px",
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between" mb="12px">
            <Typography fontSize="15px" fontWeight={400} sx={{ color: theme.colors.gray[40] }}>
              Epoch convOHM
            </Typography>
            <Box display="flex" alignItems="center" gap="4px">
              <SvgIcon sx={{ fontSize: "20px" }} component={ConvOhmSmIcon} inheritViewBox />
              <Typography fontSize="15px" fontWeight={500} sx={{ color: theme.colors.gray[10] }}>
                {formatTokenAmount(totalConvOhm, rewardAssetDecimals)}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap="8px">
            <Box
              sx={{
                border:
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(20, 23, 34, 0.1)",
                px: "10px",
                py: "8px",
                bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(20, 23, 34, 0.03)",
                borderRadius: "8px",
                textAlign: "center",
                flex: 1,
              }}
            >
              <Typography fontSize="12px" fontWeight={400} lineHeight="16px" sx={{ color: theme.colors.gray[40] }}>
                Strike Price
              </Typography>
              <Typography fontSize="13px" fontWeight={600} lineHeight="18px">
                {strikePrice}
              </Typography>
            </Box>
            <Box
              sx={{
                border:
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(20, 23, 34, 0.1)",
                px: "10px",
                py: "8px",
                bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(20, 23, 34, 0.03)",
                borderRadius: "8px",
                textAlign: "center",
                flex: 1,
              }}
            >
              <Typography fontSize="12px" fontWeight={400} lineHeight="16px" sx={{ color: theme.colors.gray[40] }}>
                Eligible
              </Typography>
              <Typography fontSize="13px" fontWeight={600} lineHeight="18px">
                {eligibleDate}
              </Typography>
            </Box>
            <Box
              sx={{
                border:
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(20, 23, 34, 0.1)",
                px: "10px",
                py: "8px",
                bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(20, 23, 34, 0.03)",
                borderRadius: "8px",
                textAlign: "center",
                flex: 1,
              }}
            >
              <Typography fontSize="12px" fontWeight={400} lineHeight="16px" sx={{ color: theme.colors.gray[40] }}>
                Expiry Date
              </Typography>
              <Typography fontSize="13px" fontWeight={600} lineHeight="18px">
                {expiryDate}
              </Typography>
            </Box>
          </Box>
        </Box>
        {submissionSuccess && safeUrl && (
          <Button
            variant="outlined"
            color="primary"
            component="a"
            href={safeUrl}
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<OpenInNewIcon />}
            sx={{
              width: "100%",
              marginTop: "auto",
              textTransform: "none",
              fontSize: "15px",
              fontWeight: 500,
              mb: "12px",
            }}
          >
            View Safe Tx
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={onSubmitProposal}
          disabled={
            (!submissionSuccess && !rewardStatuses.includes(SharedEpochRewardsStatus.calculated)) ||
            isSubmitting ||
            parseFloat(formatUnits(totalYield, rewardAssetDecimals)) === 0 ||
            userCount === 0
          }
          sx={{
            width: "100%",
            marginTop: "auto",
            textTransform: "none",
            fontSize: "15px",
            fontWeight: 500,
          }}
        >
          {submissionLabel || "Prepare Transaction"}
        </Button>
      </Box>
    </Paper>
  );
};
