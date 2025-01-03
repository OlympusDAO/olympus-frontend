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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "src/components/PageTitle";
import { DelegateRow } from "src/views/Governance/Delegation/DelegateRow";
import { DelegateVotingModal } from "src/views/Governance/Delegation/DelegateVotingModal";
import { useGetDelegates } from "src/views/Governance/hooks/useGetDelegates";

export const DelegatesView = () => {
  const { data: delegates, isLoading } = useGetDelegates();
  const navigate = useNavigate();
  const [delegateVoting, setDelegateVoting] = useState<
    { delegatorAddress: string; currentDelegatedToAddress?: string } | undefined
  >(undefined);

  return (
    <div>
      <PageTitle name="Delegation" />
      <Box width="97%" maxWidth="974px">
        <Box overflow="scroll" borderRadius="10px" px="30px" py="20px">
          <Typography variant="h4" gutterBottom>
            Active Delegates
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Delegate Address</TableCell>
                  <TableCell align="right">Voting Power</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {delegates?.map(delegate => (
                  <DelegateRow
                    key={delegate.id}
                    delegate={delegate}
                    onClick={() => navigate(`/governance/delegate/${delegate.id}`)}
                    onDelegateClick={() => setDelegateVoting({ delegatorAddress: delegate.id })}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {isLoading && <Typography textAlign="center">Loading delegates...</Typography>}
          {!isLoading && delegates?.length === 0 && <Typography textAlign="center">No delegates found</Typography>}
        </Box>
      </Box>
      <DelegateVotingModal
        address={delegateVoting?.delegatorAddress}
        open={Boolean(delegateVoting)}
        setOpen={setDelegateVoting}
        currentDelegateAddress={delegateVoting?.currentDelegatedToAddress}
        initialDelegationAddress={delegateVoting?.delegatorAddress}
      />
    </div>
  );
};
