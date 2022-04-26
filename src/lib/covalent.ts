import { NetworkId } from "src/constants";
import { Environment } from "src/helpers/environment/Environment/Environment";

import {
  CovalentErrorResponse,
  CovalentRequestOptions,
  CovalentResponse,
  CovalentSuccessResponse,
  CovalentSupportedNetwork,
  CovalentTransaction,
  CovalentTransfer,
  ListAllTransfersOptions,
} from "./covalent.types";

class Covalent {
  private SUPPORTED_NETWORKS = [
    NetworkId.FANTOM,
    NetworkId.MAINNET,
    NetworkId.POLYGON,
    NetworkId.ARBITRUM,
    NetworkId.AVALANCHE,
  ];

  private _url = "https://api.covalenthq.com/v1";
  private _key = Buffer.from(Environment.getCovalentApiKey() + "::").toString("base64");

  private async _fetch<Data>(path: string) {
    const url = this._url + path;
    const options = {
      headers: {
        Authorization: `Basic ${this._key}`,
      },
    };

    const response = await fetch(url, options);

    return this._validateResponse<Data>(response);
  }

  private async _validateResponse<Data>(response: Response) {
    const json: CovalentErrorResponse | CovalentSuccessResponse<Data> = await response.json();

    if (!response.ok) throw new Error("Failed to fetch Covalent API.");
    else if (json.error) throw new Error(json.error_message);

    return json.data;
  }

  private _createBaseParams<TOptions extends CovalentRequestOptions>(options: TOptions): Record<string, any> {
    const _params = {} as Record<string, any>;

    if (options.includeLogs === false) _params["no-logs"] = true;
    if (options.pageSize !== undefined) _params["page-size"] = options.pageSize;
    if (options.pageNumber !== undefined) _params["page-number"] = options.pageNumber;

    return _params;
  }

  public isSupportedNetwork(networkId: NetworkId): networkId is CovalentSupportedNetwork {
    return this.SUPPORTED_NETWORKS.includes(networkId);
  }

  public transactions = {
    listAll: async (options: CovalentRequestOptions) => {
      if (!this.isSupportedNetwork(options.networkId))
        throw new Error(`Covalent doesn't support network: ${options.networkId}`);

      const params = this._createBaseParams(options);

      const qsp = new URLSearchParams(params).toString();

      const path = `/${options.networkId}/address/${options.address}/transactions_v2/?${qsp}`;

      return this._fetch<CovalentTransaction[]>(path);
    },
  };

  public transfers = {
    listAll: async (options: ListAllTransfersOptions): Promise<CovalentResponse<CovalentTransfer[]>> => {
      if (!this.isSupportedNetwork(options.networkId))
        throw new Error(`Covalent doesn't support network: ${options.networkId}`);

      const params = this._createBaseParams(options);

      params["contract-address"] = options.contractAddress;

      const qsp = new URLSearchParams(params).toString();

      const path = `/${options.networkId}/address/${options.address}/transfers_v2/?${qsp}`;

      return this._fetch<CovalentTransfer[]>(path);
    },
  };
}

export const covalent = new Covalent();
