import { Button, TableCell, TableRow } from "@mui/material";
import { Voter } from "src/views/Governance/hooks/useGetDelegates";

export const DelegateRow = ({
  delegate,
  onClick,
  onDelegateClick,
}: {
  delegate: Voter;
  onClick: () => void;
  onDelegateClick: () => void;
}) => {
  return (
    <TableRow hover style={{ cursor: "pointer" }}>
      <TableCell onClick={onClick}>{delegate.id}</TableCell>
      <TableCell align="right" onClick={onClick}>
        {delegate.latestVotingPowerSnapshot.votingPower || "0"}
      </TableCell>
      <TableCell align="right">
        <Button
          variant="contained"
          color="primary"
          onClick={e => {
            e.stopPropagation();
            onDelegateClick();
          }}
        >
          Delegate
        </Button>
      </TableCell>
    </TableRow>
  );
};
