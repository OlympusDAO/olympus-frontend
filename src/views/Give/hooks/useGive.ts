import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContractReceipt, ethers } from "ethers";
import { useDispatch } from "react-redux";
import { GIVE_ADDRESSES, GOHM_ADDRESSES, SOHM_ADDRESSES } from "src/constants/addresses";
import { IUAData, trackGiveEvent } from "src/helpers/analytics/trackGiveEvent";
import { ACTION_GIVE, getTypeFromAction } from "src/helpers/GiveHelpers";
import { balanceQueryKey } from "src/hooks/useBalance";
import { useDynamicGiveContract } from "src/hooks/useContract";
import { donationInfoQueryKey, recipientInfoQueryKey } from "src/hooks/useGiveInfo";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { EthersError } from "src/lib/EthersTypes";
import { error as createErrorToast, info as createInfoToast } from "src/slices/MessagesSlice";
import { GiveData } from "src/views/Give/Interfaces";
import { useAccount } from "wagmi";

/**
 * @notice Creates a new deposit
 * @returns ContractReceipt for the deposit
 */
export const useGive = () => {
  const dispatch = useDispatch();
  const client = useQueryClient();
  const { address = "" } = useAccount();
  const networks = useTestableNetworks();
  const contract = useDynamicGiveContract(GIVE_ADDRESSES, true);

  // Mutation to interact with the YieldDirector contract
  return useMutation<ContractReceipt, EthersError, GiveData>(
    // Pass in an object with an amount and a recipient parameter
    async ({ amount: amount_, recipient: recipient_, token: token_ }) => {
      // Validate inputs
      if (parseFloat(amount_) <= 0) throw new Error(`A give amount must be positive`);

      // Confirm that the user is on a chain where YieldDirector exists
      if (!contract)
        throw new Error(
          `Give is not supported on this network. Please switch to a supported network, such as Ethereum mainnet`,
        );
      if (!address) throw new Error(`Please refresh your page and try again`);

      const uaData: IUAData = {
        address: address,
        value: amount_,
        recipient: recipient_,
        approved: true,
        txHash: null,
        type: getTypeFromAction(ACTION_GIVE),
      };

      // Before we submit the transaction, record the event.
      // This lets us track if the user rejects/ignores the confirmation dialog.
      trackGiveEvent(uaData, uaData.type + "-before");

      // Create transaction to deposit passed amount to the passed recipient
      const transaction =
        token_ === "sOHM"
          ? await contract.depositSohm(ethers.utils.parseUnits(amount_, "gwei"), recipient_)
          : await contract.deposit(ethers.utils.parseEther(amount_), recipient_);

      uaData.txHash = transaction.hash;

      trackGiveEvent(uaData);

      return transaction.wait();
    },
    {
      onError: error => {
        console.error(error.message);
        dispatch(createErrorToast("error" in error ? error.error.message : error.message));
      },
      onSuccess: async (data, GiveData) => {
        const keysToRefetch = [
          balanceQueryKey(address, SOHM_ADDRESSES, networks.MAINNET),
          balanceQueryKey(address, GOHM_ADDRESSES, networks.MAINNET),
          donationInfoQueryKey(address, networks.MAINNET),
          recipientInfoQueryKey(GiveData.recipient, networks.MAINNET),
        ];

        const promises = keysToRefetch.map(key => client.refetchQueries([key], { type: "active" }));
        await Promise.all(promises);

        dispatch(createInfoToast(`Successfully deposited sOHM`));
      },
    },
  );
};
