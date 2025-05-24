import { getAddress } from "@ethersproject/address";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  FormControl,
  Link,
  MenuItem,
  Select,
  SelectChangeEvent,
  SvgIcon,
  Tooltip,
  Typography,
} from "@mui/material";
import { InfoNotification, Input, Modal, PrimaryButton } from "@olympusdao/component-library";
import { useEffect, useState } from "react";
import lendAndBorrowIcon from "src/assets/icons/lendAndBorrow.svg?react";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { COOLER_V2_MIGRATOR_ADDRESSES, GOHM_ADDRESSES } from "src/constants/addresses";
import { formatNumber } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useConsolidateCooler } from "src/views/Lending/Cooler/hooks/useConsolidateCooler";
import { useGetCoolerLoans } from "src/views/Lending/Cooler/hooks/useGetCoolerLoans";
import { useMonoCoolerPosition } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerPosition";
import { useAccount, useNetwork } from "wagmi";

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
  const [open, setOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [newOwnerAddress, setNewOwnerAddress] = useState<string>("");
  const [isValidAddress, setIsValidAddress] = useState<boolean>(true);
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

  const handleVersionChange = (event: SelectChangeEvent) => {
    setSelectedVersion(event.target.value as "v1" | "v2" | "v3");
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputAddress = event.target.value;
    setNewOwnerAddress(inputAddress);

    try {
      const checksummedAddress = getAddress(inputAddress.toLowerCase());
      // First check if empty or valid address, then check if it's not the current owner
      const isValid = inputAddress === "" || checksummedAddress;
      const isNotCurrentOwner = !address || !inputAddress || inputAddress.toLowerCase() !== address.toLowerCase();
      setIsValidAddress(isValid && isNotCurrentOwner);
    } catch {
      setIsValidAddress(false);
    }
  };

  // newOwner is the connected wallet unless the user enters a different EOA
  const newOwner = newOwnerAddress && isValidAddress ? newOwnerAddress : address;

  const handleConsolidate = () => {
    const coolers = [sourceCoolerAddress].filter(Boolean) as string[];
    if (!coolers.length || !newOwner) return;
    coolerMutation.mutate(
      { coolers, newOwner },
      {
        onSuccess: () => {
          setOpen(false);
          setConfirmModalOpen(false);
        },
      },
    );
  };

  const openConfirmModal = () => {
    setConfirmModalOpen(true);
  };

  const handleContinue = () => {
    setConfirmModalOpen(false);
    handleConsolidate();
  };

  const getExplorerUrl = (address: string) => {
    const baseUrl = chain?.blockExplorers?.default.url || "https://etherscan.io";
    return `${baseUrl}/address/${address}`;
  };

  const migratorAddressKey = (chain?.id || 1) as keyof typeof COOLER_V2_MIGRATOR_ADDRESSES;
  const migratorAddress = COOLER_V2_MIGRATOR_ADDRESSES[migratorAddressKey];
  const coolerAddress = sourceCoolerAddress;

  if (!showConsolidateButton) return null;

  return (
    <>
      <PrimaryButton onClick={() => setOpen(true)}>Migrate Loans to Cooler V2</PrimaryButton>

      {/* Confirmation Modal */}
      <Modal
        maxWidth="476px"
        minHeight="200px"
        open={confirmModalOpen}
        headerContent={
          <Box display="flex" alignItems="center" gap="6px">
            <SvgIcon component={lendAndBorrowIcon} /> <Box fontWeight="500">Confirmation</Box>
          </Box>
        }
        onClose={() => setConfirmModalOpen(false)}
      >
        <>
          <Box mb={3}>
            <Typography textAlign="center">
              You are about to receive a signature request that allows the Olympus migrator contract (
              <Link href={getExplorerUrl(migratorAddress)} target="_blank" rel="noopener noreferrer">
                {migratorAddress.substring(0, 6)}...{migratorAddress.substring(migratorAddress.length - 4)}
              </Link>
              ) to act on behalf of your Cooler (
              <Link href={getExplorerUrl(coolerAddress || "")} target="_blank" rel="noopener noreferrer">
                {coolerAddress
                  ? `${coolerAddress.substring(0, 6)}...${coolerAddress.substring(coolerAddress.length - 4)}`
                  : ""}
              </Link>
              ).
            </Typography>
            <Typography textAlign="center" mt={2}>
              After signing the message, you will receive a request to approve the contract call.
            </Typography>
          </Box>
          <PrimaryButton onClick={handleContinue} fullWidth>
            Continue
          </PrimaryButton>
        </>
      </Modal>

      {/* Main Migration Modal */}
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
                All selected loans from this Cooler V1 clearinghouse will be repaid and migrated into your single Cooler
                V2 position. Cooler V2 loans are open-ended and do not have a fixed maturity date. Interest accrues
                continuously and is only paid when you repay your loan.
              </InfoNotification>

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
                    {preview?.borrowAmount &&
                      formatNumber(Math.ceil(Number(preview.borrowAmount.toString()) * 100) / 100, 2)}{" "}
                    {debtAssetName}
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
          {selectedVersion ? (
            <WalletConnectedGuard fullWidth>
              <TokenAllowanceGuard
                tokenAddressMap={GOHM_ADDRESSES}
                spenderAddressMap={COOLER_V2_MIGRATOR_ADDRESSES}
                isVertical
                message={<>Approve gOHM for Spending on the Consolidation Contract</>}
                spendAmount={preview?.collateralAmount}
                approvalText="Approve gOHM for Spending"
              >
                <PrimaryButton
                  onClick={openConfirmModal}
                  loading={coolerMutation.isLoading}
                  disabled={coolerMutation.isLoading || !selectedVersion || !isValidAddress}
                  fullWidth
                >
                  Migrate Loans to Cooler V2
                </PrimaryButton>
              </TokenAllowanceGuard>
            </WalletConnectedGuard>
          ) : (
            <PrimaryButton disabled fullWidth>
              Select loans to consolidate
            </PrimaryButton>
          )}
        </>
      </Modal>
    </>
  );
};
