import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NetworkId } from "src/constants";
import { COOLER_V2_MONOCOOLER_CONTRACT } from "src/constants/contracts";
import { DelegationRequest } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerCollateral";
import { useAccount, useNetwork, useSigner } from "wagmi";

export const useMonoCoolerDelegations = () => {
  const { address = "" } = useAccount();
  const { data: signer } = useSigner();
  const { chain = { id: NetworkId.MAINNET } } = useNetwork();
  const queryClient = useQueryClient();

  const delegations = useQuery(
    ["monoCoolerDelegations", address, chain.id],
    async () => {
      if (!address || !signer) return null;

      const contract = COOLER_V2_MONOCOOLER_CONTRACT.getEthersContract(chain.id).connect(signer);

      // Get all delegations (assuming max 100 for now)
      const delegationsList = await contract.accountDelegationsList(address, 0, 100);

      return delegationsList.map(d => ({
        delegate: d.delegate,
        escrow: d.escrow,
        totalAmount: d.totalAmount.toString(),
      }));
    },
    {
      enabled: !!address && !!signer,
    },
  );

  const applyDelegations = useMutation(
    async ({ delegationRequests }: { delegationRequests: DelegationRequest[] }) => {
      if (!signer || !address) throw new Error("No signer available");

      const contract = COOLER_V2_MONOCOOLER_CONTRACT.getEthersContract(chain.id).connect(signer);

      // Convert delegation requests to contract format
      const formattedDelegations = delegationRequests.map(req => ({
        delegate: req.delegate,
        amount: req.amount,
      }));

      const tx = await contract.applyDelegations(formattedDelegations);
      await tx.wait();

      return tx;
    },
    {
      onSuccess: () => {
        // Invalidate relevant queries
        queryClient.invalidateQueries(["monoCoolerDelegations", address]);
        queryClient.invalidateQueries(["monoCoolerPosition", address]);
      },
    },
  );

  return {
    delegations,
    applyDelegations,
  };
};
