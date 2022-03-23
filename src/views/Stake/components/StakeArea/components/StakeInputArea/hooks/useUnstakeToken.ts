import { t } from "@lingui/macro";
import { ContractReceipt } from "ethers";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { GOHM_ADDRESSES, OHM_ADDRESSES, SOHM_ADDRESSES, STAKING_ADDRESSES } from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useWeb3Context } from "src/hooks";
import { balanceQueryKey, useBalance } from "src/hooks/useBalance";
import { useDynamicStakingContract } from "src/hooks/useContract";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { error as createErrorToast, info as createInfoToast } from "src/slices/MessagesSlice";

export const useUnstakeToken = (fromToken: "sOHM" | "gOHM") => {
  const dispatch = useDispatch();
  const client = useQueryClient();
  const { address } = useWeb3Context();
  const networks = useTestableNetworks();
  const contract = useDynamicStakingContract(STAKING_ADDRESSES, true);

  const addresses = fromToken === "sOHM" ? SOHM_ADDRESSES : GOHM_ADDRESSES;
  const balance = useBalance(addresses)[networks.MAINNET].data;

  return useMutation<ContractReceipt, Error, string>(
    async amount => {
      if (!amount || isNaN(Number(amount))) throw new Error(t`Please enter a number`);

      const _amount = new DecimalBigNumber(amount, fromToken === "gOHM" ? 18 : 9);

      if (!_amount.gt(new DecimalBigNumber("0", 9))) throw new Error(t`Please enter a number greater than 0`);

      if (!balance) throw new Error(t`Please refresh your page and try again`);

      if (_amount.gt(balance)) throw new Error(t`You cannot unstake more than your` + ` ${fromToken} ` + t`balance`);

      if (!contract) throw new Error(t`Please switch to the Ethereum network to unstake your` + ` ${fromToken}`);

      if (!address) throw new Error(t`Please refresh your page and try again`);

      const shouldRebase = fromToken === "sOHM";

      const transaction = await contract.unstake(address, _amount.toBigNumber(), true, shouldRebase);
      return transaction.wait();
    },
    {
      onError: error => {
        dispatch(createErrorToast(error.message));
      },
      onSuccess: async () => {
        const keysToRefetch = [
          balanceQueryKey(address, addresses, networks.MAINNET),
          balanceQueryKey(address, OHM_ADDRESSES, networks.MAINNET),
        ];

        const promises = keysToRefetch.map(key => client.refetchQueries(key, { active: true }));

        await Promise.all(promises);

        dispatch(createInfoToast(t`Successfully unstaked ` + ` ${fromToken}`));
      },
    },
  );
};
