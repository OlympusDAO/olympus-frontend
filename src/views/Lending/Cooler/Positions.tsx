import {
  Box,
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
import { useState } from "react";
import { formatCurrency, formatNumber } from "src/helpers";
import { CreateLoan } from "src/views/Lending/Cooler/CreateLoan";
import { ExtendLoan } from "src/views/Lending/Cooler/ExtendLoan";
import { useGetClearingHouse } from "src/views/Lending/Cooler/hooks/useGetClearingHouse";
import { useGetCoolerForWallet } from "src/views/Lending/Cooler/hooks/useGetCoolerForWallet";
import { useGetCoolerLoans } from "src/views/Lending/Cooler/hooks/useGetCoolerLoans";
import { getCapacity, useSnapshotLatest } from "src/views/Lending/Cooler/hooks/useSnapshot";
import { RepayLoan } from "src/views/Lending/Cooler/RepayLoan";
import { useAccount } from "wagmi";

export const CoolerPositions = () => {
  const { address } = useAccount();
  const { data: clearingHouse } = useGetClearingHouse();
  const { latestSnapshot } = useSnapshotLatest();
  const [createLoanModalOpen, setCreateLoanModalOpen] = useState(false);
  const { loans } = useGetCoolerLoans({
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

  // TODO handle wallet not connected

  return (
    <div id="cooler-positions">
      <Box mb="21px" mt="66px">
        <Typography variant="h1">Your Positions</Typography>
        <div>Borrow DAI from the Olympus Treasury against your gOHM</div>
      </Box>

      {loans && (
        <Box display="flex" justifyContent="center">
          <Skeleton variant="rectangular" width="100%" height={100} />
        </Box>
      )}

      {loans && loans.length == 0 && (
        <Box display="flex" justifyContent="center">
          <Box textAlign="center">
            <Box fontWeight={700}>You currently have no Cooler loans</Box>
            <Box pt="9px">Borrow DAI against gOHM at a fixed rate and maturity</Box>
            <Box mt="21px">
              <PrimaryButton onClick={() => setCreateLoanModalOpen(true)}>Borrow DAI & Open Position</PrimaryButton>
            </Box>
          </Box>
        </Box>
      )}

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
                {loans.map((loan, index) => (
                  <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell component="th" scope="row" sx={{ padding: "9px" }}>
                      <Box display="flex" alignItems="center" gap="3px">
                        {loan.collateralDeposited && formatNumber(loan.collateralDeposited, 4)} gOHM{" "}
                        <Token name="gOHM" style={{ fontSize: "21px" }} />
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ padding: "9px" }}>
                      {loan.interest && <Box>{loan.interest * 100}%</Box>}
                    </TableCell>
                    <TableCell align="right" sx={{ padding: "9px" }}>
                      {loan.principal && (
                        <Box display="flex" justifyContent="end" alignItems={"center"} gap="3px">
                          {formatCurrency(loan.principal, 2, "DAI")}
                          <Token name="DAI" style={{ fontSize: "21px" }} />
                        </Box>
                      )}
                    </TableCell>
                    <TableCell align="right" sx={{ padding: "9px" }}>
                      {loan.expiryTimestamp && <Box>{new Date(loan.expiryTimestamp * 1000).toLocaleString()}</Box>}
                    </TableCell>
                    <TableCell align="right" sx={{ padding: "9px" }}>
                      <Box display="flex">
                        <SecondaryButton onClick={() => setRepayLoan(loan)}>Repay</SecondaryButton>
                        <PrimaryButton onClick={() => setExtendLoan(loan)}>Extend</PrimaryButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box display="flex" justifyContent={"center"}>
            <PrimaryButton onClick={() => setCreateLoanModalOpen(true)}>Borrow DAI & Open Position</PrimaryButton>
          </Box>
        </>
      )}

      {latestSnapshot && clearingHouse && (
        <>
          {extendLoan && (
            <ExtendLoan
              loan={extendLoan}
              setLoan={setExtendLoan}
              loanToCollateral={latestSnapshot?.terms?.loanToCollateral}
              interestRate={latestSnapshot?.terms?.interestRate}
              duration={latestSnapshot?.terms?.duration}
              coolerAddress={coolerAddress}
              collateralAddress={clearingHouse.collateralAddress}
            />
          )}
          {repayLoan && (
            <RepayLoan
              loan={repayLoan}
              setLoan={setRepayLoan}
              coolerAddress={coolerAddress}
              loanToCollateral={latestSnapshot?.terms?.loanToCollateral}
              debtAddress={clearingHouse.debtAddress}
            />
          )}
          <CreateLoan
            collateralAddress={clearingHouse.collateralAddress}
            debtAddress={clearingHouse.debtAddress}
            interestRate={latestSnapshot?.terms?.interestRate}
            loanToCollateral={latestSnapshot?.terms?.loanToCollateral}
            duration={latestSnapshot?.terms?.duration}
            coolerAddress={coolerAddress}
            factoryAddress={clearingHouse.factory}
            capacity={getCapacity(latestSnapshot).toString()}
            setModalOpen={setCreateLoanModalOpen}
            modalOpen={createLoanModalOpen}
          />
        </>
      )}
    </div>
  );
};
