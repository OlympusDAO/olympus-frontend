import { Box, Paper, SvgIcon, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { InfoTooltip } from "@olympusdao/component-library";
import { differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import DrachmaIcon from "src/assets/icons/drachma.svg?react";
import { LibChainId, useGETEpochsCurrentEpoch } from "src/generated/olympusUnits";
import { formatNumber } from "src/helpers";
import { useNetwork } from "wagmi";

const useCountdown = (targetDate: Date) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();

      const days = Math.max(0, differenceInDays(targetDate, now));
      const hours = Math.max(0, differenceInHours(targetDate, now) % 24);
      const minutes = Math.max(0, differenceInMinutes(targetDate, now) % 60);

      return { days, hours, minutes };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // update every minute

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

export const RewardsStats = () => {
  const theme = useTheme();
  const { chain } = useNetwork();
  const chainId = (chain?.id || LibChainId.NUMBER_11155111) as LibChainId;
  const isDark = theme.palette.mode === "dark";

  // Fetch current epoch data
  const { data: epochData } = useGETEpochsCurrentEpoch({
    chainId,
  });

  const targetDate = useMemo(() => {
    if (epochData?.endTimestamp) {
      return new Date(epochData.endTimestamp * 1000);
    }
    return new Date();
  }, [epochData?.endTimestamp]);

  const timeLeft = useCountdown(targetDate);

  const totalDrachmas = useMemo(() => {
    if (!epochData?.totalUnits) return 0;
    return parseFloat(epochData.totalUnits);
  }, [epochData?.totalUnits]);

  const badgeSx = {
    border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(20, 23, 34, 0.1)",
    px: "6px",
    py: "2px",
    bgcolor: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(20, 23, 34, 0.03)",
    borderRadius: "8px",
    width: "fit-content",
  };

  const statBoxSx = {
    bgcolor: isDark ? "#2C2E37" : "#FFF",
    borderRadius: "8px",
    padding: "16px",
  };

  return (
    <Paper
      sx={{
        background: isDark ? "#20222A" : "#EFEAE0",
        padding: "24px",
        borderRadius: "12px",
        flex: 1,
        boxShadow: "none",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%", gap: "16px" }}>
        {/* Header: Epoch + Countdown */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography fontSize="20px" lineHeight="24px" fontWeight={600} sx={{ color: theme.colors.gray[10] }}>
            Epoch {epochData?.epochNumber || 0}
          </Typography>
          <Box display="flex" alignItems="center" gap="8px">
            <Typography
              fontSize="16px"
              lineHeight="20px"
              fontWeight={400}
              sx={{ color: isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(20, 23, 34, 0.6)" }}
            >
              Next in
            </Typography>
            <Box display="flex" alignItems="center" gap="4px">
              <Box sx={badgeSx}>
                <Typography fontWeight={600} fontSize="16px" lineHeight="20px" sx={{ color: theme.colors.gray[40] }}>
                  {timeLeft.days}d
                </Typography>
              </Box>
              <Box sx={badgeSx}>
                <Typography fontWeight={600} fontSize="16px" lineHeight="20px" sx={{ color: theme.colors.gray[40] }}>
                  {timeLeft.hours}h
                </Typography>
              </Box>
              <Box sx={badgeSx}>
                <Typography fontWeight={600} fontSize="16px" lineHeight="20px" sx={{ color: theme.colors.gray[40] }}>
                  {timeLeft.minutes}m
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Description */}
        <Box display="flex" flexDirection="column" gap="8px">
          <Typography fontSize="18px" lineHeight="24px" fontWeight={600} sx={{ color: theme.colors.gray[10] }}>
            Earn Drachmas by engaging with Olympus products and governance.
          </Typography>
          <Typography
            fontSize="16px"
            lineHeight="24px"
            fontWeight={400}
            sx={{ color: isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(20, 23, 34, 0.6)" }}
          >
            Accumulated Drachmas can then be used to claim your proportional share of the Convertible OHM rewards pool,
            aligning long-term participation with meaningful on-chain incentives.
          </Typography>
        </Box>

        {/* Stat boxes */}
        <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr 1fr" }} gap="12px" mt="auto">
          <Box sx={statBoxSx}>
            <Box display="flex" alignItems="center" gap="4px">
              <Typography
                fontSize="16px"
                lineHeight="20px"
                fontWeight={400}
                sx={{ color: isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(20, 23, 34, 0.6)" }}
              >
                Drachmas
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap="6px" mt="12px">
              <SvgIcon sx={{ fontSize: "20px" }} component={DrachmaIcon} />
              <Typography fontSize="18px" fontWeight={600} sx={{ color: theme.colors.gray[10] }}>
                {formatNumber(totalDrachmas, 0)}
              </Typography>
            </Box>
            <Box mt="12px" sx={badgeSx}>
              <Typography fontWeight={600} fontSize="16px" lineHeight="20px" sx={{ color: theme.colors.gray[40] }}>
                by all participants
              </Typography>
            </Box>
          </Box>

          <Box sx={statBoxSx}>
            <Box display="flex" alignItems="center" gap="4px">
              <Typography
                fontSize="16px"
                lineHeight="20px"
                fontWeight={400}
                sx={{ color: isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(20, 23, 34, 0.6)" }}
              >
                Drachma Calculation
              </Typography>
              <InfoTooltip message="Drachmas are calculated on a daily basis. The final snapshot of the protocol positions is taken at 11:59 PM EST." />
            </Box>
            <Typography fontSize="18px" fontWeight={600} mt="12px" sx={{ color: theme.colors.gray[10] }}>
              Daily
            </Typography>
            <Box mt="12px" sx={badgeSx}>
              <Typography fontWeight={600} fontSize="16px" lineHeight="20px" sx={{ color: theme.colors.gray[40] }}>
                11:59 PM EST
              </Typography>
            </Box>
          </Box>

          <Box sx={statBoxSx}>
            <Box display="flex" alignItems="center" gap="4px">
              <Typography
                fontSize="16px"
                lineHeight="20px"
                fontWeight={400}
                sx={{ color: isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(20, 23, 34, 0.6)" }}
              >
                Reward Distribution
              </Typography>
              <InfoTooltip message="Rewards are distributed based on the Drachmas amount you have earned each epoch." />
            </Box>
            <Typography fontSize="18px" fontWeight={600} mt="12px" sx={{ color: theme.colors.gray[10] }}>
              Weekly
            </Typography>
            <Box mt="12px" sx={badgeSx}>
              <Typography fontWeight={600} fontSize="16px" lineHeight="20px" sx={{ color: theme.colors.gray[40] }}>
                Mon-Wed
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
