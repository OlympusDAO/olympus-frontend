import { useQuery } from "@tanstack/react-query";
import { NetworkId } from "src/constants";
import { COOLER_V2_MONOCOOLER_CONTRACT } from "src/constants/contracts";
import { useAccount, useNetwork, useSigner } from "wagmi";

export const useMonoCoolerPosition = () => {
  const { address = "" } = useAccount();
  const { data: signer } = useSigner();
  const { chain = { id: NetworkId.MAINNET } } = useNetwork();

  return useQuery(
    ["monoCoolerPosition", address, chain.id],
    async () => {
      if (!address || !signer) return null;

      const contract = COOLER_V2_MONOCOOLER_CONTRACT.getEthersContract(chain.id).connect(signer);

      const position = await contract.accountPosition(address);
      const globalState = await contract.globalState();
      const interestRate = await contract.interestRateBps();
      const maxOriginationLtv = await contract.maxOriginationLtv();
      const liquidationLtv = await contract.liquidationLtv();

      return {
        collateral: position.collateral,
        currentDebt: position.currentDebt,
        maxOriginationDebtAmount: position.maxOriginationDebtAmount,
        liquidationDebtAmount: position.liquidationDebtAmount,
        healthFactor: position.healthFactor,
        currentLtv: position.currentLtv,
        totalDelegated: position.totalDelegated,
        numDelegateAddresses: position.numDelegateAddresses,
        maxDelegateAddresses: position.maxDelegateAddresses,
        globalDebt: globalState[0],
        interestAccumulatorRay: globalState[1],
        interestRateBps: interestRate,
        maxOriginationLtv: maxOriginationLtv,
        liquidationLtv: liquidationLtv,
      };
    },
    {
      enabled: !!address && !!signer,
      refetchInterval: 30000, // Refetch every 30 seconds to keep interest calculations fresh
    },
  );
};

export type MonoCoolerPosition = NonNullable<ReturnType<typeof useMonoCoolerPosition>["data"]>;
