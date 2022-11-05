import { Box, Grid, Typography, useTheme } from "@mui/material";
import { Metric, PrimaryButton } from "@olympusdao/component-library";
import { Paper } from "@olympusdao/component-library";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { formatBalance } from "src/helpers";
import { useVoteBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useVotingSupply } from "src/hooks/useVoting";
import { BackButton } from "src/views/Governance/components/BackButton";
import { VohmArea } from "src/views/Governance/components/VohmArea/VohmArea";
import { useAccount } from "wagmi";

export const VotingPower = () => {
  return (
    <>
      <Box display="flex" justifyContent="center">
        <Paper>
          <Grid container direction="column" paddingLeft="4.5px" paddingRight="4.5px">
            <BackButton />
            <VohmArea />
          </Grid>
        </Paper>
      </Box>
    </>
  );
};

export const VotingPowerMetrics = () => {
  const theme = useTheme();
  const { isConnected } = useAccount();
  const networks = useTestableNetworks();
  const votesBalance = useVoteBalance()[networks.MAINNET].data;

  const { data: totalVoteSupply, isLoading: isLoadingTotalSupply } = useVotingSupply();

  return (
    <Box borderRadius="6px" padding="18px" sx={{ backgroundColor: theme.colors.gray[700] }}>
      <Box display="flex" flexDirection="column">
        <Typography fontSize="15px" fontWeight={500} lineHeight="24px">
          Voting Power
        </Typography>
      </Box>
      <Box display="flex" flexDirection="row">
        {isConnected && <Metric label={`Your voting power`} metric={`${formatBalance(2, votesBalance)} vOHM`} />}
        {totalVoteSupply && (
          <Metric label={`Total Voting Supply`} metric={`${formatBalance(2, totalVoteSupply)} vOHM`} />
        )}
      </Box>
      <WalletConnectedGuard>
        <Box display="flex" flexDirection="row" justifyContent="center">
          <PrimaryButton sx={{ minWidth: "120px" }} onClick={() => console.log("hellooo")}>
            Get More Voting Power
          </PrimaryButton>
        </Box>
      </WalletConnectedGuard>
    </Box>
  );
};
