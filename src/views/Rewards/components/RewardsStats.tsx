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

  return (
    <Paper
      sx={{
        background: theme.palette.mode === "dark" ? "#20222A" : "#EFEAE0",
        padding: "24px",
        borderRadius: "24px",
        flex: 1,
        boxShadow: "none",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between">
          <Typography fontSize="18px" lineHeight="28px" fontWeight={600} sx={{ color: theme.colors.gray[10] }}>
            Epoch {epochData?.epochNumber || 0}
          </Typography>
          <Box display="flex" alignItems="center" gap="8px">
            <Typography fontSize="15px" fontWeight={400} sx={{ color: theme.colors.gray[40] }}>
              Next in
            </Typography>
            <Box display="flex" alignItems="center" gap="4px">
              <Box
                sx={{
                  border:
                    theme.palette.mode === "dark"
                      ? "1px solid rgba(255, 255, 255, 0.1)"
                      : "1px solid rgba(20, 23, 34, 0.1)",
                  px: "6px",
                  py: "1px",
                  bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(20, 23, 34, 0.03)",
                  borderRadius: "8px",
                }}
              >
                <Typography fontWeight={600} fontSize="15px" sx={{ color: theme.colors.gray[40] }}>
                  {timeLeft.days}
                  <span>d</span>
                </Typography>
              </Box>
              <Box
                sx={{
                  border:
                    theme.palette.mode === "dark"
                      ? "1px solid rgba(255, 255, 255, 0.1)"
                      : "1px solid rgba(20, 23, 34, 0.1)",
                  px: "6px",
                  py: "1px",
                  bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(20, 23, 34, 0.03)",
                  borderRadius: "8px",
                }}
              >
                <Typography fontWeight={600} fontSize="15px" sx={{ color: theme.colors.gray[40] }}>
                  {timeLeft.hours}
                  <span>h</span>
                </Typography>
              </Box>
              <Box
                sx={{
                  border:
                    theme.palette.mode === "dark"
                      ? "1px solid rgba(255, 255, 255, 0.1)"
                      : "1px solid rgba(20, 23, 34, 0.1)",
                  px: "6px",
                  py: "1px",
                  bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(20, 23, 34, 0.03)",
                  borderRadius: "8px",
                }}
              >
                <Typography fontWeight={600} fontSize="15px" sx={{ color: theme.colors.gray[40] }}>
                  {timeLeft.minutes}
                  <span>m</span>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Typography fontSize="18px" lineHeight="28px" fontWeight={600} mt="24px" sx={{ color: theme.colors.gray[10] }}>
          Earn Drachmas by engaging with Olympus products and governance.
        </Typography>
        <Typography fontSize="15px" fontWeight={400} mt="8px" mb="24px" sx={{ color: theme.colors.gray[40] }}>
          Accumulated Drachmas can then be used to claim your proportional share of the Convertible OHM rewards pool,
          aligning long-term participation with meaningful on-chain incentives.
        </Typography>
        <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr 1fr" }} gap="12px" mt="auto">
          <Box
            sx={{
              bgcolor: theme.palette.mode === "dark" ? "#2C2E37" : "#FFF",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            <Typography fontSize="15px" fontWeight={400} sx={{ color: theme.colors.gray[40] }}>
              Drachmas
            </Typography>
            <Box display="flex" alignItems="center" gap="4px" mt="8px">
              <SvgIcon sx={{ fontSize: "20px" }} component={DrachmaIcon} />
              <Typography fontSize="18px" fontWeight={600} sx={{ color: theme.colors.gray[10] }}>
                {formatNumber(totalDrachmas, 0)}
              </Typography>
            </Box>
            <Box
              mt="8px"
              sx={{
                border:
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(20, 23, 34, 0.1)",
                px: "8px",
                py: "2px",
                bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(20, 23, 34, 0.03)",
                borderRadius: "8px",
                width: "fit-content",
              }}
            >
              <Typography fontWeight={600} fontSize="13px" sx={{ color: theme.colors.gray[40] }}>
                by all participants
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              bgcolor: theme.palette.mode === "dark" ? "#2C2E37" : "#FFF",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            <Box display="flex" alignItems="center" gap="4px">
              <Typography fontSize="15px" fontWeight={400} sx={{ color: theme.colors.gray[40] }}>
                Drachma Calculation
              </Typography>
              <InfoTooltip message="Drachmas are calculated on a daily basis. The final snapshot of the protocol positions is taken at 11:59 PM EST." />
            </Box>
            <Typography fontSize="18px" fontWeight={600} mt="8px" sx={{ color: theme.colors.gray[10] }}>
              Daily
            </Typography>
            <Box
              mt="8px"
              sx={{
                border:
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(20, 23, 34, 0.1)",
                px: "8px",
                py: "2px",
                bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(20, 23, 34, 0.03)",
                borderRadius: "8px",
                width: "fit-content",
              }}
            >
              <Typography fontWeight={600} fontSize="13px" sx={{ color: theme.colors.gray[40] }}>
                11:59 PM EST
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              bgcolor: theme.palette.mode === "dark" ? "#2C2E37" : "#FFF",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            <Box display="flex" alignItems="center" gap="4px">
              <Typography fontSize="15px" fontWeight={400} sx={{ color: theme.colors.gray[40] }}>
                Reward Distribution
              </Typography>
              <InfoTooltip message="Rewards are distributed based on the Drachmas amount you have earned each epoch." />
            </Box>
            <Typography fontSize="18px" fontWeight={600} mt="8px" sx={{ color: theme.colors.gray[10] }}>
              Weekly
            </Typography>
            <Box
              mt="8px"
              sx={{
                border:
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(20, 23, 34, 0.1)",
                px: "8px",
                py: "2px",
                bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(20, 23, 34, 0.03)",
                borderRadius: "8px",
                width: "fit-content",
              }}
            >
              <Typography fontWeight={600} fontSize="13px" sx={{ color: theme.colors.gray[40] }}>
                Mon-Wed
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
