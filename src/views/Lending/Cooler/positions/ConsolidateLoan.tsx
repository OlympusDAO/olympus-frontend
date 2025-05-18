import { getAddress } from "@ethersproject/address";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  SvgIcon,
  Tooltip,
  Typography,
} from "@mui/material";
import { InfoNotification, Input, Modal, PrimaryButton } from "@olympusdao/component-library";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils.js";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import lendAndBorrowIcon from "src/assets/icons/lendAndBorrow.svg?react";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { COOLER_CONSOLIDATION_ADDRESSES, GOHM_ADDRESSES } from "src/constants/addresses";
import { COOLER_V2_MIGRATOR_CONTRACT, COOLER_V2_MONOCOOLER_CONTRACT } from "src/constants/contracts";
import { formatNumber } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { NetworkId } from "src/networkDetails";
import { useCheckConsolidatorActive } from "src/views/Lending/Cooler/hooks/useCheckConsolidatorActive";
import { useConsolidateCooler } from "src/views/Lending/Cooler/hooks/useConsolidateCooler";
import { useGetCoolerLoans } from "src/views/Lending/Cooler/hooks/useGetCoolerLoans";
import { useMonoCoolerPosition } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerPosition";
import { getAuthorizationSignature } from "src/views/Lending/CoolerV2/utils/getAuthorizationSignature";
import { useAccount, useSignTypedData } from "wagmi";

