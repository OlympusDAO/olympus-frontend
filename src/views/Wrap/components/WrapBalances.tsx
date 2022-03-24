import { t } from "@lingui/macro";
import { DataRow } from "@olympusdao/component-library";
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
          isLoading={!wsohmAvax}
          title={t`wsOHM Balance (Avalanche)`}
          balance={wsohmAvax?.toFormattedString(4) + ` wsOHM`}
        />
        <DataRow
          isLoading={!gohmAvax}
          title={t`gOHM Balance (Avalanche)`}
          balance={gohmAvax?.toFormattedString(4) + ` gOHM`}
        />
      </>
    );

  if (networkId === networks.ARBITRUM)
    return (
      <>
        <DataRow
          isLoading={!wsohmArb}
          title={t`wsOHM Balance (Arbitrum)`}
          balance={wsohmArb?.toFormattedString(4) + ` wsOHM`}
        />
        <DataRow
          isLoading={!gohmArb}
          title={t`gOHM Balance (Arbitrum)`}
          balance={gohmArb?.toFormattedString(4) + ` gOHM`}
        />
      </>
    );

  return (
    <>
      <DataRow title={t`sOHM Balance`} isLoading={!sohmBalance} balance={sohmBalance?.toFormattedString(4) + ` sOHM`} />
      <DataRow title={t`gOHM Balance`} isLoading={!gohmMainnet} balance={gohmMainnet?.toFormattedString(4) + ` gOHM`} />
    </>
  );
};
