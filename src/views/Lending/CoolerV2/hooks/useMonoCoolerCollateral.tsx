import { useMutation, useQueryClient } from "@tanstack/react-query";
import { COOLER_V2_MONOCOOLER_ADDRESSES } from "src/constants/addresses";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { CoolerV2MonoCooler__factory } from "src/typechain";
import { useAccount, useSigner } from "wagmi";

export interface DelegationRequest {
  delegate: string;
  amount: string;
}

export const useMonoCoolerCollateral = () => {
  const { address = "" } = useAccount();
  const { data: signer } = useSigner();
  const networks = useTestableNetworks();
  const queryClient = useQueryClient();

  const addCollateral = useMutation(
    async ({
      amount,
      onBehalfOf = address,
      delegationRequests = [],
    }: {
      amount: string;
      onBehalfOf?: string;
      delegationRequests?: DelegationRequest[];
    }) => {
      if (!signer || !address) throw new Error("No signer available");

      const contract = CoolerV2MonoCooler__factory.connect(
        COOLER_V2_MONOCOOLER_ADDRESSES[networks.MAINNET_HOLESKY],
        signer,
      );

      const tx = await contract.addCollateral(amount, onBehalfOf, delegationRequests);
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

  const withdrawCollateral = useMutation(
    async ({
      amount,
      recipient = address,
      delegationRequests = [],
    }: {
      amount: string;
      recipient?: string;
      delegationRequests?: DelegationRequest[];
    }) => {
      if (!signer || !address) throw new Error("No signer available");

      const contract = CoolerV2MonoCooler__factory.connect(COOLER_V2_MONOCOOLER_ADDRESSES[networks.MAINNET], signer);

      const tx = await contract.withdrawCollateral(amount, recipient, delegationRequests);
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
    addCollateral,
    withdrawCollateral,
  };
};
