import { Box, Grid, Link, Tab, Tabs, Typography } from "@mui/material";
import { Chip, Modal, Paper, PrimaryButton } from "@olympusdao/component-library";
import { DateTime } from "luxon";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import remarkGfm from "remark-gfm";
import PageTitle from "src/components/PageTitle";
import { CallData } from "src/views/Governance/Components/CallData";
import { CurrentVotes } from "src/views/Governance/Components/CurrentVotes";
import { Status } from "src/views/Governance/Components/Status";
import { VoteModal } from "src/views/Governance/Components/VoteModal";
import { mapProposalStatus, toCapitalCase } from "src/views/Governance/helpers";
import { useActivateProposal } from "src/views/Governance/hooks/useActivateProposal";
import { useExecuteProposal } from "src/views/Governance/hooks/useExecuteProposal";
import { useGetCurrentBlockTime } from "src/views/Governance/hooks/useGetCurrentBlockTime";
import { useGetProposalDetails } from "src/views/Governance/hooks/useGetProposalDetails";
import { useGetProposal } from "src/views/Governance/hooks/useGetProposals";
import { useGetReceipt } from "src/views/Governance/hooks/useGetReceipt";
import { useQueueProposal } from "src/views/Governance/hooks/useQueueProposal";
import { useEnsName } from "wagmi";

export const ProposalPage = () => {
  const { id } = useParams();
  const { data: proposal } = useGetProposal({ proposalId: Number(id) });
  const { data: proposalDetails } = useGetProposalDetails({ proposalId: Number(id) });
  const { data: ensAddress } = useEnsName({ address: proposalDetails?.proposer as `0x${string}` });
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const { data: currentBlock } = useGetCurrentBlockTime();
  const activateProposal = useActivateProposal();
  const queueProposal = useQueueProposal();
  const executeProposal = useExecuteProposal();
  const { data: getReceipt } = useGetReceipt({ proposalId: Number(id) });
  const [tabIndex, setTabIndex] = useState(0);

  if (!proposalDetails || !proposal) {
    return <></>;
  }

  const pendingActivation = Boolean(
    proposalDetails.status === "Pending" && currentBlock?.number && currentBlock.number >= proposalDetails.startBlock,
  );

  const currentBlockTime = currentBlock?.timestamp ? new Date(currentBlock?.timestamp * 1000) : new Date();
  const pending = !pendingActivation && proposalDetails.status === "Pending";
  const pendingExecution = Boolean(proposalDetails.status === "Queued" && currentBlockTime >= proposalDetails.etaDate);
  const hasVoted = getReceipt?.hasVoted;

  console.log(proposalDetails);

  return (
    <div id="stake-view">
      <Modal open={voteModalOpen} closePosition="right" headerText="Voting" onClose={() => setVoteModalOpen(false)}>
        <VoteModal
          startBlock={proposalDetails.startBlock}
          title={proposal?.title}
          proposalId={proposalDetails.id}
          onClose={() => setVoteModalOpen(false)}
        />
      </Modal>
      <PageTitle name="Governance" />
      <Grid container>
        <Grid item xs={12}>
          <Paper enableBackground fullWidth>
            <Box mb="8px">
              <Chip
                label={toCapitalCase(proposalDetails.status)}
                template={mapProposalStatus(proposalDetails.status)}
              />
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography fontSize={"32px"} sx={{ fontWeight: "500" }}>
                {proposal?.title}
              </Typography>
              <Box display="flex" flexDirection="row" alignItems="center">
                {pendingActivation && (
                  <PrimaryButton onClick={() => activateProposal.mutate({ proposalId: proposalDetails.id })}>
                    Activate Proposal
                  </PrimaryButton>
                )}
                <Typography fontSize={"15px"}>
                  {pending && proposalDetails.startDate ? (
                    `Voting Starts in ${DateTime.fromJSDate(proposalDetails.startDate).toRelative({
                      base: DateTime.fromJSDate(currentBlockTime),
                    })}`
                  ) : proposalDetails.status === "Active" ? (
                    <PrimaryButton onClick={() => setVoteModalOpen(true)} disabled={hasVoted}>
                      {hasVoted ? "Already Voted" : "Vote"}
                    </PrimaryButton>
                  ) : proposalDetails.status === "Succeeded" ? (
                    <PrimaryButton onClick={() => queueProposal.mutate({ proposalId: proposalDetails.id })}>
                      Queue for Execution
                    </PrimaryButton>
                  ) : pendingExecution ? (
                    <PrimaryButton onClick={() => executeProposal.mutate({ proposalId: proposalDetails.id })}>
                      Execute Proposal
                    </PrimaryButton>
                  ) : (
                    <></>
                  )}
                </Typography>
              </Box>
            </Box>
            <Box borderTop="1px solid" my="9px"></Box>
            <Box>
              <Typography fontSize={"15px"}>Proposed on: {proposal?.createdAtBlock.toLocaleString()}</Typography>
              <Typography fontSize={"15px"}>
                By:{" "}
                <Link
                  component={RouterLink}
                  to={`https://etherscan.io/address/${proposalDetails.proposer}`}
                  target="_blank"
                  rel={"noopener noreferrer"}
                >
                  {ensAddress || proposalDetails.proposer}
                </Link>
              </Typography>
              <Typography fontSize={"15px"}>
                Proposal ID:{" "}
                <Link
                  component={RouterLink}
                  to={`https://etherscan.io/tx/${proposal.txHash}`}
                  target="_blank"
                  rel={"noopener noreferrer"}
                >
                  {proposalDetails.id}
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={"24px"}>
        <Grid item xs={12} lg={9}>
          <Tabs
            textColor="primary"
            aria-label="proposal tabs"
            indicatorColor="primary"
            className="stake-tab-buttons"
            value={tabIndex}
            onChange={(e, newValue) => setTabIndex(newValue)}
            //hides the tab underline sliding animation in while <Zoom> is loading
            TabIndicatorProps={{ style: { display: "none" } }}
          >
            <Tab label="Description" />
            <Tab label="Executable Code" />
            {/* <Tab label="Comments" /> */}
          </Tabs>
          <Box ml="10px">
            {tabIndex === 0 && (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  //@ts-ignore
                  a: ({ ...props }) => <Link underline={"always"} {...props} target="_blank" rel="noopener" />,
                }}
              >
                {proposal?.details.description}
              </ReactMarkdown>
            )}
            {tabIndex === 1 && (
              <Paper enableBackground zoom={false}>
                {proposal.details.calldatas.map((calldata, index) => {
                  return (
                    <>
                      <CallData
                        calldata={calldata}
                        target={proposal.details.targets[index]}
                        value={proposal.details.values[index].toString()}
                        index={index}
                      />
                    </>
                  );
                })}
              </Paper>
            )}
            {tabIndex === 2 && (
              <Paper enableBackground zoom={false}>
                <Typography fontSize="21px" fontWeight={600} mb="15px">
                  Comments
                </Typography>
                <Box display="flex" flexDirection="column" gap="15px">
                  <Typography>No comments yet</Typography>
                </Box>
              </Paper>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <CurrentVotes proposalId={proposalDetails.id} />
          <Status proposalId={proposalDetails.id} />
        </Grid>
      </Grid>
    </div>
  );
};
