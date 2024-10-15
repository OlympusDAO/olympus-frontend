import { useQuery } from "@tanstack/react-query";
import { COOLER_CONSOLIDATION_CONTRACT } from "src/constants/contracts";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { CoolerConsolidation__factory } from "src/typechain";
import { useProvider } from "wagmi";

export const useGetConsolidationAllowances = ({
  clearingHouseAddress,
  coolerAddress,
  loanIds,
}: {
  clearingHouseAddress: string;
  coolerAddress: string;
  loanIds: number[];
}) => {
  const provider = useProvider();
  const networks = useTestableNetworks();

  const { data, isFetched, isLoading } = useQuery(
    ["useGetConsolidationAllowances", clearingHouseAddress, coolerAddress],
    async () => {
      try {
        const contractAddress = COOLER_CONSOLIDATION_CONTRACT.addresses[networks.MAINNET];
        const contract = CoolerConsolidation__factory.connect(contractAddress, provider);
        const requiredApprovals = await contract.requiredApprovals(clearingHouseAddress, coolerAddress, loanIds);
        return {
          consolidatedLoanCollateral: new DecimalBigNumber(requiredApprovals[1], 18),
          totalDebtWithFee: new DecimalBigNumber(requiredApprovals[2], 18),
        };
      } catch {
        return {
          consolidatedLoanCollateral: new DecimalBigNumber("0", 18),
          totalDebtWithFee: new DecimalBigNumber("0", 18),
        };
      }
    },
    { enabled: !!coolerAddress },
  );
  return { data, isFetched, isLoading };
};
