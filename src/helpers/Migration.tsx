import React from "react";
import { useAppSelector } from "src/hooks";
import { useAppDetails } from "src/hooks/useAppDetails";

export const formatCurrency = (c: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(c);
};

export function useView() {
  const [view, setView] = React.useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const changeView: any = (_event: React.ChangeEvent<any>, newView: number) => {
    setView(newView);
  };
  return [view, setView, changeView];
}

export function useMigrationData() {
  const [view, setView, changeView] = useView();
  const { data: appDetails } = useAppDetails();

  const indexV1 = Number(appDetails?.currentIndexV1);
  const currentIndex = Number(appDetails?.currentIndex);
  const marketPrice = Number(appDetails?.marketPrice);

  const currentOhmBalance = useAppSelector(state => state.account.balances.ohmV1);
  const currentSOhmBalance = useAppSelector(state => state.account.balances.sohmV1);
  const currentWSOhmBalance = useAppSelector(state => state.account.balances.wsohm);

  const wsOhmPrice = marketPrice * currentIndex;
  const gOHMPrice = wsOhmPrice;

  const approvedOhmBalance = useAppSelector(state => Number(state.account.migration.ohm));
  const approvedSOhmBalance = useAppSelector(state => Number(state.account.migration.sohm));
  const approvedWSOhmBalance = useAppSelector(state => Number(state.account.migration.wsohm));
  const ohmFullApproval = approvedOhmBalance >= +currentOhmBalance;
  const sOhmFullApproval = approvedSOhmBalance >= +currentSOhmBalance;
  const wsOhmFullApproval = approvedWSOhmBalance >= +currentWSOhmBalance;

  const ohmAsgOHM = +currentOhmBalance / indexV1;
  const sOHMAsgOHM = +currentSOhmBalance / indexV1;

  const ohmInUSD = formatCurrency(gOHMPrice * ohmAsgOHM);
  const sOhmInUSD = formatCurrency(gOHMPrice * sOHMAsgOHM);
  const wsOhmInUSD = formatCurrency(wsOhmPrice * +currentWSOhmBalance);

  const isGOHM = view === 1;
  const targetAsset = React.useMemo(() => (isGOHM ? "gOHM" : "sOHM (v2)"), [view]);
  const targetMultiplier = React.useMemo(() => (isGOHM ? 1 : currentIndex), [currentIndex, view]);

  const isAllApproved = ohmFullApproval && sOhmFullApproval && wsOhmFullApproval;

  const oldAssetsDetected = useAppSelector(state => {
    return (
      state.account.balances &&
      (Number(state.account.balances.sohmV1) ||
      Number(state.account.balances.ohmV1) ||
      Number(state.account.balances.wsohm)
        ? true
        : false)
    );
  });

  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });

  return {
    view,
    setView,
    changeView,
    indexV1,
    currentIndex,
    currentOhmBalance,
    currentSOhmBalance,
    currentWSOhmBalance,
    wsOhmPrice,
    gOHMPrice,
    approvedOhmBalance,
    approvedSOhmBalance,
    approvedWSOhmBalance,
    ohmFullApproval,
    sOhmFullApproval,
    wsOhmFullApproval,
    ohmAsgOHM,
    sOHMAsgOHM,
    ohmInUSD,
    sOhmInUSD,
    wsOhmInUSD,
    isGOHM,
    targetAsset,
    targetMultiplier,
    oldAssetsDetected,
    pendingTransactions,
    isAllApproved,
  };
}

const Migration = {
  useMigrationData,
  formatCurrency,
  useView,
};

export default Migration;
