import { Box, Button, SvgIcon, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { RiArrowRightSLine } from "@remixicon/react";
import BorrowIcon from "src/assets/icons/borrow.svg?react";
import ConvertIcon from "src/assets/icons/conver.svg?react";
import DepositIcon from "src/assets/icons/deposit.svg?react";
import DrachmaIcon from "src/assets/icons/drachma.svg?react";

interface ActionItem {
  icon: React.ElementType;
  title: string;
  description: string;
  reward: string;
  link: string;
}

const actions: ActionItem[] = [
  {
    icon: DepositIcon,
    title: "Create CD Position or Place Limit Order",
    description: "Deposit USDS to open a CD or place a limit order and earn rewards based on size and time.",
    reward: "0.01 per deposited $1 / day",
    link: "https://deposit.olympusdao.finance/#/",
  },
  {
    icon: BorrowIcon,
    title: "Borrow against CD Position",
    description: "Unlock liquidity by borrowing against your CD position and earn a bonus on top of deposit rewards.",
    reward: "25% of CD position rewards",
    link: "https://deposit.olympusdao.finance/#/borrow",
  },
  {
    icon: ConvertIcon,
    title: "Convert CD to OHM",
    description: "Mint OHM from your CD position and receive a one-time reward based on how long you held the CD.",
    reward: "1/3 of accumulated CD rewards",
    link: "https://deposit.olympusdao.finance/#/",
  },
];

export const RewardsActions = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box display="flex" flexDirection="column" gap="16px">
      {actions.map(action => (
        <Box
          key={action.title}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            background: isDark ? "#20222A" : "#EFEAE0",
            borderRadius: "12px",
            padding: "24px",
            paddingRight: "40px",
            overflow: "hidden",
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "80px",
              height: "80px",
              minWidth: "80px",
              borderRadius: "8px",
              bgcolor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(20, 23, 34, 0.05)",
              color: theme.colors.gray[10],
            }}
          >
            <SvgIcon sx={{ fontSize: "32px" }} component={action.icon} inheritViewBox />
          </Box>

          {/* Content */}
          <Box flex={1} display="flex" flexDirection="column" gap="8px" justifyContent="center">
            <Box display="flex" flexDirection="column" gap="4px">
              <Typography fontSize="18px" fontWeight={600} lineHeight="24px" color={theme.colors.gray[10]}>
                {action.title}
              </Typography>
              <Typography
                fontSize="15px"
                fontWeight={400}
                lineHeight="20px"
                color={isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(20, 23, 34, 0.6)"}
              >
                {action.description}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap="4px">
              <SvgIcon sx={{ fontSize: "16px" }} component={DrachmaIcon} />
              <Typography fontSize="15px" fontWeight={600} lineHeight="20px" color={theme.colors.gray[10]}>
                {action.reward}
              </Typography>
            </Box>
          </Box>

          {/* Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.open(action.link, "_blank", "noopener,noreferrer")}
            sx={{
              textTransform: "none",
              fontSize: "15px",
              fontWeight: 600,
              lineHeight: "20px",
              borderRadius: "8px",
              padding: "10px 12px 10px 16px",
              minWidth: "auto",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            Get Drachmas
            <RiArrowRightSLine size={20} />
          </Button>
        </Box>
      ))}
    </Box>
  );
};
