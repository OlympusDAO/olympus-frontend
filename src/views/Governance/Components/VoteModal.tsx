import { Box, FormControlLabel, RadioGroup, styled, TextField, Typography } from "@mui/material";
import { InfoTooltip, PrimaryButton, Radio } from "@olympusdao/component-library";
import { useState } from "react";
import { useGetVotingWeight } from "src/views/Governance/hooks/useGetVotingWeight";
import { useVoteForProposal } from "src/views/Governance/hooks/useVoteForProposal";

const StyledTextField = styled(TextField)(({}) => ({
  "& .MuiInputBase-root": {
    height: "auto",
  },
}));

export const VoteModal = ({
  startBlock,
  title,
  proposalId,
  onClose,
}: {
  startBlock: number;
  title: string;
  proposalId: number;
  onClose: () => void;
}) => {
  const { data: votingWeight } = useGetVotingWeight({ startBlock });

  const [vote, setVote] = useState("");
  const [comment, setComment] = useState("");
  const castVote = useVoteForProposal();
  return (
    <>
      <Box border="1px solid #E0E0E0" borderRadius="9px" padding="18px" marginBottom="24px">
        <Box display="flex" alignItems={"center"}>
          <Typography>Voting Power</Typography>
          <InfoTooltip
            message="Your voting power is calculated as the number of tokens (votes) that have been delegated to you before the proposal became active. You can delegate your votes to yourself, or to someone else. Others can also delegate their votes to you. 
          
For votes that come from tokens that you own, if you delegated to yourself after this proposal became active, they will not be counted towards your voting power for this proposal. These votes will be counted towards your voting power for future proposals. 

This behavior is intended to prevent users from changing the outcome of a vote in progress by buying or borrowing additional votes."
          />
        </Box>
        <Typography fontSize="32px" mt={"6px"}>
          {votingWeight}
        </Typography>
      </Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Proposal ID: {proposalId}
      </Typography>
      <Typography mt="27px" fontWeight={"600"} mb="9px">
        Vote
      </Typography>
      <Box pl="12px">
        <RadioGroup
          name="vote"
          onChange={e => {
            setVote(e.target.value);
          }}
          value={vote}
        >
          <Box display="flex" flexDirection={"column"} gap={"9px"}>
            <FormControlLabel value="1" control={<Radio />} label="For" />
            <FormControlLabel value="0" control={<Radio />} label="Against" />
            <FormControlLabel value="2" control={<Radio />} label="Abstain" />
          </Box>
        </RadioGroup>
      </Box>
      <Typography mt="27px" fontWeight={"600"}>
        Add Comment
      </Typography>
      <StyledTextField
        placeholder="Optional comment"
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        margin="normal"
        value={comment}
        onChange={e => setComment(e.target.value)}
        InputProps={{ notched: false }}
      />
      <PrimaryButton
        fullWidth
        disabled={!vote || castVote.isLoading}
        onClick={() =>
          castVote.mutate(
            { proposalId, vote: Number(vote), comment },
            {
              onSuccess: () => {
                setVote("");
                setComment("");
                onClose();
              },
            },
          )
        }
      >
        Submit
      </PrimaryButton>
    </>
  );
};
