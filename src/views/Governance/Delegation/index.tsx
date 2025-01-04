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
import { PrimaryButton } from "@olympusdao/component-library";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import PageTitle from "src/components/PageTitle";
import { GovernanceNavigation } from "src/views/Governance/Components/GovernanceNavigation";
import { DelegateRow } from "src/views/Governance/Delegation/DelegateRow";
import { DelegationMessage } from "src/views/Governance/Delegation/DelegationMessage";
import { useGetDelegates } from "src/views/Governance/hooks/useGetDelegates";
import { useGetVotingWeight } from "src/views/Governance/hooks/useGetVotingWeight";

export const Delegate = () => {
  const { data: delegates, isLoading } = useGetDelegates();
  const navigate = useNavigate();
  const { data: currentVotingWeight } = useGetVotingWeight({});
  const theme = useTheme();
  return (
    <div id="stake-view">
      <PageTitle name="Delegation" />

      <Box width="97%" maxWidth="974px">
        <DelegationMessage />
        <GovernanceNavigation />
        <Metric label="Current Voting Power" metric={`${Number(currentVotingWeight || 0).toFixed(2)} gOHM`} />
        <Box display="flex" justifyContent="right">
          <Link component={RouterLink} to="/governance/manageDelegation">
            <PrimaryButton>Manage Voting Delegation</PrimaryButton>
          </Link>
        </Box>
        <Box overflow="scroll" borderRadius="10px" px="30px" py="20px">
          <Box overflow="scroll" bgcolor={theme.colors["paper"].card} borderRadius={"10px"} px="30px" py="20px">
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Delegate Address</TableCell>
                    <TableCell align="right">Voting Power</TableCell>
                    <TableCell align="right">Delegations</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {delegates?.map(delegate => (
                    <DelegateRow
                      key={delegate.id}
                      delegate={delegate}
                      onClick={() => navigate(`/governance/delegate/${delegate.id}`)}
                      onDelegateClick={() => navigate(`/governance/manageDelegation?to=${delegate.id}`)}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          {isLoading && <Typography textAlign="center">Loading delegates...</Typography>}
          {!isLoading && delegates?.length === 0 && <Typography textAlign="center">No delegates found</Typography>}
        </Box>
      </Box>
    </div>
  );
};
