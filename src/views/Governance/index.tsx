import { Box, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { PrimaryButton } from "@olympusdao/component-library";
import { Link as RouterLink } from "react-router-dom";
import PageTitle from "src/components/PageTitle";
import { ContractParameters } from "src/views/Governance/Components/ContractParameters";
import { ProposalContainer } from "src/views/Governance/Components/ProposalContainer";
import { DelegationMessage } from "src/views/Governance/Delegation/DelegationMessage";
import { GovernanceDevTools } from "src/views/Governance/hooks/dev/GovernanceDevTools";
import { useGetProposals } from "src/views/Governance/hooks/useGetProposals";

export const Governance = () => {
  const { data: proposals } = useGetProposals();
  return (
    <div id="stake-view">
      <PageTitle name="Governance" />
      <Box width="97%" maxWidth="974px">
        <GovernanceDevTools />
        <DelegationMessage />
        <Box display="flex" justifyContent="right">
          <Link component={RouterLink} to="/governance/delegate">
            <PrimaryButton>My Voting Power </PrimaryButton>
          </Link>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: "15px", padding: "9px" }}>Proposal</TableCell>
                <TableCell sx={{ fontSize: "15px", padding: "9px", width: "126px" }}>Votes for</TableCell>
                <TableCell sx={{ fontSize: "15px", padding: "9px", width: "126px" }}>Votes against</TableCell>
                <TableCell sx={{ fontSize: "15px", padding: "9px" }} align="right">
                  Total votes
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proposals?.map((item, index) => {
                return (
                  <ProposalContainer
                    key={index}
                    proposalId={Number(item?.details.id)}
                    title={item?.details.description}
                    createdAt={item?.createdAtBlock}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <ContractParameters />
      </Box>
    </div>
  );
};
