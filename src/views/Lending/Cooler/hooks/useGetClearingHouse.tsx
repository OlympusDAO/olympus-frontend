import { ethers } from "ethers";
import { COOLER_CLEARING_HOUSE_CONTRACT } from "src/constants/contracts";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useQuery } from "wagmi";

export const useGetClearingHouse = () => {
  const networks = useTestableNetworks();
  const contract = COOLER_CLEARING_HOUSE_CONTRACT.getEthersContract(networks.MAINNET);
  const { data, isFetched, isLoading } = useQuery(["getClearingHouse", networks.MAINNET], async () => {
    const factory = await contract.factory();
    const interestRate = ethers.utils.formatUnits((await contract.interestRate()).toString()); // 16 decimals, but 18 gives you % format. i.e. 0.1 = 10%
    const duration = (await contract.maxDuration()).div(86400).toString(); // 86400 seconds in a day
    const loanToCollateral = ethers.utils.formatUnits((await contract.loanToCollateral()).toString()); // 1.5 = 150% LTV (Loan to Value Ratio
    const collateralAddress = await contract.gOHM();
    const debtAddress = await contract.dai();

    console.log("data", interestRate, duration, loanToCollateral);

    return { interestRate, duration, loanToCollateral, factory, collateralAddress, debtAddress };
  });
  return { data, isFetched, isLoading };
};
