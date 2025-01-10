import { TableCell, TableRow, Typography } from "@mui/material";
import { SecondaryButton } from "@olympusdao/component-library";
import { Voter } from "src/views/Governance/hooks/useGetDelegates";
import { useEnsName } from "wagmi";

export const DelegateRow = ({
  delegate,
  quorum,
  onClick,
  onDelegateClick,
}: {
  delegate: Voter;
  quorum?: number;
  onClick: () => void;
  onDelegateClick: () => void;
}) => {
  const { data: ensName } = useEnsName({ address: delegate.address as `0x${string}` });

  return (
    <TableRow hover style={{ cursor: "pointer" }}>
      <TableCell onClick={onClick}>
        <Typography fontWeight={600}>{ensName || delegate.id}</Typography>
      </TableCell>
      <TableCell align="right" onClick={onClick}>
        {Number(delegate.latestVotingPowerSnapshot.votingPower).toFixed(2) || "0"} gOHM
      </TableCell>
      <TableCell align="right">
        <Typography fontWeight={600}>{delegate.delegators.length}</Typography>
      </TableCell>

      <TableCell align="right">
        <Typography fontWeight={600}>
          {quorum && (Number(Number(delegate.latestVotingPowerSnapshot.votingPower) / quorum) * 100).toFixed(2)}%
        </Typography>
      </TableCell>

      <TableCell align="right">
        <SecondaryButton
          onClick={() => {
            onDelegateClick();
          }}
        >
          Delegate
        </SecondaryButton>
      </TableCell>
    </TableRow>
  );
};
