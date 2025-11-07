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
    }: {
      amount: DecimalBigNumber;
      recipient?: string;
      delegationRequests?: IDLGTEv1.DelegationRequestStruct[];
    }) => {
      if (!position) throw new Error("No position available");
      if (!signer || !address) throw new Error("No signer available");

      const contract = COOLER_V2_MONOCOOLER_CONTRACT.getEthersContract(chain.id).connect(signer);

      const tx = await contract.withdrawCollateral(
        amount.toBigNumber(18),
        address, // onBehalfOf
        recipient,
        delegationRequests,
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
      isAuthorized = false,
    }: {
      collateralAmount: DecimalBigNumber;
      borrowAmount: DecimalBigNumber;
      delegationRequests?: IDLGTEv1.DelegationRequestStruct[];
      isAuthorized?: boolean;
    }) => {
      if (!position || !address) throw new Error("No position or address");
      if (!signer) throw new Error("No signer available");

      const borrowAmountToUse = calculateBorrowAmount(borrowAmount, position.interestRateBps);
      const contract = COOLER_V2_COMPOSITES_CONTRACT.getEthersContract(chain.id).connect(signer);

      // For smart contract wallets that are already authorized, use empty auth/sig
      if (isAuthorized) {
        const emptyAuth = {
          account: "0x0000000000000000000000000000000000000000",
          authorized: "0x0000000000000000000000000000000000000000",
          authorizationDeadline: 0,
          nonce: 0,
          signatureDeadline: 0,
        };
        const emptySig = {
          v: 0,
          r: "0x0000000000000000000000000000000000000000000000000000000000000000",
          s: "0x0000000000000000000000000000000000000000000000000000000000000000",
        };

        const tx = await contract.addCollateralAndBorrow(
          emptyAuth,
          emptySig,
          collateralAmount.toBigNumber(18),
          borrowAmountToUse.toBigNumber(18),
          delegationRequests,
        );
        await tx.wait();
        return tx;
      }

      // For EOAs, use signature-based authorization
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
      isAuthorized = false,
    }: {
      repayAmount: DecimalBigNumber;
      collateralAmount: DecimalBigNumber;
      delegationRequests?: IDLGTEv1.DelegationRequestStruct[];
      fullRepay?: boolean;
      isAuthorized?: boolean;
    }) => {
      if (!position || !address) throw new Error("No position or address");
      if (!signer) throw new Error("No signer available");

      const amountToRepay = calculateRepayAmount(repayAmount, position.interestRateBps, fullRepay);
      const contract = COOLER_V2_COMPOSITES_CONTRACT.getEthersContract(chain.id).connect(signer);

      // For smart contract wallets that are already authorized, use empty auth/sig
      if (isAuthorized) {
        const emptyAuth = {
          account: "0x0000000000000000000000000000000000000000",
          authorized: "0x0000000000000000000000000000000000000000",
          authorizationDeadline: 0,
          nonce: 0,
          signatureDeadline: 0,
        };
        const emptySig = {
          v: 0,
          r: "0x0000000000000000000000000000000000000000000000000000000000000000",
          s: "0x0000000000000000000000000000000000000000000000000000000000000000",
        };

        const tx = await contract.repayAndRemoveCollateral(
          emptyAuth,
          emptySig,
          amountToRepay.toBigNumber(18),
          collateralAmount.toBigNumber(18),
          delegationRequests,
        );
        await tx.wait();
        return tx;
      }

      // For EOAs, use signature-based authorization
      const { auth, signature } = await authSignature();

      const tx = await contract.repayAndRemoveCollateral(
        auth,
        signature,
        amountToRepay.toBigNumber(18),
        collateralAmount.toBigNumber(18),
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

  return {
    borrow,
    repay,
    withdrawCollateral,
    addCollateral,
    addCollateralAndBorrow,
    repayAndRemoveCollateral,
  };
};
