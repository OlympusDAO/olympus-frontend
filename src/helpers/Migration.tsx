import { useMemo } from "react";
import { useAppSelector } from "src/hooks";

export const formatCurrency = (c: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(c);
};

export function useMigrationData() {
  const indexV1 = useAppSelector(state => Number(state.app.currentIndexV1!));
  const currentIndex = useAppSelector(state => Number(state.app.currentIndex));

  const currentOhmBalance = useAppSelector(state => state.account.balances.ohmV1);
  const currentSOhmBalance = useAppSelector(state => state.account.balances.sohmV1);
  const currentWSOhmBalance = useAppSelector(state => state.account.balances.wsohm);
  const wsOhmPrice = useAppSelector(state => state.app.marketPrice! * Number(state.app.currentIndex!));
  const gOHMPrice = wsOhmPrice;

  const approvedOhmBalance = useAppSelector(state => Number(state.account.migration.ohm));
  const approvedSOhmBalance = useAppSelector(state => Number(state.account.migration.sohm));
  const approvedWSOhmBalance = useAppSelector(state => Number(state.account.migration.wsohm));
  const ohmFullApproval = approvedOhmBalance >= +currentOhmBalance;
  const sOhmFullApproval = approvedSOhmBalance >= +currentSOhmBalance;
  const wsOhmFullApproval = approvedWSOhmBalance >= +currentWSOhmBalance;

  const ohmAsgOHM = +currentOhmBalance / indexV1;
  const sOHMAsgOHM = +currentSOhmBalance / indexV1;

  const ohmInUSD = formatCurrency(gOHMPrice! * ohmAsgOHM);
  const sOhmInUSD = formatCurrency(gOHMPrice! * sOHMAsgOHM);
  const wsOhmInUSD = formatCurrency(wsOhmPrice * +currentWSOhmBalance);

  const isGOHM = view === 1;
  const targetAsset = useMemo(() => (isGOHM ? "gOHM" : "sOHM (v2)"), [view]);
  const targetMultiplier = useMemo(() => (isGOHM ? 1 : currentIndex), [currentIndex, view]);

  return {
    indexV1,
    currentIndex,
    currentOhmBalance,
    currentSOhmBalance,
    wsOhmPrice,
    gOHMPrice,
    approvedOhmBalance,
    approvedSOhmBalance,
    approvedWSOhmBalance,
    ohmFullApproval,
    sOhmFullApproval,
    wsOhmFullApproval,
    ohmInUSD,
    sOhmInUSD,
    wsOhmInUSD,
    isGOHM,
    targetAsset,
    targetMultiplier,
  };
}
