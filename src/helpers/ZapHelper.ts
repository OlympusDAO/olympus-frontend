import { BigNumber } from "ethers";

import { addresses } from "../constants";

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

interface ZapHelperBalancesResponse {
  balances: { [key: string]: ZapperToken };
}

interface ZapTransactionResponse {
  to: string;
  data: string;
  estimatedGas: string;
  buyAmount: string;
}

export class ZapHelper {
  static getZapTokens = async (address: string): Promise<ZapHelperBalancesResponse> => {
    address = address.toLowerCase();
    const apiKey = ZapHelper.getZapperAPIKey();
    try {
      const response = await fetch(
        `https://api.zapper.fi/v1/protocols/tokens/balances?api_key=${apiKey}&addresses%5B%5D=${address}&newBalances=true`,
      );
      const responseJson = await response.json();
      if (response.ok) {
        return ZapHelper.parseResponse(responseJson, address);
      } else {
        throw Error(JSON.stringify(responseJson));
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  static parseResponse = (response: ZapperResponse, address: string): ZapHelperBalancesResponse => {
    const parsed = response[address].products
      .find(product => product.label === "Tokens")
      ?.assets.flatMap(asset => asset.tokens);
    const arr = parsed?.map(token => [token.symbol.toLowerCase(), token]) ?? null;
    const result = { balances: arr == null ? {} : Object.fromEntries(arr) };
    return result;
  };

  /**
   * contract address for sOHM zap pool
   * @param networkID number
   * @returns string
   */
  static getZapperPoolAddress = (networkID: number) => {
    return addresses[networkID].ZAPPER_POOL_V1;
  };

  static getZapperAPIKey() {
    // below is public key from Zapper, per: https://docs.zapper.fi/zapper-api/endpoints
    const apiKey = "96e0cc51-a62e-42ca-acee-910ea7d2a241";
    if (!apiKey) {
      console.warn("zaps won't work without REACT_APP_ZAPPER_API key");
    }
    return apiKey;
  }

  static executeZapHelper = async (
    address: string,
    sellAmount: BigNumber,
    tokenAddress: string,
    slippageDecimal: number,
  ): Promise<ZapTransactionResponse> => {
    tokenAddress = tokenAddress.toLowerCase();
    const apiKey = ZapHelper.getZapperAPIKey();
    const response = await fetch(
      `https://api.zapper.fi/v1/exchange/quote?sellTokenAddress=${tokenAddress}&buyTokenAddress=0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5&sellAmount=${sellAmount}&slippagePercentage=${slippageDecimal}&network=ethereum&api_key=${apiKey}&ownerAddress=${address}&isZap=true`,
    );
    const responseJson = await response.json();
    if (response.ok) {
      return responseJson;
    } else {
      throw Error(JSON.stringify(responseJson));
    }
  };
}
