import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NetworkId } from "src/constants";
import { COOLER_V2_COMPOSITES_CONTRACT, COOLER_V2_MONOCOOLER_CONTRACT } from "src/constants/contracts";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { balanceQueryKey } from "src/hooks/useBalance";
import type { IDLGTEv1 } from "src/typechain/CoolerV2MonoCooler";
import { useMonoCoolerPosition } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerPosition";
import { getAuthorizationSignature } from "src/views/Lending/CoolerV2/utils/getAuthorizationSignature";
import { useAccount, useNetwork, useSigner, useSignTypedData } from "wagmi";

const calculateBorrowAmount = (amount: DecimalBigNumber, interestRateBps: number) => {
  const hourlyInterestRate = interestRateBps / 10000 / 8760;
  const hourlyInterestRateString = hourlyInterestRate.toFixed(18);

  // Calculate the buffer amount (one hour's worth of interest)
  const bufferAmount = amount.mul(new DecimalBigNumber(hourlyInterestRateString));

  // Subtract buffer to ensure there's room for interest accrual
  const finalBorrowAmount = amount.sub(bufferAmount);

  return finalBorrowAmount;
};

export const calculateRepayAmount = (amount: DecimalBigNumber, interestRateBps: number, fullRepay: boolean) => {
  if (!fullRepay) return amount;

  // For full repayment, add an hour's worth of interest to ensure complete repayment
  // Convert annual interest rate to hourly (interestRateWad is in WAD)
  const hourlyInterestRate = interestRateBps / 10000 / 8760;
  const hourlyInterestRateString = hourlyInterestRate.toFixed(18);

  // Calculate buffer (one hour's worth of interest)
  const bufferAmount = amount.mul(new DecimalBigNumber(hourlyInterestRateString));

  // Add the buffer to the repayment amount
  return new DecimalBigNumber(amount.add(bufferAmount).toBigNumber(18), 18);
};

