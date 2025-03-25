import { useQuery } from "@tanstack/react-query";
import { multicall } from "@wagmi/core";
import { ethers } from "ethers";
import {
  COOLER_CLEARING_HOUSE_CONTRACT_V1,
  COOLER_CLEARING_HOUSE_CONTRACT_V2,
  COOLER_CLEARING_HOUSE_CONTRACT_V3,
} from "src/constants/contracts";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import {
  CoolerClearingHouse,
  CoolerClearingHouse__factory,
  CoolerClearingHouseV3,
  CoolerClearingHouseV3__factory,
  ERC4626__factory,
  IERC20__factory,
} from "src/typechain";
import { useProvider } from "wagmi";

export const useGetClearingHouse = ({
  clearingHouse,
}: {
  clearingHouse: "clearingHouseV1" | "clearingHouseV2" | "clearingHouseV3";
}) => {
  const networks = useTestableNetworks();
  const provider = useProvider();
  const clearingHouseContract =
    clearingHouse === "clearingHouseV1"
      ? COOLER_CLEARING_HOUSE_CONTRACT_V1
      : clearingHouse === "clearingHouseV2"
        ? COOLER_CLEARING_HOUSE_CONTRACT_V2
        : COOLER_CLEARING_HOUSE_CONTRACT_V3;

  const contract = clearingHouseContract.getEthersContract(networks.MAINNET);
  const { data, isFetched, isLoading } = useQuery(
    ["getClearingHouse", networks.MAINNET, clearingHouse],
    async () => {
      const clearingHouseFactory =
        clearingHouse === "clearingHouseV1" || clearingHouse === "clearingHouseV2"
          ? CoolerClearingHouse__factory
          : CoolerClearingHouseV3__factory;
      const contractConfig = {
        address: clearingHouseContract.addresses[networks.MAINNET] as `0x${string}`,
        abi: clearingHouseFactory.abi,
      };
      const [
        factory,
        interestRateFromContract,
        durationFromContract,
        loanToCollateralFromContract,
        collateralAddress,
        isActive,
      ] = await multicall({
        contracts: [
          {
            ...contractConfig,
            functionName: "factory",
          },
          {
            ...contractConfig,
            functionName: "INTEREST_RATE",
          },
          {
            ...contractConfig,
            functionName: "DURATION",
          },
          {
            ...contractConfig,
            functionName: "LOAN_TO_COLLATERAL",
          },
          {
            ...contractConfig,
            functionName: "gohm",
          },
          {
            ...contractConfig,
            functionName: "isActive",
          },
        ],
      });
      const interestRate = ethers.utils.formatUnits(interestRateFromContract.toString(), 16); // 16 decimals, but 18 gives you % format. i.e. 0.1 = 10%
      const duration = durationFromContract.div(86400).toString(); // 86400 seconds in a day
      const loanToCollateral = ethers.utils.formatUnits(loanToCollateralFromContract.toString()); // 1.5 = 150% LTV (Loan to Value Ratio
      let debtAddress: string;
      let sReserveAddress: string;
      if (clearingHouse === "clearingHouseV3") {
        debtAddress = await (contract as CoolerClearingHouseV3).reserve();
        sReserveAddress = await (contract as CoolerClearingHouseV3).sReserve();
      } else {
        debtAddress = await (contract as CoolerClearingHouse).dai();
        sReserveAddress = await (contract as CoolerClearingHouse).sdai();
      }

      const [debtAssetName, sReserveBalanceClearingHouse] = await multicall({
        contracts: [
          {
            address: debtAddress as `0x${string}`,
            abi: IERC20__factory.abi,
            functionName: "symbol",
          },
          {
            address: sReserveAddress as `0x${string}`,
            abi: ERC4626__factory.abi,
            functionName: "balanceOf",
            args: [contract.address as `0x${string}`],
          },
        ],
      });

      const sReserveContract = ERC4626__factory.connect(sReserveAddress, provider);
      const reserveBalanceClearingHouse = await sReserveContract.convertToAssets(sReserveBalanceClearingHouse);
      const clearingHouseAddress = contract.address;

      return {
        interestRate,
        duration,
        loanToCollateral,
        factory,
        collateralAddress,
        debtAddress,
        capacity: reserveBalanceClearingHouse,
        clearingHouseAddress,
        debtAssetName,
        isActive,
      };
    },
    { enabled: !!networks.MAINNET },
  );
  return { data, isFetched, isLoading };
};
