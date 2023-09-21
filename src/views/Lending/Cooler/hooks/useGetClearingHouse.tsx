import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { COOLER_CLEARING_HOUSE_CONTRACT } from "src/constants/contracts";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { ERC4626__factory } from "src/typechain";
import { useProvider } from "wagmi";

export const useGetClearingHouse = () => {
  const networks = useTestableNetworks();
  const provider = useProvider();
  const contract = COOLER_CLEARING_HOUSE_CONTRACT.getEthersContract(networks.MAINNET);
  const { data, isFetched, isLoading } = useQuery(["getClearingHouse", networks.MAINNET], async () => {
    const factory = await contract.factory();
    const interestRate = ethers.utils.formatUnits((await contract.INTEREST_RATE()).toString(), 16); // 16 decimals, but 18 gives you % format. i.e. 0.1 = 10%

    const duration = (await contract.DURATION()).div(86400).toString(); // 86400 seconds in a day
    const loanToCollateral = ethers.utils.formatUnits((await contract.LOAN_TO_COLLATERAL()).toString()); // 1.5 = 150% LTV (Loan to Value Ratio
    const collateralAddress = await contract.gohm();
    const debtAddress = await contract.dai();
    const sdai = await contract.sdai();
    const sdaiContract = ERC4626__factory.connect(sdai, provider);
    const sdaiBalanceClearingHouse = await sdaiContract.balanceOf(contract.address); //shares held by clearinghouse
    // const sdaiBalanceTreasury = await sdaiContract.balanceOf(treasury); //shares held by treasury
    const daiBalanceClearingHouse = await sdaiContract.convertToAssets(sdaiBalanceClearingHouse);
    // const daiBalanceTreasury = await sdaiContract.convertToAssets(sdaiBalanceTreasury);

    // const daiBalance = daiBalanceClearingHouse.add(daiBalanceTreasury);

    return {
      interestRate,
      duration,
      loanToCollateral,
      factory,
      collateralAddress,
      debtAddress,
      capacity: daiBalanceClearingHouse,
    };
  });
  return { data, isFetched, isLoading };
};
