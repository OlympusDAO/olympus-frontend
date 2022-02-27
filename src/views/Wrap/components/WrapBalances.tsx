import { t } from "@lingui/macro";
import { DataRow } from "@olympusdao/component-library";
import { formatNumber, parseBigNumber } from "src/helpers";
import { useWeb3Context } from "src/hooks";
import { useGohmBalance, useSohmBalance, useWsohmBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";

export const WrapBalances = () => {
  const networks = useTestableNetworks();
  const { networkId } = useWeb3Context();
  const sohmBalance = useSohmBalance()[networks.MAINNET].data;

  const gohmBalances = useGohmBalance();
  const gohmArb = gohmBalances[networks.ARBITRUM].data;
  const gohmAvax = gohmBalances[networks.AVALANCHE].data;
  const gohmMainnet = gohmBalances[networks.MAINNET].data;

  const wsohmBalances = useWsohmBalance();
  const wsohmArb = wsohmBalances[networks.ARBITRUM].data;
  const wsohmAvax = wsohmBalances[networks.AVALANCHE].data;

  if (networkId === networks.AVALANCHE)
    return (
      <>
        <DataRow
          title={t`wsOHM Balance (Avalanche)`}
          isLoading={!wsohmAvax}
          balance={wsohmAvax && `${formatNumber(parseBigNumber(wsohmAvax, 18), 4)} wsOHM`}
        />
        <DataRow
          title={t`gOHM Balance (Avalanche)`}
          isLoading={!gohmAvax}
          balance={gohmAvax && `${formatNumber(parseBigNumber(gohmAvax, 18), 4)} gOHM`}
        />
      </>
    );

  if (networkId === networks.ARBITRUM)
    return (
      <>
        <DataRow
          title={t`wsOHM Balance (Arbitrum)`}
          isLoading={!wsohmArb}
          balance={wsohmArb && `${formatNumber(parseBigNumber(wsohmArb, 18), 4)} wsOHM`}
        />
        <DataRow
          title={t`gOHM Balance (Arbitrum)`}
          isLoading={!gohmArb}
          balance={gohmArb && `${formatNumber(parseBigNumber(gohmArb, 18), 4)} gOHM`}
        />
      </>
    );

  return (
    <>
      <DataRow
        title={t`sOHM Balance`}
        isLoading={!sohmBalance}
        balance={sohmBalance && `${formatNumber(parseBigNumber(sohmBalance), 4)} sOHM`}
      />
      <DataRow
        title={t`gOHM Balance`}
        isLoading={!gohmMainnet}
        balance={gohmMainnet && `${formatNumber(parseBigNumber(gohmMainnet, 18), 4)} gOHM`}
      />
    </>
  );
};
