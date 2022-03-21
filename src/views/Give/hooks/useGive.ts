import { t } from "@lingui/macro";
import { ContractReceipt, ethers } from "ethers";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { GIVE_ADDRESSES, SOHM_ADDRESSES } from "src/constants/addresses";
import { useWeb3Context } from "src/hooks";
import { balanceQueryKey } from "src/hooks/useBalance";
import { useDynamicGiveContract } from "src/hooks/useContract";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { error as createErrorToast, info as createInfoToast } from "src/slices/MessagesSlice";

import { GiveData } from "../Interfaces";

export const useGive = () => {
  const dispatch = useDispatch();
  const client = useQueryClient();
  const { address } = useWeb3Context();
  const networks = useTestableNetworks();
  const contract = useDynamicGiveContract(GIVE_ADDRESSES, true);

  return useMutation<ContractReceipt, Error, GiveData>(
    async ({ amount: amount_, recipient: recipient_ }) => {
      if (!contract) throw new Error(t`Please switch to the Ethereum network to donate yield`);

      const transaction = await contract.deposit(ethers.utils.parseUnits(amount_, "gwei"), recipient_);
      return transaction.wait();
    },
    {
      onError: error => {
        console.error(error.message);
        dispatch(createErrorToast(error.message));
      },
      onSuccess: async () => {
        const keysToRefetch = [
          balanceQueryKey(address, SOHM_ADDRESSES, networks.MAINNET),
          // need to add donation info refetch
        ];

        const promises = keysToRefetch.map(key => client.refetchQueries(key, { active: true }));
        await Promise.all(promises);

        dispatch(createInfoToast(t`Successfully deposited sOHM`));
      },
    },
  );
};
