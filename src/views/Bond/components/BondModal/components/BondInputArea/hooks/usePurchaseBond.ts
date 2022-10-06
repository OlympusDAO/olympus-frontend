import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContractReceipt } from "ethers";
import toast from "react-hot-toast";
import { DAO_TREASURY_ADDRESSES } from "src/constants/addresses";
import {
  BOND_DEPOSITORY_CONTRACT,
  BOND_FIXED_EXPIRY_TELLER,
  BOND_FIXED_TERM_TELLER,
  OP_BOND_DEPOSITORY_CONTRACT,
} from "src/constants/contracts";
import { trackGAEvent, trackGtagEvent } from "src/helpers/analytics/trackGAEvent";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { isValidAddress } from "src/helpers/misc/isValidAddress";
import { balanceQueryKey, useBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { EthersError } from "src/lib/EthersTypes";
import { bondNotesQueryKey } from "src/views/Bond/components/ClaimBonds/hooks/useBondNotes";
import { Bond } from "src/views/Bond/hooks/useBond";
import { useAccount, useNetwork, useSigner } from "wagmi";

export const usePurchaseBond = (bond: Bond) => {
  const client = useQueryClient();
  const networks = useTestableNetworks();
  const { data: signer } = useSigner();
  const { chain = { id: 1 } } = useNetwork();
  const { address = "" } = useAccount();
  const balance = useBalance(bond.quoteToken.addresses)[networks.MAINNET].data;

  return useMutation<
    ContractReceipt,
    EthersError,
    {
      amount: string;
      slippage: string;
      isInverseBond: boolean;
      recipientAddress: string;
      isV3Bond?: string;
    }
  >(
    async ({ amount, slippage, recipientAddress, isInverseBond }) => {
      if (!amount || isNaN(Number(amount))) throw new Error(`Please enter a number`);
      if (!slippage || isNaN(Number(slippage))) throw new Error(`Please enter a valid slippage amount`);

      const parsedAmount = new DecimalBigNumber(amount, bond.quoteToken.decimals);
      const parsedSlippage = new DecimalBigNumber(slippage, bond.quoteToken.decimals);

      if (!parsedAmount.gt("0")) throw new Error(`Please enter a number greater than 0`);

      if (!parsedSlippage.gt("0")) throw new Error(`Please enter a slippage amount greater than 0`);

      if (!balance) throw new Error(`Please refresh your page and try again`);

      if (parsedAmount.gt(balance))
        throw new Error(`You cannot bond more than your` + ` ${bond.quoteToken.name} ` + `balance`);

      if (parsedAmount.gt(bond.maxPayout.inQuoteToken))
        throw new Error(
          `The maximum you can bond at this time is` +
            ` ${bond.maxPayout.inQuoteToken.toString()} ${bond.quoteToken.name}`,
        );

      if (parsedAmount.gt(bond.capacity.inQuoteToken))
        throw new Error(
          `The maximum you can bond at this time is` +
            ` ${bond.capacity.inQuoteToken.toString()} ${bond.quoteToken.name}`,
        );

      if (!isValidAddress(recipientAddress)) throw new Error(t`Please enter a valid address as the recipient address`);

      if (!signer) throw new Error(`Please connect a wallet to purchase a bond`);
      if (chain.id !== networks.MAINNET) throw new Error(`Please switch to the Ethereum network to purchase this bond`);

      const slippageAsPercent = parsedSlippage.div("100");
      const maxPrice = bond.price.inBaseToken.mul(slippageAsPercent.add("1"));
      const referrer = DAO_TREASURY_ADDRESSES[networks.MAINNET];
      const minAmountOut = parsedAmount
        .div(bond.price.inBaseToken)
        .mul(new DecimalBigNumber("1").sub(slippageAsPercent));

      if (isInverseBond && !bond.isV3Bond) {
        const transaction = await OP_BOND_DEPOSITORY_CONTRACT.getEthersContract(networks.MAINNET)
          .connect(signer)
          .deposit(
            bond.id,
            [parsedAmount.toBigNumber(), minAmountOut.toBigNumber(bond.baseToken.decimals)],
            [recipientAddress, referrer],
          );

        return transaction.wait();
      }
      //TODO: V3 Bond only supports Fixed Expiry. Not tested for fixed term/ERC-1155
      if (bond.isV3Bond) {
        const bondContract = bond.isFixedTerm ? BOND_FIXED_TERM_TELLER : BOND_FIXED_EXPIRY_TELLER;
        const transaction = await bondContract
          .getEthersContract(networks.MAINNET)
          .connect(signer)
          .purchase(
            recipientAddress,
            referrer,
            bond.id,
            parsedAmount.toBigNumber(),
            minAmountOut.toBigNumber(bond.baseToken.decimals),
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
        toast.error("error" in error ? error.error.message : error.message);
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

        const promises = keysToRefetch.map(key => client.refetchQueries([key], { type: "active" }));

        await Promise.all(promises);

        toast(`Successfully bonded` + ` ${bond.quoteToken.name}`);
      },
    },
  );
};
