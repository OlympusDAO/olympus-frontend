import { Box, LinearProgress, Typography, useTheme } from "@mui/material";
import { ProposalTabProps } from "src/views/Governance/interfaces";

export const StatusBar = ({ proposal }: ProposalTabProps) => {
  const theme = useTheme();
  const gold = theme.colors.primary[300];
  const gray = theme.colors.gray[40];

  const ProgressBarAndLabel = ({ label, active }: { label: string; active: boolean }) => {
    return (
      <>
        <LinearProgress variant="determinate" value={active ? 100 : 0} color={active ? "secondary" : "primary"} />
        <Typography variant="body2" sx={{ color: active ? gold : gray }}>
          {label}
        </Typography>
      </>
    );
  };

  return (
    <Box
      display="flex"
      flexDirection={"row"}
      sx={{ width: "100%", marginBottom: "5px" }}
      justifyContent="space-evenly"
      flexWrap={"wrap"}
    >
      <Box flexGrow={1} sx={{ paddingX: "2px" }}>
        <ProgressBarAndLabel label="Submitted" active={["discussion", "ready to activate"].includes(proposal.state)} />
      </Box>
      <Box flexGrow={1} sx={{ paddingX: "2px" }}>
        <ProgressBarAndLabel label="Voting" active={proposal.state === "active"} />
      </Box>
      {["closed", "expired activation", "expired execution"].includes(proposal.state) ? (
        <Box flexGrow={1} sx={{ paddingX: "2px" }}>
          <ProgressBarAndLabel
            label={
              proposal.state === "expired activation"
                ? `Expired Activation`
                : proposal.state === "expired execution"
                ? `Expired Execution`
                : `Closed`
            }
            active={true}
          />
        </Box>
      ) : (
        <>
          <Box flexGrow={1} sx={{ paddingX: "2px" }}>
            <ProgressBarAndLabel
              label="Awaiting Execution"
              active={["awaiting execution", "ready to execute"].includes(proposal.state)}
            />
          </Box>
          <Box flexGrow={1} sx={{ paddingX: "2px" }}>
            <ProgressBarAndLabel label="Executed" active={proposal.state === "executed"} />
          </Box>
        </>
      )}
    </Box>
  );
};
