import { Box, Paper, SvgIcon, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { InfoTooltip } from "@olympusdao/component-library";
import { differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import DrachmaIcon from "src/assets/icons/drachma.svg?react";
import { LibChainId, useGETEpochsCurrentEpoch, useGETUserUserUnits } from "src/generated/olympusUnits";
import { formatNumber } from "src/helpers";
import { useAccount, useNetwork } from "wagmi";

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
  const { address } = useAccount();
  const chainId = (chain?.id || LibChainId.NUMBER_11155111) as LibChainId;

  // Fetch current epoch data
  const { data: epochData } = useGETEpochsCurrentEpoch({
    chainId,
  });

  // Fetch user units data from API
  const { data: userUnitsData } = useGETUserUserUnits(
    address || "",
    {
      chainId,
    },
    {
      query: {
        enabled: !!address,
      },
    },
  );

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

  // Calculate user's drachmas for the current epoch
  const userEpochDrachmas = useMemo(() => {
    if (!userUnitsData?.units?.entries || !epochData?.epochId) return 0;
    const currentEpochEntries = userUnitsData.units.entries.filter(entry => entry.epochId === epochData.epochId);
    return currentEpochEntries.reduce((sum, entry) => sum + parseFloat(entry.units), 0);
  }, [userUnitsData?.units?.entries, epochData?.epochId]);

  return (
    <Paper
      sx={{
        background: theme.palette.mode === "dark" ? "#20222A" : "#EFEAE0",
        padding: "24px",
        borderRadius: "24px",
        width: "100%",
      }}
    >
      <Box>
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
        <Typography fontSize="15px" fontWeight={400} my="24px" sx={{ color: theme.colors.gray[10] }}>
          Rewards are distributed each epoch. Earn Drachmas for activity in the protocol and claim your share of the
          rewards.
        </Typography>
        <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }} gap="12px">
          <Box
            sx={{
              bgcolor: theme.palette.mode === "dark" ? "#2C2E37" : "#FFF",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            <Box display="flex" alignItems="center" gap="4px">
              <Typography fontSize="15px" fontWeight={400} sx={{ color: theme.colors.gray[40] }}>
                Epoch Drachmas
              </Typography>
              <InfoTooltip message="Total Drachmas accumulated during this epoch by all the participants." />
            </Box>
            <Box display="flex" alignItems="center" gap="4px" mt="8px">
              <SvgIcon sx={{ fontSize: "20px" }} component={DrachmaIcon} />
              <Typography fontSize="15px" fontWeight={500} sx={{ color: theme.colors.gray[10] }}>
                {formatNumber(totalDrachmas, 0)}
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
                Your Drachmas
              </Typography>
              <InfoTooltip message="The total Drachmas you've earned during this epoch from protocol activity." />
            </Box>
            <Box display="flex" alignItems="center" gap="4px" mt="8px">
              <SvgIcon sx={{ fontSize: "20px" }} component={DrachmaIcon} />
              <Typography fontSize="15px" fontWeight={500} sx={{ color: theme.colors.gray[10] }}>
                {address ? formatNumber(userEpochDrachmas, 0) : "—"}
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
                Drachma Snapshot
              </Typography>
              <InfoTooltip message="Drachmas are calculated on a daily basis. The final snapshot of the protocol positions is taken at 23:59:59 UTC." />
            </Box>
            <Box display="flex" alignItems="center" gap="4px" mt="8px">
              <Typography fontSize="15px" fontWeight={500} sx={{ color: theme.colors.gray[10] }}>
                Daily
              </Typography>
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
                  23:59:59 UTC
                </Typography>
              </Box>
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
            <Box display="flex" alignItems="center" gap="4px" mt="8px">
              <Typography fontSize="15px" fontWeight={500} sx={{ color: theme.colors.gray[10] }}>
                Weekly
              </Typography>
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
                  Tue-Wed
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
