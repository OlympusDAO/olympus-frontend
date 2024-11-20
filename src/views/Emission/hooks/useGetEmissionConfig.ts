import { useQuery } from "@tanstack/react-query";
import { EMISSION_MANAGER_CONTRACT } from "src/constants/contracts";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";

export const useGetEmissionConfig = () => {
  const networks = useTestableNetworks();
  const contract = EMISSION_MANAGER_CONTRACT.getEthersContract(networks.MAINNET);
  const {
    data = { symbol: "", reserveAddress: "" },
    isFetched,
    isLoading,
  } = useQuery(["getEmissionConfig", networks.MAINNET], async () => {
    const baseEmissionRate = await contract.baseEmissionRate();
    const backing = await contract.backing();
    const premium = await contract.getPremium();
    const minimumPremium = await contract.minimumPremium();
    const nextSale = await contract.getNextSale();

    //active base emissions rate change information
    const rateChange = await contract.rateChange();

    const activeMarketId = await contract.activeMarketId();
    const vestingPeriod = await contract.vestingPeriod();
    const reserves = await contract.getReserves();

    //addresses
    const tellerAddress = await contract.teller();
    const reserveAddress = await contract.reserve();
    const kernelAddress = await contract.kernel();
    const auctioneerAddress = await contract.auctioneer();
    const chregAddress = await contract.CHREG();
    const mintrAddress = await contract.MINTR();
    const priceAddress = await contract.PRICE();
    const rolesAddress = await contract.ROLES();
    const trsryAddress = await contract.TRSRY();

    //todo
    return {};
  });
  return { data, isFetched, isLoading };
};
