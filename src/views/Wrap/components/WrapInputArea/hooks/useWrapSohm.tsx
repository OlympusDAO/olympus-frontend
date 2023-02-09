import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContractReceipt } from "ethers";
import toast from "react-hot-toast";
import { GOHM_ADDRESSES, SOHM_ADDRESSES, STAKING_ADDRESSES } from "src/constants/addresses";
import { trackGAEvent } from "src/helpers/analytics/trackGAEvent";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { balanceQueryKey, useBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { warmupQueryKey } from "src/hooks/useWarmupInfo";
import { EthersError } from "src/lib/EthersTypes";
import { OlympusStakingv2__factory } from "src/typechain";
import { useAccount, useNetwork, useSigner } from "wagmi";

export const useWrapSohm = () => {
  const client = useQueryClient();
  const { address = "" } = useAccount();
  const { data: signer } = useSigner();
  const { chain = { id: 1 } } = useNetwork();

  const networks = useTestableNetworks();
  const balance = useBalance(SOHM_ADDRESSES)[networks.MAINNET].data;

  return useMutation<ContractReceipt, EthersError, string>({
    mutationFn: async amount => {
      if (!signer) throw new Error(`Please connect a wallet`);
      const contract = OlympusStakingv2__factory.connect(
        STAKING_ADDRESSES[chain.id as keyof typeof STAKING_ADDRESSES],
        signer,
      );
      const _amount = new DecimalBigNumber(amount, 9);

      if (!_amount.gt("0")) throw new Error(`Please enter a number greater than 0`);

      if (!balance) throw new Error(`Please refresh your page and try again`);

      if (_amount.gt(balance)) throw new Error(`You cannot wrap more than your sOHM balance`);

      if (!contract) throw new Error(`Please switch to the Ethereum network to wrap your sOHM`);

      if (!address) throw new Error(`Please refresh your page and try again`);

      const transaction = await contract.wrap(address, _amount.toBigNumber());

      return transaction.wait();
    },
    onError: error => {
      toast.error("error" in error ? error.error.message : error.message);
    },
    onSuccess: async (_, amount) => {
      trackGAEvent({
        category: "Wrapping",
        action: "Wrap sOHM",
        value: new DecimalBigNumber(amount, 9).toApproxNumber(),
      });

      const keysToRefetch = [
        balanceQueryKey(address, SOHM_ADDRESSES, networks.MAINNET),
        balanceQueryKey(address, GOHM_ADDRESSES, networks.MAINNET),
        warmupQueryKey(address, networks.MAINNET),
      ];

      const promises = keysToRefetch.map(key => client.refetchQueries([key], { type: "active" }));

      await Promise.all(promises);

      toast(`Successfully wrapped sOHM to gOHM`);
    },
  });
};
