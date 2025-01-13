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
import { Icon, Metric, PrimaryButton } from "@olympusdao/component-library";
import { useNavigate, useParams } from "react-router-dom";
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
  const navigate = useNavigate();

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
        <Box display="flex" gap={2} mb={8} mt={4}>
          <Metric
            label="Voting Power"
            metric={`${Number(delegate?.latestVotingPowerSnapshot.votingPower).toFixed(4)} gOHM`}
          />
          <Metric label="Vote Participation" metric={`${delegate?.votesCasted.length}`} />
          <Metric label="Received Delegations" metric={`${delegatorCount}`} />
        </Box>
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" gap={1}>
          <Typography fontSize="27px" fontWeight="500">
            Voting History
          </Typography>
          <Box display="flex" justifyContent="flex-end">
            <Link component={RouterLink} to={`/governance/manageDelegation?to=${delegate?.address}`}>
              <PrimaryButton>Delegate voting power</PrimaryButton>
            </Link>
          </Box>
        </Box>
        <Box overflow="scroll" bgcolor={theme.colors.gray[700]} borderRadius={"10px"} px="30px" py="20px" mt="33px">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Proposal</TableCell>
                  <TableCell>Vote</TableCell>
                  <TableCell align="right"></TableCell>
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
                    <TableRow key={vote.proposalId} hover style={{ cursor: "pointer" }}>
                      <TableCell
                        onClick={() => {
                          navigate(`/governance/proposals/${vote.proposalId}`);
                        }}
                      >
                        {proposalTitle(vote.proposalId)}
                      </TableCell>
                      <TableCell
                        onClick={() => {
                          navigate(`/governance/proposals/${vote.proposalId}`);
                        }}
                      >
                        {vote.support === 1 ? (
                          <Typography color="success.main">For</Typography>
                        ) : vote.support === 0 ? (
                          <Typography color="error.main">Against</Typography>
                        ) : vote.support === 2 ? (
                          "Abstain"
                        ) : (
                          ""
                        )}
                      </TableCell>
                      <TableCell
                        onClick={() => {
                          navigate(`/governance/proposals/${vote.proposalId}`);
                        }}
                      >
                        <Box
                          display="flex"
                          flexDirection="row"
                          alignItems="center"
                          gap={1}
                          color={theme.colors.primary[300]}
                          fontWeight={600}
                        >
                          <span>View Proposal</span>
                          <Icon name="arrow-up-right" sx={{ fontSize: "9px" }} />{" "}
                        </Box>
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
