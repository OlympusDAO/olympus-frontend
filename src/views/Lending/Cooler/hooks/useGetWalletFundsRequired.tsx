import { COOLER_CONSOLIDATION_CONTRACT } from "src/constants/contracts";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { CoolerConsolidation__factory } from "src/typechain";
import { useProvider, useQuery } from "wagmi";

export const useGetWalletFundsRequired = ({
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
    ["useGetWalletFundsRequired", clearingHouseAddress, coolerAddress],
    async () => {
      try {
        const contractAddress = COOLER_CONSOLIDATION_CONTRACT.addresses[networks.MAINNET];
        const contract = CoolerConsolidation__factory.connect(contractAddress, provider);
        const requiredDebtInWallet = await contract.fundsRequired(clearingHouseAddress, coolerAddress, loanIds);
        const requiredCollateralInWallet = await contract.collateralRequired(
          clearingHouseAddress,
          coolerAddress,
          loanIds,
        );
        return {
          totalDebtNeededInWallet: new DecimalBigNumber(requiredDebtInWallet.interest, 18),
          totalCollateralNeededInWallet: new DecimalBigNumber(requiredCollateralInWallet.additionalCollateral, 18),
        };
      } catch {
        return {
          totalDebtNeededInWallet: new DecimalBigNumber("0", 18),
          totalCollateralNeededInWallet: new DecimalBigNumber("0", 18),
        };
      }
    },
    { enabled: !!coolerAddress },
  );
  return { data, isFetched, isLoading };
};
