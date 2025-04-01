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
  CoolerClearingHouse__factory,
  CoolerClearingHouseV3__factory,
  ERC4626__factory,
  IERC20__factory,
} from "src/typechain";
import { useProvider } from "wagmi";

type ClearingHouseVersion = "clearingHouseV1" | "clearingHouseV2" | "clearingHouseV3";

type ClearingHouseData = {
  interestRate: string;
  duration: string;
  loanToCollateral: string;
  factory: string;
  collateralAddress: string;
  debtAddress: string;
  capacity: ethers.BigNumber;
  clearingHouseAddress: string;
  debtAssetName: string;
  isActive: boolean;
};

const getClearingHouseContract = (version: ClearingHouseVersion) => {
  switch (version) {
    case "clearingHouseV1":
      return COOLER_CLEARING_HOUSE_CONTRACT_V1;
    case "clearingHouseV2":
      return COOLER_CLEARING_HOUSE_CONTRACT_V2;
    case "clearingHouseV3":
      return COOLER_CLEARING_HOUSE_CONTRACT_V3;
  }
};

export const useGetClearingHouse = ({ clearingHouse }: { clearingHouse: ClearingHouseVersion }) => {
  const networks = useTestableNetworks();
  const provider = useProvider();
  const clearingHouseContract = getClearingHouseContract(clearingHouse);
  const contract = clearingHouseContract.getEthersContract(networks.MAINNET);
  const { data, isFetched, isLoading } = useQuery(["getClearingHouse", networks.MAINNET, clearingHouse], async () => {
    const clearingHouseConfig = {
      abi: clearingHouse === "clearingHouseV3" ? CoolerClearingHouseV3__factory.abi : CoolerClearingHouse__factory.abi,
      address: clearingHouseContract.getAddress(networks.MAINNET) as `0x${string}`,
    };

    // Batch all clearing house calls together
    const [
      factory,
      interestRate,
      duration,
      loanToCollateral,
      collateralAddress,
      debtAddress,
      sReserveAddress,
      isActive,
    ] = await multicall({
      contracts: [
        {
          ...clearingHouseConfig,
          functionName: "factory",
        },
        {
          ...clearingHouseConfig,
          functionName: "INTEREST_RATE",
        },
        {
          ...clearingHouseConfig,
          functionName: "DURATION",
        },
        {
          ...clearingHouseConfig,
          functionName: "LOAN_TO_COLLATERAL",
        },
        {
          ...clearingHouseConfig,
          functionName: "gohm",
        },
        {
          ...clearingHouseConfig,
          functionName: clearingHouse === "clearingHouseV3" ? "reserve" : "dai",
        },
        {
          ...clearingHouseConfig,
          functionName: clearingHouse === "clearingHouseV3" ? "sReserve" : "sdai",
        },
        {
          ...clearingHouseConfig,
          functionName: "isActive",
        },
      ],
    });

    // Get debt asset name
    const debtContract = IERC20__factory.connect(debtAddress, provider);
    const debtAssetName = await debtContract.symbol();

    // Get sReserve balance info
    const sReserveContract = ERC4626__factory.connect(sReserveAddress, provider);
    const balanceOfResult = await multicall({
      contracts: [
        {
          abi: ERC4626__factory.abi,
          address: sReserveAddress as `0x${string}`,
          functionName: "balanceOf",
          args: [contract.address as `0x${string}`],
        },
      ],
    });

    const [sReserveBalanceClearingHouse] = balanceOfResult;

    const [reserveBalanceClearingHouse] = await multicall({
      contracts: [
        {
          abi: ERC4626__factory.abi,
          address: sReserveAddress as `0x${string}`,
          functionName: "convertToAssets",
          args: [sReserveBalanceClearingHouse],
        },
      ],
    });

    return {
      interestRate: ethers.utils.formatUnits(interestRate.toString(), 16), // 16 decimals, but 18 gives you % format. i.e. 0.1 = 10%
      duration: duration.div(86400).toString(), // 86400 seconds in a day
      loanToCollateral: ethers.utils.formatUnits(loanToCollateral.toString()), // 1.5 = 150% LTV (Loan to Value Ratio)
      factory,
      collateralAddress,
      debtAddress,
      capacity: reserveBalanceClearingHouse,
      clearingHouseAddress: contract.address,
      debtAssetName,
      isActive,
    };
  });
  return { data, isFetched, isLoading };
};

