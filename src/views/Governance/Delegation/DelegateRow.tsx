import { TableCell, TableRow } from "@mui/material";
import { SecondaryButton } from "@olympusdao/component-library";
import { Voter } from "src/views/Governance/hooks/useGetDelegates";
import { useEnsName } from "wagmi";

export const DelegateRow = ({
  delegate,
  onClick,
  onDelegateClick,
}: {
  delegate: Voter;
  onClick: () => void;
  onDelegateClick: () => void;
}) => {
  const { data: ensName } = useEnsName({ address: delegate.address as `0x${string}` });

  return (
    <TableRow hover style={{ cursor: "pointer" }}>
      <TableCell onClick={onClick}>{ensName || delegate.id}</TableCell>
      <TableCell align="right" onClick={onClick}>
        {Number(delegate.latestVotingPowerSnapshot.votingPower).toFixed(4) || "0"} gOHM
      </TableCell>
      <TableCell align="right">{delegate.delegators.length}</TableCell>
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
