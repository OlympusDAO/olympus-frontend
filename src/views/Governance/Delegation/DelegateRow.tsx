import { TableCell, TableRow, Tooltip, Typography } from "@mui/material";
import { SecondaryButton } from "@olympusdao/component-library";
import { truncateEthereumAddress } from "src/helpers/truncateAddress";
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
      <TableCell onClick={onClick}>
        <Tooltip title={delegate.id}>
          <>{ensName || truncateEthereumAddress(delegate.id, 10)}</>
        </Tooltip>
      </TableCell>
      <TableCell align="right" onClick={onClick}>
        {Number(delegate.latestVotingPowerSnapshot.votingPower).toFixed(2) || "0"} gOHM
      </TableCell>
      <TableCell align="right">
        <Typography fontWeight={600}>{delegate.delegators.length}</Typography>
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
