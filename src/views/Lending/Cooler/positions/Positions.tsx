import {
  Box,
  Grid,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
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
import { LiquidityCTA } from "src/views/Liquidity/LiquidityCTA";
import { useAccount } from "wagmi";

export const CoolerPositions = () => {
  const { address } = useAccount();
  const { data: clearingHouse } = useGetClearingHouse();
  const [createLoanModalOpen, setCreateLoanModalOpen] = useState(false);
  const { data: loans, isFetched: isFetchedLoans } = useGetCoolerLoans({
    walletAddress: address,
    factoryAddress: clearingHouse?.factory,
    collateralAddress: clearingHouse?.collateralAddress,
    debtAddress: clearingHouse?.debtAddress,
  });

  const { data: coolerAddress } = useGetCoolerForWallet({
    walletAddress: address,
    factoryAddress: clearingHouse?.factory,
    collateralAddress: clearingHouse?.collateralAddress,
    debtAddress: clearingHouse?.debtAddress,
  });

  const [extendLoan, setExtendLoan] = useState<any>(null);
  const [repayLoan, setRepayLoan] = useState<any>(null);

  return (
    <div id="cooler-positions">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <WeeklyCapacityRemaining />
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
          />
        </>
      )}

      <LiquidityCTA />
    </div>
  );
};
