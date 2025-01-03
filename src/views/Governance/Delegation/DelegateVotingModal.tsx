import { Box, Link, SvgIcon } from "@mui/material";
import { Input, Modal, PrimaryButton, SecondaryButton } from "@olympusdao/component-library";
import { ethers } from "ethers";
import { useState } from "react";
import lendAndBorrowIcon from "src/assets/icons/lendAndBorrow.svg?react";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { useDelegateVoting } from "src/views/Governance/hooks/useDelegateVoting";
import { useNetwork } from "wagmi";

export const DelegateVotingModal = ({
  address,
  open,
  setOpen,
  currentDelegateAddress,
  currentWalletAddress,
  initialDelegationAddress,
}: {
  address?: string;
  open: boolean;
  setOpen: React.Dispatch<
    React.SetStateAction<
      | {
          delegatorAddress: string;
          currentDelegatedToAddress?: string;
        }
      | undefined
    >
  >;
  currentDelegateAddress?: string;
  currentWalletAddress?: string;
  initialDelegationAddress?: string;
}) => {
  const [delegationAddress, setDelegationAddress] = useState(initialDelegationAddress || "");
  const delegateVoting = useDelegateVoting();
  const client = useNetwork();

  console.log(delegationAddress, "yes", initialDelegationAddress);
  return (
    <Modal
      maxWidth="476px"
      minHeight="200px"
      open={open}
      headerContent={
        <Box display="flex" alignItems="center" gap="6px">
          <SvgIcon component={lendAndBorrowIcon} /> <Box fontWeight="500">Delegate Voting</Box>
        </Box>
      }
      onClose={() => {
        setDelegationAddress("");
        setOpen(undefined);
      }}
    >
      {address ? (
        <>
          <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center"></Box>
          {currentDelegateAddress && (
            <Box fontSize="14px">
              Currently Delegated to:{" "}
              <Link
                href={`${client.chain?.blockExplorers?.default.url}/address/${currentDelegateAddress}`}
                target="_blank"
              >
                {currentDelegateAddress}
              </Link>
            </Box>
          )}
          <Box mt={"16px"} mb="16px">
            <Input
              id="delegateAddress"
              placeholder="Address"
              value={delegationAddress}
              onChange={e => {
                setDelegationAddress(e.target.value);
              }}
            />
          </Box>

          <WalletConnectedGuard fullWidth>
            <SecondaryButton
              fullWidth
              onClick={() => {
                currentWalletAddress && setDelegationAddress(currentWalletAddress);
              }}
            >
              Set to My Wallet
            </SecondaryButton>
            <PrimaryButton
              fullWidth
              disabled={delegateVoting.isLoading || !delegationAddress}
              onClick={() => {
                delegateVoting.mutate(
                  { address, delegationAddress },
                  {
                    onSuccess: () => {
                      setDelegationAddress("");
                      setOpen(undefined);
                    },
                  },
                );
              }}
              loading={delegateVoting.isLoading && delegationAddress}
            >
              Delegate Voting
            </PrimaryButton>
            {currentDelegateAddress && (
              <PrimaryButton
                fullWidth
                disabled={delegateVoting.isLoading || delegationAddress}
                onClick={() => {
                  delegateVoting.mutate(
                    { address, delegationAddress: ethers.constants.AddressZero },
                    {
                      onSuccess: () => {
                        setOpen(undefined);
                      },
                    },
                  );
                }}
                loading={delegateVoting.isLoading && !delegationAddress}
              >
                Revoke Delegation
              </PrimaryButton>
            )}
          </WalletConnectedGuard>
        </>
      ) : (
        <></>
      )}
    </Modal>
  );
};
