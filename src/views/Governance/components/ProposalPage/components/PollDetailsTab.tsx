import { Box, Skeleton, Typography } from "@mui/material";
import { Paper, TertiaryButton } from "@olympusdao/component-library";
import { useGetInstructions } from "src/hooks/useProposal";
import { ProposalAction } from "src/hooks/useProposals";
import { MarkdownPreview } from "src/views/Governance/components/MarkdownPreview";
import { ActivateVoting } from "src/views/Governance/components/ProposalPage/components/ActivateVoting";
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
        <MarkdownPreview content={proposal.content} />

        <Box display="flex" flexDirection="row" justifyContent="flex-end">
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

export const InstructionsDetails = ({ action, target }: { action: number; target: string }) => {
  const { chain } = useNetwork();
  const etherscanURI =
    chain?.id === 5 ? `https://goerli.etherscan.io/address/${target}` : `https://etherscan.io/address/${target}`;
  const dethcodeURI =
    chain?.id === 5
      ? `https://goerli.etherscan.deth.net/address/${target}`
      : `https://etherscan.deth.net/address/${target}`;

  return (
    <Box display="flex" flexDirection="column">
      <Typography id="instructions-action">{`${ProposalAction[action]} ${target}`}</Typography>
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
