import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NetworkId } from "src/constants";
import { COOLER_V2_MONOCOOLER_CONTRACT } from "src/constants/contracts";
import { DelegationRequest } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerCollateral";
import { useAccount, useNetwork, useSigner } from "wagmi";

export const useMonoCoolerCombined = () => {
  const { address = "" } = useAccount();
  const { data: signer } = useSigner();
  const { chain = { id: NetworkId.MAINNET } } = useNetwork();
  const queryClient = useQueryClient();

  const addCollateralAndBorrow = useMutation(
    async ({
      collateralAmount,
      borrowAmount,
      recipient = address,
      delegationRequests = [],
    }: {
      collateralAmount: string;
      borrowAmount: string;
      recipient?: string;
      delegationRequests?: DelegationRequest[];
    }) => {
      if (!signer || !address) throw new Error("No signer available");

      const contract = COOLER_V2_MONOCOOLER_CONTRACT.getEthersContract(chain.id).connect(signer);

      const tx = await contract.addCollateralAndBorrow(collateralAmount, borrowAmount, recipient, delegationRequests);
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

  const addCollateralAndBorrowOnBehalfOf = useMutation(
    async ({
      onBehalfOf,
      collateralAmount,
      borrowAmount,
    }: {
      onBehalfOf: string;
      collateralAmount: string;
      borrowAmount: string;
    }) => {
      if (!signer || !address) throw new Error("No signer available");

      const contract = COOLER_V2_MONOCOOLER_CONTRACT.getEthersContract(chain.id).connect(signer);

      const tx = await contract.addCollateralAndBorrowOnBehalfOf(onBehalfOf, collateralAmount, borrowAmount);
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
    addCollateralAndBorrow,
    addCollateralAndBorrowOnBehalfOf,
  };
};
