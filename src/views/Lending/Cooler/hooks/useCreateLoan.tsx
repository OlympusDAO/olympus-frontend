import { useMutation, useQueryClient } from "@tanstack/react-query";
import { parseEther } from "ethers/lib/utils.js";
import toast from "react-hot-toast";
import { COOLER_CLEARING_HOUSE_CONTRACT } from "src/constants/contracts";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useSigner } from "wagmi";

export const useCreateLoan = () => {
  const { data: signer } = useSigner();
  const networks = useTestableNetworks();
  const queryClient = useQueryClient();

  return useMutation(
    async ({ coolerAddress, borrowAmount }: { coolerAddress: string; borrowAmount: number }) => {
      if (!signer) throw new Error(`Please connect a wallet`);
      const contract = COOLER_CLEARING_HOUSE_CONTRACT.getEthersContract(networks.MAINNET).connect(signer);
      //   const contract = CoolerClearingHouse__factory.connect(clearingHouseAddress, signer);
      const loan = await contract.lendToCooler(coolerAddress, parseEther(borrowAmount.toString()));
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
