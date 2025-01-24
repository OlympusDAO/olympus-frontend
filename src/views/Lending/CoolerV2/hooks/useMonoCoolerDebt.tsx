import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NetworkId } from "src/constants";
import { COOLER_V2_MONOCOOLER_CONTRACT } from "src/constants/contracts";
import { useAccount, useNetwork, useSigner } from "wagmi";

export const useMonoCoolerDebt = () => {
  const { address = "" } = useAccount();
  const { data: signer } = useSigner();
  const { chain = { id: NetworkId.MAINNET } } = useNetwork();
  const queryClient = useQueryClient();

  const borrow = useMutation(
    async ({ amount, recipient = address }: { amount: string; recipient?: string }) => {
      if (!signer || !address) throw new Error("No signer available");

      const contract = COOLER_V2_MONOCOOLER_CONTRACT.getEthersContract(chain.id).connect(signer);

      const tx = await contract.borrow(amount, recipient);
      await tx.wait();

      return tx;
    },
    {
      onSuccess: () => {
        // Invalidate relevant queries
        queryClient.invalidateQueries(["monoCoolerPosition", address]);
      },
    },
  );

  const repay = useMutation(
    async ({ amount, onBehalfOf = address }: { amount: string; onBehalfOf?: string }) => {
      if (!signer || !address) throw new Error("No signer available");

      const contract = COOLER_V2_MONOCOOLER_CONTRACT.getEthersContract(chain.id).connect(signer);

      const tx = await contract.repay(amount, onBehalfOf);
      await tx.wait();

      return tx;
    },
    {
      onSuccess: () => {
        // Invalidate relevant queries
        queryClient.invalidateQueries(["monoCoolerPosition", address]);
      },
    },
  );

  return {
    borrow,
    repay,
  };
};
