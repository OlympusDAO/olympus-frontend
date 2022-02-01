import { NetworkId } from "src/constants";
import { EnvHelper } from "src/helpers/Environment";

import { CovalentResponse, CovalentTokenBalance, CovalentTransaction } from "./covalent.types";

export class Covalent {
  public SUPPORTED_NETWORKS = {
    [NetworkId.FANTOM]: true,
    [NetworkId.MAINNET]: true,
    [NetworkId.POLYGON]: true,
    [NetworkId.ARBITRUM]: true,
    [NetworkId.AVALANCHE]: true,
  };

  private _url = "https://api.covalenthq.com/v1";
  private _key = Buffer.from(EnvHelper.getCovalentKey() + "::").toString("base64");

  private async _fetch<Data = unknown>(path: string) {
    const url = this._url + path;
    const options = {
      headers: {
        Authorization: `Basic ${this._key}`,
      },
    };

    const response = await fetch(url, options);

    return this._validateResponse<Data>(response);
  }

  private async _validateResponse<Data = unknown>(response: Response) {
    const json: CovalentResponse<Data> = await response.json();

    if (!response.ok) throw new Error("Failed to fetch Covalent API.");
    else if (json.error) throw new Error(json.error_message);

    return json.data.items;
  }

  public isSupportedNetwork(networkId: NetworkId) {
    return this.SUPPORTED_NETWORKS.hasOwnProperty(networkId);
  }

  public balances = {
    /**
     * Returns the balance of every token owned by an address.
     */
    getAllTokens: async (address: string, networkId: keyof typeof this.SUPPORTED_NETWORKS) => {
      const url = `/${networkId}/address/${address}/balances_v2/`;

      return this._fetch<CovalentTokenBalance[]>(url);
    },
  };

  public transactions = {
    /**
     * Returns all successful, failed, and pending transactions for an address
     */
    getAllForAddress: async (address: string, networkId: keyof typeof this.SUPPORTED_NETWORKS) => {
      const url = `/${networkId}/address/${address}/transactions_v2/?no-logs=true`;

      return this._fetch<CovalentTransaction[]>(url);
    },
  };
}

export const covalent = new Covalent();
