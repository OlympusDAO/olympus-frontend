import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { Cooler__factory } from "src/typechain/factories/Cooler__factory";
import { useSigner } from "wagmi";

export const useRepayLoan = () => {
  const { data: signer } = useSigner();
  const queryClient = useQueryClient();

  return useMutation(
    async ({ coolerAddress, loanId, amount }: { coolerAddress: string; loanId: number; amount: DecimalBigNumber }) => {
      if (!signer) throw new Error(`Please connect a wallet`);

      const coolerContract = Cooler__factory.connect(coolerAddress, signer);
      //   const contract = CoolerClearingHouse__factory.connect(clearingHouseAddress, signer);
      const loan = await coolerContract.repayLoan(loanId, amount.toBigNumber(18));
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
        toast(`Successfully Repaid Loan`);
      },
    },
  );
};
