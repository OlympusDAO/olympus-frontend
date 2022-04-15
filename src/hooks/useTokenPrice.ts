import { useQuery } from "react-query";
import { LPToken } from "src/helpers/contracts/LPToken";
import { Token } from "src/helpers/contracts/Token";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { NetworkId } from "src/networkDetails";

export interface UseTokenPriceOptions<TToken extends Token | LPToken = Token> {
  token: TToken;
  networkId: keyof TToken["addresses"];
}

export const tokenPriceQueryKey = (options: UseTokenPriceOptions) => [
  "useTokenPrice",
  options.networkId,
  options.token.getAddress(options.networkId), // Address is smaller and nicer to serialize
];

export const useTokenPrice = <TToken extends Token | LPToken>(options: UseTokenPriceOptions<TToken>) => {
  const _networkId = options.networkId as NetworkId;
  const key = tokenPriceQueryKey({ token: options.token, networkId: _networkId });
  return useQuery<DecimalBigNumber, Error>(key, () => options.token.getPrice(_networkId));
};
