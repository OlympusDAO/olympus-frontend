import { Box, Skeleton, useTheme } from "@mui/material";
import { Metric, PrimaryButton } from "@olympusdao/component-library";
import { ethers } from "ethers";
import PageTitle from "src/components/PageTitle";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { COOLER_CLEARING_HOUSE_ADDRESSES } from "src/constants/addresses";
import { formatCurrency } from "src/helpers";
import { useBalance } from "src/hooks/useBalance";
import { useOhmPrice } from "src/hooks/usePrices";
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
  const { data: balance } = useBalance({ [5]: clearingHouse?.collateralAddress || "" })[5];

  console.log(clearingHouse?.collateralAddress, "collateralAddress", COOLER_CLEARING_HOUSE_ADDRESSES);
  return (
    <div id="stake-view">
      <PageTitle name="Lend and Borrow" />
      <Box width="97%" maxWidth="974px">
        <Box>
          <Metric label="OHM Price" metric={ohmPrice ? formatCurrency(ohmPrice, 2) : <Skeleton />} />
        </Box>
        <Box display="flex" flexWrap="wrap" justifyContent="space-between" mt="50px" gap="20px">
          Cooler
        </Box>
        {coolerAddress && <Box>Cooler Address: {coolerAddress}</Box>}
        <Box>{loans && loans.length < 1 && "No Loans. You should create one"}</Box>
        {balance && <Box>{balance?.toString()} gOHM in wallet</Box>}
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
            tokenAddressMap={{ [5]: clearingHouse?.collateralAddress }}
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
        {loans?.map(loan => (
          <Box>
            {loan.collateral && <Box>Loan Collateral: {ethers.utils.formatUnits(loan.collateral.toString())}</Box>}
            {loan.expiry && (
              <Box>Loan Expiration: {new Date(Number(loan.expiry.toString()) * 1000).toLocaleString()}</Box>
            )}
            {loan.amount && <Box>Loan Amount: {ethers.utils.formatUnits(loan.amount)}</Box>}
          </Box>
        ))}
      </Box>
    </div>
  );
};
