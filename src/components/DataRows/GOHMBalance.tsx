import { t } from "@lingui/macro";
import { DataRow } from "@olympusdao/component-library";
import { formatBalance } from "src/helpers";
import { useAppSelector } from "src/hooks";
import { useGohmWalletBalanceData } from "src/hooks/useBalances";

const SOHMBalance: React.FC = () => {
  const gohmBalance = useGohmWalletBalanceData().data;
  const isAppLoading = useAppSelector(state => state.app.loading);
  return (
    <DataRow title={t`gOHM Balance`} balance={`${formatBalance(gohmBalance, 36)} sOHM`} isLoading={isAppLoading} />
  );
};

export default SOHMBalance;
