import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import toast from "react-hot-toast";
import { balanceQueryKey } from "src/hooks/useBalance";
import { contractAllowanceQueryKey } from "src/hooks/useContractAllowance";
import { CoolerClearingHouse__factory } from "src/typechain";
import { useSigner } from "wagmi";

export const useExtendLoan = () => {
  const { data: signer } = useSigner();
  const queryClient = useQueryClient();

  return useMutation(
    async ({
      coolerAddress,
      loanId,
      times,
      clearingHouseAddress,
    }: {
      clearingHouseAddress: string;
      coolerAddress: string;
      loanId: number;
      times: number;
    }) => {
      if (!signer) throw new Error(`Please connect a wallet`);
      const contract = CoolerClearingHouse__factory.connect(clearingHouseAddress, signer);
      const loan = await contract.extendLoan(coolerAddress, loanId, times, {
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
        toast(`Successfully Extended Loan`);
      },
    },
  );
};
