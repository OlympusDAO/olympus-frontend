import { NetworkId } from "src/networkDetails";

import { DecimalBigNumber } from "../DecimalBigNumber/DecimalBigNumber";

/**
 * Attempts to get the price of a token from coingecko by contract address
 */
export const getCoingeckoPrice = async (networkId: NetworkId, contractAddress: string) => {
  const normalizedAddress = contractAddress.toLowerCase();

  const params = new URLSearchParams({ contract_addresses: normalizedAddress, vs_currencies: "usd" }).toString();

  const url = `https://api.coingecko.com/api/v3/simple/token_price/ethereum?${params}`;

  const res = await fetch(url);

  const json = await res.json();

  const price: number = json[normalizedAddress].usd;

  if (!price) throw new Error(`Unable to get token price of ${normalizedAddress} from coingecko`);

  return new DecimalBigNumber(price.toString(), 9);
};
