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
import { useCheckDelegation } from "src/views/Lending/Cooler/hooks/useCheckDelegation";
import { useGetClearingHouse } from "src/views/Lending/Cooler/hooks/useGetClearingHouse";
import { useGetCoolerForWallet } from "src/views/Lending/Cooler/hooks/useGetCoolerForWallet";
import { useGetCoolerLoans } from "src/views/Lending/Cooler/hooks/useGetCoolerLoans";
import { CreateOrRepayLoan } from "src/views/Lending/Cooler/positions/CreateOrRepayLoan";
import { DelegateVoting } from "src/views/Lending/Cooler/positions/DelegateVoting";
import { ExtendLoan } from "src/views/Lending/Cooler/positions/ExtendLoan";
import { LiquidityCTA } from "src/views/Liquidity/LiquidityCTA";
import { useAccount } from "wagmi";

export const CoolerPositions = () => {
  const { address } = useAccount();
  const [currentClearingHouse, setCurrentClearingHouse] = useState<"clearingHouseV1" | "clearingHouseV2">(
    "clearingHouseV2",
  );
  const { data: clearingHouse } = useGetClearingHouse({ clearingHouse: currentClearingHouse });
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
    clearingHouseVersion: currentClearingHouse,
  });
  const { data: delegationAddress } = useCheckDelegation({ coolerAddress });

  const [extendLoan, setExtendLoan] = useState<any>(null);
  const [repayLoan, setRepayLoan] = useState<any>(null);
  const [delegateVoting, setDelegateVoting] = useState<any>(null);
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
          <Box display="flex" justifyContent={"center"} mt="16px">
            <PrimaryButton onClick={() => setDelegateVoting(true)}>Delegate Voting</PrimaryButton>
          </Box>
          <Box display="flex" fontSize="12px" justifyContent={"center"}></Box>
          <DelegateVoting
            coolerAddress={coolerAddress}
            open={delegateVoting}
            setOpen={setDelegateVoting}
            currentDelegateAddress={delegationAddress}
          />
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

      <LiquidityCTA />
    </div>
  );
};
