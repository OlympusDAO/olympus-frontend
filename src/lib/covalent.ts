import { NetworkId } from "src/constants";
import { EnvHelper } from "src/helpers/Environment";
import { CovalentResponse, GetTokenBalancesData } from "./covalent.types";

export class Covalent {
  public SUPPORTED_NETWORKS = {
    [NetworkId.MAINNET]: true,
    [NetworkId.AVALANCHE]: true,
    [NetworkId.ARBITRUM]: true,
    [NetworkId.POLYGON]: true,
    [NetworkId.FANTOM]: true,
  };

  private _url = "https://api.covalenthq.com/v1";
  private _key = Buffer.from(EnvHelper.getCovalentKey() + "::").toString("base64");

  private async _fetch<Data = unknown>(path: string): Promise<Data> {
    const url = this._url + path;
    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${this._key}`,
      },
    };

    const response = await fetch(url, options);

    return this._validateResponse(response);
  }

  private async _validateResponse<Data = unknown>(response: Response): Promise<Data> {
    const json: CovalentResponse<Data> = await response.json();

    if (!response.ok || json.error) throw new Error(json.error_message || "Unknown error when requesting covalent api");

    return json.data;
  }

  public balances = {
    /**
     * Returns the balance of every token owned by an address.
     * All prices are denominated in USD.
     */
    getAllTokens: async (address: string, networkId: keyof typeof covalent.SUPPORTED_NETWORKS) => {
      const url = `/${networkId}/address/${address}/balances_v2/?quote-currency=usd`;

      const response = await this._fetch<GetTokenBalancesData>(url);

      return response.items;
    },
  };
}

export const covalent = new Covalent();
