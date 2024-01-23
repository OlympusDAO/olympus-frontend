import {
  Box,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { InfoNotification, PrimaryButton } from "@olympusdao/component-library";
import { useState } from "react";
import { InPageConnectButton } from "src/components/ConnectButton/ConnectButton";
import PageTitle from "src/components/PageTitle";
import { GOHM_ADDRESSES } from "src/constants/addresses";
import { truncateEthereumAddress } from "src/helpers/truncateAddress";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { DelegateVoting } from "src/views/Governance/DelegateVoting";
import { GovernanceTableRow } from "src/views/Governance/GovernanceTableRow";
import { useCheckDelegation } from "src/views/Governance/hooks/useCheckDelegation";
import { useGetClearingHouse } from "src/views/Lending/Cooler/hooks/useGetClearingHouse";
import { useGetCoolerForWallet } from "src/views/Lending/Cooler/hooks/useGetCoolerForWallet";
import { useAccount, useBalance } from "wagmi";

export const Governance = () => {
  const { address, isConnected } = useAccount();
  const networks = useTestableNetworks();
  const { data: gOHMDelegationAddress } = useCheckDelegation({ address });

  const { data: clearingHouseV1 } = useGetClearingHouse({ clearingHouse: "clearingHouseV1" });
  const { data: clearingHouseV2 } = useGetClearingHouse({ clearingHouse: "clearingHouseV2" });
  const { data: coolerAddressV1 } = useGetCoolerForWallet({
    walletAddress: address,
    factoryAddress: clearingHouseV1?.factory,
    collateralAddress: clearingHouseV1?.collateralAddress,
    debtAddress: clearingHouseV1?.debtAddress,
    clearingHouseVersion: "clearingHouseV1",
  });
  const { data: coolerAddressV2 } = useGetCoolerForWallet({
    walletAddress: address,
    factoryAddress: clearingHouseV2?.factory,
    collateralAddress: clearingHouseV2?.collateralAddress,
    debtAddress: clearingHouseV2?.debtAddress,
    clearingHouseVersion: "clearingHouseV2",
  });
  const { data: coolerV1DelegationAddress } = useCheckDelegation({ address: coolerAddressV1 });
  const { data: coolerV2DelegationAddress } = useCheckDelegation({ address: coolerAddressV2 });
  const { data: gohmCoolerV2Balance } = useBalance({
    address: coolerAddressV2 as `0x${string}`,
    token: GOHM_ADDRESSES[networks.MAINNET] as `0x${string}`,
  });
  const { data: gohmCoolerV1Balance } = useBalance({
    address: coolerAddressV1 as `0x${string}`,
    token: GOHM_ADDRESSES[networks.MAINNET] as `0x${string}`,
  });
  const { data: gohmBalance } = useBalance({
    address: address as `0x${string}`,
    token: GOHM_ADDRESSES[networks.MAINNET] as `0x${string}`,
  });

  console.log(gohmCoolerV2Balance, "balance");
  const [delegateVoting, setDelegateVoting] = useState<
    { delegatorAddress: string; currentDelegatedToAddress?: string } | undefined
  >(undefined);

  return (
    <div id="stake-view">
      <PageTitle name="Governance" />
      <Box width="97%" maxWidth="974px">
        <Typography variant="h4" sx={{ fontWeight: "500", mb: "24px" }}>
          Proposals
        </Typography>
        <Box display="flex" justifyContent="center">
          <Link href="https://snapshot.org/#/olympusdao.eth" target="_blank" rel="noopener noreferrer">
            <PrimaryButton>View Proposals on Snapshot</PrimaryButton>
          </Link>
        </Box>
        <Box mt="60px">
          <Typography variant="h4" sx={{ fontWeight: "500", mb: "24px" }}>
            Delegate Voting
          </Typography>
          {!isConnected ? (
            <Box mt="48px">
              <div className="stake-wallet-notification">
                <InPageConnectButton buttonText="Connect to Delegate Voting" />
              </div>
            </Box>
          ) : (
            <>
              {(coolerAddressV1 || coolerAddressV2) && (
                <InfoNotification>
                  To make gOHM in Cooler Loans votable, you must delegate it to yourself
                </InfoNotification>
              )}

              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: "15px", padding: "9px" }}>Address</TableCell>
                      <TableCell sx={{ fontSize: "15px", padding: "9px" }}>Amount</TableCell>
                      <TableCell sx={{ fontSize: "15px", padding: "9px" }} align="right">
                        Delegation Status
                      </TableCell>
                      <TableCell sx={{ fontSize: "15px", padding: "9px" }} align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {address && (
                      <GovernanceTableRow
                        tokenName={`gOHM in Connected Wallet (${truncateEthereumAddress(address)})`}
                        delegatorAddress={GOHM_ADDRESSES[networks.MAINNET]}
                        delegationAddress={gOHMDelegationAddress}
                        setDelegateVoting={setDelegateVoting}
                        balance={gohmBalance?.formatted}
                      />
                    )}
                    {coolerAddressV1 && (
                      <GovernanceTableRow
                        delegatorAddress={coolerAddressV1}
                        tokenName={`gOHM in Cooler for Clearinghouse V1`}
                        setDelegateVoting={setDelegateVoting}
                        delegationAddress={coolerV1DelegationAddress}
                        balance={gohmCoolerV1Balance?.formatted}
                      />
                    )}
                    {coolerAddressV2 && (
                      <GovernanceTableRow
                        delegatorAddress={coolerAddressV2}
                        tokenName={`gOHM in Cooler for Clearinghouse V2`}
                        setDelegateVoting={setDelegateVoting}
                        delegationAddress={coolerV2DelegationAddress}
                        balance={gohmCoolerV2Balance?.formatted}
                      />
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <DelegateVoting
                address={delegateVoting?.delegatorAddress}
                open={Boolean(delegateVoting)}
                setOpen={setDelegateVoting}
                currentDelegateAddress={delegateVoting?.currentDelegatedToAddress}
              />
            </>
          )}
        </Box>
      </Box>
    </div>
  );
};
