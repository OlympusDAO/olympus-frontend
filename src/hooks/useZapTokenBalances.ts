import { BigNumber, ethers } from "ethers";
import { useQuery } from "react-query";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { useWeb3Context } from "src/hooks";

interface ZapperResponse {
  [key: string]: ZapperAddress;
}

interface ZapperAddress {
  products: [ZapperProduct];
}

interface ZapperProduct {
  assets: [ZapperAsset];
  label: string;
}

interface ZapperAsset {
  tokens: [ZapperToken];
}

export interface ZapperToken {
  address: string;
  decimals: number;
  hide: boolean;
  tokenImageUrl: string;
  symbol: string;
  price: number;
  network: string;
  balance: number;
  balanceRaw: string;
  balanceUSD: number;
}

export interface ZapHelperBalancesResponse {
  balances: { [key: string]: ZapperToken };
}

export const zapTokenBalancesKey = (address: string) => ["zapTokenBalances", address];

/**
 * Asynchronously fetches the token balances for the current wallet.
 *
 * This hook uses react-query to fetch the token balances via the Zapper API.
 * The Zapper API is used as it returns an exhaustive list of the tokens in
 * the wallet, along with the balances and USD value. Doing this manually would
 * require querying balances for an exhaustive list of token contracts, so the Zapper
 * API is quicker.
 *
 * Caveats:
 * - The Zapper API supports Ethereum mainnet only, which makes it difficult to conduct testing.
 *
 * @returns react-query result
 */
export const useZapTokenBalances = () => {
  const { address, connected } = useWeb3Context();
  const key = zapTokenBalancesKey(address);
  return useQuery<ZapHelperBalancesResponse, Error>(
    key,
    async () => {
      // TODO handle missing API key
      const apiKey = Environment.getZapperApiKey();
      try {
        const addressLower = address.toLowerCase();
        console.debug("Refetching Zap token balances");
        const response = await fetch(
          `https://api.zapper.fi/v1/protocols/tokens/balances?api_key=${apiKey}&addresses%5B%5D=${addressLower}&newBalances=true`,
        );
        const responseJson = await response.json();

        if (response.ok) {
          return parseResponse(responseJson, addressLower);
        } else {
          throw Error(JSON.stringify(responseJson));
        }
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
    { enabled: !!address && !!connected },
  );
};

/**
 * This function formats the `ZapperResponse`.
 *
 * @param response JSON-formatted response from Zapper
 * @param address wallet address (lowercase)
 * @returns ZapHelperBalancesResponse object
 */
const parseResponse = (response: ZapperResponse, address: string): ZapHelperBalancesResponse => {
  const parsed = response[address].products
    .find(product => product.label === "Tokens")
    ?.assets.flatMap(asset => asset.tokens);
  const arr = parsed?.map(token => [token.symbol.toLowerCase(), token]) ?? null;
  const result = { balances: arr == null ? {} : Object.fromEntries(arr) };

  if (result.balances["ohm"]) {
    result.balances["ohm"].hide = true;
  }

  for (const key in result.balances) {
    const balance = result.balances[key];
    const balanceRaw = balance.balanceRaw;
    const balanceBigNumber = BigNumber.from(balanceRaw);
    balance.balanceRaw = ethers.utils.formatUnits(balanceBigNumber, balance.decimals);
  }

  return result;
};
