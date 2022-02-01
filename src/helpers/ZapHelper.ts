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

interface ZapperToken {
  address: string;
  decimals: number;
  hide: boolean;
  img: string;
  symbol: string;
  price: number;
  network: string;
}

interface ZapHelperBalancesResponse {
  balances: { [key: string]: ZapperToken };
}

interface ZapHelperChangeAllowanceTransaction {
  data: string;
  from: string;
  gasPrice: string;
  to: string;
}

const ETHEREUM_ADDRESS = "0x0000000000000000000000000000000000000000";

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

  static getZapTokenAllowanceHelper = async (tokenAddress: string, ownerAddress: string): Promise<boolean> => {
    tokenAddress = tokenAddress.toLowerCase();
    if (tokenAddress === ETHEREUM_ADDRESS) {
      return true;
    }
    ownerAddress = ownerAddress.toLowerCase();
    const apiKey = ZapHelper.getZapperAPIKey();
    const response = await fetch(
      `https://api.zapper.fi/v1/zap-in/olympus/approval-state?api_key=${apiKey}&ownerAddress=${ownerAddress}&sellTokenAddress=${tokenAddress}`,
    );
    const responseJson = await response.json();
    if (response.ok) {
      return responseJson.isApproved;
    } else {
      throw Error(JSON.stringify(responseJson));
    }
  };

  static changeZapTokenAllowanceHelper = async (
    tokenAddress: string,
    ownerAddress: string,
    gasPrice: number,
  ): Promise<ZapHelperChangeAllowanceTransaction> => {
    tokenAddress = tokenAddress.toLowerCase();
    ownerAddress = ownerAddress.toLowerCase();
    const apiKey = ZapHelper.getZapperAPIKey();
    const response = await fetch(
      `https://api.zapper.fi/v1/zap-in/olympus/approval-transaction?api_key=${apiKey}&ownerAddress=${ownerAddress}&sellTokenAddress=${tokenAddress}&gasPrice=${gasPrice}`,
    );
    const responseJson = await response.json();
    if (response.ok) {
      return responseJson;
    } else {
      throw Error(JSON.stringify(responseJson));
    }
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
    sellAmount: BigNumber,
    ownerAddress: string,
    tokenAddress: string,
    slippagePercentage: string,
    gasPrice: number,
    networkID: number,
  ) => {
    tokenAddress = tokenAddress.toLowerCase();
    ownerAddress = ownerAddress.toLowerCase();
    const apiKey = ZapHelper.getZapperAPIKey();
    const response = await fetch(
      `https://api.zapper.fi/v1/zap-in/vault/olympus/transaction?ownerAddress=${ownerAddress}&network=ethereum&sellAmount=${sellAmount}&sellTokenAddress=${tokenAddress}&poolAddress=${ZapHelper.getZapperPoolAddress(
        networkID,
      )}&slippagePercentage=${slippagePercentage}&gasPrice=${gasPrice}&api_key=${apiKey}`,
    );
    const responseJson = await response.json();
    if (response.ok) {
      return responseJson;
    } else {
      throw Error(JSON.stringify(responseJson));
    }
  };
}
