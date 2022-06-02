import { t } from "@lingui/macro";
import { ContractReceipt } from "ethers";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { DAO_TREASURY_ADDRESSES } from "src/constants/addresses";
import { BOND_DEPOSITORY_CONTRACT, OP_BOND_DEPOSITORY_CONTRACT } from "src/constants/contracts";
import { trackGAEvent, trackGtagEvent } from "src/helpers/analytics/trackGAEvent";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { isValidAddress } from "src/helpers/misc/isValidAddress";
import { useWeb3Context } from "src/hooks";
import { balanceQueryKey, useBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { error as createErrorToast, info as createInfoToast } from "src/slices/MessagesSlice";
import { bondNotesQueryKey } from "src/views/Bond/components/ClaimBonds/hooks/useBondNotes";
import { Bond } from "src/views/Bond/hooks/useBond";

export const usePurchaseBond = (bond: Bond) => {
  const dispatch = useDispatch();
  const client = useQueryClient();
  const networks = useTestableNetworks();
  const { provider, networkId, address } = useWeb3Context();
  const balance = useBalance(bond.quoteToken.addresses)[networks.MAINNET].data;

  return useMutation<
    ContractReceipt,
    Error,
    {
      amount: string;
      slippage: string;
      isInverseBond: boolean;
      recipientAddress: string;
    }
  >(
    async ({ amount, slippage, recipientAddress, isInverseBond }) => {
      if (!amount || isNaN(Number(amount))) throw new Error(t`Please enter a number`);
      if (!slippage || isNaN(Number(slippage))) throw new Error(t`Please enter a valid slippage amount`);

      const parsedAmount = new DecimalBigNumber(amount, bond.quoteToken.decimals);
      const parsedSlippage = new DecimalBigNumber(slippage, bond.quoteToken.decimals);

      if (!parsedAmount.gt("0")) throw new Error(t`Please enter a number greater than 0`);

      if (!parsedSlippage.gt("0")) throw new Error(t`Please enter a slippage amount greater than 0`);

      if (!balance) throw new Error(t`Please refresh your page and try again`);

      if (parsedAmount.gt(balance))
        throw new Error(t`You cannot bond more than your` + ` ${bond.quoteToken.name} ` + `balance`);

      if (parsedAmount.gt(bond.maxPayout.inQuoteToken))
        throw new Error(
          t`The maximum you can bond at this time is` +
            ` ${bond.maxPayout.inQuoteToken.toString()} ${bond.quoteToken.name}`,
        );

      if (parsedAmount.gt(bond.capacity.inQuoteToken))
        throw new Error(
          t`The maximum you can bond at this time is` +
            ` ${bond.capacity.inQuoteToken.toString()} ${bond.quoteToken.name}`,
        );

      if (!isValidAddress(recipientAddress)) throw new Error(t`Please enter a valid address as the recipient address`);

      if (!provider) throw new Error(t`Please connect a wallet to purchase a bond`);

      if (networkId !== networks.MAINNET)
        throw new Error(t`Please switch to the Ethereum network to purchase this bond`);

      const slippageAsPercent = parsedSlippage.div("100");
      const maxPrice = bond.price.inBaseToken.mul(slippageAsPercent.add("1"));

      const signer = provider.getSigner();
      const referrer = DAO_TREASURY_ADDRESSES[networks.MAINNET];

      if (isInverseBond) {
        const minAmountOut = parsedAmount
          .div(bond.price.inBaseToken)
          .mul(new DecimalBigNumber("1").sub(slippageAsPercent));

        const transaction = await OP_BOND_DEPOSITORY_CONTRACT.getEthersContract(networks.MAINNET)
          .connect(signer)
          .deposit(
            bond.id,
            [parsedAmount.toBigNumber(), minAmountOut.toBigNumber(bond.baseToken.decimals)],
            [recipientAddress, referrer],
          );

        return transaction.wait();
      }

      const transaction = await BOND_DEPOSITORY_CONTRACT.getEthersContract(networks.MAINNET)
        .connect(signer)
        .deposit(
          bond.id,
          parsedAmount.toBigNumber(),
          maxPrice.toBigNumber(bond.baseToken.decimals),
          recipientAddress,
          referrer,
        );
      return transaction.wait();
    },
    {
      onError: error => {
        dispatch(createErrorToast(error.message));
      },
      onSuccess: async (tx, { amount }) => {
        trackGAEvent({
          category: "Bonds",
          action: "Bond",
          label: bond.quoteToken.name,
          value: new DecimalBigNumber(amount, bond.quoteToken.decimals).toApproxNumber(),
          dimension1: tx.transactionHash,
          dimension2: address,
        });

        trackGtagEvent("Bond", {
          event_category: "Bonds",
          value: new DecimalBigNumber(amount, bond.quoteToken.decimals).toApproxNumber(),
          address: address.slice(2),
          txHash: tx.transactionHash.slice(2),
          token: bond.quoteToken.name,
        });

        const keysToRefetch = [
          bondNotesQueryKey(networks.MAINNET, address),
          balanceQueryKey(address, bond.quoteToken.addresses, networks.MAINNET),
        ];

        const promises = keysToRefetch.map(key => client.refetchQueries(key, { active: true }));

        await Promise.all(promises);

        dispatch(createInfoToast(t`Successfully bonded` + ` ${bond.quoteToken.name}`));
      },
    },
  );
};
