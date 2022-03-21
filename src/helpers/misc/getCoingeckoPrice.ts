import { NetworkId } from "src/networkDetails";

/**
 * Attempts to get the price of a token from coingecko by contract address
 */
export const getCoingeckoPrice = async (networkId: NetworkId, contractAddress: string): Promise<number> => {
  const params = new URLSearchParams({ contract_addresses: contractAddress, vs_currencies: "usd" }).toString();

  const url = `https://api.coingecko.com/api/v3/simple/token_price/ethereum?${params}`;

  const res = await fetch(url);

  const json = await res.json();

  const price = json[contractAddress].usd;

  if (!price) throw new Error(`Unable to get token price of ${contractAddress} from coingecko`);

  return price;
};
