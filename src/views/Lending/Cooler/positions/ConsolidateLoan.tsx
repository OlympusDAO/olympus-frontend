import { Box, FormControl, MenuItem, Select, SelectChangeEvent, SvgIcon, Typography } from "@mui/material";
import { InfoNotification, Modal, PrimaryButton } from "@olympusdao/component-library";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils.js";
import { useEffect, useState } from "react";
import lendAndBorrowIcon from "src/assets/icons/lendAndBorrow.svg?react";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { COOLER_CONSOLIDATION_ADDRESSES, GOHM_ADDRESSES } from "src/constants/addresses";
import { formatNumber } from "src/helpers";
import { useBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { NetworkId } from "src/networkDetails";
import { useConsolidateCooler } from "src/views/Lending/Cooler/hooks/useConsolidateCooler";
import { useCreateCooler } from "src/views/Lending/Cooler/hooks/useCreateCooler";
import { useGetClearingHouse } from "src/views/Lending/Cooler/hooks/useGetClearingHouse";
import { useGetConsolidationAllowances } from "src/views/Lending/Cooler/hooks/useGetConsolidationAllowances";
import { useGetCoolerLoans } from "src/views/Lending/Cooler/hooks/useGetCoolerLoans";

export const ConsolidateLoans = ({
  v3CoolerAddress,
  v2CoolerAddress,
  v1CoolerAddress,
  clearingHouseAddresses,
  v1Loans,
  v2Loans,
  v3Loans,
  factoryAddress,
}: {
  v3CoolerAddress?: string;
  v2CoolerAddress?: string;
  v1CoolerAddress?: string;
  clearingHouseAddresses: {
    v1: NonNullable<ReturnType<typeof useGetClearingHouse>["data"]>;
    v2: NonNullable<ReturnType<typeof useGetClearingHouse>["data"]>;
    v3: NonNullable<ReturnType<typeof useGetClearingHouse>["data"]>;
  };
  v1Loans?: NonNullable<ReturnType<typeof useGetCoolerLoans>["data"]>;
  v2Loans?: NonNullable<ReturnType<typeof useGetCoolerLoans>["data"]>;
  v3Loans?: NonNullable<ReturnType<typeof useGetCoolerLoans>["data"]>;
  factoryAddress: string;
}) => {
  const coolerMutation = useConsolidateCooler();
  const createCooler = useCreateCooler();
  const networks = useTestableNetworks();
  const [open, setOpen] = useState(false);

  // Determine which versions are available for consolidation
  const hasV1Loans = v1Loans && v1Loans.length > 0;
  const hasV2Loans = v2Loans && v2Loans.length > 0;
  const hasMultipleV3Loans = v3Loans && v3Loans.length > 1;

  // Calculate available versions
  const availableVersions = [hasV1Loans && "v1", hasV2Loans && "v2", hasMultipleV3Loans && "v3"].filter(Boolean) as (
    | "v1"
    | "v2"
    | "v3"
  )[];

  // If there's only one option, use it automatically
  const [selectedVersion, setSelectedVersion] = useState<"v1" | "v2" | "v3" | "">(
    availableVersions.length === 1 ? availableVersions[0] : "",
  );

  // Get the appropriate loans based on selection
  const selectedLoans =
    selectedVersion === "v1" ? v1Loans : selectedVersion === "v2" ? v2Loans : selectedVersion === "v3" ? v3Loans : [];

  const loans = selectedLoans || [];
  const loanIds = loans.map(loan => loan.loanId);

  // Set the appropriate addresses based on selection
  const coolerAddress =
    selectedVersion === "v1"
      ? v1CoolerAddress
      : selectedVersion === "v2"
        ? v2CoolerAddress
        : selectedVersion === "v3"
          ? v3CoolerAddress
          : "";
  const selectedClearingHouse =
    selectedVersion === "v1"
      ? clearingHouseAddresses.v1
      : selectedVersion === "v2"
        ? clearingHouseAddresses.v2
        : clearingHouseAddresses.v3;
  const duration = 90; // Standard duration for consolidated loans
  const debtAddress = selectedClearingHouse.debtAddress;

  // Show button only if there are loans that can be consolidated
  const showConsolidateButton = hasV1Loans || hasV2Loans || hasMultipleV3Loans;

  const totals = loans.reduce(
    (acc, loan) => {
      acc.principal = acc.principal.add(loan.principal);
      acc.interest = acc.interest.add(loan.interestDue);
      acc.collateral = acc.collateral.add(loan.collateral);
      return acc;
    },
    { principal: BigNumber.from(0), interest: BigNumber.from(0), collateral: BigNumber.from(0) },
  );
  const { data: allowances } = useGetConsolidationAllowances({
    clearingHouseAddress: clearingHouseAddresses.v3.clearingHouseAddress,
    coolerAddress: coolerAddress || "",
    loanIds,
  });

  const maturityDate = new Date();
  maturityDate.setDate(maturityDate.getDate() + Number(duration || 0));
  const { data: debtBalance } = useBalance({ [networks.MAINNET]: debtAddress || "" })[networks.MAINNET];
  const [insufficientCollateral, setInsufficientCollateral] = useState<boolean | undefined>();
  useEffect(() => {
    if (!debtBalance) {
      setInsufficientCollateral(undefined);
      return;
    }

    if (Number(debtBalance) < parseFloat(formatEther(totals.interest))) {
      setInsufficientCollateral(true);
    } else {
      setInsufficientCollateral(false);
    }
  }, [debtBalance, totals.interest]);

  const handleVersionChange = (event: SelectChangeEvent) => {
    setSelectedVersion(event.target.value as "v1" | "v2" | "v3");
  };

  const handleConsolidate = () => {
    if (!coolerAddress || !v3CoolerAddress) return;
    coolerMutation.mutate(
      {
        fromCoolerAddress: coolerAddress,
        toCoolerAddress: v3CoolerAddress,
        fromClearingHouseAddress: selectedClearingHouse.clearingHouseAddress,
        toClearingHouseAddress: clearingHouseAddresses.v3.clearingHouseAddress,
        loanIds,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setSelectedVersion("");
        },
      },
    );
  };

  const needsCoolerCreation = !v3CoolerAddress;

  if (!showConsolidateButton) return null;

  console.log(allowances, "allowances");

  return (
    <>
      <PrimaryButton onClick={() => setOpen(!open)}>Consolidate Loans</PrimaryButton>
      <Modal
        maxWidth="476px"
        minHeight="200px"
        open={open}
        headerContent={
          <Box display="flex" alignItems="center" gap="6px">
            <SvgIcon component={lendAndBorrowIcon} /> <Box fontWeight="500">Consolidate Loans</Box>
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
                    Select loans to consolidate
                  </MenuItem>
                  {hasV1Loans && <MenuItem value="v1">V1 Loans ({v1Loans?.length})</MenuItem>}
                  {hasV2Loans && <MenuItem value="v2">V2 Loans ({v2Loans?.length})</MenuItem>}
                  {hasMultipleV3Loans && <MenuItem value="v3">V3 Loans ({v3Loans?.length})</MenuItem>}
                </Select>
              </FormControl>
            </Box>
          )}
          {selectedVersion && (
            <>
              <InfoNotification>
                All existing open loans for this Cooler and Clearinghouse will be repaid and consolidated into a new
                loan with a {duration} day duration. You must hold enough {selectedClearingHouse.debtAssetName} in your
                wallet to cover the interest owed at consolidation.
              </InfoNotification>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                mb={"9px"}
                mt={"21px"}
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
                mt={"21px"}
              >
                <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>New Principal Amount</Typography>
                <Box display="flex" flexDirection="column" textAlign="right">
                  <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>
                    {formatNumber(parseFloat(formatEther(totals.principal)), 4)}{" "}
                    {clearingHouseAddresses.v3.debtAssetName}
                  </Typography>
                </Box>
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                mb={"9px"}
                mt={"21px"}
              >
                <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>Interest Owed At Consolidation</Typography>
                <Box display="flex" flexDirection="column" textAlign="right">
                  <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>
                    {formatNumber(parseFloat(formatEther(totals.interest)), 4)} {selectedClearingHouse.debtAssetName}
                  </Typography>
                </Box>
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                mb={"9px"}
                mt={"21px"}
              >
                <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>New Maturity Date</Typography>
                <Box display="flex" flexDirection="column" textAlign="right">
                  <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>
                    {maturityDate.toLocaleDateString([], {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }) || ""}{" "}
                    {maturityDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Box>
              </Box>
            </>
          )}
          {selectedVersion && !insufficientCollateral ? (
            <WalletConnectedGuard fullWidth>
              {needsCoolerCreation ? (
                <PrimaryButton
                  fullWidth
                  onClick={() =>
                    createCooler.mutate({
                      collateralAddress: clearingHouseAddresses.v3.collateralAddress,
                      debtAddress: clearingHouseAddresses.v3.debtAddress,
                      factoryAddress,
                    })
                  }
                  loading={createCooler.isLoading}
                  disabled={createCooler.isLoading}
                >
                  Create Cooler & Consolidate
                </PrimaryButton>
              ) : (
                <TokenAllowanceGuard
                  tokenAddressMap={{ [NetworkId.MAINNET]: selectedClearingHouse.debtAddress }}
                  spenderAddressMap={COOLER_CONSOLIDATION_ADDRESSES}
                  isVertical
                  message={
                    <>Approve {selectedClearingHouse.debtAssetName} for Spending on the Consolidation Contract</>
                  }
                  spendAmount={allowances?.totalDebtWithFee}
                  approvalText={`Approve ${selectedClearingHouse.debtAssetName} for Spending`}
                >
                  <TokenAllowanceGuard
                    tokenAddressMap={GOHM_ADDRESSES}
                    spenderAddressMap={COOLER_CONSOLIDATION_ADDRESSES}
                    isVertical
                    message={<>Approve gOHM for Spending on the Consolidation Contract</>}
                    spendAmount={allowances?.consolidatedLoanCollateral}
                    approvalText="Approve gOHM for Spending"
                  >
                    <PrimaryButton
                      onClick={handleConsolidate}
                      loading={coolerMutation.isLoading}
                      disabled={coolerMutation.isLoading || !selectedVersion}
                      fullWidth
                    >
                      Consolidate Loans
                    </PrimaryButton>
                  </TokenAllowanceGuard>
                </TokenAllowanceGuard>
              )}
            </WalletConnectedGuard>
          ) : (
            <PrimaryButton disabled fullWidth>
              {insufficientCollateral
                ? `Insufficient ${selectedClearingHouse.debtAssetName} Balance`
                : "Select loans to consolidate"}
            </PrimaryButton>
          )}
        </>
      </Modal>
    </>
  );
};
