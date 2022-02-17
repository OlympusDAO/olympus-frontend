import { parseUnits } from "@ethersproject/units";
import { t } from "@lingui/macro";
import { ContractReceipt } from "ethers";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { GOHM_ADDRESSES, OHM_ADDRESSES, SOHM_ADDRESSES, STAKING_ADDRESSES } from "src/constants/addresses";
import { useWeb3Context } from "src/hooks";
import { balanceQueryKey, useBalance } from "src/hooks/useBalance";
import { useDynamicStakingContract } from "src/hooks/useContract";
import { NetworkId } from "src/networkDetails";
import { error as createErrorToast, info as createInfoToast } from "src/slices/MessagesSlice";

export const useStakeMutation = (action: "STAKE" | "UNSTAKE", stakedAssetType: "sOHM" | "gOHM") => {
  const dispatch = useDispatch();
  const client = useQueryClient();
  const { address } = useWeb3Context();
  const contract = useDynamicStakingContract(STAKING_ADDRESSES, true);

  const fromToken = action === "STAKE" ? "OHM" : stakedAssetType;

  const addresses = fromToken === "OHM" ? OHM_ADDRESSES : fromToken === "sOHM" ? SOHM_ADDRESSES : GOHM_ADDRESSES;
  const { data: balances } = useBalance(addresses);

  return useMutation<ContractReceipt, Error, string>(
    async amount => {
      if (!amount || isNaN(Number(amount))) throw new Error(t`Please enter a number`);

      const parsedAmount = parseUnits(amount, fromToken === "gOHM" ? 18 : 9);

      if (!parsedAmount.gt(0)) throw new Error(t`Please enter a number greater than 0`);

      if (!balances) throw new Error(t`Please refresh your page and try again`);

      if (parsedAmount.gt(balances[NetworkId.MAINNET]))
        throw new Error(t`You cannot ${action === "STAKE" ? "stake" : "unstake"} more than your ${fromToken} balance`);

      if (!contract)
        throw new Error(
          t`Please switch to the Ethereum network to ${action === "STAKE" ? "stake" : "unstake"} your ${fromToken}`,
        );

      if (!address) throw new Error(t`Please refresh your page and try again`);

      const shouldRebase = stakedAssetType === "sOHM";

      if (action === "STAKE") {
        const transaction = await contract.stake(address, parsedAmount, shouldRebase, true);
        return transaction.wait();
      }

      const transaction = await contract.unstake(address, parsedAmount, true, shouldRebase);
      return transaction.wait();
    },
    {
      onError: error => void dispatch(createErrorToast(error.message)),
      onSuccess: () => {
        dispatch(createInfoToast(`Successfully ${action === "STAKE" ? "staked OHM" : `unstaked ${fromToken}`}`));
        client.refetchQueries(balanceQueryKey());
      },
    },
  );
};
