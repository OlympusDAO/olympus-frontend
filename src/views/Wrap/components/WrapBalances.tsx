import { t } from "@lingui/macro";
import { DataRow } from "@olympusdao/component-library";
import { formatNumber, parseBigNumber } from "src/helpers";
import { useGohmBalance, useSohmBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";

export const WrapBalances = () => {
  const networks = useTestableNetworks();
  const sohmBalance = useSohmBalance()[networks.MAINNET].data;
  const gohmBalance = useGohmBalance()[networks.MAINNET].data;

  return (
    <>
      <DataRow
        title={t`sOHM Balance`}
        isLoading={!sohmBalance}
        balance={sohmBalance && `${formatNumber(parseBigNumber(sohmBalance), 4)} sOHM`}
      />

      <DataRow
        title={t`gOHM Balance`}
        isLoading={!gohmBalance}
        balance={gohmBalance && `${formatNumber(parseBigNumber(gohmBalance, 18), 4)} gOHM`}
      />
    </>
  );
};
