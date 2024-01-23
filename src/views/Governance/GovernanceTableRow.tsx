import { Box, TableCell, TableRow } from "@mui/material";
import { PrimaryButton } from "@olympusdao/component-library";
import { ethers } from "ethers";
import { truncateEthereumAddress } from "src/helpers/truncateAddress";
import { useDelegateVoting } from "src/views/Governance/hooks/useDelegateVoting";

export const GovernanceTableRow = ({
  tokenName,
  delegationAddress,
  delegatorAddress,
  setDelegateVoting,
  balance,
}: {
  tokenName: string;
  delegationAddress?: string;
  delegatorAddress: string;
  setDelegateVoting: React.Dispatch<
    React.SetStateAction<
      | {
          delegatorAddress: string;
          currentDelegatedToAddress?: string;
        }
      | undefined
    >
  >;
  balance?: string;
}) => {
  const delegateVoting = useDelegateVoting();

  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell component="th" scope="row" sx={{ padding: "9px" }}>
        {tokenName}
      </TableCell>
      <TableCell align="right" sx={{ padding: "9px" }}>
        {Number(balance || 0).toFixed(2)} gOHM
      </TableCell>
      <TableCell align="right" sx={{ padding: "9px" }}>
        {delegationAddress ? `Delegated to ${truncateEthereumAddress(delegationAddress)} ` : "Undelegated"}
      </TableCell>

      <TableCell align="right" sx={{ padding: "9px" }}>
        <Box display="flex" flexDirection="row" justifyContent="flex-end" gap="8px">
          <Box flexGrow={1}>
            <PrimaryButton
              onClick={() => setDelegateVoting({ currentDelegatedToAddress: delegationAddress, delegatorAddress })}
            >
              Delegate
            </PrimaryButton>
          </Box>
          {delegationAddress && (
            <PrimaryButton
              fullWidth
              disabled={delegateVoting.isLoading}
              onClick={() => {
                delegateVoting.mutate({ address: delegatorAddress, delegationAddress: ethers.constants.AddressZero });
              }}
              loading={delegateVoting.isLoading && !delegationAddress}
            >
              Revoke
            </PrimaryButton>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
};
