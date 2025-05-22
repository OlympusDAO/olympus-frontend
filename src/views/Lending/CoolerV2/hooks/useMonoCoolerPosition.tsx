import { useQuery } from "@tanstack/react-query";
import { multicall } from "@wagmi/core";
import { formatUnits } from "ethers/lib/utils";
import { COOLER_V2_MONOCOOLER_ADDRESSES } from "src/constants/addresses";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { CoolerV2MonoCooler__factory, IERC20__factory } from "src/typechain";
import { useAccount } from "wagmi";

export const useMonoCoolerPosition = () => {
  const { address = "" } = useAccount();
  const networks = useTestableNetworks();

  return useQuery(
    ["monoCoolerPosition", address, networks.MAINNET_HOLESKY],
    async () => {
      console.log(address, "address");
      if (!address) return null;

      const config = {
        address: COOLER_V2_MONOCOOLER_ADDRESSES[networks.MAINNET_HOLESKY] as `0x${string}`,
        abi: CoolerV2MonoCooler__factory.abi,
      };

      const [
        accountPosition,
        interestRateWad,
        [maxOriginationLtv, liquidationLtv],
        collateralToken,
        debtToken,
        borrowsPaused,
        isActive,
      ] = await multicall({
        contracts: [
          {
            ...config,
            functionName: "accountPosition",
            args: [address],
          },
          {
            ...config,
            functionName: "interestRateWad",
          },
          {
            ...config,
            functionName: "loanToValues",
          },
          {
            ...config,
            functionName: "collateralToken",
          },
          {
            ...config,
            functionName: "debtToken",
          },
          {
            ...config,
            functionName: "borrowsPaused",
          },
          {
            ...config,
            functionName: "isActive",
          },
        ],
      });

      console.log(accountPosition, "accountPosition");

      const [debtAssetName, collateralAssetName] = await multicall({
        contracts: [
          {
            abi: IERC20__factory.abi,
            address: debtToken,
            functionName: "symbol",
          },
          {
            abi: IERC20__factory.abi,
            address: collateralToken,
            functionName: "symbol",
          },
        ],
      });

      // Calculate projected liquidation date
      let projectedLiquidationDate: Date | null = null;
      if (accountPosition.currentDebt.gt(0) && accountPosition.collateral.gt(0)) {
        // Convert interest rate from basis points to decimal (1 bp = 0.0001)
        const annualRate = Math.round((Math.exp(Number(interestRateWad) / 1e18) - 1) * 10000) / 10000;
        const currentLtv = Number(formatUnits(accountPosition.currentLtv, 18));
        const liquidationLtvValue = Number(formatUnits(liquidationLtv, 18));

        // If already at or above liquidation LTV, return now
        if (currentLtv >= liquidationLtvValue) {
          projectedLiquidationDate = new Date();
        } else {
          // Calculate time until liquidation using continuous compound interest formula
          // liquidationLtv = currentLtv * e^(r*t)
          // t = ln(liquidationLtv/currentLtv) / r
          const timeInYears = Math.log(liquidationLtvValue / currentLtv) / annualRate;
          const timeInMilliseconds = timeInYears * 365 * 24 * 60 * 60 * 1000;
          projectedLiquidationDate = new Date(Date.now() + timeInMilliseconds);
        }
      }

      return {
        collateral: accountPosition.collateral,
        currentDebt: accountPosition.currentDebt,
        maxOriginationDebtAmount: accountPosition.maxOriginationDebtAmount,
        liquidationDebtAmount: accountPosition.liquidationDebtAmount,
        healthFactor: accountPosition.healthFactor,
        currentLtv: accountPosition.currentLtv,
        totalDelegated: accountPosition.totalDelegated,
        numDelegateAddresses: accountPosition.numDelegateAddresses,
        maxDelegateAddresses: accountPosition.maxDelegateAddresses,
        interestRateWad,
        interestRateBps: Math.round((Math.exp(Number(interestRateWad) / 1e18) - 1) * 10000),
        maxOriginationLtv,
        liquidationLtv,
        debtAssetName,
        collateralAssetName,
        debtAddress: debtToken,
        collateralAddress: collateralToken,
        borrowsPaused,
        projectedLiquidationDate,
        isActive,
      };
    },
    {
      enabled: Boolean(address),
    },
  );
};

export type MonoCoolerPosition = NonNullable<ReturnType<typeof useMonoCoolerPosition>["data"]>;
