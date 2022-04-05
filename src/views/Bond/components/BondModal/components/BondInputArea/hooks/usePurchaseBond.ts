import { t } from "@lingui/macro";
import { ContractReceipt } from "ethers";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { DAO_TREASURY_ADDRESSES } from "src/constants/addresses";
import { BOND_DEPOSITORY_CONTRACT } from "src/constants/contracts";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { isValidAddress } from "src/helpers/misc/isValidAddress";
import { useWeb3Context } from "src/hooks";
import { balanceQueryKey, useBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { error as createErrorToast, info as createInfoToast } from "src/slices/MessagesSlice";
import { bondNotesQueryKey } from "src/views/Bond/components/ClaimBonds/hooks/useBondNotes";
import { Bond } from "src/views/Bond/hooks/useBonds";

export const usePurchaseBond = (bond: Bond) => {
  const dispatch = useDispatch();
  const client = useQueryClient();
  const networks = useTestableNetworks();
  const { provider, networkId, address } = useWeb3Context();
  const balance = useBalance(bond.quoteToken.addresses)[networks.MAINNET].data;

  return useMutation<ContractReceipt, Error, { amount: string; slippage: string; recipientAddress: string }>(
    async params => {
      if (!params.amount || isNaN(Number(params.amount))) throw new Error(t`Please enter a number`);
      if (!params.slippage || isNaN(Number(params.slippage))) throw new Error(t`Please enter a valid slippage amount`);

      const amount = new DecimalBigNumber(params.amount, bond.quoteToken.decimals);
      const slippage = new DecimalBigNumber(params.slippage, 18);

      if (!amount.gt(new DecimalBigNumber("0"))) throw new Error(t`Please enter a number greater than 0`);
      if (!slippage.gt(new DecimalBigNumber("0"))) throw new Error(t`Please enter a slippage amount greater than 0`);

      if (!balance) throw new Error(t`Please refresh your page and try again`);
      if (amount.gt(balance))
        throw new Error(t`You cannot bond more than your` + ` ${bond.quoteToken.name} ` + `balance`);

      if (amount.gt(bond.maxPayout.inQuoteToken))
        throw new Error(
          t`The maximum you can bond at this time is` +
            ` ${bond.maxPayout.inQuoteToken.toString()} ${bond.quoteToken.name}`,
        );
      if (amount.gt(bond.capacity.inQuoteToken))
        throw new Error(
          t`The maximum you can bond at this time is` +
            ` ${bond.capacity.inQuoteToken.toString()} ${bond.quoteToken.name}`,
        );

      if (!isValidAddress(params.recipientAddress))
        throw new Error(t`Please enter a valid address as the recipient address`);

      if (!provider) throw new Error(t`Please connect a wallet to purchase a bond`);
      if (networkId !== networks.MAINNET)
        throw new Error(t`Please switch to the Ethereum network to purchase this bond`);

      const DAO_TREASURY_ADDRESS = DAO_TREASURY_ADDRESSES[networks.MAINNET];

      // const contract = isInverseBond ? OP_BOND_DEPOSITORY_CONTRACT : BOND_DEPOSITORY_CONTRACT;
      const signer = provider.getSigner();
      const contract = BOND_DEPOSITORY_CONTRACT;
      const depository = contract.getEthersContract(networks.MAINNET).connect(signer);

      const _slippage = slippage.div(new DecimalBigNumber("100")).add(new DecimalBigNumber("1"));
      const maxPrice = new DecimalBigNumber(bond.price.inBaseToken.mul(_slippage).toString(), bond.baseToken.decimals);

      const transaction = await depository.deposit(
        bond.id,
        amount.toBigNumber(),
        maxPrice.toBigNumber(),
        params.recipientAddress,
        DAO_TREASURY_ADDRESS,
      );

      return transaction.wait();
    },
    {
      onError: error => {
        dispatch(createErrorToast(error.message));
      },
      onSuccess: async () => {
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
