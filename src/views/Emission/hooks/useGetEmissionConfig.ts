import { useQuery } from "@tanstack/react-query";
import { multicall } from "@wagmi/core";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils.js";
import { EMISSION_MANAGER_CONTRACT } from "src/constants/contracts";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { BondFixedTermSDA__factory, EmissionManager__factory } from "src/typechain";

export const useGetEmissionConfig = () => {
  const networks = useTestableNetworks();
  const contract = EMISSION_MANAGER_CONTRACT.getEthersContract(networks.MAINNET);
  const { data, isFetched, isLoading } = useQuery(["getEmissionConfig", networks.MAINNET], async () => {
    const emissionManagerConfig = {
      abi: EmissionManager__factory.abi,
      address: EMISSION_MANAGER_CONTRACT.getAddress(networks.MAINNET) as `0x${string}`,
    };
    const [
      baseEmissionRate,
      backing,
      premium,
      minimumPremium,
      rateChange,
      activeMarketId,
      vestingPeriod,
      tellerAddress,
      reserveAddress,
      kernelAddress,
      auctioneerAddress,
      chregAddress,
      mintrAddress,
      priceAddress,
      rolesAddress,
      trsryAddress,
    ] = await multicall({
      contracts: [
        {
          ...emissionManagerConfig,
          functionName: "baseEmissionRate",
        },
        {
          ...emissionManagerConfig,
          functionName: "backing",
        },
        {
          ...emissionManagerConfig,
          functionName: "getPremium",
        },
        {
          ...emissionManagerConfig,
          functionName: "minimumPremium",
        },
        {
          ...emissionManagerConfig,
          functionName: "rateChange",
        },
        {
          ...emissionManagerConfig,
          functionName: "activeMarketId",
        },
        {
          ...emissionManagerConfig,
          functionName: "vestingPeriod",
        },
        {
          ...emissionManagerConfig,
          functionName: "teller",
        },
        {
          ...emissionManagerConfig,
          functionName: "reserve",
        },
        {
          ...emissionManagerConfig,
          functionName: "kernel",
        },
        {
          ...emissionManagerConfig,
          functionName: "auctioneer",
        },
        {
          ...emissionManagerConfig,
          functionName: "CHREG",
        },
        {
          ...emissionManagerConfig,
          functionName: "MINTR",
        },
        {
          ...emissionManagerConfig,
          functionName: "PRICE",
        },
        {
          ...emissionManagerConfig,
          functionName: "ROLES",
        },
        {
          ...emissionManagerConfig,
          functionName: "TRSRY",
        },
      ],
    });

    const [nextSalePremium, nextSaleEmissionRate, nextSaleEmission] = await contract
      .getNextSale()
      .catch(() => [BigNumber.from(0), BigNumber.from(0), BigNumber.from(0)]);

    let currentEmissionRate = BigNumber.from(0);
    let currentEmission = BigNumber.from(0);
    let isMarketLive = false;
    if (activeMarketId.gt(0)) {
      //bond market info
      const bondMarketInfo = {
        abi: BondFixedTermSDA__factory.abi,
        address: auctioneerAddress,
      };
      const [totalSupply, marketInfo, isLive] = await multicall({
        contracts: [
          {
            ...emissionManagerConfig,
            functionName: "getSupply",
          },
          {
            ...bondMarketInfo,
            functionName: "markets",
            args: [activeMarketId],
          },
          {
            ...bondMarketInfo,
            functionName: "isLive",
            args: [activeMarketId],
          },
        ],
      });
      // Get original capacity - this is the capacity plus the amount sold
      currentEmission = marketInfo.capacity.add(marketInfo.sold);
      // Calculate emission rate: (emission * 10^decimals) / supply
      currentEmissionRate = currentEmission.mul(BigNumber.from(10).pow(9)).div(totalSupply);
      isMarketLive = isLive;
    }

    //todo
    return {
      baseEmissionRate: `${Number(formatUnits(baseEmissionRate, 9)) * 100}%`, // 1e9 = 100%
      backing: formatUnits(backing, 18),
      premium: `${(Number(formatUnits(premium, 18)) * 100).toFixed(2)}%`,
      minimumPremium: `${(Number(formatUnits(minimumPremium, 18)) * 100).toFixed(2)}%`, // 1e18 = 100%
      nextSale: {
        premium: `${(Number(formatUnits(nextSalePremium, 18)) * 100).toFixed(2)}%`, // 1e18 = 100%
        emissionRate: `${(Number(formatUnits(nextSaleEmissionRate, 9)) * 100).toFixed(2)}%`, // OHM scale
        emission: `${Number(formatUnits(nextSaleEmission, 9)).toFixed(2)} OHM`, // OHM scale
      },
      rateChange: {
        changeBy: formatUnits(rateChange.changeBy, 9), // OHM scale
        daysLeft: rateChange.daysLeft.toString(), // uint48
        addition: rateChange.addition, // boolean
      },
      activeMarketId: isMarketLive ? activeMarketId.toNumber() : 0,
      vestingPeriod: vestingPeriod.toString(), // uint48 (in seconds)
      // reserves: formatUnits(reserves, 18), // DAI scale (18 decimals)
      currentEmissionRate: isMarketLive
        ? `${(Number(formatUnits(currentEmissionRate, 9)) * 100).toFixed(4)}%` // OHM scale
        : "0%",
      currentEmission: isMarketLive
        ? `${Number(formatUnits(currentEmission, 9)).toFixed(2)} OHM` // OHM scale
        : "0 OHM",
      tellerAddress,
      reserveAddress,
      kernelAddress,
      auctioneerAddress,
      chregAddress,
      mintrAddress,
      priceAddress,
      rolesAddress,
      trsryAddress,
      emissionsManagerAddress: contract.address,
    };
  });
  return { data, isFetched, isLoading };
};
