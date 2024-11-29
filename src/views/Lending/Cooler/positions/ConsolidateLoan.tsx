import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils.js";
import { useEffect, useState } from "react";
import { useBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useConsolidateCooler } from "src/views/Lending/Cooler/hooks/useConsolidateCooler";
import { useGetCoolerLoans } from "src/views/Lending/Cooler/hooks/useGetCoolerLoans";

export const ConsolidateLoans = ({
  coolerAddress,
  clearingHouseAddress,
  loans,
  duration,
  debtAddress,
}: {
  coolerAddress: string;
  clearingHouseAddress: string;
  loans: NonNullable<ReturnType<typeof useGetCoolerLoans>["data"]>;
  duration: string;
  debtAddress: string;
}) => {
  const coolerMutation = useConsolidateCooler();
  const networks = useTestableNetworks();
  const [open, setOpen] = useState(false);
  const loanIds = loans.map(loan => loan.loanId);
  const totals = loans.reduce(
    (acc, loan) => {
      acc.principal = acc.principal.add(loan.principal);
      acc.interest = acc.interest.add(loan.interestDue);
      acc.collateral = acc.collateral.add(loan.collateral);
      return acc;
    },
    { principal: BigNumber.from(0), interest: BigNumber.from(0), collateral: BigNumber.from(0) },
  );
  const maturityDate = new Date();
  maturityDate.setDate(maturityDate.getDate() + Number(duration || 0));
  const { data: daiBalance } = useBalance({ [networks.MAINNET]: debtAddress || "" })[networks.MAINNET];
  const [insufficientCollateral, setInsufficientCollateral] = useState<boolean | undefined>();
  useEffect(() => {
    if (!daiBalance) {
      setInsufficientCollateral(undefined);
      return;
    }

    if (Number(daiBalance) < parseFloat(formatEther(totals.interest))) {
      setInsufficientCollateral(true);
    } else {
      setInsufficientCollateral(false);
    }
  }, [daiBalance, totals.interest]);

  console.log("consolidate loans");
  return <></>;
};
