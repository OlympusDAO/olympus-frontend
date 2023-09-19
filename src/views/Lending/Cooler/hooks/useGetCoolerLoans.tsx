import { useMemo, useState } from "react";
import { SnapshotLoans } from "src/generated/coolerLoans";
import { useSnapshotLatest } from "src/views/Lending/Cooler/hooks/useSnapshot";
import { ValuesType } from "utility-types";
import { useSigner } from "wagmi";

export type SnapshotLoan = ValuesType<SnapshotLoans>;

export const useGetCoolerLoans = ({
  walletAddress,
  factoryAddress,
  collateralAddress,
  debtAddress,
}: {
  walletAddress?: string;
  factoryAddress?: string;
  collateralAddress?: string;
  debtAddress?: string;
}) => {
  const { data: signer } = useSigner();

  const { latestSnapshot } = useSnapshotLatest();

  const [loans, setLoans] = useState<SnapshotLoan[] | undefined>(undefined);
  useMemo(() => {
    if (!latestSnapshot || !factoryAddress || !collateralAddress || !debtAddress || !signer) {
      setLoans(undefined);
      return;
    }

    const originalLoans = latestSnapshot.loans ? Array.from(Object.values(latestSnapshot.loans)) : [];
    const tempLoans = originalLoans.filter(loan => loan.collateralDeposited != 0 && loan.principal != 0);
    setLoans(tempLoans);
  }, [latestSnapshot, factoryAddress, collateralAddress, debtAddress, signer]);

  return { loans };
};

export const useGetCoolerLoansForWallet = ({ walletAddress }: { walletAddress?: string }) => {
  const { latestSnapshot } = useSnapshotLatest();

  const [loans, setLoans] = useState<SnapshotLoan[] | undefined>(undefined);
  useMemo(() => {
    if (!latestSnapshot || !walletAddress) {
      setLoans(undefined);
      return;
    }

    const originalLoans = latestSnapshot.loans ? Array.from(Object.values(latestSnapshot.loans)) : [];
    const tempLoans = originalLoans.filter(loan => loan.borrowerAddress == walletAddress);
    setLoans(tempLoans);
  }, [latestSnapshot, walletAddress]);

  return { loans };
};
