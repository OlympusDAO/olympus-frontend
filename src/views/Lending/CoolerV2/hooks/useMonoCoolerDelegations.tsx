import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NetworkId } from "src/constants";
import { COOLER_V2_MONOCOOLER_CONTRACT } from "src/constants/contracts";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { IDLGTEv1 } from "src/typechain/CoolerV2MonoCooler";
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
        totalAmount: d.amount,
      }));
    },
    {
      enabled: !!address && !!signer,
    },
  );

  const applyDelegations = useMutation(
    async ({ delegationRequests }: { delegationRequests: IDLGTEv1.DelegationRequestStruct[] }) => {
      if (!signer || !address) throw new Error("No signer available");

      const contract = COOLER_V2_MONOCOOLER_CONTRACT.getEthersContract(chain.id).connect(signer);

      // Convert delegation requests to contract format
      const formattedDelegations = delegationRequests.map(req => ({
        delegate: req.delegate,
        amount: req.amount,
      }));

      const tx = await contract.applyDelegations(formattedDelegations, address);
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

  /**
   * Check if delegations need to be rescinded for a withdrawal and get the required rescission requests
   */
  const getRequiredDelegationRescissions = (withdrawAmount: DecimalBigNumber) => {
    if (!delegations.data || delegations.data.length === 0) {
      return {
        needsRescission: false,
        rescissionRequests: [],
        totalDelegated: new DecimalBigNumber("0", 18),
        canWithdrawDirectly: true,
      };
    }

    const totalDelegated = delegations.data.reduce(
      (sum, delegation) => sum.add(new DecimalBigNumber(delegation.totalAmount, 18)),
      new DecimalBigNumber("0", 18),
    );

    // If no delegations, no rescission needed
    if (totalDelegated.eq(new DecimalBigNumber("0", 18))) {
      return {
        needsRescission: false,
        rescissionRequests: [],
        totalDelegated,
        canWithdrawDirectly: true,
      };
    }

    let remainingToUndelegate = withdrawAmount;
    const rescissionRequests: IDLGTEv1.DelegationRequestStruct[] = [];

    // Calculate which delegations need to be rescinded
    for (const delegation of delegations.data) {
      if (
        remainingToUndelegate.eq(new DecimalBigNumber("0", 18)) ||
        remainingToUndelegate.lt(new DecimalBigNumber("0", 18))
      )
        break;

      const delegatedAmount = new DecimalBigNumber(delegation.totalAmount, 18);
      const amountToRescind =
        remainingToUndelegate.gt(delegatedAmount) || remainingToUndelegate.eq(delegatedAmount)
          ? delegatedAmount
          : remainingToUndelegate;

      if (amountToRescind.gt(new DecimalBigNumber("0", 18))) {
        rescissionRequests.push({
          delegate: delegation.delegate,
          amount: amountToRescind.toBigNumber(18).mul(-1), // Negative amount for rescinding
        });

        remainingToUndelegate = remainingToUndelegate.sub(amountToRescind);
      }
    }

    return {
      needsRescission: rescissionRequests.length > 0,
      rescissionRequests,
      totalDelegated,
      canWithdrawDirectly: rescissionRequests.length === 0,
    };
  };

  return {
    delegations,
    applyDelegations,
    getRequiredDelegationRescissions,
  };
};
