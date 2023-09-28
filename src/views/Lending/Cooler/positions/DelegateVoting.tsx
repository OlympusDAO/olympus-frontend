import { Box, Link, SvgIcon } from "@mui/material";
import { Input, Modal, PrimaryButton } from "@olympusdao/component-library";
import { ethers } from "ethers";
import { useState } from "react";
import { ReactComponent as lendAndBorrowIcon } from "src/assets/icons/lendAndBorrow.svg";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { useDelegateVoting } from "src/views/Lending/Cooler/hooks/useDelegateVoting";
import { useNetwork } from "wagmi";

export const DelegateVoting = ({
  coolerAddress,
  open,
  setOpen,
  currentDelegateAddress,
}: {
  coolerAddress?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  currentDelegateAddress?: string;
}) => {
  const [delegationAddress, setDelegationAddress] = useState("");
  const delegateVoting = useDelegateVoting();
  const client = useNetwork();

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
        setOpen(false);
      }}
    >
      {coolerAddress ? (
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
            <PrimaryButton
              fullWidth
              disabled={delegateVoting.isLoading || !delegationAddress}
              onClick={() => {
                delegateVoting.mutate(
                  { coolerAddress, delegationAddress },
                  {
                    onSuccess: () => {
                      setDelegationAddress("");
                      setOpen(false);
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
                    { coolerAddress, delegationAddress: ethers.constants.AddressZero },
                    {
                      onSuccess: () => {
                        setOpen(false);
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
