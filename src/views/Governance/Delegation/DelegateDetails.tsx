import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import PageTitle from "src/components/PageTitle";
import { useGetDelegate } from "src/views/Governance/hooks/useGetDelegate";

export const DelegateDetails = () => {
  const { id } = useParams();
  const { data: delegate, isLoading } = useGetDelegate({ id: id || "" });

  return (
    <div>
      <PageTitle name={`Delegate ${id?.slice(0, 6)}...${id?.slice(-4)}`} />
      <Box width="97%" maxWidth="974px">
        <Box display="flex" gap={2} mb={4}>
          <Paper sx={{ p: 3, flex: 1 }}>
            <Typography variant="h6">Voting Power</Typography>
            <Typography variant="h4">{Number(delegate?.latestVotingPowerSnapshot.votingPower).toFixed(2)}</Typography>
          </Paper>
          <Paper sx={{ p: 3, flex: 1 }}>
            <Typography variant="h6">Vote Participation</Typography>
            <Typography variant="h4">{delegate?.votesCasted.length}</Typography>
          </Paper>
        </Box>

        <Typography variant="h5" gutterBottom>
          Voting History
        </Typography>
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
              {delegate?.votesCasted.map(vote => (
                <TableRow key={vote.proposalId}>
                  <TableCell>{vote.proposalId}</TableCell>
                  <TableCell>
                    {vote.support === 1 ? "For" : vote.support === 0 ? "Against" : vote.support === 2 ? "Abstain" : ""}
                  </TableCell>
                  {/* <TableCell align="right">{Number(vote).toFixed(2)}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};
