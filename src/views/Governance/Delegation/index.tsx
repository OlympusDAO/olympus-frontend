import { ArrowBack } from "@mui/icons-material";
import { Box, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Paper } from "@olympusdao/component-library";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { InPageConnectButton } from "src/components/ConnectButton/ConnectButton";
import PageTitle from "src/components/PageTitle";
import { GOHM_ADDRESSES } from "src/constants/addresses";
import { truncateEthereumAddress } from "src/helpers/truncateAddress";
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

  const [delegateVoting, setDelegateVoting] = useState<
    { delegatorAddress: string; currentDelegatedToAddress?: string } | undefined
  >(undefined);
  return (
    <div id="stake-view">
      <PageTitle
        name={
          <Box display="flex" flexDirection="row" alignItems="center">
            <Link component={RouterLink} to="/governance">
              <Box display="flex" flexDirection="row">
                <ArrowBack />
                <Typography fontWeight="500" marginLeft="9.5px" marginRight="18px">
                  Back
                </Typography>
              </Box>
            </Link>

            <Box display="flex" flexDirection="column" ml={1} justifyContent="center" alignItems="center">
              <Typography variant="h4" fontWeight={500}>
                Delegate Voting
              </Typography>
            </Box>
          </Box>
        }
      />
      <Box width="97%" maxWidth="974px">
        {!isConnected ? (
          <Box mt="48px">
            <div className="stake-wallet-notification">
              <InPageConnectButton buttonText="Connect to Delegate Voting" />
            </div>
          </Box>
        ) : (
          <>
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
            <DelegateVotingModal
              address={delegateVoting?.delegatorAddress}
              open={Boolean(delegateVoting)}
              setOpen={setDelegateVoting}
              currentDelegateAddress={delegateVoting?.currentDelegatedToAddress}
            />
          </>
        )}
      </Box>
    </div>
  );
};
