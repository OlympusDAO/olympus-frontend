import { useQuery } from "react-query";
import { ERC20 } from "src/helpers/contracts/ERC20";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { nonNullable } from "src/helpers/types/nonNullable";
import { NetworkId } from "src/networkDetails";

export const tokenPriceQueryKey = (networkId: NetworkId, address: string) =>
  ["useTokenPrice", networkId, address].filter(nonNullable);

export const useTokenPrice = <TToken extends ERC20 = ERC20>(networkId: keyof TToken["addresses"], token: TToken) => {
  const _networkId = networkId as NetworkId;

  const key = tokenPriceQueryKey(_networkId, token.getAddress(_networkId));
  return useQuery<DecimalBigNumber, Error>(key, () => token.getPrice(_networkId));
};
