import { t } from "@lingui/macro";
import { DataRow } from "@olympusdao/component-library";
import { formatBalance } from "src/helpers";
import { useAppSelector } from "src/hooks";
import { useSohmWalletBalanceData } from "src/hooks/useBalances";

const SOHMBalance: React.FC = () => {
  const sohmBalance = useSohmWalletBalanceData().data;
  const isAppLoading = useAppSelector(state => state.app.loading);
  return (
    <DataRow title={t`sOHM Balance`} balance={`${formatBalance(sohmBalance, 36)} sOHM`} isLoading={isAppLoading} />
  );
};

export default SOHMBalance;
