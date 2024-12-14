import { Box, Grid, Link, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { Chip, Modal, PrimaryButton } from "@olympusdao/component-library";
import { DateTime } from "luxon";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import remarkGfm from "remark-gfm";
import PageTitle from "src/components/PageTitle";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { truncateEthereumAddress } from "src/helpers/truncateAddress";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { NetworkId } from "src/networkDetails";
import { CallData } from "src/views/Governance/Components/CallData";
import { CurrentVotes } from "src/views/Governance/Components/CurrentVotes";
import { Status } from "src/views/Governance/Components/Status";
import { VoteModal } from "src/views/Governance/Components/VoteModal";
import { mapProposalStatus, toCapitalCase } from "src/views/Governance/helpers";
import { useActivateProposal } from "src/views/Governance/hooks/useActivateProposal";
import { useExecuteProposal } from "src/views/Governance/hooks/useExecuteProposal";
import { useGetCurrentBlockTime } from "src/views/Governance/hooks/useGetCurrentBlockTime";
import { useGetProposalDetails } from "src/views/Governance/hooks/useGetProposalDetails";
import { useGetProposalFromSubgraph } from "src/views/Governance/hooks/useGetProposalFromSubgraph";
import { useQueueProposal } from "src/views/Governance/hooks/useQueueProposal";
import VoteDetails from "src/views/Governance/Proposals/VoteDetails";
import { useEnsName, useNetwork, useSwitchNetwork } from "wagmi";

export const ProposalPage = () => {
  const { id } = useParams();
  const { data: proposal } = useGetProposalFromSubgraph({ proposalId: id });
  const { data: proposalDetails } = useGetProposalDetails({ proposalId: Number(id) });
  const { data: ensAddress } = useEnsName({ address: proposalDetails?.proposer as `0x${string}` });
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const { data: currentBlock } = useGetCurrentBlockTime();
  const activateProposal = useActivateProposal();
  const queueProposal = useQueueProposal();
  const executeProposal = useExecuteProposal();
  const { chain } = useNetwork();
  const networks = useTestableNetworks();
  const { switchNetwork } = useSwitchNetwork();
  const [tabIndex, setTabIndex] = useState(0);
  const theme = useTheme();

  if (!proposalDetails || !proposal) {
    return <></>;
  }

  const pendingActivation = Boolean(
    proposalDetails.status === "Pending" && currentBlock?.number && currentBlock.number >= proposalDetails.startBlock,
  );

  const currentBlockTime = currentBlock?.timestamp ? new Date(currentBlock?.timestamp * 1000) : new Date();
  const pending = !pendingActivation && proposalDetails.status === "Pending";
  const pendingExecution = Boolean(
    proposalDetails.status === "Queued" && proposalDetails.etaDate && currentBlockTime >= proposalDetails.etaDate,
  );

  return (
    <div id="stake-view">
      <Modal
        open={voteModalOpen}
        closePosition="right"
        headerText="Vote"
        onClose={() => setVoteModalOpen(false)}
        maxWidth="450px"
        minHeight="400px"
      >
        <VoteModal
          startBlock={proposalDetails.startBlock}
          proposalId={proposalDetails.id}
          onClose={() => setVoteModalOpen(false)}
        />
      </Modal>
      <PageTitle name="Governance" />
      <Box width="97%" maxWidth="974px">
        <Grid container>
          <Grid item xs={12}>
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
                <Typography fontSize={"18px"} fontWeight={600}>
                  {pending && proposalDetails.startDate ? (
                    `Voting Starts ${DateTime.fromJSDate(proposalDetails.startDate).toRelative({
                      base: DateTime.fromJSDate(currentBlockTime),
                    })}`
                  ) : proposalDetails.status === "Succeeded" ? (
                    <WalletConnectedGuard fullWidth buttonText="Connect to Queue">
                      {networks.MAINNET === chain?.id ? (
                        <PrimaryButton onClick={() => queueProposal.mutate({ proposalId: proposalDetails.id })}>
                          Queue for Execution
                        </PrimaryButton>
                      ) : (
                        <PrimaryButton onClick={() => switchNetwork?.(NetworkId.MAINNET)}>Switch Network</PrimaryButton>
                      )}
                    </WalletConnectedGuard>
                  ) : pendingExecution ? (
                    <WalletConnectedGuard fullWidth buttonText="Connect to Execute">
                      {networks.MAINNET === chain?.id ? (
                        <PrimaryButton onClick={() => executeProposal.mutate({ proposalId: proposalDetails.id })}>
                          Execute Proposal
                        </PrimaryButton>
                      ) : (
                        <PrimaryButton onClick={() => switchNetwork?.(NetworkId.MAINNET)}>Switch Network</PrimaryButton>
                      )}
                    </WalletConnectedGuard>
                  ) : (
                    <></>
                  )}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography fontSize={"15px"} color={theme.colors.gray[90]} lineHeight={"18px"} mt="6px">
                Proposed on: {proposal?.createdAtBlock.toLocaleString()} | By:{" "}
                <Link
                  component={RouterLink}
                  to={`https://etherscan.io/address/${proposalDetails.proposer}`}
                  target="_blank"
                  rel={"noopener noreferrer"}
                >
                  {ensAddress || truncateEthereumAddress(proposalDetails.proposer)}
                </Link>
              </Typography>

              <Typography fontSize={"15px"} lineHeight="21px" color={theme.colors.gray[90]}>
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
          </Grid>
        </Grid>
        <Box display="flex" justifyContent={"center"}>
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
            <Tab label="Participation" />
          </Tabs>
        </Box>
        <Grid container spacing={"24px"}>
          <Grid item xs={12} lg={8}>
            {/* <Paper enableBackground fullWidth> */}
            <Box overflow="scroll" bgcolor={theme.colors["paper"].card} borderRadius={"10px"} px="30px" py="20px">
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
                <>
                  {proposal.details.calldatas.map((calldata, index) => {
                    return (
                      <>
                        <CallData
                          calldata={calldata}
                          target={proposal.details.targets[index]}
                          value={proposal.details.values[index].toString()}
                          signature={proposal.details.signatures[index]}
                          index={index}
                        />
                      </>
                    );
                  })}
                </>
              )}
              {tabIndex === 2 && (
                <>
                  <Box display="flex" flexDirection="column" gap="15px">
                    <VoteDetails />
                  </Box>
                </>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <CurrentVotes proposalId={proposalDetails.id} onVoteClick={() => setVoteModalOpen(true)} />
            <Status proposalId={proposalDetails.id} />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};
