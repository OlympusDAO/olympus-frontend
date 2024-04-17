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
import { Metric, PrimaryButton } from "@olympusdao/component-library";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import PageTitle from "src/components/PageTitle";
import { ContractParameters } from "src/views/Governance/Components/ContractParameters";
import { ProposalContainer } from "src/views/Governance/Components/ProposalContainer";
import { DelegationMessage } from "src/views/Governance/Delegation/DelegationMessage";
import { GovernanceDevTools } from "src/views/Governance/hooks/dev/GovernanceDevTools";
import { useGetProposals } from "src/views/Governance/hooks/useGetProposals";
import { useGetVotingWeight } from "src/views/Governance/hooks/useGetVotingWeight";

export const Governance = () => {
  const { data: proposals } = useGetProposals();
  const { data: currentVotingWeight } = useGetVotingWeight({});
  const theme = useTheme();
  const [activeProposals, setActiveProposals] = useState<number[]>([]);
  const [pastProposals, setPastProposals] = useState<number[]>([]);
  const [pastProposalsLoading, setPastProposalsLoading] = useState<boolean>(true);
  const [activeProposalsLoading, setActiveProposalsLoading] = useState<boolean>(true);

  return (
    <div id="stake-view">
      <PageTitle name="Governance" />
      <Box width="97%" maxWidth="974px">
        <GovernanceDevTools />
        <DelegationMessage />
        <Metric label="Current Voting Power" metric={`${Number(currentVotingWeight).toFixed(2)} gOHM`} />
        <Box display="flex" justifyContent="right">
          <Link component={RouterLink} to="/governance/delegate">
            <PrimaryButton>Manage Voting Delegation</PrimaryButton>
          </Link>
        </Box>
        <Box overflow="scroll" bgcolor={theme.colors["paper"].card} borderRadius={"10px"} px="30px" py="20px" mt="33px">
          <Typography fontSize="21px" fontWeight="600">
            Upcoming & Active Proposals
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: "15px", padding: "9px" }}>Proposal</TableCell>
                  <TableCell sx={{ fontSize: "15px", padding: "9px" }} width="150px">
                    Approval
                  </TableCell>
                  <TableCell sx={{ fontSize: "15px", padding: "9px" }} width="150px">
                    Quorum
                  </TableCell>
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
                      active
                      setProposals={setActiveProposals}
                      proposals={activeProposals}
                      setIsLoading={setActiveProposalsLoading}
                      proposalsCount={proposals.length}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {activeProposals.length === 0 && !activeProposalsLoading ? (
            <Typography fontSize="21px" fontWeight="600" mt="21px" mb="21px" textAlign="center">
              No Upcoming or Active Proposals
            </Typography>
          ) : null}
        </Box>
        <Box overflow="scroll" bgcolor={theme.colors["paper"].card} borderRadius={"10px"} px="30px" py="20px" mt="66px">
          <Typography fontSize="21px" fontWeight="600">
            Past Proposals
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: "15px", padding: "9px" }}>Proposal</TableCell>
                  <TableCell sx={{ fontSize: "15px", padding: "9px" }} width="150px">
                    Approval
                  </TableCell>
                  <TableCell sx={{ fontSize: "15px", padding: "9px" }} width="150px">
                    Quorum
                  </TableCell>
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
                      setProposals={setPastProposals}
                      proposals={pastProposals}
                      setIsLoading={setActiveProposalsLoading}
                      proposalsCount={proposals.length}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {pastProposals.length === 0 && !activeProposalsLoading ? (
            <Typography fontSize="21px" fontWeight="600" mt="21px" mb="21px" textAlign="center">
              No Past Proposals
            </Typography>
          ) : null}
        </Box>
        <ContractParameters />
      </Box>
    </div>
  );
};
