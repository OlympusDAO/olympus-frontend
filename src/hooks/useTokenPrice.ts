import { useQuery } from "react-query";
import { Token } from "src/helpers/contracts/Token";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { nonNullable } from "src/helpers/types/nonNullable";
import { NetworkId } from "src/networkDetails";

export const tokenPriceQueryKey = (networkId: NetworkId, address: string) =>
  ["useTokenPrice", networkId, address].filter(nonNullable);

export const useTokenPrice = <TToken extends Token = Token>(networkId: keyof TToken["addresses"], token: TToken) => {
  const _networkId = networkId as NetworkId;

  const key = tokenPriceQueryKey(_networkId, token.getAddress(_networkId));
  return useQuery<DecimalBigNumber, Error>(key, () => token.getPrice(_networkId));
};
