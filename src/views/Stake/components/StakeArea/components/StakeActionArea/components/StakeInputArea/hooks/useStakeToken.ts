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

export const useStakeToken = (toToken: "sOHM" | "gOHM") => {
  const dispatch = useDispatch();
  const client = useQueryClient();
  const { address, networkId } = useWeb3Context();
  const { data: balances } = useBalance(OHM_ADDRESSES);
  const contract = useDynamicStakingContract(STAKING_ADDRESSES, true);

  return useMutation<ContractReceipt, Error, string>(
    async amount => {
      if (!amount || isNaN(Number(amount))) throw new Error(t`Please enter a number`);

      const parsedAmount = parseUnits(amount, 9);

      if (!parsedAmount.gt(0)) throw new Error(t`Please enter a number greater than 0`);

      if (!balances) throw new Error(t`Please refresh your page and try again`);

      const balance = balances[networkId === NetworkId.TESTNET_RINKEBY ? NetworkId.TESTNET_RINKEBY : NetworkId.MAINNET];

      if (parsedAmount.gt(balance)) throw new Error(t`You cannot stake more than your OHM balance`);

      if (!contract) throw new Error(t`Please switch to the Ethereum network to stake your OHM`);

      if (!address) throw new Error(t`Please refresh your page and try again`);

      const shouldRebase = toToken === "sOHM";

      const transaction = await contract.stake(address, parsedAmount, shouldRebase, true);
      return transaction.wait();
    },
    {
      onError: error => void dispatch(createErrorToast(error.message)),
      onSuccess: () => {
        dispatch(createInfoToast(t`Successfully staked OHM`));

        const keysToRefetch = [
          balanceQueryKey(address, OHM_ADDRESSES),
          balanceQueryKey(address, toToken === "sOHM" ? SOHM_ADDRESSES : GOHM_ADDRESSES),
        ];

        keysToRefetch.map(key => client.refetchQueries(key, { active: true }));
      },
    },
  );
};
