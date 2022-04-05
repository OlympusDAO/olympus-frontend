import { BigNumber } from "ethers";

import { addresses } from "../constants";

interface ZapTransactionResponse {
  to: string;
  data: string;
  estimatedGas: string;
  buyAmount: string;
}

export class ZapHelper {
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