export const useMonoCoolerDebt = () => {
  const { address = "" } = useAccount();
  const { data: signer } = useSigner();
  const { chain = { id: NetworkId.MAINNET } } = useNetwork();
  const { signTypedDataAsync } = useSignTypedData();
  const queryClient = useQueryClient();
  const { data: position } = useMonoCoolerPosition();

  const authSignature = async () => {
    if (!address) throw new Error("No address available");
    const coolerContract = COOLER_V2_MONOCOOLER_CONTRACT.getEthersContract(chain.id);
    const nonce = await coolerContract.authorizationNonces(address);
    const deadline = Math.floor(Date.now() / 1000) + 3600;
    return getAuthorizationSignature({
      userAddress: address,
      authorizedAddress: COOLER_V2_COMPOSITES_CONTRACT.getAddress(chain.id) as `0x${string}`,
      verifyingContract: coolerContract.address as `0x${string}`,
      chainId: chain.id,
      deadline,
      nonce: nonce.toString(),
      signTypedDataAsync,
    });
  };

  const borrow = useMutation(
    async ({ amount, recipient = address }: { amount: DecimalBigNumber; recipient?: string }) => {
      if (!position) throw new Error("No position available");
      if (!signer || !address) throw new Error("No signer available");

      const contract = COOLER_V2_MONOCOOLER_CONTRACT.getEthersContract(chain.id).connect(signer);
      const finalBorrowAmount = calculateBorrowAmount(amount, position.interestRateBps);

      const tx = await contract.borrow(
        finalBorrowAmount.toBigNumber(18),
        address, // onBehalfOf
        recipient,
        {
          gasLimit: 500000,
        },
      );
      await tx.wait();

      return tx;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["monoCoolerPosition", address] });
        queryClient.invalidateQueries({ queryKey: [balanceQueryKey()] });
      },
    },
  );

  const repay = useMutation(
    async ({
      amount,
      onBehalfOf = address,
      fullRepay = false,
    }: {
      amount: DecimalBigNumber;
      onBehalfOf?: string;
      fullRepay?: boolean;
    }) => {
      if (!position) throw new Error("No position available");
      if (!signer || !address) throw new Error("No signer available");

      const contract = COOLER_V2_MONOCOOLER_CONTRACT.getEthersContract(chain.id).connect(signer);
      const amountToRepay = calculateRepayAmount(amount, position.interestRateBps, fullRepay);

      const tx = await contract.repay(amountToRepay.toBigNumber(), onBehalfOf, {
        gasLimit: 500000,
      });
      await tx.wait();

      return tx;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["monoCoolerPosition", address] });
        queryClient.invalidateQueries({ queryKey: [balanceQueryKey()] });
      },
    },
  );

  const withdrawCollateral = useMutation(
    async ({
      amount,
      recipient = address,
      delegationRequests = [],
      autoRescindDelegations = true,
    }: {
      amount: DecimalBigNumber;
      recipient?: string;
      delegationRequests?: IDLGTEv1.DelegationRequestStruct[];
      autoRescindDelegations?: boolean;
    }) => {
      if (!position) throw new Error("No position available");
      if (!signer || !address) throw new Error("No signer available");

      const contract = COOLER_V2_MONOCOOLER_CONTRACT.getEthersContract(chain.id).connect(signer);

      let finalDelegationRequests = delegationRequests;

      // If auto-rescind is enabled and no explicit delegation requests provided,
      // automatically create delegation requests to undelegate the required amount
      if (autoRescindDelegations && delegationRequests.length === 0) {
        try {
          // Get current delegations
          const delegationsList = await contract.accountDelegationsList(address, 0, 100);

          if (delegationsList.length > 0) {
            let remainingToUndelegate = amount.toBigNumber(18);
            const rescindRequests: IDLGTEv1.DelegationRequestStruct[] = [];

            // Create rescind requests for delegations until we have enough undelegated
            for (const delegation of delegationsList) {
              if (remainingToUndelegate.lte(0)) break;

              const delegatedAmount = delegation.amount;
              const amountToRescind = remainingToUndelegate.gte(delegatedAmount)
                ? delegatedAmount
                : remainingToUndelegate;

              if (amountToRescind.gt(0)) {
                rescindRequests.push({
                  delegate: delegation.delegate,
                  amount: amountToRescind.mul(-1), // Negative amount for rescinding
                });

                remainingToUndelegate = remainingToUndelegate.sub(amountToRescind);
              }
            }

            finalDelegationRequests = rescindRequests;
          }
        } catch (error) {
          console.warn("Failed to automatically rescind delegations:", error);
          // Continue with empty delegation requests - let the contract handle the error
        }
      }

      const tx = await contract.withdrawCollateral(
        amount.toBigNumber(18),
        address, // onBehalfOf
        recipient,
        finalDelegationRequests,
      );
      await tx.wait();

      return tx;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["monoCoolerPosition", address] });
        queryClient.invalidateQueries({ queryKey: [balanceQueryKey()] });
        queryClient.invalidateQueries({ queryKey: ["monoCoolerDelegations", address] });
      },
    },
  );

  const addCollateral = useMutation(
    async ({
      amount,
      onBehalfOf = address,
      delegationRequests = [],
    }: {
      amount: DecimalBigNumber;
      onBehalfOf?: string;
      delegationRequests?: IDLGTEv1.DelegationRequestStruct[];
    }) => {
      if (!position) throw new Error("No position available");
      if (!signer || !address) throw new Error("No signer available");

      const contract = COOLER_V2_MONOCOOLER_CONTRACT.getEthersContract(chain.id).connect(signer);
      const tx = await contract.addCollateral(amount.toBigNumber(18), onBehalfOf, delegationRequests);
      await tx.wait();

      return tx;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["monoCoolerPosition", address] });
        queryClient.invalidateQueries({ queryKey: [balanceQueryKey()] });
      },
    },
  );

  // New Composite functions
  const addCollateralAndBorrow = useMutation({
    mutationFn: async ({
      collateralAmount,
      borrowAmount,
      delegationRequests = [],
    }: {
      collateralAmount: DecimalBigNumber;
      borrowAmount: DecimalBigNumber;
      delegationRequests?: IDLGTEv1.DelegationRequestStruct[];
    }) => {
      if (!position || !address) throw new Error("No position or address");
      if (!signer) throw new Error("No signer available");

      const borrowAmountToUse = calculateBorrowAmount(borrowAmount, position.interestRateBps);
      const contract = COOLER_V2_COMPOSITES_CONTRACT.getEthersContract(chain.id).connect(signer);

      const { auth, signature } = await authSignature();

      const tx = await contract.addCollateralAndBorrow(
        auth,
        signature,
        collateralAmount.toBigNumber(18),
        borrowAmountToUse.toBigNumber(18),
        delegationRequests,
      );
      await tx.wait();

      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monoCoolerPosition", address] });
      queryClient.invalidateQueries({ queryKey: [balanceQueryKey()] });
    },
  });

  const repayAndRemoveCollateral = useMutation({
    mutationFn: async ({
      repayAmount,
      collateralAmount,
      delegationRequests = [],
      fullRepay = false,
      autoRescindDelegations = true,
    }: {
      repayAmount: DecimalBigNumber;
      collateralAmount: DecimalBigNumber;
      delegationRequests?: IDLGTEv1.DelegationRequestStruct[];
      fullRepay?: boolean;
      autoRescindDelegations?: boolean;
    }) => {
      if (!position || !address) throw new Error("No position or address");
      if (!signer) throw new Error("No signer available");

      const contract = COOLER_V2_COMPOSITES_CONTRACT.getEthersContract(chain.id).connect(signer);
      const amountToRepay = calculateRepayAmount(repayAmount, position.interestRateBps, fullRepay);

      let finalDelegationRequests = delegationRequests;

      // If auto-rescind is enabled and no explicit delegation requests provided,
      // automatically create delegation requests to undelegate the required amount
      if (
        autoRescindDelegations &&
        delegationRequests.length === 0 &&
        collateralAmount.gt(new DecimalBigNumber("0", 18))
      ) {
        try {
          // Get current delegations from the MonoCooler contract
          const coolerContract = COOLER_V2_MONOCOOLER_CONTRACT.getEthersContract(chain.id).connect(signer);
          const delegationsList = await coolerContract.accountDelegationsList(address, 0, 100);

          if (delegationsList.length > 0) {
            let remainingToUndelegate = collateralAmount.toBigNumber(18);
            const rescindRequests: IDLGTEv1.DelegationRequestStruct[] = [];

            // Create rescind requests for delegations until we have enough undelegated
            for (const delegation of delegationsList) {
              if (remainingToUndelegate.lte(0)) break;

              const delegatedAmount = delegation.amount;
              const amountToRescind = remainingToUndelegate.gte(delegatedAmount)
                ? delegatedAmount
                : remainingToUndelegate;

              if (amountToRescind.gt(0)) {
                rescindRequests.push({
                  delegate: delegation.delegate,
                  amount: amountToRescind.mul(-1), // Negative amount for rescinding
                });

                remainingToUndelegate = remainingToUndelegate.sub(amountToRescind);
              }
            }

            finalDelegationRequests = rescindRequests;
          }
        } catch (error) {
          console.warn("Failed to automatically rescind delegations:", error);
          // Continue with empty delegation requests - let the contract handle the error
        }
      }

      const { auth, signature } = await authSignature();

      const tx = await contract.repayAndRemoveCollateral(
        auth,
        signature,
        amountToRepay.toBigNumber(18),
        collateralAmount.toBigNumber(18),
        finalDelegationRequests,
      );
      await tx.wait();

      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monoCoolerPosition", address] });
      queryClient.invalidateQueries({ queryKey: [balanceQueryKey()] });
      queryClient.invalidateQueries({ queryKey: ["monoCoolerDelegations", address] });
    },
  });

  return {
    borrow,
    repay,
    withdrawCollateral,
    addCollateral,
    addCollateralAndBorrow,
    repayAndRemoveCollateral,
  };
};
