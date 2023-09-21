import { Box, SvgIcon } from "@mui/material";
import { Input, Modal, PrimaryButton } from "@olympusdao/component-library";
import { useState } from "react";
import { ReactComponent as lendAndBorrowIcon } from "src/assets/icons/lendAndBorrow.svg";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { useDelegateVoting } from "src/views/Lending/Cooler/hooks/useDelegateVoting";

export const DelegateVoting = ({
  coolerAddress,
  open,
  setOpen,
}: {
  coolerAddress?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [delegationAddress, setDelegationAddress] = useState("");
  const delegateVoting = useDelegateVoting();

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
      onClose={() => setOpen(false)}
    >
      {coolerAddress ? (
        <>
          <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center"></Box>
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
              disabled={delegateVoting.isLoading}
              onClick={() => {
                delegateVoting.mutate(
                  { coolerAddress, delegationAddress },
                  {
                    onSuccess: () => {
                      setOpen(false);
                    },
                  },
                );
              }}
              loading={delegateVoting.isLoading}
            >
              Delegate Voting
            </PrimaryButton>
          </WalletConnectedGuard>
        </>
      ) : (
        <></>
      )}
    </Modal>
  );
};
