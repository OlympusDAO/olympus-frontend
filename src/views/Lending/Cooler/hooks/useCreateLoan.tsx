import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { COOLER_CLEARING_HOUSE_CONTRACT } from "src/constants/contracts";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useSigner } from "wagmi";

export const useCreateLoan = () => {
  const { data: signer } = useSigner();
  const networks = useTestableNetworks();
  const queryClient = useQueryClient();

  return useMutation(
    async ({ coolerAddress, borrowAmount }: { coolerAddress: string; borrowAmount: DecimalBigNumber }) => {
      if (!signer) throw new Error(`Please connect a wallet`);

      const contract = COOLER_CLEARING_HOUSE_CONTRACT.getEthersContract(networks.MAINNET).connect(signer);
      const loan = await contract.lendToCooler(coolerAddress, borrowAmount.toBigNumber(18));
      const receipt = await loan.wait();
      return receipt;
    },
    {
      onError: (error: Error) => {
        toast.error(error.message);
      },
      onSuccess: async tx => {
        queryClient.invalidateQueries({ queryKey: ["getCoolerLoans"] });
        queryClient.invalidateQueries({ queryKey: [["useBalance"]] });
        queryClient.invalidateQueries({ queryKey: [["useContractAllowances"]] });
        toast(`Loan Successful`);
      },
    },
  );
};
