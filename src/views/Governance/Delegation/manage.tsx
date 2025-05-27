import { Box, Typography, useTheme } from "@mui/material";
import { Modal } from "@olympusdao/component-library";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { InPageConnectButton } from "src/components/ConnectButton/ConnectButton";
import { GOHM_ADDRESSES } from "src/constants/addresses";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { CoolerV2GovernanceTableRow } from "src/views/Governance/Components/CoolerV2GovernanceTableRow";
import { GovernanceTableRow } from "src/views/Governance/Components/GovernanceTableRow";
import { DelegateVotingModal } from "src/views/Governance/Delegation/DelegateVotingModal";
import { useGovernanceDelegationCheck } from "src/views/Governance/hooks/useGovernanceDelegationCheck";
import { CoolerV2DelegationModal } from "src/views/Lending/CoolerV2/components/CoolerV2DelegationModal";
import { useMonoCoolerDelegations } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerDelegations";
import { useAccount } from "wagmi";

export const ManageDelegation = () => {
  const { address, isConnected } = useAccount();
  const [searchParams] = useSearchParams();
  const to = searchParams.get("to");

  const networks = useTestableNetworks();
  const {
    gOHMDelegationAddress,
    coolerV1ClearingHouseDelegationAddress,
    coolerV2ClearingHouseDelegationAddress,
    coolerV3ClearingHouseDelegationAddress,
    gohmBalance,
    gohmCoolerV1ClearingHouseBalance,
    gohmCoolerV2ClearingHouseBalance,
    gohmCoolerV3ClearingHouseBalance,
    coolerAddressV1,
    coolerAddressV2,
    coolerAddressV3,
    gohmCoolerV2Balance,
  } = useGovernanceDelegationCheck();

  const { delegations } = useMonoCoolerDelegations();
  const navigate = useNavigate();

  const [delegateVoting, setDelegateVoting] = useState<{
    delegatorAddress: string;
    currentDelegatedToAddress?: string;
  }>();
  const [coolerV2DelegationOpen, setCoolerV2DelegationOpen] = useState(false);
  const theme = useTheme();

  console.log(gohmCoolerV2Balance, "this is the balance");

  // Calculate delegation percentages for Cooler V2
  const coolerV2DelegationRows = useMemo(() => {
    if (!gohmCoolerV2Balance || !delegations.data) return [];
    if (gohmCoolerV2Balance.isZero()) return [];

    return delegations.data.map(delegation => {
      const percentage =
        (Number(formatUnits(delegation.totalAmount, 18)) / Number(formatUnits(gohmCoolerV2Balance, 18))) * 100;
      return {
        tokenName: `Cooler V2 Delegation`,
        delegationAddress: delegation.delegate,
        balance: formatUnits(delegation.totalAmount, 18),
        address: address || "",
        percentage,
      };
    });
  }, [gohmCoolerV2Balance, delegations.data, address]);

  console.log(delegations, "this is the cooler v2 delegation rows");

  return (
    <Modal
      open={true}
      closePosition="right"
      headerText="Manage Voting Delegation"
      onClose={() => navigate("/governance/delegate")}
      maxWidth="600px"
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
          <>
            {to && (
              <Box display="flex" flexDirection="column" mb="18px">
                <Typography>You are about to delegate your voting power to the following address:</Typography>
                <Box
                  display="flex"
                  width="100%"
                  bgcolor={theme.colors.gray[700]}
                  borderRadius="6px"
                  px="18px"
                  py="3px"
                  height="39px"
                  alignItems="center"
                >
                  {to}
                </Box>
                <Box width="100%" height="1px" bgcolor={theme.colors.gray[500]} mt="9px" />
              </Box>
            )}
            <Box display="flex" flexDirection="column" gap="18px">
              {address && (
                <GovernanceTableRow
                  tokenName={`Wallet Voting Power`}
                  delegatorAddress={GOHM_ADDRESSES[networks.MAINNET_HOLESKY]}
                  delegationAddress={gOHMDelegationAddress}
                  setDelegateVoting={setDelegateVoting}
                  balance={gohmBalance?.formatted}
                  address={address}
                />
              )}
              {coolerAddressV1 && (
                <GovernanceTableRow
                  delegatorAddress={coolerAddressV1}
                  tokenName={`Cooler Clearinghouse V1 Voting Power`}
                  setDelegateVoting={setDelegateVoting}
                  delegationAddress={coolerV1ClearingHouseDelegationAddress}
                  balance={gohmCoolerV1ClearingHouseBalance?.formatted}
                  address={coolerAddressV1}
                />
              )}
              {coolerAddressV2 && (
                <GovernanceTableRow
                  delegatorAddress={coolerAddressV2}
                  tokenName={`Cooler Clearinghouse V2 Voting Power`}
                  setDelegateVoting={setDelegateVoting}
                  delegationAddress={coolerV2ClearingHouseDelegationAddress}
                  balance={gohmCoolerV2ClearingHouseBalance?.formatted}
                  address={coolerAddressV2}
                />
              )}
              {coolerAddressV3 && (
                <GovernanceTableRow
                  delegatorAddress={coolerAddressV3}
                  tokenName={`Cooler Clearinghouse V3 Voting Power`}
                  setDelegateVoting={setDelegateVoting}
                  delegationAddress={coolerV3ClearingHouseDelegationAddress}
                  balance={gohmCoolerV3ClearingHouseBalance?.formatted}
                  address={coolerAddressV3}
                />
              )}
              {gohmCoolerV2Balance && (
                <CoolerV2GovernanceTableRow
                  tokenName={`Cooler V2 Voting Power`}
                  delegationAddress={undefined}
                  balance={formatUnits(gohmCoolerV2Balance || BigNumber.from(0), 18)}
                  address={address || ""}
                  onDelegate={() => setCoolerV2DelegationOpen(true)}
                  delegations={coolerV2DelegationRows}
                />
              )}

              <DelegateVotingModal
                address={delegateVoting?.delegatorAddress}
                open={Boolean(delegateVoting)}
                setOpen={setDelegateVoting}
                currentDelegateAddress={delegateVoting?.currentDelegatedToAddress}
                currentWalletAddress={address}
                initialDelegationAddress={to || undefined}
              />

              <CoolerV2DelegationModal open={coolerV2DelegationOpen} setOpen={setCoolerV2DelegationOpen} />
            </Box>
          </>
        )}
      </>
    </Modal>
  );
};
