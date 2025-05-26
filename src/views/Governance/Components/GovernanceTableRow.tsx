import { Box, Tooltip, Typography, useTheme } from "@mui/material";
import { PrimaryButton, SecondaryButton } from "@olympusdao/component-library";
import { ethers } from "ethers";
import { truncateEthereumAddress } from "src/helpers/truncateAddress";
import { DelegateVotingState } from "src/views/Governance/Delegation/manage";
import { useDelegateVoting } from "src/views/Governance/hooks/useDelegateVoting";

export const GovernanceTableRow = ({
  tokenName,
  delegationAddress,
  delegatorAddress,
  setDelegateVoting,
  balance,
  address,
}: {
  tokenName: string;
  delegationAddress?: string;
  delegatorAddress: string;
  setDelegateVoting: React.Dispatch<React.SetStateAction<DelegateVotingState | undefined>>;
  balance?: string;
  address: string;
}) => {
  const delegateVoting = useDelegateVoting();
  const theme = useTheme();

  return (
    <div>
      <Typography fontWeight="600" fontSize="18px" mb="3px">
        {tokenName}
      </Typography>
      <Box display="flex" flexDirection="column" bgcolor={theme.colors.gray[700]} padding="20px" borderRadius={"10px"}>
        <Tooltip title={address}>
          <Typography sx={{ color: theme.colors.gray["40"] }}>
            <>{truncateEthereumAddress(address, 9)}</>
          </Typography>
        </Tooltip>
        <Box display="flex" gap="3px" justifyContent={"space-between"}>
          <Typography>Balance </Typography>
          <Typography fontWeight="600">{Number(balance || 0).toFixed(2)} gOHM</Typography>
        </Box>
        <Tooltip title={delegationAddress ? `Delegated to ${delegationAddress} ` : "Undelegated"}>
          <Box display="flex" gap="3px" justifyContent={"space-between"}>
            <Typography>Status</Typography>
            <Typography fontWeight="600">{delegationAddress ? "Delegated" : "Undelegated"}</Typography>
          </Box>
        </Tooltip>
        <Box display="flex" gap="3px" mt="18px" justifyContent={"flex-end"}>
          {delegationAddress && (
            <SecondaryButton
              disabled={delegateVoting.isLoading}
              onClick={() => {
                delegateVoting.mutate({ address: delegatorAddress, delegationAddress: ethers.constants.AddressZero });
              }}
              loading={delegateVoting.isLoading && !delegationAddress}
            >
              Revoke Delegation
            </SecondaryButton>
          )}
          <Box>
            <PrimaryButton
              onClick={() => setDelegateVoting({ currentDelegatedToAddress: delegationAddress, delegatorAddress })}
            >
              Delegate
            </PrimaryButton>
          </Box>
        </Box>
      </Box>
    </div>
  );
};
