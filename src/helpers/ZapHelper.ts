import { EnvHelper } from "./Environment";

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

interface ZapperToken {
  address: string;
  decimals: number;
  hide: boolean;
  img: string;
  symbol: string;
  price: number;
  network: string;
}

interface ZapHelperResponse {
  balances: { [key: string]: ZapperToken };
}

export class ZapHelper {
  static getZapTokens = async (address: string): Promise<ZapHelperResponse> => {
    address = address.toLocaleLowerCase();
    const apiKey = EnvHelper.getZapperAPIKey();
    try {
      const response = await fetch(
        `https://api.zapper.fi/v1/protocols/tokens/balances?api_key=${apiKey}&addresses%5B%5D=${address}&newBalances=true`,
      );
      if (response.ok) {
        return response.json().then(raw => ZapHelper.parseResponse(raw, address));
      }
    } catch (e) {
      console.error(e);
    }
    return { balances: {} };
  };

  static parseResponse = (response: ZapperResponse, address: string): ZapHelperResponse => {
    const parsed = response[address].products
      .find(product => product.label === "Tokens")
      ?.assets.flatMap(asset => asset.tokens);
    const arr = parsed?.map(token => [token.symbol.toLowerCase(), token]) ?? null;
    const result = { balances: arr == null ? {} : Object.fromEntries(arr) };
    return result;
  };
}
