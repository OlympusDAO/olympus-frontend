import {
  Box,
  Grid,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { PrimaryButton, SecondaryButton, Token } from "@olympusdao/component-library";
import { ethers } from "ethers";
import { useState } from "react";
import { BorrowRate, OutstandingPrincipal, WeeklyCapacityRemaining } from "src/views/Lending/Cooler/dashboard/Metrics";
import { useGetClearingHouse } from "src/views/Lending/Cooler/hooks/useGetClearingHouse";
import { useGetCoolerForWallet } from "src/views/Lending/Cooler/hooks/useGetCoolerForWallet";
import { useGetCoolerLoans } from "src/views/Lending/Cooler/hooks/useGetCoolerLoans";
import { CreateOrRepayLoan } from "src/views/Lending/Cooler/positions/CreateOrRepayLoan";
import { ExtendLoan } from "src/views/Lending/Cooler/positions/ExtendLoan";
import { useAccount } from "wagmi";

export const CoolerPositions = () => {
  const { address } = useAccount();
  const [currentClearingHouse, setCurrentClearingHouse] = useState<"clearingHouseV1" | "clearingHouseV2">(
    "clearingHouseV2",
  );
  const { data: clearingHouseV1 } = useGetClearingHouse({ clearingHouse: "clearingHouseV1" });
  const { data: clearingHouseV2 } = useGetClearingHouse({ clearingHouse: "clearingHouseV2" });

  const [createLoanModalOpen, setCreateLoanModalOpen] = useState(false);
  const { data: loansV1, isFetched: isFetchedLoansV1 } = useGetCoolerLoans({
    walletAddress: address,
    factoryAddress: clearingHouseV1?.factory,
    collateralAddress: clearingHouseV1?.collateralAddress,
    debtAddress: clearingHouseV1?.debtAddress,
  });

  const { data: coolerAddressV1 } = useGetCoolerForWallet({
    walletAddress: address,
    factoryAddress: clearingHouseV1?.factory,
    collateralAddress: clearingHouseV1?.collateralAddress,
    debtAddress: clearingHouseV1?.debtAddress,
    clearingHouseVersion: "clearingHouseV1",
  });

  const { data: loansV2, isFetched: isFetchedLoansV2 } = useGetCoolerLoans({
    walletAddress: address,
    factoryAddress: clearingHouseV2?.factory,
    collateralAddress: clearingHouseV2?.collateralAddress,
    debtAddress: clearingHouseV2?.debtAddress,
  });

  const { data: coolerAddressV2 } = useGetCoolerForWallet({
    walletAddress: address,
    factoryAddress: clearingHouseV2?.factory,
    collateralAddress: clearingHouseV2?.collateralAddress,
    debtAddress: clearingHouseV2?.debtAddress,
    clearingHouseVersion: "clearingHouseV2",
  });

  const coolerAddress = currentClearingHouse === "clearingHouseV1" ? coolerAddressV1 : coolerAddressV2;
  const clearingHouse = currentClearingHouse === "clearingHouseV1" ? clearingHouseV1 : clearingHouseV2;
  const loans = currentClearingHouse === "clearingHouseV1" ? loansV1 : loansV2;
  const isFetchedLoans = currentClearingHouse === "clearingHouseV1" ? isFetchedLoansV1 : isFetchedLoansV2;

  const [extendLoan, setExtendLoan] = useState<any>(null);
  const [repayLoan, setRepayLoan] = useState<any>(null);
  const theme = useTheme();

  return (
    <div id="cooler-positions">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <WeeklyCapacityRemaining capacity={clearingHouse?.capacity} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <BorrowRate />
        </Grid>
        <Grid item xs={12} sm={4}>
          <OutstandingPrincipal />
        </Grid>
      </Grid>
      {clearingHouseV1 && loansV1 && loansV1.length > 0 && (
        <Box display="flex" mt="16px" justifyContent="right">
          <Select
            value={currentClearingHouse}
            label="ClearingHouse"
            onChange={e => {
              setCurrentClearingHouse(e.target.value as "clearingHouseV1" | "clearingHouseV2");
            }}
            sx={{
              width: "200px",
              height: "44px",
              backgroundColor: theme.colors.gray[700],
              border: "none",
              ".MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
              },
            }}
          >
            <MenuItem value="clearingHouseV1">ClearingHouse V1</MenuItem>
            <MenuItem value="clearingHouseV2">ClearingHouse V2</MenuItem>
          </Select>
        </Box>
      )}

      <Box mb="21px" mt="66px">
        <Typography variant="h1">Your Positions</Typography>
        <div>Borrow DAI from the Olympus Treasury against your gOHM</div>
      </Box>

      {!address && (
        <Box display="flex" justifyContent="center">
          <Typography variant="h4">Please connect your wallet in order to view your positions</Typography>
        </Box>
      )}

      {address && !isFetchedLoans && (
        <Box display="flex" justifyContent="center">
          <Skeleton variant="rectangular" width="100%" height={100} />
        </Box>
      )}

      {loans && loans.length == 0 && isFetchedLoans && (
        <Box display="flex" justifyContent="center">
          <Box textAlign="center">
            <Box fontWeight={700}>You currently have no Cooler loans</Box>
            <Box pt="9px">Borrow DAI against gOHM at a fixed rate and maturity</Box>
            <Box mt="21px">
              <PrimaryButton
                onClick={() => {
                  setRepayLoan(undefined);
                  setCreateLoanModalOpen(true);
                }}
              >
                Borrow DAI & Open Position
              </PrimaryButton>
            </Box>
          </Box>
        </Box>
      )}

      {coolerAddress && (
        <>
          {loans && loans.length > 0 && (
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
                    {loans?.map((loan, index) => {
                      const principalAndInterest = loan.principal.add(loan.interestDue || 0) || 0;
                      return (
                        <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell component="th" scope="row" sx={{ padding: "9px" }}>
                            <Box display="flex" alignItems="center" gap="3px">
                              {loan.collateral &&
                                Number(ethers.utils.formatUnits(loan.collateral.toString())).toFixed(4)}{" "}
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
                                {Number(ethers.utils.formatUnits(principalAndInterest.toString())).toFixed(2)} DAI{" "}
                                <Token name="DAI" style={{ fontSize: "21px" }} />
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
              <Box display="flex" justifyContent={"center"}>
                <PrimaryButton
                  onClick={() => {
                    setRepayLoan(undefined);
                    setCreateLoanModalOpen(true);
                  }}
                >
                  Borrow DAI & Open Position
                </PrimaryButton>
              </Box>
            </>
          )}
        </>
      )}

      {clearingHouse && (
        <>
          {extendLoan && (
            <ExtendLoan
              loan={extendLoan}
              setLoan={setExtendLoan}
              loanToCollateral={clearingHouse.loanToCollateral}
              interestRate={clearingHouse.interestRate}
              duration={clearingHouse.duration}
              coolerAddress={coolerAddress}
              debtAddress={clearingHouse.debtAddress}
              clearingHouseAddress={clearingHouse.clearingHouseAddress}
            />
          )}
          <CreateOrRepayLoan
            collateralAddress={clearingHouse.collateralAddress}
            debtAddress={clearingHouse.debtAddress}
            interestRate={clearingHouse.interestRate}
            loanToCollateral={clearingHouse.loanToCollateral}
            duration={clearingHouse.duration}
            coolerAddress={coolerAddress}
            factoryAddress={clearingHouse.factory}
            capacity={ethers.utils.formatUnits(clearingHouse?.capacity || "0")}
            setModalOpen={setCreateLoanModalOpen}
            modalOpen={createLoanModalOpen}
            loan={repayLoan}
            clearingHouseAddress={clearingHouse.clearingHouseAddress}
          />
        </>
      )}
    </div>
  );
};
