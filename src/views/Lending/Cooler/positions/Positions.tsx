import {
  Box,
  Grid,
  Paper,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { OHMTokenProps, PrimaryButton, SecondaryButton, Token } from "@olympusdao/component-library";
import { ethers } from "ethers";
import { useState } from "react";
import usdsIcon from "src/assets/tokens/usds.svg?react";
import { BorrowRate, OutstandingPrincipal, WeeklyCapacityRemaining } from "src/views/Lending/Cooler/dashboard/Metrics";
import { useGetClearingHouse } from "src/views/Lending/Cooler/hooks/useGetClearingHouse";
import { useGetCoolerForWallet } from "src/views/Lending/Cooler/hooks/useGetCoolerForWallet";
import { useGetCoolerLoans } from "src/views/Lending/Cooler/hooks/useGetCoolerLoans";
import { ConsolidateLoans } from "src/views/Lending/Cooler/positions/ConsolidateLoan";
import { CreateOrRepayLoan } from "src/views/Lending/Cooler/positions/CreateOrRepayLoan";
import { ExtendLoan } from "src/views/Lending/Cooler/positions/ExtendLoan";
import { useAccount } from "wagmi";

export const CoolerPositions = () => {
  const { address } = useAccount();
  const clearingHouses = {
    v1: useGetClearingHouse({ clearingHouse: "clearingHouseV1" }).data,
    v2: useGetClearingHouse({ clearingHouse: "clearingHouseV2" }).data,
    v3: useGetClearingHouse({ clearingHouse: "clearingHouseV3" }).data,
  };

  const [createLoanModalOpen, setCreateLoanModalOpen] = useState(false);
  const { data: loansV1, isFetched: isFetchedLoansV1 } = useGetCoolerLoans({
    walletAddress: address,
    factoryAddress: clearingHouses.v1?.factory,
    collateralAddress: clearingHouses.v1?.collateralAddress,
    debtAddress: clearingHouses.v1?.debtAddress,
  });

  const { data: coolerAddressV1 } = useGetCoolerForWallet({
    walletAddress: address,
    factoryAddress: clearingHouses.v1?.factory,
    collateralAddress: clearingHouses.v1?.collateralAddress,
    debtAddress: clearingHouses.v1?.debtAddress,
    clearingHouseVersion: "clearingHouseV1",
  });

  const { data: loansV2, isFetched: isFetchedLoansV2 } = useGetCoolerLoans({
    walletAddress: address,
    factoryAddress: clearingHouses.v2?.factory,
    collateralAddress: clearingHouses.v2?.collateralAddress,
    debtAddress: clearingHouses.v2?.debtAddress,
  });

  const { data: coolerAddressV2 } = useGetCoolerForWallet({
    walletAddress: address,
    factoryAddress: clearingHouses.v2?.factory,
    collateralAddress: clearingHouses.v2?.collateralAddress,
    debtAddress: clearingHouses.v2?.debtAddress,
    clearingHouseVersion: "clearingHouseV2",
  });

  const { data: loansV3, isFetched: isFetchedLoansV3 } = useGetCoolerLoans({
    walletAddress: address,
    factoryAddress: clearingHouses.v3?.factory,
    collateralAddress: clearingHouses.v3?.collateralAddress,
    debtAddress: clearingHouses.v3?.debtAddress,
  });

  const { data: coolerAddressV3 } = useGetCoolerForWallet({
    walletAddress: address,
    factoryAddress: clearingHouses.v3?.factory,
    collateralAddress: clearingHouses.v3?.collateralAddress,
    debtAddress: clearingHouses.v3?.debtAddress,
    clearingHouseVersion: "clearingHouseV3",
  });

  const [extendLoan, setExtendLoan] = useState<ReturnType<typeof getAllLoans>[number] | undefined>(undefined);
  const [repayLoan, setRepayLoan] = useState<ReturnType<typeof getAllLoans>[number] | undefined>(undefined);

  const getAllLoans = () => {
    const allLoans = [
      ...(loansV1 || []).map(loan => ({ ...loan, version: "v1" })),
      ...(loansV2 || []).map(loan => ({ ...loan, version: "v2" })),
      ...(loansV3 || []).map(loan => ({ ...loan, version: "v3" })),
    ];
    return allLoans;
  };

  const getActiveClearingHouse = () => {
    if (clearingHouses.v3?.isActive && clearingHouses.v3?.capacity.gt(0)) {
      return { version: "v3", ...clearingHouses.v3 };
    }
    if (clearingHouses.v2?.isActive && clearingHouses.v2?.capacity.gt(0)) {
      return { version: "v2", ...clearingHouses.v2 };
    }
    return null;
  };

  const activeClearingHouse = getActiveClearingHouse();
  const allLoans = getAllLoans();

  const getClearingHouseForLoan = (version: string) => {
    const clearingHouse = clearingHouses[version as keyof typeof clearingHouses];
    if (!clearingHouse) throw new Error(`No clearing house found for version ${version}`);
    return clearingHouse;
  };

  const getCoolerAddressForLoan = (version: string) => {
    switch (version) {
      case "v1":
        return coolerAddressV1;
      case "v2":
        return coolerAddressV2;
      case "v3":
        return coolerAddressV3;
      default:
        return undefined;
    }
  };

  console.log(allLoans, isFetchedLoansV1, isFetchedLoansV2, isFetchedLoansV3, address);
  console.log(coolerAddressV1, coolerAddressV2, coolerAddressV3);
  return (
    <div id="cooler-positions">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <WeeklyCapacityRemaining
            capacity={activeClearingHouse?.capacity}
            reserveAsset={activeClearingHouse?.debtAssetName}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <BorrowRate />
        </Grid>
        <Grid item xs={12} sm={4}>
          <OutstandingPrincipal />
        </Grid>
      </Grid>

      <Box mb="21px" mt="66px">
        <Typography variant="h1">Your Positions</Typography>
        <div>Borrow from the Olympus Treasury against your gOHM</div>
      </Box>

      {!address && (
        <Box display="flex" justifyContent="center">
          <Typography variant="h4">Please connect your wallet in order to view your positions</Typography>
        </Box>
      )}

      {allLoans.length === 0 && isFetchedLoansV1 && isFetchedLoansV2 && isFetchedLoansV3 && address && (
        <Box display="flex" justifyContent="center">
          <Box textAlign="center">
            <Box fontWeight={700}>You currently have no Cooler loans</Box>
            {activeClearingHouse && (
              <>
                <Box pt="9px">Borrow against gOHM at a fixed rate and maturity</Box>
                <Box mt="21px">
                  <PrimaryButton
                    onClick={() => {
                      setRepayLoan(undefined);
                      setCreateLoanModalOpen(true);
                    }}
                  >
                    Borrow {activeClearingHouse.debtAssetName} & Open Position
                  </PrimaryButton>
                </Box>
              </>
            )}
          </Box>
        </Box>
      )}

      {address && (!isFetchedLoansV1 || !isFetchedLoansV2 || !isFetchedLoansV3) && (
        <Box display="flex" justifyContent="center">
          <Typography variant="h4">Loading your positions...</Typography>
        </Box>
      )}

      {allLoans.length > 0 && (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: "15px", padding: "9px" }}>Collateral</TableCell>
                  <TableCell sx={{ fontSize: "15px", padding: "9px" }} align="right">
                    Interest Rate
                  </TableCell>
                  <TableCell sx={{ fontSize: "15px", padding: "9px" }} align="right">
                    Repayment
                  </TableCell>
                  <TableCell sx={{ fontSize: "15px", padding: "9px" }} align="right">
                    Maturity Date
                  </TableCell>
                  <TableCell sx={{ fontSize: "15px", padding: "9px" }} align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allLoans.map((loan, index) => {
                  const principalAndInterest = loan.principal.add(loan.interestDue || 0) || 0;
                  return (
                    <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell component="th" scope="row" sx={{ padding: "9px" }}>
                        <Box display="flex" alignItems="center" gap="3px">
                          {loan.collateral && Number(ethers.utils.formatUnits(loan.collateral.toString())).toFixed(4)}{" "}
                          gOHM <Token name="gOHM" style={{ fontSize: "21px" }} />
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ padding: "9px" }}>
                        {loan.request?.interest && (
                          <Box>{Number(ethers.utils.formatUnits(loan.request.interest.toString())) * 100}%</Box>
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ padding: "9px" }}>
                        {principalAndInterest && (
                          <Box display="flex" justifyContent="end" alignItems={"center"} gap="3px">
                            {Number(ethers.utils.formatUnits(principalAndInterest.toString())).toFixed(2)}{" "}
                            {loan.debtAssetName}{" "}
                            {loan.debtAssetName === "USDS" ? (
                              <SvgIcon
                                color="primary"
                                sx={{ width: "20px", height: "20px" }}
                                viewBox="0 0 50 50"
                                component={usdsIcon}
                              />
                            ) : (
                              <Token name={loan.debtAssetName as OHMTokenProps["name"]} style={{ fontSize: "21px" }} />
                            )}
                          </Box>
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ padding: "9px" }}>
                        {loan.expiry && (
                          <Box>
                            {new Date(Number(loan.expiry.toString()) * 1000).toLocaleString([], {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }) || ""}
                          </Box>
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ padding: "9px" }}>
                        <Box display="flex">
                          <SecondaryButton
                            onClick={() => {
                              setRepayLoan(loan);
                              setCreateLoanModalOpen(true);
                            }}
                          >
                            Repay
                          </SecondaryButton>
                          <PrimaryButton onClick={() => setExtendLoan(loan)}>Extend</PrimaryButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {activeClearingHouse && (
            <Box display="flex" justifyContent={"center"} gap="4px">
              <PrimaryButton
                onClick={() => {
                  setRepayLoan(undefined);
                  setCreateLoanModalOpen(true);
                }}
              >
                Borrow {activeClearingHouse.debtAssetName} & Open Position
              </PrimaryButton>
              {allLoans.length > 1 && (
                <ConsolidateLoans
                  v3CoolerAddress={coolerAddressV3 || ""}
                  v2CoolerAddress={coolerAddressV2 || ""}
                  v1CoolerAddress={coolerAddressV1 || ""}
                  clearingHouseAddresses={clearingHouses}
                  v1Loans={loansV1}
                  v2Loans={loansV2}
                  v3Loans={loansV3}
                />
              )}
            </Box>
          )}
        </>
      )}

      {activeClearingHouse && (
        <>
          {extendLoan && getClearingHouseForLoan(extendLoan.version) && getCoolerAddressForLoan(extendLoan.version) && (
            <ExtendLoan
              loan={extendLoan}
              setLoan={setExtendLoan}
              loanToCollateral={getClearingHouseForLoan(extendLoan.version).loanToCollateral}
              interestRate={getClearingHouseForLoan(extendLoan.version).interestRate}
              duration={getClearingHouseForLoan(extendLoan.version).duration}
              coolerAddress={getCoolerAddressForLoan(extendLoan.version) || ""}
              debtAddress={getClearingHouseForLoan(extendLoan.version).debtAddress}
              clearingHouseAddress={getClearingHouseForLoan(extendLoan.version).clearingHouseAddress}
              debtAssetName={getClearingHouseForLoan(extendLoan.version).debtAssetName}
            />
          )}
          <CreateOrRepayLoan
            collateralAddress={
              repayLoan && getClearingHouseForLoan(repayLoan.version)
                ? getClearingHouseForLoan(repayLoan.version).collateralAddress
                : activeClearingHouse.collateralAddress
            }
            debtAddress={
              repayLoan && getClearingHouseForLoan(repayLoan.version)
                ? getClearingHouseForLoan(repayLoan.version).debtAddress
                : activeClearingHouse.debtAddress
            }
            interestRate={
              repayLoan && getClearingHouseForLoan(repayLoan.version)
                ? getClearingHouseForLoan(repayLoan.version).interestRate
                : activeClearingHouse.interestRate
            }
            loanToCollateral={
              repayLoan && getClearingHouseForLoan(repayLoan.version)
                ? getClearingHouseForLoan(repayLoan.version).loanToCollateral
                : activeClearingHouse.loanToCollateral
            }
            duration={
              repayLoan && getClearingHouseForLoan(repayLoan.version)
                ? getClearingHouseForLoan(repayLoan.version).duration
                : activeClearingHouse.duration
            }
            coolerAddress={
              repayLoan && getCoolerAddressForLoan(repayLoan.version)
                ? getCoolerAddressForLoan(repayLoan.version)
                : coolerAddressV3 || ""
            }
            factoryAddress={
              repayLoan && getClearingHouseForLoan(repayLoan.version)
                ? getClearingHouseForLoan(repayLoan.version).factory
                : activeClearingHouse.factory
            }
            capacity={ethers.utils.formatUnits(activeClearingHouse.capacity || "0")}
            setModalOpen={setCreateLoanModalOpen}
            modalOpen={createLoanModalOpen}
            loan={repayLoan}
            clearingHouseAddress={
              repayLoan && getClearingHouseForLoan(repayLoan.version)
                ? getClearingHouseForLoan(repayLoan.version).clearingHouseAddress
                : activeClearingHouse.clearingHouseAddress
            }
            debtAssetName={
              repayLoan && getClearingHouseForLoan(repayLoan.version)
                ? getClearingHouseForLoan(repayLoan.version).debtAssetName
                : activeClearingHouse.debtAssetName
            }
          />
        </>
      )}
    </div>
  );
};
