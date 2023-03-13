import { Box, capitalize, Typography, useTheme } from "@mui/material";
import { Metric, PrimaryButton, TertiaryButton } from "@olympusdao/component-library";
import { BigNumber } from "ethers";
import { useState } from "react";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { formatBalance } from "src/helpers";
import { useVoteBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useUserVote, useVote } from "src/hooks/useVoting";
import { ActivateVoting } from "src/views/Governance/components/ProposalPage/components/ActivateVoting";
import { UserVote } from "src/views/Governance/components/ProposalPage/components/UserVote";
import { proposalDateFormat } from "src/views/Governance/components/ProposalPage/ProposalPage";
import { ProposalTabProps } from "src/views/Governance/interfaces";
import { useAccount } from "wagmi";

export const CastVote = ({ proposal }: ProposalTabProps) => {
  const theme = useTheme();
  const { isConnected } = useAccount();
  const [vote, setVote] = useState<string>("");
  const submitVote = useVote();
  const { address: voterAddress } = useAccount();
  const { data: voteValue, isLoading: isLoadingVoteValue } = useUserVote(proposal.id, voterAddress as string);
  const networks = useTestableNetworks();
  const votesBalance = useVoteBalance()[networks.MAINNET].data;

  const handleVoteSubmission = () => {
    submitVote.mutate({ voteData: { proposalId: BigNumber.from(proposal.id), vote: vote === "yes" } });
  };
  return (
    <Box borderRadius="6px" padding="18px" sx={{ backgroundColor: theme.colors.gray[700] }}>
      <Box display="flex" flexDirection="column">
        <ActivateVoting proposal={proposal} />
        <Typography fontSize="15px" fontWeight={500} lineHeight="24px">
          Your Vote
        </Typography>
      </Box>
      {["active", "closed"].includes(proposal.state) && (
        <Box display="flex" flexDirection="row">
          {isConnected && <Metric label={`Your Voting Power`} metric={`${formatBalance(2, votesBalance)} vOHM`} />}
          <Metric
            label={proposal.state === "active" ? `Vote Closes On` : proposal.state === "closed" ? `Vote Closed On` : ``}
            metric={`${proposalDateFormat.format(proposal.nextDeadline)}`}
          />
        </Box>
      )}
      <>
        {voteValue && !voteValue.gt("0") && (
          <>
            <Box display="flex" flexDirection="row" justifyContent="center">
              <TertiaryButton
                template={vote === "yes" ? "secondary" : "tertiary"}
                sx={{ minWidth: "120px" }}
                disabled={!isConnected || !proposal.isActive}
                onClick={() => setVote("yes")}
              >
                Yes
              </TertiaryButton>
              <TertiaryButton
                template={vote === "no" ? "secondary" : "tertiary"}
                sx={{ minWidth: "120px" }}
                disabled={!isConnected || !proposal.isActive}
                onClick={() => setVote("no")}
              >
                No
              </TertiaryButton>
            </Box>
            <WalletConnectedGuard>
              <Box display="flex" flexDirection="row" justifyContent="center">
                <PrimaryButton
                  sx={{ minWidth: "120px" }}
                  disabled={!proposal.isActive || submitVote.isLoading}
                  onClick={handleVoteSubmission}
                  loading={submitVote.isLoading}
                >
                  {submitVote.isLoading ? `Voting ${capitalize(vote)}...` : `Vote ${capitalize(vote)}`}
                </PrimaryButton>
              </Box>
            </WalletConnectedGuard>
          </>
        )}

        {voterAddress && proposal.isActive && <UserVote proposalId={proposal.id} voterAddress={voterAddress} />}
      </>
      {(proposal.state === "discussion" || proposal.state === "ready to activate") && (
        <p>This Proposal is not yet active for voting.</p>
      )}
      {proposal.state === "expired activation" && <p>This Proposal missed it's activation window.</p>}
    </Box>
  );
};
