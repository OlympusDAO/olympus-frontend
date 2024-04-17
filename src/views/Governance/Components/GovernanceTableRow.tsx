import { Box, Tooltip, Typography, useTheme } from "@mui/material";
import { PrimaryButton, SecondaryButton } from "@olympusdao/component-library";
import { ethers } from "ethers";
import { truncateEthereumAddress } from "src/helpers/truncateAddress";
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
  address: string;
}) => {
  const delegateVoting = useDelegateVoting();
  const theme = useTheme();

  return (
    <Box display="flex" flexDirection="column" bgcolor={theme.colors.paper.card} padding="20px" borderRadius={"10px"}>
      <Typography fontWeight="600" fontSize="18px">
        {tokenName}
      </Typography>{" "}
      <Tooltip title={address}>
        <Typography sx={{ color: theme.colors.gray["40"] }}>
          <>{truncateEthereumAddress(address, 9)}</>
        </Typography>
      </Tooltip>
      <Box display="flex" gap="3px">
        <Typography fontWeight="600">Balance: </Typography>
        {Number(balance || 0).toFixed(2)} gOHM
      </Box>
      <Tooltip title={delegationAddress ? `Delegated to ${delegationAddress} ` : "Undelegated"}>
        <Box display="flex" gap="3px">
          <Typography fontWeight="600">Status:</Typography>
          {delegationAddress ? "Delegated" : "Undelegated"}
        </Box>
      </Tooltip>
      <Box display="flex" gap="3px" mt="18px">
        <Box>
          <PrimaryButton
            onClick={() => setDelegateVoting({ currentDelegatedToAddress: delegationAddress, delegatorAddress })}
          >
            Delegate
          </PrimaryButton>
        </Box>
        {delegationAddress && (
          <SecondaryButton
            disabled={delegateVoting.isLoading}
            onClick={() => {
              delegateVoting.mutate({ address: delegatorAddress, delegationAddress: ethers.constants.AddressZero });
            }}
            loading={delegateVoting.isLoading && !delegationAddress}
          >
            Revoke
          </SecondaryButton>
        )}
      </Box>
    </Box>
  );
};
