import { ArrowBack } from "@mui/icons-material";
import {
  Box,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { Metric } from "@olympusdao/component-library";
import { useParams } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import PageTitle from "src/components/PageTitle";
import { truncateEthereumAddress } from "src/helpers/truncateAddress";
import { useGetDelegate } from "src/views/Governance/hooks/useGetDelegate";
import { useGetProposalsFromSubgraph } from "src/views/Governance/hooks/useGetProposalsFromSubgraph";
import { useEnsName } from "wagmi";

export const DelegateDetails = () => {
  const { id } = useParams();
  const { data: delegate } = useGetDelegate({ id: id || "" });
  const theme = useTheme();
  const delegatorCount = delegate?.delegators.length || 0;
  const { data: proposals } = useGetProposalsFromSubgraph();
  const { data: ensName } = useEnsName({ address: delegate?.address as `0x${string}` });

  //get proposal title from proposal id
  const proposalTitle = (id: string) => {
    const proposal = proposals?.find(proposal => proposal.details.id === id);
    return proposal?.title;
  };

  return (
    <div id="stake-view">
      <PageTitle
        name={
          <Box display="flex" flexDirection="row" alignItems="center">
            <Box display="flex" flexDirection="row" gap={2} alignItems="center">
              <Link component={RouterLink} to="/governance/delegate">
                <ArrowBack />
              </Link>
              Delegate: {ensName || truncateEthereumAddress(delegate?.address || "")}
            </Box>
          </Box>
        }
      />
      <Box width="97%" maxWidth="974px">
        <Box display="flex" gap={2} mb={4}>
          <Metric
            label="Voting Power"
            metric={`${Number(delegate?.latestVotingPowerSnapshot.votingPower).toFixed(4)} gOHM`}
          />
          <Metric label="Vote Participation" metric={`${delegate?.votesCasted.length}`} />
          <Metric label="Received Delegations" metric={`${delegatorCount}`} />
        </Box>
        <Typography variant="h5" gutterBottom>
          Voting History
        </Typography>
        <Box overflow="scroll" bgcolor={theme.colors["paper"].card} borderRadius={"10px"} px="30px" py="20px" mt="33px">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Proposal</TableCell>
                  <TableCell>Vote</TableCell>
                  {/* <TableCell align="right">Weight</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {delegate?.votesCasted.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      <Typography variant="body1" py={2}>
                        No voting history available
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  delegate?.votesCasted.map(vote => (
                    <TableRow key={vote.proposalId}>
                      <TableCell>
                        <Link component={RouterLink} to={`/governance/proposals/${vote.proposalId}`}>
                          {proposalTitle(vote.proposalId)}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {vote.support === 1
                          ? "For"
                          : vote.support === 0
                            ? "Against"
                            : vote.support === 2
                              ? "Abstain"
                              : ""}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </div>
  );
};
