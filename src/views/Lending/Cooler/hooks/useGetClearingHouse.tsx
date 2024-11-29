import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import {
  COOLER_CLEARING_HOUSE_CONTRACT_V1,
  COOLER_CLEARING_HOUSE_CONTRACT_V2,
  COOLER_CLEARING_HOUSE_CONTRACT_V3,
} from "src/constants/contracts";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { CoolerClearingHouse, CoolerClearingHouseV3, ERC4626__factory } from "src/typechain";
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
  const { data, isFetched, isLoading } = useQuery(["getClearingHouse", networks.MAINNET, clearingHouse], async () => {
    const factory = await contract.factory();
    const interestRate = ethers.utils.formatUnits((await contract.INTEREST_RATE()).toString(), 16); // 16 decimals, but 18 gives you % format. i.e. 0.1 = 10%
    const duration = (await contract.DURATION()).div(86400).toString(); // 86400 seconds in a day
    const loanToCollateral = ethers.utils.formatUnits((await contract.LOAN_TO_COLLATERAL()).toString()); // 1.5 = 150% LTV (Loan to Value Ratio
    const collateralAddress = await contract.gohm();
    let debtAddress: string;
    let sReserveAddress: string;
    if (clearingHouse === "clearingHouseV3") {
      debtAddress = await (contract as CoolerClearingHouseV3).sReserve();
      sReserveAddress = await (contract as CoolerClearingHouseV3).sReserve();
    } else {
      debtAddress = await (contract as CoolerClearingHouse).dai();
      sReserveAddress = await (contract as CoolerClearingHouse).sdai();
    }

    const sReserveContract = ERC4626__factory.connect(sReserveAddress, provider);
    const sReserveBalanceClearingHouse = await sReserveContract.balanceOf(contract.address); //shares held by clearinghouse
    const reserveSymbol = await sReserveContract.symbol();
    const reserveBalanceClearingHouse = await sReserveContract.convertToAssets(sReserveBalanceClearingHouse);
    const clearingHouseAddress = contract.address;
    const isActive = await contract.isActive();

    return {
      interestRate,
      duration,
      loanToCollateral,
      factory,
      collateralAddress,
      debtAddress,
      capacity: reserveBalanceClearingHouse,
      clearingHouseAddress,
      reserveSymbol,
      isActive,
    };
  });
  return { data, isFetched, isLoading };
};