export const ConsolidateLoans = ({
  v3CoolerAddress,
  v2CoolerAddress,
  v1CoolerAddress,
  v1Loans,
  v2Loans,
  v3Loans,
}: {
  v3CoolerAddress?: string;
  v2CoolerAddress?: string;
  v1CoolerAddress?: string;

  v1Loans?: NonNullable<ReturnType<typeof useGetCoolerLoans>["data"]>;
  v2Loans?: NonNullable<ReturnType<typeof useGetCoolerLoans>["data"]>;
  v3Loans?: NonNullable<ReturnType<typeof useGetCoolerLoans>["data"]>;
}) => {
  const coolerMutation = useConsolidateCooler();
  const { data: consolidatorActive } = useCheckConsolidatorActive();
  const networks = useTestableNetworks();
  const [open, setOpen] = useState(false);
  const { address } = useAccount();
  const [newOwnerAddress, setNewOwnerAddress] = useState<string>("");
  const [isValidAddress, setIsValidAddress] = useState<boolean>(true);
  const { signTypedDataAsync } = useSignTypedData();
  const { data: v2Position } = useMonoCoolerPosition();

  // Determine which V1 clearinghouse loans are available for consolidation (source selection only)
  const hasV1Loans = v1Loans && v1Loans.length > 0;
  const hasV2Loans = v2Loans && v2Loans.length > 0;
  const hasV3Loans = v3Loans && v3Loans.length > 0;

  // Only used for selecting the *source* (CoolerV1 clearinghouse) to consolidate from
  const availableVersions = [hasV1Loans && "v1", hasV2Loans && "v2", hasV3Loans && "v3"].filter(Boolean) as (
    | "v1"
    | "v2"
    | "v3"
  )[];

  // If there's only one source, use it automatically
  const [selectedVersion, setSelectedVersion] = useState<"v1" | "v2" | "v3" | "">(
    availableVersions.length === 1 ? availableVersions[0] : "",
  );

  // Destination is always CoolerV2 (no branching needed)
  const debtAddress = v2Position?.debtAddress;
  const collateralAddress = v2Position?.collateralAddress;
  const debtAssetName = v2Position?.debtAssetName;

  // Use selectedVersion for source loan info only (CoolerV1s)
  const selectedLoans =
    selectedVersion === "v1" ? v1Loans : selectedVersion === "v2" ? v2Loans : selectedVersion === "v3" ? v3Loans : [];
  const loans = selectedLoans || [];
  const sourceCoolerAddress =
    selectedVersion === "v1"
      ? v1CoolerAddress
      : selectedVersion === "v2"
        ? v2CoolerAddress
        : selectedVersion === "v3"
          ? v3CoolerAddress
          : "";

  // Show button only if there are loans that can be consolidated
  const showConsolidateButton = hasV1Loans || hasV2Loans || hasV3Loans;

  const totals = loans.reduce(
    (acc, loan) => {
      acc.principal = acc.principal.add(loan.principal);
      acc.interest = acc.interest.add(loan.interestDue);
      acc.collateral = acc.collateral.add(loan.collateral);
      return acc;
    },
    { principal: BigNumber.from(0), interest: BigNumber.from(0), collateral: BigNumber.from(0) },
  );

  // All destination (post-migration) logic uses V2
  const { data: debtBalance } = useBalance({ [networks.MAINNET]: debtAddress || "" })[networks.MAINNET];
  const { data: gOhmBalance } = useBalance(GOHM_ADDRESSES)[networks.MAINNET];
  const [insufficientBalances, setInsufficientBalances] = useState<
    | {
        debt: boolean;
        gohm: boolean;
      }
    | undefined
  >();

  const [preview, setPreview] = useState<{ collateralAmount: DecimalBigNumber; borrowAmount: DecimalBigNumber } | null>(
    null,
  );
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    if (!sourceCoolerAddress) return;
    setPreviewLoading(true);
    coolerMutation
      .previewConsolidate([sourceCoolerAddress])
      .then(res => {
        setPreview({
          collateralAmount: new DecimalBigNumber(res.collateralAmount, 18),
          borrowAmount: new DecimalBigNumber(res.borrowAmount, 18),
        });
      })
      .catch(() => setPreview(null))
      .finally(() => setPreviewLoading(false));
  }, [sourceCoolerAddress]);

  useEffect(() => {
    if (!debtBalance || !gOhmBalance || !preview) {
      setInsufficientBalances(undefined);
      return;
    }

    setInsufficientBalances({
      debt: Number(debtBalance) < Number(preview.borrowAmount),
      gohm: Number(gOhmBalance) < Number(preview.collateralAmount),
    });
  }, [debtBalance, gOhmBalance, preview]);

  const handleVersionChange = (event: SelectChangeEvent) => {
    setSelectedVersion(event.target.value as "v1" | "v2" | "v3");
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputAddress = event.target.value;
    setNewOwnerAddress(inputAddress);

    try {
      const checksummedAddress = getAddress(inputAddress.toLowerCase());
      console.log("checksummedAddress", checksummedAddress);
      // First check if empty or valid address, then check if it's not the current owner
      const isValid = inputAddress === "" || checksummedAddress;
      const isNotCurrentOwner = !address || !inputAddress || inputAddress.toLowerCase() !== address.toLowerCase();
      setIsValidAddress(isValid && isNotCurrentOwner);
    } catch {
      setIsValidAddress(false);
    }
  };

  const handleConsolidate = async () => {
    // Collect all selected cooler addresses (from UI logic)
    const coolers = [sourceCoolerAddress]; // TODO: update if multi-select is supported
    const newOwner = newOwnerAddress && isValidAddress ? newOwnerAddress : address;
    if (!coolers.length || !newOwner) return;

    // Get nonce from V2 contract for new owner
    const v2Contract = COOLER_V2_MONOCOOLER_CONTRACT.getEthersContract(networks.MAINNET_HOLESKY);
    let nonce;
    try {
      nonce = await v2Contract.authorizationNonces(newOwner);
    } catch (e) {
      toast.error("Failed to fetch nonce for authorization signature");
      return;
    }

    // Ensure addresses are defined and valid
    const migratorAddress = COOLER_V2_MIGRATOR_CONTRACT.getAddress(networks.MAINNET_HOLESKY);
    const v2ContractAddress = v2Contract.address;
    if (
      !migratorAddress ||
      !migratorAddress.startsWith("0x") ||
      !v2ContractAddress ||
      !v2ContractAddress.startsWith("0x")
    ) {
      toast.error("Could not determine contract addresses for signature");
      return;
    }
    let safeMigratorAddress: `0x${string}`;
    let safeV2ContractAddress: `0x${string}`;
    try {
      safeMigratorAddress = asHexString(migratorAddress);
      safeV2ContractAddress = asHexString(v2ContractAddress);
    } catch {
      toast.error("Invalid contract address format");
      return;
    }

    // Generate authorization signature
    let auth, signature;
    try {
      const sigResult = await getAuthorizationSignature({
        userAddress: newOwner,
        authorizedAddress: safeMigratorAddress,
        verifyingContract: safeV2ContractAddress,
        chainId: networks.MAINNET_HOLESKY,
        nonce: nonce.toString(),
        signTypedDataAsync,
      });
      auth = sigResult.auth;
      signature = sigResult.signature;
    } catch (e) {
      toast.error("Signature request was rejected or failed");
      return;
    }

    // Call the migrator
    coolerMutation.mutate(
      {
        coolers: coolers.filter(Boolean) as string[],
        newOwner,
        authorization: auth,
        signature,
        delegationRequests: [], // TODO: support delegation if needed
      },
      {
        onSuccess: () => {
          setOpen(false);
          setSelectedVersion("");
          setNewOwnerAddress("");
        },
      },
    );
  };

  if (!showConsolidateButton) return null;

  console.log(v2Position, "debtAddress");

  return (
    <>
      {consolidatorActive && <PrimaryButton onClick={() => setOpen(!open)}>Migrate Loans to Cooler V2</PrimaryButton>}
      <Modal
        maxWidth="476px"
        minHeight="200px"
        open={open}
        headerContent={
          <Box display="flex" alignItems="center" gap="6px">
            <SvgIcon component={lendAndBorrowIcon} /> <Box fontWeight="500">Migrate Loans to Cooler V2</Box>
          </Box>
        }
        onClose={() => setOpen(false)}
      >
        <>
          {availableVersions.length > 1 && (
            <Box mb={2}>
              <FormControl fullWidth>
                <Select value={selectedVersion} onChange={handleVersionChange} displayEmpty sx={{ height: "40px" }}>
                  <MenuItem value="" disabled>
                    Select which CoolerV1 Clearinghouse to consolidate from
                  </MenuItem>
                  {hasV1Loans && <MenuItem value="v1">V1 Loans ({v1Loans?.length})</MenuItem>}
                  {hasV2Loans && <MenuItem value="v2">V2 Loans ({v2Loans?.length})</MenuItem>}
                  {hasV3Loans && <MenuItem value="v3">V3 Loans ({v3Loans?.length})</MenuItem>}
                </Select>
              </FormControl>
            </Box>
          )}
          {selectedVersion && (
            <>
              <InfoNotification>
                All selected loans from this CoolerV1 clearinghouse will be repaid and migrated into your single
                CoolerV2 position. <b>CoolerV2 is always the destination.</b> CoolerV2 loans are open-ended and do not
                have a fixed maturity date. Interest accrues continuously and is only paid when you repay your loan.
              </InfoNotification>
              {preview && (
                <>
                  <Typography fontWeight="500">Wallet Balances Required</Typography>
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={"9px"}
                    mt={"9px"}
                  >
                    <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>{debtAssetName} Balance</Typography>
                    <Box display="flex" flexDirection="column" textAlign="right">
                      <Tooltip title={preview?.borrowAmount?.toString()}>
                        <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>
                          {Math.ceil(Number(preview?.borrowAmount?.toString()) * 100) / 100}
                        </Typography>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={"9px"}
                    mt={"9px"}
                  >
                    <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>gOHM Balance</Typography>
                    <Box display="flex" flexDirection="column" textAlign="right">
                      <Tooltip title={preview?.collateralAmount?.toString()}>
                        <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>
                          {Math.ceil(Number(preview?.collateralAmount?.toString()) * 100000) / 100000}
                        </Typography>
                      </Tooltip>
                    </Box>
                  </Box>
                </>
              )}
              <Box sx={{ width: "100%", my: "21px" }}>
                <Divider />
              </Box>
              <Typography fontWeight="500" mt="21px">
                Required Allowances
              </Typography>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                mb={"9px"}
                mt={"9px"}
              >
                <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>{debtAssetName}</Typography>
                <Box display="flex" flexDirection="column" textAlign="right">
                  <Tooltip title={preview?.borrowAmount?.toString()}>
                    <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>
                      {Math.ceil(Number(preview?.borrowAmount?.toString()) * 100) / 100}
                    </Typography>
                  </Tooltip>
                </Box>
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                mb={"9px"}
                mt={"9px"}
              >
                <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>gOHM</Typography>
                <Box display="flex" flexDirection="column" textAlign="right">
                  <Tooltip title={preview?.collateralAmount?.toString()}>
                    <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>
                      {Math.ceil(Number(preview?.collateralAmount?.toString()) * 100000) / 100000}
                    </Typography>
                  </Tooltip>
                </Box>
              </Box>
              <Box sx={{ width: "100%", my: "21px" }}>
                <Divider />
              </Box>
              <Typography fontWeight="500" mt="21px">
                Consolidated Loan Details
              </Typography>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                mb={"9px"}
                mt={"9px"}
              >
                <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>Loans to Consolidate</Typography>
                <Box display="flex" flexDirection="column" textAlign="right">
                  <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>{loans.length}</Typography>
                </Box>
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                mb={"9px"}
                mt={"9px"}
              >
                <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>New Principal Amount</Typography>
                <Box display="flex" flexDirection="column" textAlign="right">
                  <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>
                    {formatNumber(parseFloat(formatEther(totals.principal)), 4)} {debtAssetName}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ width: "100%", my: "21px" }}>
                <Divider />
              </Box>
              <Accordion
                sx={{
                  background: "none",
                  boxShadow: "none",
                  "&:before": {
                    display: "none",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    padding: 0,
                    "& .MuiAccordionSummary-content": {
                      margin: 0,
                    },
                  }}
                >
                  <Typography fontWeight="500">Transfer Ownership (Optional)</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: "0 0 8px 0" }}>
                  <Box>
                    <Input
                      id="new-owner-address"
                      fullWidth
                      label="New Owner EOA"
                      value={newOwnerAddress}
                      onChange={handleAddressChange}
                      error={!isValidAddress}
                      helperText={
                        !isValidAddress && newOwnerAddress.toLowerCase() === address?.toLowerCase()
                          ? "New owner cannot be the current owner"
                          : !isValidAddress
                            ? "Invalid Ethereum address"
                            : ""
                      }
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>
            </>
          )}
          {selectedVersion && !insufficientBalances?.debt && !insufficientBalances?.gohm ? (
            <WalletConnectedGuard fullWidth>
              <TokenAllowanceGuard
                tokenAddressMap={{ [NetworkId.MAINNET]: debtAddress }}
                spenderAddressMap={COOLER_CONSOLIDATION_ADDRESSES}
                isVertical
                message={<>Approve {debtAssetName} for Spending on the Consolidation Contract</>}
                spendAmount={preview?.borrowAmount}
                approvalText={`Approve ${debtAssetName} for Spending`}
              >
                <TokenAllowanceGuard
                  tokenAddressMap={GOHM_ADDRESSES}
                  spenderAddressMap={COOLER_CONSOLIDATION_ADDRESSES}
                  isVertical
                  message={<>Approve gOHM for Spending on the Consolidation Contract</>}
                  spendAmount={preview?.collateralAmount}
                  approvalText="Approve gOHM for Spending"
                >
                  <PrimaryButton
                    onClick={handleConsolidate}
                    loading={coolerMutation.isLoading}
                    disabled={coolerMutation.isLoading || !selectedVersion || !isValidAddress}
                    fullWidth
                  >
                    Migrate Loans to Cooler V2
                  </PrimaryButton>
                </TokenAllowanceGuard>
              </TokenAllowanceGuard>
            </WalletConnectedGuard>
          ) : (
            <PrimaryButton disabled fullWidth>
              {insufficientBalances?.debt
                ? `Insufficient ${debtAssetName} Balance`
                : insufficientBalances?.gohm
                  ? "Insufficient gOHM Balance"
                  : "Select loans to consolidate"}
            </PrimaryButton>
          )}
        </>
      </Modal>
    </>
  );
};

// Helper to assert a value is a valid 0x-prefixed string
function asHexString(value: string | undefined): `0x${string}` {
  if (!value || typeof value !== "string" || !value.startsWith("0x")) {
    throw new Error("Invalid hex string");
  }
  return value as `0x${string}`;
}
