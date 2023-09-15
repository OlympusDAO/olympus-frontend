import { ArrowBack } from "@mui/icons-material";
import {
  Box,
  Link,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Metric, PrimaryButton, SecondaryButton, Token } from "@olympusdao/component-library";
import { ethers } from "ethers";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import PageTitle from "src/components/PageTitle";
import { formatCurrency } from "src/helpers";
import { CreateOrRepayLoan } from "src/views/Lending/Cooler/CreateOrRepayLoan";
import { ExtendLoan } from "src/views/Lending/Cooler/ExtendLoan";
import { useGetClearingHouse } from "src/views/Lending/Cooler/hooks/useGetClearingHouse";
import { useGetCoolerForWallet } from "src/views/Lending/Cooler/hooks/useGetCoolerForWallet";
import { useGetCoolerLoans } from "src/views/Lending/Cooler/hooks/useGetCoolerLoans";
import { useAccount } from "wagmi";

export const Cooler = () => {
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
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div id="stake-view">
      <PageTitle
        name={
          <Box display="flex" flexDirection="row" alignItems="center" mt={mobile ? "50px" : "0px"}>
            <Link component={RouterLink} to="/lending">
              <Box display="flex" flexDirection="row">
                <ArrowBack />
                <Typography fontWeight="500" marginLeft="9.5px" marginRight="18px"></Typography>
              </Box>
            </Link>
            <Box display="flex" flexDirection="column" ml={1} justifyContent="center" alignItems="center">
              <Typography fontSize="32px" fontWeight={500}>
                Cooler Loans
              </Typography>
            </Box>
          </Box>
        }
      />
      <Box width="97%" maxWidth="974px">
        <Box display="flex" flexDirection="row" justifyContent="center">
          <Box display="flex" flexDirection="row" width={["100%", "70%"]} mt="24px" flexWrap={"wrap"}>
            <Metric
              label="Borrow Rate"
              metric={clearingHouse?.interestRate ? `${clearingHouse.interestRate}%` : <Skeleton />}
            />
            <Metric
              label="Available Borrow Capacity"
              metric={
                clearingHouse?.capacity ? (
                  formatCurrency(Number(ethers.utils.formatUnits(clearingHouse?.capacity || "0")), 2)
                ) : (
                  <Skeleton />
                )
              }
            />
          </Box>
        </Box>
        <Box mb="21px" mt="66px">
          <Typography variant="h1">Your Positions</Typography>
          <div>Borrow DAI from the Olympus Treasury against your gOHM</div>
        </Box>
        {loans && loans.length < 1 && isFetchedLoans && (
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
                          Annual Interest Rate
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
                                  {new Date(Number(loan.expiry.toString()) * 1000).toLocaleDateString([], {
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
                    Open Position & Borrow DAI
                  </PrimaryButton>
                </Box>
              </>
            )}
          </>
        )}
      </Box>

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
    </div>
  );
};
