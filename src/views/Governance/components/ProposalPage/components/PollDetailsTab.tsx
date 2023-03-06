import { Box, Skeleton, Typography } from "@mui/material";
import { Paper, TertiaryButton } from "@olympusdao/component-library";
import { useGetInstructions } from "src/hooks/useProposal";
import { ProposalAction, ProposalActionsReadable } from "src/hooks/useProposals";
import { MarkdownPreview } from "src/views/Governance/components/MarkdownPreview";
import { ActivateVoting } from "src/views/Governance/components/ProposalPage/components/ActivateVoting";
import ReclaimVohmButton from "src/views/Governance/components/ReclaimVohmButton";
import { ProposalTabProps } from "src/views/Governance/interfaces";
import { useNetwork } from "wagmi";

export const PollDetailsTab = ({ proposal }: ProposalTabProps) => {
  const { data: instructions, isLoading } = useGetInstructions(proposal.id);

  const renderInstructions = () => {
    if (instructions && instructions.length > 0) {
      return instructions.map((instruction, index) => {
        return <InstructionsDetails key={index} action={instruction.action} target={instruction.target} />;
      });
    }
    return <InstructionSkeleton />;
  };

  return (
    <Paper enableBackground fullWidth>
      <Box display="flex" flexDirection="column">
        <ActivateVoting proposal={proposal} />
        <Box id="timeline-details" display="flex" flexDirection="column" sx={{ display: "none" }}>
          <Box display="flex" flexDirection="row">
            <Typography>Current Timestamp&nbsp;</Typography>
            <Typography>{Date.now()}</Typography>
          </Box>
          <Box display="flex" flexDirection="row">
            <Typography>Submission Timestamp&nbsp;</Typography>
            <Typography>{proposal.submissionTimestamp}</Typography>
          </Box>
          <Box display="flex" flexDirection="row">
            <Typography>Activation Timestamp&nbsp;</Typography>
            <Typography>{proposal.activationTimestamp}</Typography>
          </Box>
          <Box display="flex" flexDirection="row">
            <Typography>Activation Deadline&nbsp;</Typography>
            <Typography>{proposal.activationDeadline}</Typography>
          </Box>
          <Box display="flex" flexDirection="row">
            <Typography>Activation Expiry&nbsp;</Typography>
            <Typography>{proposal.activationExpiry}</Typography>
          </Box>
          <Box display="flex" flexDirection="row">
            <Typography>Voting Expiry&nbsp;</Typography>
            <Typography>{proposal.votingExpiry}</Typography>
          </Box>
        </Box>
        <MarkdownPreview content={proposal.content} />

        <Box display="flex" flexDirection="row" justifyContent="flex-end">
          <ReclaimVohmButton proposal={proposal} />
          <TertiaryButton target="_blank" href={proposal.uri}>
            Discussion
          </TertiaryButton>
        </Box>
        <Box display="flex" flexDirection="column">
          <Typography variant="h6">Implementation Details</Typography>
          <>{isLoading ? <InstructionSkeleton /> : renderInstructions()}</>
        </Box>
      </Box>
    </Paper>
  );
};

export const InstructionsDetails = ({ action, target }: { action: ProposalAction; target: string }) => {
  const { chain } = useNetwork();
  const etherscanURI =
    chain?.id === 5 ? `https://goerli.etherscan.io/address/${target}` : `https://etherscan.io/address/${target}`;
  const dethcodeURI =
    chain?.id === 5
      ? `https://goerli.etherscan.deth.net/address/${target}`
      : `https://etherscan.deth.net/address/${target}`;

  return (
    <Box display="flex" flexDirection="column">
      <Typography id="instructions-action">{`${ProposalActionsReadable[action]}: ${target}`}</Typography>
      <Box display="flex" flexDirection="row" justifyContent={`center`}>
        <TertiaryButton id="instructions-target-etherscan" target="_blank" href={etherscanURI} disabled={!chain}>
          etherscan
        </TertiaryButton>
        <TertiaryButton id="instructions-target-dethcode" target="_blank" href={dethcodeURI} disabled={!chain}>
          dethcode
        </TertiaryButton>
      </Box>
    </Box>
  );
};

const InstructionSkeleton = () => {
  return (
    <Skeleton>
      <Typography id="instructions-action">{1}</Typography>
      <TertiaryButton id="instructions-target-etherscan" target="_blank" href={``}>
        {`instruction[1]`}
      </TertiaryButton>
    </Skeleton>
  );
};
