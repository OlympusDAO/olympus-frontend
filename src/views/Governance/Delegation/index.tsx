import { Box } from "@mui/material";
import { Modal } from "@olympusdao/component-library";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InPageConnectButton } from "src/components/ConnectButton/ConnectButton";
import { GOHM_ADDRESSES } from "src/constants/addresses";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { GovernanceTableRow } from "src/views/Governance/Components/GovernanceTableRow";
import { DelegateVotingModal } from "src/views/Governance/Delegation/DelegateVotingModal";
import { useGovernanceDelegationCheck } from "src/views/Governance/hooks/useGovernanceDelegationCheck";
import { useAccount } from "wagmi";

export const Delegate = () => {
  const { address, isConnected } = useAccount();
  const networks = useTestableNetworks();
  const {
    gOHMDelegationAddress,
    coolerV1DelegationAddress,
    coolerV2DelegationAddress,
    gohmBalance,
    gohmCoolerV1Balance,
    gohmCoolerV2Balance,
    coolerAddressV1,
    coolerAddressV2,
  } = useGovernanceDelegationCheck();
  const navigate = useNavigate();

  const [delegateVoting, setDelegateVoting] = useState<
    { delegatorAddress: string; currentDelegatedToAddress?: string } | undefined
  >(undefined);
  return (
    <Modal
      open={true}
      closePosition="right"
      headerText="Delegate Voting"
      onClose={() => navigate("/governance")}
      maxWidth="450px"
      minHeight="300px"
    >
      <>
        {!isConnected ? (
          <Box mt="48px">
            <div className="stake-wallet-notification">
              <InPageConnectButton buttonText="Connect to Delegate Voting" />
            </div>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap="18px">
            {address && (
              <GovernanceTableRow
                tokenName={`Wallet`}
                delegatorAddress={GOHM_ADDRESSES[networks.MAINNET]}
                delegationAddress={gOHMDelegationAddress}
                setDelegateVoting={setDelegateVoting}
                balance={gohmBalance?.formatted}
                address={address}
              />
            )}
            {coolerAddressV1 && (
              <GovernanceTableRow
                delegatorAddress={coolerAddressV1}
                tokenName={`Cooler Clearinghouse V1`}
                setDelegateVoting={setDelegateVoting}
                delegationAddress={coolerV1DelegationAddress}
                balance={gohmCoolerV1Balance?.formatted}
                address={coolerAddressV1}
              />
            )}
            {coolerAddressV2 && (
              <GovernanceTableRow
                delegatorAddress={coolerAddressV2}
                tokenName={`Cooler Clearinghouse V2`}
                setDelegateVoting={setDelegateVoting}
                delegationAddress={coolerV2DelegationAddress}
                balance={gohmCoolerV2Balance?.formatted}
                address={coolerAddressV2}
              />
            )}
            <DelegateVotingModal
              address={delegateVoting?.delegatorAddress}
              open={Boolean(delegateVoting)}
              setOpen={setDelegateVoting}
              currentDelegateAddress={delegateVoting?.currentDelegatedToAddress}
              currentWalletAddress={address}
            />
          </Box>
        )}
      </>
    </Modal>
  );
};
