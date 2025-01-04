import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  InputAdornment,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { PrimaryButton } from "@olympusdao/component-library";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import PageTitle from "src/components/PageTitle";
import { GovernanceNavigation } from "src/views/Governance/Components/GovernanceNavigation";
import { DelegateRow } from "src/views/Governance/Delegation/DelegateRow";
import { DelegationMessage } from "src/views/Governance/Delegation/DelegationMessage";
import { useGetDelegates } from "src/views/Governance/hooks/useGetDelegates";

export const Delegate = () => {
  const { data: delegates, isLoading } = useGetDelegates();
  const navigate = useNavigate();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDelegates = delegates?.filter(delegate =>
    delegate.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div id="stake-view">
      <PageTitle name="Delegation" />
      <Box width="100%" maxWidth="974px">
        <DelegationMessage />
        <GovernanceNavigation />
        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" justifyContent="flex-end" mb="9px">
            <Link component={RouterLink} to="/governance/manageDelegation">
              <PrimaryButton>Manage Voting Delegation</PrimaryButton>
            </Link>
          </Box>

          <TextField
            placeholder="Search Address"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            size="small"
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                backgroundColor: theme.colors.gray[700],
                borderRadius: "6px",
                "& fieldset": {
                  border: "none",
                },
                "&:hover fieldset": {
                  border: "none",
                },
                "&.Mui-focused fieldset": {
                  border: "none",
                },
              },
              "& .MuiOutlinedInput-input": {
                color: theme.palette.text.primary,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.colors.gray["500"] }} />
                </InputAdornment>
              ),
            }}
          />

          <Box overflow="scroll" borderRadius="10px">
            <Box overflow="scroll" bgcolor={theme.colors.gray[700]} borderRadius={"10px"} px="30px" py="20px">
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
                    {filteredDelegates?.map(delegate => (
                      <DelegateRow
                        key={delegate.id}
                        delegate={delegate}
                        onClick={() => navigate(`/governance/delegate/${delegate.id}`)}
                        onDelegateClick={() => navigate(`/governance/manageDelegation?to=${delegate.id}`)}
                      />
                    ))}
                    {!isLoading && filteredDelegates?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Typography textAlign="center">
                            {searchQuery ? "No delegates found matching your search" : "No delegates found"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            {isLoading && <Typography textAlign="center">Loading delegates...</Typography>}
          </Box>
        </Box>
      </Box>
    </div>
  );
};
