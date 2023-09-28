import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { balanceQueryKey } from "src/hooks/useBalance";
import { contractAllowanceQueryKey } from "src/hooks/useContractAllowance";
import { CoolerClearingHouse__factory } from "src/typechain";
import { useSigner } from "wagmi";

export const useCreateLoan = () => {
  const { data: signer } = useSigner();
  const queryClient = useQueryClient();

  return useMutation(
    async ({
      coolerAddress,
      borrowAmount,
      clearingHouseAddress,
    }: {
      coolerAddress: string;
      borrowAmount: DecimalBigNumber;
      clearingHouseAddress: string;
    }) => {
      if (!signer) throw new Error(`Please connect a wallet`);
      const contract = CoolerClearingHouse__factory.connect(clearingHouseAddress, signer);
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
        queryClient.invalidateQueries({ queryKey: [balanceQueryKey()] });
        queryClient.invalidateQueries({ queryKey: [contractAllowanceQueryKey()] });
        toast(`Loan Successful`);
      },
    },
  );
};
