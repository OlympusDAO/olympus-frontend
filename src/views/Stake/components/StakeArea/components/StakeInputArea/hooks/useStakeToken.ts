import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContractReceipt } from "ethers";
import toast from "react-hot-toast";
import { GOHM_ADDRESSES, OHM_ADDRESSES, SOHM_ADDRESSES, STAKING_ADDRESSES } from "src/constants/addresses";
import { trackGAEvent, trackGtagEvent } from "src/helpers/analytics/trackGAEvent";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { balanceQueryKey, useBalance } from "src/hooks/useBalance";
import { useDynamicStakingContract } from "src/hooks/useContract";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { warmupQueryKey } from "src/hooks/useWarmupInfo";
import { EthersError } from "src/lib/EthersTypes";
import { useAccount } from "wagmi";

export const useStakeToken = () => {
  const client = useQueryClient();
  const { address = "" } = useAccount();
  const networks = useTestableNetworks();
  const balance = useBalance(OHM_ADDRESSES)[networks.MAINNET].data;
  const contract = useDynamicStakingContract(STAKING_ADDRESSES, true);

  return useMutation<ContractReceipt, EthersError, { amount: string; toToken: string }>({
    mutationFn: async ({ amount, toToken }) => {
      if (!amount || isNaN(Number(amount))) throw new Error(`Please enter a number`);

      const _amount = new DecimalBigNumber(amount, 9);

      if (!_amount.gt("0")) throw new Error(`Please enter a number greater than 0`);

      if (!balance) throw new Error(`Please refresh your page and try again`);

      if (_amount.gt(balance)) throw new Error(`You cannot stake more than your OHM balance`);

      if (!contract) throw new Error(`Please switch to the Ethereum network to stake your OHM`);

      if (!address) throw new Error(`Please refresh your page and try again`);

      const shouldRebase = toToken === "sOHM";

      const claim = true; // was true before the mint & sync distributor change

      const transaction = await contract.stake(address, _amount.toBigNumber(), shouldRebase, claim);
      return transaction.wait();
    },
    onError: error => {
      toast.error("error" in error ? error.error.message : error.message);
    },
    onSuccess: async (tx, data) => {
      const keysToRefetch = [
        balanceQueryKey(address, OHM_ADDRESSES, networks.MAINNET),
        balanceQueryKey(address, data.toToken === "sOHM" ? SOHM_ADDRESSES : GOHM_ADDRESSES, networks.MAINNET),
        warmupQueryKey(address, networks.MAINNET),
      ];

      const promises = keysToRefetch.map(key => client.refetchQueries([key], { type: "active" }));

      await Promise.all(promises);

      trackGAEvent({
        category: "Staking",
        action: "stake",
        label: `Stake to ${data.toToken}`,
        value: new DecimalBigNumber(data.amount, 9).toApproxNumber(),
        dimension1: tx.transactionHash,
        dimension2: address,
      });

      trackGtagEvent("Stake Test 2", {
        event_category: "Staking",
        value: new DecimalBigNumber(data.amount, 9).toApproxNumber(),
        address: address.slice(2),
        txHash: tx.transactionHash.slice(2),
        token: data.toToken,
      });

      toast(`Successfully staked OHM`);
    },
  });
};
