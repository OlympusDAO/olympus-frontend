import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { COOLER_CLEARING_HOUSE_CONTRACT } from "src/constants/contracts";
import { useGetSnapshots } from "src/generated/coolerLoans";
import { getISO8601String } from "src/helpers/DateHelper";
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
    const collateralAddress = await contract.gOHM();
    const debtAddress = await contract.dai();
    const sdai = await contract.sdai();
    const treasury = await contract.TRSRY();
    const sdaiContract = ERC4626__factory.connect(sdai, provider);
    const sdaiBalanceClearingHouse = await sdaiContract.balanceOf(contract.address); //shares held by clearinghouse
    const sdaiBalanceTreasury = await sdaiContract.balanceOf(treasury); //shares held by treasury
    const daiBalanceClearingHouse = await sdaiContract.convertToAssets(sdaiBalanceClearingHouse);
    const daiBalanceTreasury = await sdaiContract.convertToAssets(sdaiBalanceTreasury);

    const daiBalance = daiBalanceClearingHouse.add(daiBalanceTreasury);

    const receivables = contract.receivables();

    return {
      interestRate,
      duration,
      loanToCollateral,
      factory,
      collateralAddress,
      debtAddress,
      capacity: daiBalance,
      receivables,
    };
  });
  return { data, isFetched, isLoading };
};

export const useClearinghouseLatest = () => {
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  const { data, isLoading } = useGetSnapshots({
    startDate: getISO8601String(new Date()),
    beforeDate: getISO8601String(tomorrowDate),
  });

  const latestSnapshot = data?.records ? data?.records[data?.records.length - 1] : undefined;

  return {
    latestSnapshot,
    isLoading,
  };
};
