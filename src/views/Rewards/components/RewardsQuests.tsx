import { Box, Button, Paper, SvgIcon, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { RiUserCommunityLine } from "@remixicon/react";
import DrachmaIcon from "src/assets/icons/drachma.svg?react";
import { formatNumber } from "src/helpers";

export const RewardsQuests = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        },
        gap: 4,
      }}
    >
      <Paper
        sx={{
          background: theme.palette.mode === "dark" ? "#20222A" : "#EFEAE0",
          padding: "24px",
          borderRadius: "24px",
          width: "100%",
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "start", justifyContent: "space-between", marginBottom: "24px" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(20, 23, 34, 0.03)",
                borderRadius: "8px",
                color: theme.colors.primary[300],
              }}
            >
              <RiUserCommunityLine size={20} />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border:
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(20, 23, 34, 0.1)",
                px: "6px",
                bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(20, 23, 34, 0.03)",
                borderRadius: "8px",
              }}
            >
              <Typography fontWeight={600} fontSize="12px" sx={{ color: theme.colors.gray[40] }}>
                Recurring
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography fontSize="18px" sx={{ marginBottom: "8px" }} fontWeight={600}>
              Open CD Position
            </Typography>
            <Typography fontSize="15px">Description that explains the task. That explains the task.</Typography>
          </Box>
        </Box>
        <Box
          sx={{
            margin: "24px 0",
            height: "1px",
            width: "100%",
            bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(20, 23, 34, 0.1)",
          }}
        />
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <Typography fontSize="15px" sx={{ color: theme.colors.gray[40] }}>
            Bonus
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center" gap="4px" mt="8px">
            <SvgIcon sx={{ fontSize: "16px" }} component={DrachmaIcon} />
            <Typography fontSize="15px" fontWeight={500} sx={{ color: theme.colors.gray[10] }}>
              {formatNumber(200, 0)}
            </Typography>
          </Box>
        </Box>
        <Button size="small" variant="contained" color="primary" sx={{ width: "100%" }}>
          Get Drachmas
        </Button>
      </Paper>
      <Paper
        sx={{
          background: theme.palette.mode === "dark" ? "#20222A" : "#EFEAE0",
          padding: "24px",
          borderRadius: "24px",
          width: "100%",
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "start", justifyContent: "space-between", marginBottom: "24px" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(20, 23, 34, 0.03)",
                borderRadius: "8px",
                color: theme.colors.primary[300],
              }}
            >
              <RiUserCommunityLine size={20} />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border:
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(20, 23, 34, 0.1)",
                px: "6px",
                bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(20, 23, 34, 0.03)",
                borderRadius: "8px",
              }}
            >
              <Typography fontWeight={600} fontSize="12px" sx={{ color: theme.colors.gray[40] }}>
                Recurring
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography fontSize="18px" sx={{ marginBottom: "8px" }} fontWeight={600}>
              Open CD Position
            </Typography>
            <Typography fontSize="15px">Description that explains the task. That explains the task.</Typography>
          </Box>
        </Box>
        <Box
          sx={{
            margin: "24px 0",
            height: "1px",
            width: "100%",
            bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(20, 23, 34, 0.1)",
          }}
        />
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <Typography fontSize="15px" sx={{ color: theme.colors.gray[40] }}>
            Bonus
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center" gap="4px" mt="8px">
            <SvgIcon sx={{ fontSize: "16px" }} component={DrachmaIcon} />
            <Typography fontSize="15px" fontWeight={500} sx={{ color: theme.colors.gray[10] }}>
              {formatNumber(200, 0)}
            </Typography>
          </Box>
        </Box>
        <Button size="small" variant="contained" color="primary" sx={{ width: "100%" }}>
          Get Drachmas
        </Button>
      </Paper>
      <Paper
        sx={{
          background: theme.palette.mode === "dark" ? "#20222A" : "#EFEAE0",
          padding: "24px",
          borderRadius: "24px",
          width: "100%",
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "start", justifyContent: "space-between", marginBottom: "24px" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(20, 23, 34, 0.03)",
                borderRadius: "8px",
                color: theme.colors.primary[300],
              }}
            >
              <RiUserCommunityLine size={20} />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border:
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(20, 23, 34, 0.1)",
                px: "6px",
                bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(20, 23, 34, 0.03)",
                borderRadius: "8px",
              }}
            >
              <Typography fontWeight={600} fontSize="12px" sx={{ color: theme.colors.gray[40] }}>
                One Time
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography fontSize="18px" sx={{ marginBottom: "8px" }} fontWeight={600}>
              Open CD Position
            </Typography>
            <Typography fontSize="15px">Description that explains the task. That explains the task.</Typography>
          </Box>
        </Box>
        <Box
          sx={{
            margin: "24px 0",
            height: "1px",
            width: "100%",
            bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(20, 23, 34, 0.1)",
          }}
        />
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <Typography fontSize="15px" sx={{ color: theme.colors.gray[40] }}>
            Bonus
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center" gap="4px" mt="8px">
            <SvgIcon sx={{ fontSize: "16px" }} component={DrachmaIcon} />
            <Typography fontSize="15px" fontWeight={500} sx={{ color: theme.colors.gray[10] }}>
              {formatNumber(200, 0)}
            </Typography>
          </Box>
        </Box>
        <Button size="small" variant="contained" color="primary" sx={{ width: "100%" }}>
          Get Drachmas
        </Button>
      </Paper>
      <Paper
        sx={{
          background: theme.palette.mode === "dark" ? "#20222A" : "#EFEAE0",
          padding: "24px",
          borderRadius: "24px",
          width: "100%",
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "start", justifyContent: "space-between", marginBottom: "24px" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(20, 23, 34, 0.03)",
                borderRadius: "8px",
                color: theme.colors.primary[300],
              }}
            >
              <RiUserCommunityLine size={20} />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border:
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(20, 23, 34, 0.1)",
                px: "6px",
                bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(20, 23, 34, 0.03)",
                borderRadius: "8px",
              }}
            >
              <Typography fontWeight={600} fontSize="12px" sx={{ color: theme.colors.gray[40] }}>
                One Time
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography fontSize="18px" sx={{ marginBottom: "8px" }} fontWeight={600}>
              Open CD Position
            </Typography>
            <Typography fontSize="15px">Description that explains the task. That explains the task.</Typography>
          </Box>
        </Box>
        <Box
          sx={{
            margin: "24px 0",
            height: "1px",
            width: "100%",
            bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(20, 23, 34, 0.1)",
          }}
        />
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <Typography fontSize="15px" sx={{ color: theme.colors.gray[40] }}>
            Bonus
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center" gap="4px" mt="8px">
            <SvgIcon sx={{ fontSize: "16px" }} component={DrachmaIcon} />
            <Typography fontSize="15px" fontWeight={500} sx={{ color: theme.colors.gray[10] }}>
              {formatNumber(200, 0)}
            </Typography>
          </Box>
        </Box>
        <Button size="small" variant="contained" color="primary" sx={{ width: "100%" }}>
          Get Drachmas
        </Button>
      </Paper>
      <Paper
        sx={{
          background: theme.palette.mode === "dark" ? "#20222A" : "#EFEAE0",
          padding: "24px",
          borderRadius: "24px",
          width: "100%",
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "start", justifyContent: "space-between", marginBottom: "24px" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(20, 23, 34, 0.03)",
                borderRadius: "8px",
                color: theme.colors.primary[300],
              }}
            >
              <RiUserCommunityLine size={20} />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border:
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(20, 23, 34, 0.1)",
                px: "6px",
                bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(20, 23, 34, 0.03)",
                borderRadius: "8px",
              }}
            >
              <Typography fontWeight={600} fontSize="12px" sx={{ color: theme.colors.gray[40] }}>
                One Time
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography fontSize="18px" sx={{ marginBottom: "8px" }} fontWeight={600}>
              Open CD Position
            </Typography>
            <Typography fontSize="15px">Description that explains the task. That explains the task.</Typography>
          </Box>
        </Box>
        <Box
          sx={{
            margin: "24px 0",
            height: "1px",
            width: "100%",
            bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(20, 23, 34, 0.1)",
          }}
        />
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <Typography fontSize="15px" sx={{ color: theme.colors.gray[40] }}>
            Bonus
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center" gap="4px" mt="8px">
            <SvgIcon sx={{ fontSize: "16px" }} component={DrachmaIcon} />
            <Typography fontSize="15px" fontWeight={500} sx={{ color: theme.colors.gray[10] }}>
              {formatNumber(200, 0)}
            </Typography>
          </Box>
        </Box>
        <Button size="small" variant="contained" color="primary" sx={{ width: "100%" }}>
          Get Drachmas
        </Button>
      </Paper>
      <Paper
        sx={{
          background: theme.palette.mode === "dark" ? "#20222A" : "#EFEAE0",
          padding: "24px",
          borderRadius: "24px",
          width: "100%",
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "start", justifyContent: "space-between", marginBottom: "24px" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(20, 23, 34, 0.03)",
                borderRadius: "8px",
                color: theme.colors.primary[300],
              }}
            >
              <RiUserCommunityLine size={20} />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border:
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(20, 23, 34, 0.1)",
                px: "6px",
                bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(20, 23, 34, 0.03)",
                borderRadius: "8px",
              }}
            >
              <Typography fontWeight={600} fontSize="12px" sx={{ color: theme.colors.gray[40] }}>
                One Time
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography fontSize="18px" sx={{ marginBottom: "8px" }} fontWeight={600}>
              Open CD Position
            </Typography>
            <Typography fontSize="15px">Description that explains the task. That explains the task.</Typography>
          </Box>
        </Box>
        <Box
          sx={{
            margin: "24px 0",
            height: "1px",
            width: "100%",
            bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(20, 23, 34, 0.1)",
          }}
        />
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <Typography fontSize="15px" sx={{ color: theme.colors.gray[40] }}>
            Bonus
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center" gap="4px" mt="8px">
            <SvgIcon sx={{ fontSize: "16px" }} component={DrachmaIcon} />
            <Typography fontSize="15px" fontWeight={500} sx={{ color: theme.colors.gray[10] }}>
              {formatNumber(200, 0)}
            </Typography>
          </Box>
        </Box>
        <Button size="small" variant="contained" color="primary" sx={{ width: "100%" }}>
          Get Drachmas
        </Button>
      </Paper>
    </Box>
  );
};
