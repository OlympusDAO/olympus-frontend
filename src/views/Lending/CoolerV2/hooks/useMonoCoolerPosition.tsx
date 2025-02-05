import { useQuery } from "@tanstack/react-query";
import { multicall } from "@wagmi/core";
import { NetworkId } from "src/constants";
import { COOLER_V2_MONOCOOLER_CONTRACT } from "src/constants/contracts";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { CoolerV2MonoCooler__factory, IERC20__factory } from "src/typechain";
import { useAccount, useNetwork, useSigner } from "wagmi";

export const useMonoCoolerPosition = () => {
  const { address = "" } = useAccount();
  const { data: signer } = useSigner();
  const { chain = { id: NetworkId.MAINNET } } = useNetwork();
  const networks = useTestableNetworks();
  return useQuery(
    ["monoCoolerPosition", address, chain.id],
    async () => {
      if (!address || !signer) return null;

      const [position, debt, interestRate, maxOriginationLtv, liquidationLtv, debtAddress, collateralAddress] =
        await multicall({
          contracts: [
            {
              abi: CoolerV2MonoCooler__factory.abi,
              address: COOLER_V2_MONOCOOLER_CONTRACT.getAddress(chain.id) as `0x${string}`,
              functionName: "accountPosition",
              args: [address],
            },
            {
              abi: CoolerV2MonoCooler__factory.abi,
              address: COOLER_V2_MONOCOOLER_CONTRACT.getAddress(chain.id) as `0x${string}`,
              functionName: "accountDebt",
              args: [address],
            },
            {
              abi: CoolerV2MonoCooler__factory.abi,
              address: COOLER_V2_MONOCOOLER_CONTRACT.getAddress(chain.id) as `0x${string}`,
              functionName: "interestRateBps",
            },
            {
              abi: CoolerV2MonoCooler__factory.abi,
              address: COOLER_V2_MONOCOOLER_CONTRACT.getAddress(chain.id) as `0x${string}`,
              functionName: "maxOriginationLtv",
            },
            {
              abi: CoolerV2MonoCooler__factory.abi,
              address: COOLER_V2_MONOCOOLER_CONTRACT.getAddress(chain.id) as `0x${string}`,
              functionName: "liquidationLtv",
            },
            {
              abi: CoolerV2MonoCooler__factory.abi,
              address: COOLER_V2_MONOCOOLER_CONTRACT.getAddress(chain.id) as `0x${string}`,
              functionName: "debtToken",
            },
            {
              abi: CoolerV2MonoCooler__factory.abi,
              address: COOLER_V2_MONOCOOLER_CONTRACT.getAddress(chain.id) as `0x${string}`,
              functionName: "collateralToken",
            },
          ],
        });

      const [debtAssetName, collateralAssetName] = await multicall({
        contracts: [
          {
            abi: IERC20__factory.abi,
            address: debtAddress,
            functionName: "symbol",
          },
          {
            abi: IERC20__factory.abi,
            address: collateralAddress,
            functionName: "symbol",
          },
        ],
      });

      //retrieve the name of the debt token
      const debtContract = IERC20__factory.connect(debtAddress, Providers.getStaticProvider(networks.MAINNET_HOLESKY));
      const collateralContract = IERC20__factory.connect(
        collateralAddress,
        Providers.getStaticProvider(networks.MAINNET_HOLESKY),
      );

      return {
        // Raw values from contract
        collateral: position.collateral,
        currentDebt: position.currentDebt,
        maxOriginationDebtAmount: position.maxOriginationDebtAmount,
        liquidationDebtAmount: position.liquidationDebtAmount,
        healthFactor: position.healthFactor,
        currentLtv: position.currentLtv,
        totalDelegated: position.totalDelegated,
        numDelegateAddresses: position.numDelegateAddresses,
        maxDelegateAddresses: position.maxDelegateAddresses,
        interestRateBps: interestRate,
        maxOriginationLtv,
        liquidationLtv,
        debtAssetName,
        collateralAssetName,
        debtAddress,
        collateralAddress,
      };
    },
    {
      enabled: !!address && !!signer,
    },
  );
};

export type MonoCoolerPosition = NonNullable<ReturnType<typeof useMonoCoolerPosition>["data"]>;
