import { Box, SvgIcon, Tab, Tabs, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { RiBarChart2Line, RiQuestionLine } from "@remixicon/react";
import { useState } from "react";
import ConvOhmIcon from "src/assets/tokens/convOHM.svg?react";
import { ClaimTable } from "src/views/Rewards/components/ClaimTable";
import { ConvertTable } from "src/views/Rewards/components/ConvertTable";
import { RewardsFaq } from "src/views/Rewards/components/RewardsFaq";
import { RewardsLeaderboardTable } from "src/views/Rewards/components/RewardsLeaderboardTable";
import { RewardsStats } from "src/views/Rewards/components/RewardsStats";
import { RewardsWalletNotConnected } from "src/views/Rewards/components/RewardsWalletNotConnected";
import { UserRewards } from "src/views/Rewards/components/UserRewards";
import { useAccount } from "wagmi";

export const UserPageRewards = () => {
  const { isConnected } = useAccount();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const tabSx = {
    fontSize: "18px",
    fontWeight: 600,
    lineHeight: "24px",
    textTransform: "none" as const,
    color: theme.colors.gray[40],
    minWidth: "auto",
    paddingX: "5px",
    borderBottom: `3px solid transparent`,
    "&:hover": {
      textDecoration: "none",
      borderColor: theme.colors.primary[300],
    },
    "&.Mui-selected": {
      color: theme.colors.gray[10],
      textDecoration: "none",
      borderColor: theme.colors.gray[10],
    },
  };

  return (
    <section>
      <Box mb="23px" pl="31px">
        <Typography component="h1" fontSize="32px" lineHeight="36px" m={0} fontWeight={600}>
          Rewards
        </Typography>
      </Box>
      <Box py="8px" px="32px" sx={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} alignItems="stretch" gap="16px" mb="40px">
          <RewardsStats />
          {isConnected ? <UserRewards /> : <RewardsWalletNotConnected />}
        </Box>
        <Box sx={{ width: "100%" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{ marginBottom: "20px" }}
            TabIndicatorProps={{ style: { display: "none" } }}
          >
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <SvgIcon sx={{ fontSize: "20px" }} component={ConvOhmIcon} inheritViewBox />
                  Claim
                </Box>
              }
              sx={tabSx}
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <SvgIcon sx={{ fontSize: "20px" }} component={ConvOhmIcon} inheritViewBox />
                  Convert
                </Box>
              }
              sx={tabSx}
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <RiBarChart2Line size={20} />
                  Leaderboard
                </Box>
              }
              sx={tabSx}
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <RiQuestionLine size={20} />
                  FAQ
                </Box>
              }
              sx={tabSx}
            />
          </Tabs>
          {activeTab === 0 && <ClaimTable />}
          {activeTab === 1 && <ConvertTable />}
          {activeTab === 2 && <RewardsLeaderboardTable />}
          {activeTab === 3 && <RewardsFaq />}
        </Box>
      </Box>
    </section>
  );
};
