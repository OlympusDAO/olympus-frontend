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

export const useUnstakeToken = (fromToken: "sOHM" | "gOHM") => {
  const client = useQueryClient();
  const { address = "" } = useAccount();
  const networks = useTestableNetworks();
  const contract = useDynamicStakingContract(STAKING_ADDRESSES, true);

  const addresses = fromToken === "sOHM" ? SOHM_ADDRESSES : GOHM_ADDRESSES;
  const balance = useBalance(addresses)[networks.MAINNET].data;

  return useMutation<ContractReceipt, EthersError, string>(
    async amount => {
      if (!amount || isNaN(Number(amount))) throw new Error(`Please enter a number`);

      const _amount = new DecimalBigNumber(amount, fromToken === "gOHM" ? 18 : 9);

      if (!_amount.gt("0")) throw new Error(`Please enter a number greater than 0`);

      if (!balance) throw new Error(`Please refresh your page and try again`);

      if (_amount.gt(balance)) throw new Error(`You cannot unstake more than your` + ` ${fromToken} ` + `balance`);

      if (!contract) throw new Error(`Please switch to the Ethereum network to unstake your` + ` ${fromToken}`);

      if (!address) throw new Error(`Please refresh your page and try again`);

      const shouldRebase = fromToken === "sOHM";

      const trigger = false; // was true before the mint & sync distributor change

      const transaction = await contract.unstake(address, _amount.toBigNumber(), trigger, shouldRebase);
      return transaction.wait();
    },
    {
      onError: error => {
        toast.error("error" in error ? error.error.message : error.message);
      },
      onSuccess: async (tx, amount) => {
        trackGAEvent({
          category: "Staking",
          action: "unstake",
          label: `Unstake from ${fromToken}`,
          value: new DecimalBigNumber(amount, fromToken === "gOHM" ? 18 : 9).toApproxNumber(),
          dimension1: tx.transactionHash,
          dimension2: address,
        });

        trackGtagEvent("Unstake", {
          event_category: "Staking",
          value: new DecimalBigNumber(amount, fromToken === "gOHM" ? 18 : 9).toApproxNumber(),
          address: address.slice(2),
          txHash: tx.transactionHash.slice(2),
          token: fromToken,
        });

        const keysToRefetch = [
          balanceQueryKey(address, addresses, networks.MAINNET),
          balanceQueryKey(address, OHM_ADDRESSES, networks.MAINNET),
          warmupQueryKey(address, networks.MAINNET),
        ];

        const promises = keysToRefetch.map(key => client.refetchQueries([key], { type: "active" }));

        await Promise.all(promises);

        toast(`Successfully unstaked ` + ` ${fromToken}`);
      },
    },
  );
};
