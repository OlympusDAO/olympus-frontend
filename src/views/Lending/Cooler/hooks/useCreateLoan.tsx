import { useMutation } from "@tanstack/react-query";
import { parseEther } from "ethers/lib/utils.js";
import toast from "react-hot-toast";
import { COOLER_CLEARING_HOUSE_CONTRACT } from "src/constants/contracts";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useSigner } from "wagmi";

export const useCreateLoan = () => {
  const { data: signer } = useSigner();
  const networks = useTestableNetworks();

  return useMutation(
    async ({ coolerAddress }: { coolerAddress: string }) => {
      if (!signer) throw new Error(`Please connect a wallet`);
      const contract = COOLER_CLEARING_HOUSE_CONTRACT.getEthersContract(networks.MAINNET).connect(signer);
      //   const contract = CoolerClearingHouse__factory.connect(clearingHouseAddress, signer);
      const loan = await contract.lend(coolerAddress, parseEther("100"), 31536000);
      //   const receipt = await cooler.wait();
      return loan;
    },
    {
      onError: (error: Error) => {
        toast.error(error.message);
      },
      onSuccess: async tx => {
        toast(`Loan Successful`);
      },
    },
  );
};