export const useGetAllClearingHouses = () => {
  const networks = useTestableNetworks();
  const provider = useProvider();
  const { data, isFetched, isLoading } = useQuery(["getAllClearingHouses", networks.MAINNET], async () => {
    const versions: ClearingHouseVersion[] = ["clearingHouseV1", "clearingHouseV2", "clearingHouseV3"];

    // Fetch all clearing house data in parallel
    const clearingHouseData = await Promise.all(
      versions.map(async version => {
        const clearingHouseContract = getClearingHouseContract(version);
        const contract = clearingHouseContract.getEthersContract(networks.MAINNET);
        const clearingHouseConfig = {
          abi: version === "clearingHouseV3" ? CoolerClearingHouseV3__factory.abi : CoolerClearingHouse__factory.abi,
          address: clearingHouseContract.getAddress(networks.MAINNET) as `0x${string}`,
        };

        // Batch all clearing house calls together
        const [
          factory,
          interestRate,
          duration,
          loanToCollateral,
          collateralAddress,
          debtAddress,
          sReserveAddress,
          isActive,
        ] = await multicall({
          contracts: [
            {
              ...clearingHouseConfig,
              functionName: "factory",
            },
            {
              ...clearingHouseConfig,
              functionName: "INTEREST_RATE",
            },
            {
              ...clearingHouseConfig,
              functionName: "DURATION",
            },
            {
              ...clearingHouseConfig,
              functionName: "LOAN_TO_COLLATERAL",
            },
            {
              ...clearingHouseConfig,
              functionName: "gohm",
            },
            {
              ...clearingHouseConfig,
              functionName: version === "clearingHouseV3" ? "reserve" : "dai",
            },
            {
              ...clearingHouseConfig,
              functionName: version === "clearingHouseV3" ? "sReserve" : "sdai",
            },
            {
              ...clearingHouseConfig,
              functionName: "isActive",
            },
          ],
        });

        // Get sReserve balance info and debt asset name
        const [sReserveBalanceClearingHouse, debtAssetName] = await multicall({
          contracts: [
            {
              abi: ERC4626__factory.abi,
              address: sReserveAddress as `0x${string}`,
              functionName: "balanceOf",
              args: [contract.address as `0x${string}`],
            },
            { abi: IERC20__factory.abi, address: debtAddress, functionName: "symbol" },
          ],
        });

        const [reserveBalanceClearingHouse] = await multicall({
          contracts: [
            {
              abi: ERC4626__factory.abi,
              address: sReserveAddress as `0x${string}`,
              functionName: "convertToAssets",
              args: [sReserveBalanceClearingHouse],
            },
          ],
        });

        return {
          version,
          data: {
            interestRate: ethers.utils.formatUnits(interestRate.toString(), 16),
            duration: duration.div(86400).toString(),
            loanToCollateral: ethers.utils.formatUnits(loanToCollateral.toString()),
            factory,
            collateralAddress,
            debtAddress,
            capacity: reserveBalanceClearingHouse,
            clearingHouseAddress: contract.address,
            debtAssetName,
            isActive,
          },
        };
      }),
    );

    // Transform the data into a more convenient format
    return clearingHouseData.reduce(
      (acc, { version, data }) => {
        acc[version] = data;
        return acc;
      },
      {} as Record<ClearingHouseVersion, ClearingHouseData>,
    );
  });
  return { data, isFetched, isLoading };
};
