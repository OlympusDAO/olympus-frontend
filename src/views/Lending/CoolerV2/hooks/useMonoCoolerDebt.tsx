import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NetworkId } from "src/constants";
import { COOLER_V2_MONOCOOLER_CONTRACT } from "src/constants/contracts";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { balanceQueryKey } from "src/hooks/useBalance";
import { DelegationRequest } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerCollateral";
import { useMonoCoolerPosition } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerPosition";
import { useAccount, useNetwork, useSigner } from "wagmi";

const calculateBorrowAmount = (amount: DecimalBigNumber, interestRateBps: number) => {
  // Convert annual interest rate (in basis points) to hourly rate
  // interestRateBps is in basis points (1 bp = 0.01%)
  // 1 year = 8760 hours
  // Formula: hourlyRate = (interestRateBps / 10000) / 8760
  const hourlyInterestRate = interestRateBps / 10000 / 8760;
  const hourlyInterestRateString = hourlyInterestRate.toFixed(18);

  // Calculate the buffer amount (one hour's worth of interest)
  const bufferAmount = amount.mul(new DecimalBigNumber(hourlyInterestRateString));

  // Subtract buffer to ensure there's room for interest accrual
  const finalBorrowAmount = amount.sub(bufferAmount);

  console.log(
    finalBorrowAmount.toString(),
    "finalBorrowAmount",
    amount.toString(),
    "originalAmount",
    bufferAmount.toString(),
    "bufferAmount",
  );

  return finalBorrowAmount;
};

export const calculateRepayAmount = (amount: DecimalBigNumber, interestRateBps: number, fullRepay: boolean) => {
  if (!fullRepay) return amount;

  // For full repayment, add an hour's worth of interest to ensure complete repayment
  // Convert annual interest rate to hourly (interestRateBps is in basis points)
  const hourlyInterestRate = interestRateBps / 10000 / 8760;
  const hourlyInterestRateString = hourlyInterestRate.toFixed(18);

  // Calculate buffer (one hour's worth of interest)
  const bufferAmount = amount.mul(new DecimalBigNumber(hourlyInterestRateString));

  // Add the buffer to the repayment amount

  console.log(amount.toString(), "amount", bufferAmount.toString(), "bufferAmount");
  return new DecimalBigNumber(amount.add(bufferAmount).toBigNumber(18), 18);
};

export const useMonoCoolerDebt = () => {
  const { address = "" } = useAccount();
  const { data: signer } = useSigner();
  const { chain = { id: NetworkId.MAINNET } } = useNetwork();
  const queryClient = useQueryClient();
  const { data: position } = useMonoCoolerPosition();

  const borrow = useMutation(
    async ({ amount, recipient = address }: { amount: DecimalBigNumber; recipient?: string }) => {
      if (!position) throw new Error("No position available");
      if (!signer || !address) throw new Error("No signer available");

      const contract = COOLER_V2_MONOCOOLER_CONTRACT.getEthersContract(chain.id).connect(signer);
      const finalBorrowAmount = calculateBorrowAmount(amount, position.interestRateBps);

      const tx = await contract.borrow(finalBorrowAmount.toBigNumber(18), recipient);
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

      const tx = await contract.repay(amountToRepay.toBigNumber(), onBehalfOf);
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
      delegationRequests?: any[];
    }) => {
      if (!position) throw new Error("No position available");
      if (!signer || !address) throw new Error("No signer available");

      console.log("withdrawing collateral", amount.toString(), "amount");

      const contract = COOLER_V2_MONOCOOLER_CONTRACT.getEthersContract(chain.id).connect(signer);

      const tx = await contract.withdrawCollateral(amount.toBigNumber(18), recipient, delegationRequests);
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
      recipient?: string;
      onBehalfOf?: string;
      delegationRequests?: DelegationRequest[];
    }) => {
      if (!position) throw new Error("No position available");
      if (!signer || !address) throw new Error("No signer available");

      const contract = COOLER_V2_MONOCOOLER_CONTRACT.getEthersContract(chain.id).connect(signer);
      const tx = await contract.addCollateral(amount.toBigNumber(18), onBehalfOf, delegationRequests);
      await tx.wait();

      return tx;
    },
  );

  const repayAndWithdrawCollateral = useMutation(
    async ({
      amount,
      collateralAmount,
      recipient = address,
      delegationRequests = [],
      fullRepay = false,
    }: {
      amount: DecimalBigNumber;
      collateralAmount: DecimalBigNumber;
      recipient?: string;
      delegationRequests?: DelegationRequest[];
      fullRepay?: boolean;
    }) => {
      if (!position) throw new Error("No position available");
      if (!signer || !address) throw new Error("No signer available");

      const contract = COOLER_V2_MONOCOOLER_CONTRACT.getEthersContract(chain.id).connect(signer);
      const amountToRepay = calculateRepayAmount(amount, position.interestRateBps, fullRepay);

      const tx = await contract.repayAndWithdrawCollateral(
        amountToRepay.toBigNumber(),
        collateralAmount.toBigNumber(18),
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

  const addCollateralAndBorrow = useMutation({
    mutationFn: async ({
      collateralAmount,
      borrowAmount,
      recipient = address,
      delegationRequests = [],
    }: {
      collateralAmount: DecimalBigNumber;
      borrowAmount: DecimalBigNumber;
      recipient?: string;
      delegationRequests?: DelegationRequest[];
    }) => {
      if (!position || !address) throw new Error("No position or address");
      if (!signer || !address) throw new Error("No signer available");

      const borrowAmountToUse = calculateBorrowAmount(borrowAmount, position.interestRateBps);

      const contract = COOLER_V2_MONOCOOLER_CONTRACT.getEthersContract(chain.id).connect(signer);
      const tx = await contract.addCollateralAndBorrow(
        collateralAmount.toBigNumber(18),
        borrowAmountToUse.toBigNumber(18),
        recipient,
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
    repayAndWithdrawCollateral,
    addCollateralAndBorrow,
    addCollateral,
  };
};
