import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { COOLER_CLEARING_HOUSE_CONTRACT } from "src/constants/contracts";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useSigner } from "wagmi";

export const useExtendLoan = () => {
  const { data: signer } = useSigner();
  const networks = useTestableNetworks();

  return useMutation(
    async ({ coolerAddress, loanId }: { coolerAddress: string; loanId: number }) => {
      if (!signer) throw new Error(`Please connect a wallet`);
      const contract = COOLER_CLEARING_HOUSE_CONTRACT.getEthersContract(networks.MAINNET).connect(signer);
      //   const contract = CoolerClearingHouse__factory.connect(clearingHouseAddress, signer);
      const loan = await contract.rollLoan(coolerAddress, loanId);
      const receipt = await loan.wait();
      return receipt;
    },
    {
      onError: (error: Error) => {
        toast.error(error.message);
      },
      onSuccess: async tx => {
        toast(`Successfully Extended Loan`);
      },
    },
  );
};
