import { DataRow } from "@olympusdao/component-library";
import { useGohmBalance, useSohmBalance, useWsohmBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useNetwork } from "wagmi";

export const WrapBalances = () => {
  const networks = useTestableNetworks();
  const { chain = { id: 1 } } = useNetwork();
  const sohmBalance = useSohmBalance()[networks.MAINNET].data;

  const gohmBalances = useGohmBalance();
  const gohmArb = gohmBalances[networks.ARBITRUM].data;
  const gohmAvax = gohmBalances[networks.AVALANCHE].data;
  const gohmMainnet = gohmBalances[networks.MAINNET].data;

  const wsohmBalances = useWsohmBalance();
  const wsohmArb = wsohmBalances[networks.ARBITRUM].data;
  const wsohmAvax = wsohmBalances[networks.AVALANCHE].data;

  if (chain.id === networks.AVALANCHE)
    return (
      <>
        <DataRow
          isLoading={!wsohmAvax}
          title={`wsOHM Balance (Avalanche)`}
          balance={wsohmAvax?.toString({ decimals: 4, trim: false, format: true }) + ` wsOHM`}
        />
        <DataRow
          isLoading={!gohmAvax}
          title={`gOHM Balance (Avalanche)`}
          balance={gohmAvax?.toString({ decimals: 4, trim: false, format: true }) + ` gOHM`}
        />
      </>
    );

  if (chain.id === networks.ARBITRUM)
    return (
      <>
        <DataRow
          isLoading={!wsohmArb}
          title={`wsOHM Balance (Arbitrum)`}
          balance={wsohmArb?.toString({ decimals: 4, trim: false, format: true }) + ` wsOHM`}
        />
        <DataRow
          isLoading={!gohmArb}
          title={`gOHM Balance (Arbitrum)`}
          balance={gohmArb?.toString({ decimals: 4, trim: false, format: true }) + ` gOHM`}
        />
      </>
    );

  return (
    <>
      <DataRow
        title={`sOHM Balance`}
        isLoading={!sohmBalance}
        balance={sohmBalance?.toString({ decimals: 4, trim: false, format: true }) + ` sOHM`}
      />
      <DataRow
        title={`gOHM Balance`}
        isLoading={!gohmMainnet}
        balance={gohmMainnet?.toString({ decimals: 4, trim: false, format: true }) + ` gOHM`}
      />
    </>
  );
};
