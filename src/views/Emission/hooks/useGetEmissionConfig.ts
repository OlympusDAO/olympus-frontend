import { useQuery } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils.js";
import { EMISSION_MANAGER_CONTRACT } from "src/constants/contracts";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { BondFixedTermSDA__factory } from "src/typechain";

export const useGetEmissionConfig = () => {
  const networks = useTestableNetworks();
  const contract = EMISSION_MANAGER_CONTRACT.getEthersContract(networks.MAINNET);
  const { data, isFetched, isLoading } = useQuery(["getEmissionConfig", networks.MAINNET], async () => {
    const baseEmissionRate = await contract.baseEmissionRate();
    const backing = await contract.backing();
    const premium = await contract.getPremium().catch(() => BigNumber.from(0));
    const minimumPremium = await contract.minimumPremium();
    const [nextSalePremium, nextSaleEmissionRate, nextSaleEmission] = await contract
      .getNextSale()
      .catch(() => [BigNumber.from(0), BigNumber.from(0), BigNumber.from(0)]);
    const rateChange = await contract.rateChange();
    const activeMarketId = await contract.activeMarketId();
    const vestingPeriod = await contract.vestingPeriod();

    // // //addresses
    const tellerAddress = await contract.teller();
    const reserveAddress = await contract.reserve();
    const kernelAddress = await contract.kernel();
    const auctioneerAddress = await contract.auctioneer();
    const chregAddress = await contract.CHREG();
    const mintrAddress = await contract.MINTR();
    const priceAddress = await contract.PRICE();
    const rolesAddress = await contract.ROLES();
    const trsryAddress = await contract.TRSRY();

    //get active market information
    const provider = Providers.getStaticProvider(networks.MAINNET);
    const bondAuctioneer = BondFixedTermSDA__factory.connect(auctioneerAddress, provider);

    let currentEmissionRate = BigNumber.from(0);
    let currentEmission = BigNumber.from(0);
    if (activeMarketId.gt(0)) {
      const totalSupply = await contract.getSupply();
      const marketInfo = await bondAuctioneer.markets(activeMarketId);
      // Get remaining capacity - this is the current emission amount left
      currentEmission = marketInfo.capacity;
      // Calculate emission rate: (emission * 10^decimals) / supply
      currentEmissionRate = currentEmission.mul(BigNumber.from(10).pow(9)).div(totalSupply);
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
      activeMarketId: activeMarketId.toNumber(),
      vestingPeriod: vestingPeriod.toString(), // uint48 (in seconds)
      // reserves: formatUnits(reserves, 18), // DAI scale (18 decimals)
      currentEmissionRate: `${(Number(formatUnits(currentEmissionRate, 9)) * 100).toFixed(4)}%`, // OHM scale
      currentEmission: `${Number(formatUnits(currentEmission, 9)).toFixed(2)} OHM`, // OHM scale
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
