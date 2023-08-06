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
  useTheme,
} from "@mui/material";
import { Metric, PrimaryButton, SecondaryButton, Token } from "@olympusdao/component-library";
import { ethers } from "ethers";
import { useState } from "react";
import PageTitle from "src/components/PageTitle";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { COOLER_CLEARING_HOUSE_ADDRESSES } from "src/constants/addresses";
import { formatCurrency } from "src/helpers";
import { useBalance } from "src/hooks/useBalance";
import { useOhmPrice } from "src/hooks/usePrices";
import { ExtendLoan } from "src/views/Lending/Cooler/ExtendLoan";
import { useCreateCooler } from "src/views/Lending/Cooler/hooks/useCreateCooler";
import { useCreateLoan } from "src/views/Lending/Cooler/hooks/useCreateLoan";
import { useGetClearingHouse } from "src/views/Lending/Cooler/hooks/useGetClearingHouse";
import { useGetCoolerForWallet } from "src/views/Lending/Cooler/hooks/useGetCoolerForWallet";
import { useGetCoolerLoans } from "src/views/Lending/Cooler/hooks/useGetCoolerLoans";
import { useAccount } from "wagmi";

export const Cooler = () => {
  const theme = useTheme();
  const { address } = useAccount();
  const { data: ohmPrice } = useOhmPrice();
  const { data: clearingHouse } = useGetClearingHouse();
  const { data: loans } = useGetCoolerLoans({
    walletAddress: address,
    factoryAddress: clearingHouse?.factory,
    collateralAddress: clearingHouse?.collateralAddress,
    debtAddress: clearingHouse?.debtAddress,
  });

  console.log("loans in page", loans);

  const createCooler = useCreateCooler();
  const { data: coolerAddress } = useGetCoolerForWallet({
    walletAddress: address,
    factoryAddress: clearingHouse?.factory,
    collateralAddress: clearingHouse?.collateralAddress,
    debtAddress: clearingHouse?.debtAddress,
  });
  const createLoan = useCreateLoan();
  console.log(clearingHouse, "clearingHouse");
  const { data: balance } = useBalance({ [1]: clearingHouse?.collateralAddress || "" })[1];
  const { data: daiBalance } = useBalance({ [1]: clearingHouse?.debtAddress || "" })[1];

  const [extendLoan, setExtendLoan] = useState<any>(null);

  console.log(clearingHouse?.collateralAddress, "collateralAddress", COOLER_CLEARING_HOUSE_ADDRESSES);
  return (
    <div id="stake-view">
      <PageTitle name="Cooler Loans" />
      <Box width="97%" maxWidth="974px">
        <Box>
          <Metric label="OHM Price" metric={ohmPrice ? formatCurrency(ohmPrice, 2) : <Skeleton />} />
        </Box>
        <Box mb="21px" mt="9px">
          <Typography variant="h1">Your Positions</Typography>
          <div>Borrow DAI from the Olympus Treasury against your gOHM</div>
        </Box>
        <Box display="flex" justifyContent="center">
          <Box textAlign="center">
            <Box fontWeight={700}>You currently have no Cooler loans</Box>
            <Box pt="9px">Borrow DAI against gOHM at a fixed rate and maturity</Box>
            <Box mt="21px">
              <PrimaryButton>Borrow DAI & Open Position</PrimaryButton>
            </Box>
          </Box>
        </Box>
        <Box display="flex" flexWrap="wrap" justifyContent="space-between" mt="50px" gap="20px">
          Cooler
        </Box>
        {coolerAddress && <Box>Cooler Address: {coolerAddress}</Box>}
        <Box>{loans && loans.length < 1 && "No Loans. You should create one"}</Box>
        {balance && <Box>{balance?.toString()} gOHM in wallet</Box>}
        {daiBalance && <Box>{daiBalance?.toString()} DAI in wallet</Box>}

        <PrimaryButton
          onClick={() =>
            clearingHouse?.collateralAddress &&
            clearingHouse?.debtAddress &&
            clearingHouse?.factory &&
            createCooler.mutate({
              collateralAddress: clearingHouse?.collateralAddress,
              debtAddress: clearingHouse?.debtAddress,
              factoryAddress: clearingHouse?.factory,
            })
          }
        >
          Create Cooler
        </PrimaryButton>
        {clearingHouse?.collateralAddress && (
          <TokenAllowanceGuard
            tokenAddressMap={{ [1]: clearingHouse?.collateralAddress }}
            spenderAddressMap={COOLER_CLEARING_HOUSE_ADDRESSES}
          >
            <PrimaryButton
              onClick={() => {
                coolerAddress &&
                  createLoan.mutate({
                    coolerAddress,
                  });
              }}
            >
              Create a Loan
            </PrimaryButton>
          </TokenAllowanceGuard>
        )}

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
              {loans?.map((loan, index) => (
                <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row" sx={{ padding: "9px" }}>
                    <Box display="flex" alignItems="center" gap="3px">
                      {loan.collateral && Number(ethers.utils.formatUnits(loan.collateral.toString())).toFixed(4)} gOHM{" "}
                      <Token name="gOHM" style={{ fontSize: "21px" }} />
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ padding: "9px" }}>
                    {loan.request?.interest && (
                      <Box>{Number(ethers.utils.formatUnits(loan.request.interest.toString())) * 100}%</Box>
                    )}
                  </TableCell>
                  <TableCell align="right" sx={{ padding: "9px" }}>
                    {loan.amount && (
                      <Box display="flex" justifyContent="end" alignItems={"center"} gap="3px">
                        {Number(ethers.utils.formatUnits(loan.amount.toString())).toFixed(2)} DAI{" "}
                        <Token name="DAI" style={{ fontSize: "21px" }} />
                      </Box>
                    )}
                    {loan.request?.amount && (
                      <Box display="flex" justifyContent="end" alignItems={"center"} gap="3px" fontSize={"12px"}>
                        Borrowed:{Number(ethers.utils.formatUnits(loan.request?.amount.toString())).toFixed(2)} DAI{" "}
                      </Box>
                    )}
                  </TableCell>
                  <TableCell align="right" sx={{ padding: "9px" }}>
                    {loan.expiry && <Box>{new Date(Number(loan.expiry.toString()) * 1000).toLocaleString()}</Box>}
                  </TableCell>
                  <TableCell align="right" sx={{ padding: "9px" }}>
                    <SecondaryButton>Repay</SecondaryButton>
                    <PrimaryButton onClick={() => setExtendLoan(loan)}>Extend</PrimaryButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <ExtendLoan
        loan={extendLoan}
        setLoan={setExtendLoan}
        loanToCollateral={clearingHouse?.loanToCollateral}
        interestRate={clearingHouse?.interestRate}
        duration={clearingHouse?.duration}
        coolerAddress={coolerAddress}
      />
    </div>
  );
};
