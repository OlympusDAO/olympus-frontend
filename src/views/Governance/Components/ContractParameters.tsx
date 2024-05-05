import { Box, Grid, Link, Typography } from "@mui/material";
import { Accordion } from "@olympusdao/component-library";
import { Link as RouterLink } from "react-router-dom";
import { formatNumber } from "src/helpers";
import { useGetContractParameters } from "src/views/Governance/hooks/useGetContractParameters";

export const ContractParameters = () => {
  const { data: parameters } = useGetContractParameters();
  return (
    <>
      <Accordion
        title="Contract Parameters"
        summary={
          <Box display="flex" alignItems="center" height="60px">
            <Typography fontWeight={600} fontSize="18px">
              Contract Parameters
            </Typography>
          </Box>
        }
        defaultExpanded={false}
      >
        {parameters ? (
          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Box display="flex" flexDirection="column" gap="9px">
                <Typography fontWeight={600} fontSize="18px">
                  Parameters
                </Typography>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontWeight={600}>Proposal Creation Threshold:</Typography>
                  <Typography>{formatNumber(Number(parameters.proposalThreshold), 4)} gOHM</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontWeight={600}>Proposal Approval Threshold:</Typography>
                  <Typography>{parameters.proposalApprovalThreshold}%</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontWeight={600}>Quorum Needed:</Typography>
                  <Typography>{formatNumber(Number(parameters.proposalQuorum), 4)} gOHM</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontWeight={600}>Proposal Delay:</Typography>
                  <Typography>{parameters?.votingDelay}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontWeight={600}>Timelock Delay:</Typography>
                  <Typography>{parameters?.executionDelay}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontWeight={600}>Execution Grace Period:</Typography>
                  <Typography>{parameters?.activationGracePeriod}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontWeight={600}>Voting Period:</Typography>
                  <Typography>{parameters?.votingPeriod}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Box display="flex" flexDirection="column" gap="9px">
                <Typography fontWeight={600} fontSize="18px">
                  Contract Addresses
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography fontWeight={600}>Timelock Contract:</Typography>
                  <Link
                    component={RouterLink}
                    to={`https://etherscan.io/address/${parameters?.timelockContract}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Typography>{parameters?.timelockContract}</Typography>
                  </Link>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography fontWeight={600}>Governance Contract:</Typography>
                  <Link
                    component={RouterLink}
                    to={`https://etherscan.io/address/${parameters?.governanceContract}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Typography>{parameters?.governanceContract}</Typography>
                  </Link>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography fontWeight={600}>gOHM Contract:</Typography>
                  <Link
                    component={RouterLink}
                    to={`https://etherscan.io/address/${parameters?.gohmContract}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Typography>{parameters?.gohmContract}</Typography>
                  </Link>
                </Box>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <></>
        )}
      </Accordion>
    </>
  );
};
