import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import toast from "react-hot-toast";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { balanceQueryKey } from "src/hooks/useBalance";
import { contractAllowanceQueryKey } from "src/hooks/useContractAllowance";
import { Cooler__factory } from "src/typechain/factories/Cooler__factory";
import { useSigner } from "wagmi";

export const useRepayLoan = () => {
  const { data: signer } = useSigner();
  const queryClient = useQueryClient();

  return useMutation(
    async ({ coolerAddress, loanId, amount }: { coolerAddress: string; loanId: number; amount: DecimalBigNumber }) => {
      if (!signer) throw new Error(`Please connect a wallet`);

      const coolerContract = Cooler__factory.connect(coolerAddress, signer);
      const loan = await coolerContract.repayLoan(loanId, amount.toBigNumber(18), {
        gasLimit: BigNumber.from("1000000"),
      });
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
        toast(`Successfully Repaid Loan`);
      },
    },
  );
};
