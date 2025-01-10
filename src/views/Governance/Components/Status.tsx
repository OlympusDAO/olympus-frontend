import { Box, Tooltip, Typography, useTheme } from "@mui/material";
import { useGetCanceledTime } from "src/views/Governance/hooks/useGetCanceledTime";
import { useGetExecutedTime } from "src/views/Governance/hooks/useGetExecutedTime";
import { useGetProposalDetails } from "src/views/Governance/hooks/useGetProposalDetails";
import { useGetProposalFromSubgraph } from "src/views/Governance/hooks/useGetProposalFromSubgraph";
import { useGetQueuedTime } from "src/views/Governance/hooks/useGetQueuedTime";
import { useGetVetoedTime } from "src/views/Governance/hooks/useGetVetoedTime";

export const Status = ({ proposalId }: { proposalId: number }) => {
  const { data: proposal } = useGetProposalFromSubgraph({ proposalId: proposalId.toString() });
  const { data: proposalDetails } = useGetProposalDetails({ proposalId });
  const { data: queueTime } = useGetQueuedTime({ proposalId });
  const { data: executedTime } = useGetExecutedTime({ proposalId, status: proposalDetails?.status });
  const { data: canceledTime } = useGetCanceledTime({ proposalId, status: proposalDetails?.status });
  const { data: vetoedTime } = useGetVetoedTime({ proposalId, status: proposalDetails?.status });

  //end date plus 7 days
  const placeholderEndDate = proposalDetails?.startDate && new Date(proposalDetails?.startDate);

  placeholderEndDate?.setDate(placeholderEndDate.getDate() + 7);
  const theme = useTheme();
  return (
    <Box bgcolor={theme.colors.gray[700]} borderRadius={"10px"} px="30px" py="20px">
      <Typography fontSize="21px" fontWeight={600} mb="15px">
        Timeline
      </Typography>
      <Box display="flex" flexDirection="column" gap="15px">
        <div>
          <Typography fontSize="12px">{proposal?.createdAtBlock?.toLocaleString()}</Typography>
          <Typography fontWeight="500">Published Onchain</Typography>
        </div>
        <Tooltip title={`Block ${proposalDetails?.startBlock}`}>
          <div>
            <Typography fontSize="12px">{proposalDetails?.startDate?.toLocaleString()}</Typography>
            <Typography fontWeight="500">Voting Period Starts</Typography>
          </div>
        </Tooltip>
        {(proposalDetails?.endDate || placeholderEndDate) && (
          <Tooltip title={`Block ${proposalDetails.endBlock}`}>
            <div>
              <Typography fontSize="12px">
                {proposalDetails.endDate
                  ? proposalDetails?.endDate?.toLocaleString()
                  : placeholderEndDate?.toLocaleString()}
              </Typography>
              <Typography fontWeight="500">Voting Period Ends </Typography>
            </div>
          </Tooltip>
        )}
        {proposalDetails?.status === "Queued" && (
          <>
            {queueTime?.createdAtDate && (
              <div>
                <Typography fontSize="12px">{queueTime.createdAtDate.toLocaleString()}</Typography>
                <Typography fontWeight="500">Queued for Execution</Typography>
              </div>
            )}
            {proposalDetails.etaDate && (
              <div>
                <Typography fontSize="12px">{proposalDetails.etaDate.toLocaleString()}</Typography>
                <Typography fontWeight="500">Estimated Execution Time</Typography>
              </div>
            )}
          </>
        )}
        {proposalDetails?.status === "Expired" && (
          <>
            {queueTime?.createdAtDate && (
              <div>
                <Typography fontSize="12px">{queueTime.createdAtDate.toLocaleString()}</Typography>
                <Typography fontWeight="500">Queued for Execution</Typography>
              </div>
            )}
            {proposalDetails.etaDate && (
              <div>
                <Typography fontSize="12px">{proposalDetails.etaDate.toLocaleString()}</Typography>
                <Typography fontWeight="500">Execution Expired</Typography>
              </div>
            )}
          </>
        )}
        {proposalDetails?.status === "Executed" && (
          <>
            {queueTime?.createdAtDate && (
              <div>
                <Typography fontSize="12px">{queueTime.createdAtDate.toLocaleString()}</Typography>
                <Typography fontWeight="500">Queued for Execution</Typography>
              </div>
            )}
            {executedTime?.createdAtDate && (
              <div>
                <Typography fontSize="12px">{executedTime.createdAtDate.toLocaleString()}</Typography>
                <Typography fontWeight="500">Executed</Typography>
              </div>
            )}
          </>
        )}
        {proposalDetails?.status === "Canceled" && (
          <>
            {canceledTime?.createdAtDate && (
              <div>
                <Typography fontSize="12px">{canceledTime.createdAtDate.toLocaleString()}</Typography>
                <Typography fontWeight="500">Proposal Canceled</Typography>
              </div>
            )}
          </>
        )}
        {proposalDetails?.status === "Vetoed" && (
          <>
            {vetoedTime?.createdAtDate && (
              <div>
                <Typography fontSize="12px">{vetoedTime.createdAtDate.toLocaleString()}</Typography>
                <Typography fontWeight="500">Proposal Vetoed</Typography>
              </div>
            )}
          </>
        )}
        {proposalDetails?.status === "Defeated" && (
          <>
            {(proposalDetails?.endDate || placeholderEndDate) && (
              <div>
                <Typography fontSize="12px">
                  {proposalDetails.endDate
                    ? proposalDetails?.endDate?.toLocaleString()
                    : placeholderEndDate?.toLocaleString()}
                </Typography>
                <Typography fontWeight="500">Proposal Defeated</Typography>
              </div>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};
