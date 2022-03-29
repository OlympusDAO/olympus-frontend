import { t } from "@lingui/macro";
import { ContractReceipt, ethers } from "ethers";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { GIVE_ADDRESSES, SOHM_ADDRESSES } from "src/constants/addresses";
import { useWeb3Context } from "src/hooks";
import { balanceQueryKey } from "src/hooks/useBalance";
import { useDynamicGiveContract } from "src/hooks/useContract";
import { donationInfoQueryKey } from "src/hooks/useGiveInfo";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { error as createErrorToast, info as createInfoToast } from "src/slices/MessagesSlice";

import { GiveData } from "../Interfaces";

/**
 * @notice Increases the value of an active donation
 * @returns ContractReceipt for the deposit
 */
export const useIncreaseGive = () => {
  const dispatch = useDispatch();
  const client = useQueryClient();
  const { address } = useWeb3Context();
  const networks = useTestableNetworks();
  const contract = useDynamicGiveContract(GIVE_ADDRESSES, true);

  // Mutation to interact with the YieldDirector contract
  return useMutation<ContractReceipt, Error, GiveData>(
    // Pass in an object with an amount and a recipient parameter
    async ({ amount: amount_, recipient: recipient_ }) => {
      // Validate inputs
      if (parseFloat(amount_) <= 0) throw new Error(t`An increase Give amount must be positive`);

      // Confirm that the user is on a chain where YieldDirector exists
      if (!contract) throw new Error(t`Please switch to the Ethereum network to donate yield`);

      // Create transaction to deposit passed amount to the passed recipient
      const transaction = await contract.deposit(ethers.utils.parseUnits(amount_, "gwei"), recipient_);
      return transaction.wait();
    },
    {
      onError: error => {
        dispatch(createErrorToast(error.message));
      },
      onSuccess: async () => {
        // Refetch sOHM balance and donation info
        const keysToRefetch = [
          balanceQueryKey(address, SOHM_ADDRESSES, networks.MAINNET),
          donationInfoQueryKey(address, networks.MAINNET),
        ];

        const promises = keysToRefetch.map(key => client.refetchQueries(key, { active: true }));
        await Promise.all(promises);

        dispatch(createInfoToast(t`Successfully deposited sOHM`));
      },
    },
  );
};

/**
 * @notice Decreases the value of an active donation
 * @returns ContractReceipt for the deposit
 */
export const useDecreaseGive = () => {
  const dispatch = useDispatch();
  const client = useQueryClient();
  const { address } = useWeb3Context();
  const networks = useTestableNetworks();
  const contract = useDynamicGiveContract(GIVE_ADDRESSES, true);

  // Mutation to interact with the YieldDirector contract
  return useMutation<ContractReceipt, Error, GiveData>(
    // Pass in an object with an amount and a recipient parameter
    async ({ amount: amount_, recipient: recipient_ }) => {
      // Validate inputs
      if (parseFloat(amount_) <= 0) throw new Error(t`A decrease Give amount must be positive`);

      // Confirm that the user is on a chain where YieldDirector exists
      if (!contract) throw new Error(t`Please switch to the Ethereum network to donate yield`);

      // Create transaction to withdraw passed amount from the passed recipient
      const transaction = await contract.withdraw(ethers.utils.parseUnits(amount_, "gwei"), recipient_);
      return transaction.wait();
    },
    {
      onError: error => {
        dispatch(createErrorToast(error.message));
      },
      onSuccess: async () => {
        // Refetch sOHM balance and donation info
        const keysToRefetch = [
          balanceQueryKey(address, SOHM_ADDRESSES, networks.MAINNET),
          donationInfoQueryKey(address, networks.MAINNET),
        ];

        const promises = keysToRefetch.map(key => client.refetchQueries(key, { active: true }));
        await Promise.all(promises);

        dispatch(createInfoToast(t`Successfully deposited sOHM`));
      },
    },
  );
};
