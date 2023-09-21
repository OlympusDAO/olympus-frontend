import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { COOLER_CLEARING_HOUSE_CONTRACT } from "src/constants/contracts";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useSigner } from "wagmi";

export const useExtendLoan = () => {
  const { data: signer } = useSigner();
  const networks = useTestableNetworks();
  const queryClient = useQueryClient();

  return useMutation(
    async ({ coolerAddress, loanId, times }: { coolerAddress: string; loanId: number; times: number }) => {
      if (!signer) throw new Error(`Please connect a wallet`);
      const contract = COOLER_CLEARING_HOUSE_CONTRACT.getEthersContract(networks.MAINNET).connect(signer);
      const loan = await contract.extendLoan(coolerAddress, loanId, times);
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
        toast(`Successfully Extended Loan`);
      },
    },
  );
};
