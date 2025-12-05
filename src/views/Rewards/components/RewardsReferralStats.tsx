import { Box, Button, Paper, SvgIcon, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DrachmaIcon from "src/assets/icons/drachma.svg?react";
import { formatNumber } from "src/helpers";

export const RewardsReferralStats = () => {
  const theme = useTheme();
  return (
    <Box>
      <Paper
        sx={{
          background: theme.palette.mode === "dark" ? "#20222A" : "#EFEAE0",
          padding: "24px",
          borderRadius: "24px",
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <Box>
            <Typography fontWeight={600} sx={{ marginBottom: "8px" }} fontSize="18px">
              Refer Users to Earn Rewards
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography fontSize="15px">Earn additional rewards by referring users.</Typography>

              <Typography fontSize="15px" fontWeight={600}>
                <a href="">Learn More</a>
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Box>
              <Typography fontSize="15px" sx={{ marginBottom: "8px" }}>
                Active Referrals
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "end" }}>
                <Typography fontSize="18px">4</Typography>
                <Typography sx={{ color: theme.colors.gray[40] }} fontSize="18px">
                  / 10
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography fontSize="15px" sx={{ marginBottom: "8px" }}>
                Total Earned
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="center" gap="4px" mt="8px">
                <SvgIcon sx={{ fontSize: "16px" }} component={DrachmaIcon} />
                <Typography fontSize="15px" fontWeight={500} sx={{ color: theme.colors.gray[10] }}>
                  {formatNumber(200, 0)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            bgcolor: theme.palette.mode === "dark" ? "#2C2E37" : "#FFF",
            borderRadius: "12px",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography fontSize="15px" fontWeight={400} sx={{ color: theme.colors.gray[40] }}>
              Your Referral Link
            </Typography>
            <Typography fontSize="18px" fontWeight={600}>
              https://cd.olympusdao.finance/join/F5QW1
            </Typography>
          </Box>
          <Button size="small" variant="contained" color="primary">
            Copy Link
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
