import { Box, Typography, useTheme } from "@mui/material";
import { PrimaryButton, TertiaryButton } from "@olympusdao/component-library";
import { BigNumber } from "ethers";
import { useState } from "react";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useUserVote, useVote } from "src/hooks/useVoting";
import { ActivateVoting } from "src/views/Governance/components/ProposalPage/components/ActivateVoting";
import { UserVote } from "src/views/Governance/components/ProposalPage/components/UserVote";
import { ProposalTabProps } from "src/views/Governance/interfaces";
import { useAccount } from "wagmi";

export const CastVote = ({ proposal }: ProposalTabProps) => {
  const theme = useTheme();
  const networks = useTestableNetworks();
  const { isConnected } = useAccount();
  const [vote, setVote] = useState<string>("");
  const submitVote = useVote();
  const { address: voterAddress } = useAccount();
  const { data: voteValue, isLoading: isLoadingVoteValue } = useUserVote(proposal.id, voterAddress as string);

  const handleVoteSubmission = () => {
    submitVote.mutate({ voteData: { proposalId: BigNumber.from(proposal.id), vote: vote === "yes" } });
  };
  return (
    <Box borderRadius="6px" padding="18px" sx={{ backgroundColor: theme.colors.gray[700] }}>
      <Box display="flex" flexDirection="column">
        <ActivateVoting proposal={proposal} />
        <Typography fontSize="15px" fontWeight={500} lineHeight="24px">
          Cast Your Vote
        </Typography>
      </Box>
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
                <PrimaryButton sx={{ minWidth: "120px" }} disabled={!proposal.isActive} onClick={handleVoteSubmission}>
                  Vote <span style={{ textTransform: "capitalize" }}>&nbsp;{vote}</span>
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
