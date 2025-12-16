import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { RiBarChart2Line, RiHistoryLine, RiQuestionLine } from "@remixicon/react";
import { useState } from "react";
import { RewardsFaq } from "src/views/Rewards/components/RewardsFaq";
import { RewardsHistoryTable } from "src/views/Rewards/components/RewardsHistoryTable";
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

  return (
    <section>
      <Box mb="23px" pl="31px">
        <Typography component="h1" fontSize="32px" lineHeight="36px" m={0} fontWeight={600}>
          Rewards
        </Typography>
      </Box>
      <Box py="8px" px="32px">
        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} alignItems="stretch" gap="32px" mb="40px">
          <RewardsStats />
          {isConnected ? <UserRewards /> : <RewardsWalletNotConnected />}
        </Box>
        <Box sx={{ width: "100%" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              marginBottom: "20px",
            }}
            TabIndicatorProps={{ style: { display: "none" } }}
          >
            {/*<Tab*/}
            {/*  label={*/}
            {/*    <Box*/}
            {/*      sx={{*/}
            {/*        display: "flex",*/}
            {/*        alignItems: "center",*/}
            {/*        gap: 1,*/}
            {/*      }}*/}
            {/*    >*/}
            {/*      <RiSurveyLine size={20} />*/}
            {/*      Quests*/}
            {/*    </Box>*/}
            {/*  }*/}
            {/*  sx={{*/}
            {/*    fontSize: "15px",*/}
            {/*    fontWeight: 500,*/}
            {/*    textTransform: "none",*/}
            {/*    color: theme.colors.gray[40],*/}
            {/*    minWidth: "auto",*/}
            {/*    paddingX: "5px",*/}
            {/*    borderBottom: `3px solid transparent`,*/}
            {/*    "&:hover": {*/}
            {/*      textDecoration: "none",*/}
            {/*      borderColor: theme.colors.primary[300],*/}
            {/*    },*/}
            {/*    "&.Mui-selected": {*/}
            {/*      color: theme.colors.gray[10],*/}
            {/*      textDecoration: "none",*/}
            {/*      borderColor: theme.colors.gray[10],*/}
            {/*    },*/}
            {/*  }}*/}
            {/*/>*/}
            {/*<Tab*/}
            {/*  label={*/}
            {/*    <Box*/}
            {/*      sx={{*/}
            {/*        display: "flex",*/}
            {/*        alignItems: "center",*/}
            {/*        gap: 1,*/}
            {/*      }}*/}
            {/*    >*/}
            {/*      <RiUserCommunityLine size={20} />*/}
            {/*      Referrals*/}
            {/*    </Box>*/}
            {/*  }*/}
            {/*  sx={{*/}
            {/*    fontSize: "15px",*/}
            {/*    fontWeight: 500,*/}
            {/*    textTransform: "none",*/}
            {/*    color: theme.colors.gray[40],*/}
            {/*    minWidth: "auto",*/}
            {/*    paddingX: "5px",*/}
            {/*    borderBottom: `3px solid transparent`,*/}
            {/*    "&:hover": {*/}
            {/*      textDecoration: "none",*/}
            {/*      borderColor: theme.colors.primary[300],*/}
            {/*    },*/}
            {/*    "&.Mui-selected": {*/}
            {/*      color: theme.colors.gray[10],*/}
            {/*      textDecoration: "none",*/}
            {/*      borderColor: theme.colors.gray[10],*/}
            {/*    },*/}
            {/*  }}*/}
            {/*/>*/}
            <Tab
              label={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <RiHistoryLine size={20} />
                  History
                </Box>
              }
              sx={{
                fontSize: "15px",
                fontWeight: 500,
                textTransform: "none",
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
              }}
            />
            <Tab
              label={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <RiBarChart2Line size={20} />
                  Leaderboard
                </Box>
              }
              sx={{
                fontSize: "15px",
                fontWeight: 500,
                textTransform: "none",
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
              }}
            />
            <Tab
              label={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <RiQuestionLine size={20} />
                  FAQ
                </Box>
              }
              sx={{
                fontSize: "15px",
                fontWeight: 500,
                textTransform: "none",
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
              }}
            />
          </Tabs>
          {activeTab === 0 && <RewardsHistoryTable />}
          {activeTab === 1 && <RewardsLeaderboardTable />}
          {activeTab === 2 && <RewardsFaq />}
        </Box>
      </Box>
    </section>
  );
};
