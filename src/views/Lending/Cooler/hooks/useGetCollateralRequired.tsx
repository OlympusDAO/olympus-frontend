import { useQuery } from "@tanstack/react-query";
import { COOLER_CONSOLIDATION_CONTRACT } from "src/constants/contracts";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { CoolerConsolidation__factory } from "src/typechain";
import { useSigner } from "wagmi";

export const useGetCollateralRequired = ({
  coolerAddress,
  clearingHouseAddress,
  loanIds,
}: {
  coolerAddress?: string;
  clearingHouseAddress?: string;
  loanIds?: number[];
}) => {
  const networks = useTestableNetworks();
  const { data: signer } = useSigner();

  const { data, isFetched, isLoading } = useQuery(
    ["getCollateralRequired", networks.MAINNET, coolerAddress, clearingHouseAddress, loanIds],
    async () => {
      try {
        if (!coolerAddress || !clearingHouseAddress || !loanIds || !signer) return new DecimalBigNumber("0");
        const contractAddress = COOLER_CONSOLIDATION_CONTRACT.addresses[networks.MAINNET];
        const contract = CoolerConsolidation__factory.connect(contractAddress, signer);

        const approvals = await contract.collateralRequired(clearingHouseAddress, coolerAddress, loanIds);
        return new DecimalBigNumber(approvals.additionalCollateral, 18);
      } catch (e) {
        return new DecimalBigNumber("0");
      }
    },
    { enabled: !!coolerAddress && !!clearingHouseAddress && !!loanIds && !!signer },
  );
  return { data, isFetched, isLoading };
};
