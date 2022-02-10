import { BigNumber } from "ethers";
import { addresses, NetworkId } from "src/constants";
import { EnvHelper } from "src/helpers/Environment";

import {
  AlchemyResponse,
  AlchemyTokenBalances,
  CovalentResponse,
  CovalentTokenBalance,
  CovalentTransaction,
} from "./covalent.types";
export class Covalent {
  public SUPPORTED_COVALENT_NETWORKS = {
    [NetworkId.FANTOM]: true,
    [NetworkId.MAINNET]: true,
    [NetworkId.POLYGON]: true,
    [NetworkId.ARBITRUM]: true,
    [NetworkId.AVALANCHE]: true,
  };
  private SUPPORTED_ALCHEMY_NETWORKS = {
    [NetworkId.TESTNET_RINKEBY]: true,
  };
  public SUPPORTED_NETWORKS = Object.assign({}, this.SUPPORTED_COVALENT_NETWORKS, this.SUPPORTED_ALCHEMY_NETWORKS);

  private _url = "https://api.covalenthq.com/v1";
  private _key = Buffer.from(EnvHelper.getCovalentKey() + "::").toString("base64");

  private async _fetchCovalent<Data = unknown>(path: string) {
    const url = this._url + path;
    const options = {
      headers: {
        Authorization: `Basic ${this._key}`,
      },
    };

    const response = await fetch(url, options);

    return this._validateCovalentResponse<Data>(response);
  }
  private async _validateCovalentResponse<Data = unknown>(response: Response) {
    const json: CovalentResponse<Data> = await response.json();

    if (!response.ok) throw new Error("Failed to fetch Covalent API.");
    else if (json.error) throw new Error(json.error_message);
    return json.data.items;
  }
  private async _validateAlchemyResponse<Data = unknown>(response: Response) {
    const json: AlchemyResponse<Data> = await response.json();
    return json.result;
  }
  private async _convertAlchemyTokenBalances(data: AlchemyTokenBalances) {
    return data.tokenBalances.map(item => {
      let balance = "0";
      try {
        balance = BigNumber.from(item.tokenBalance)
          .mul(BigNumber.from(10).pow(36 - 9))
          .toString();
      } catch {}
      return {
        type: "",
        quote: 0,
        balance,
        nft_data: null,
        logo_url: "",
        balance_24h: "",
        contract_name: "",
        contract_address: item.contractAddress,
        contract_decimals: 0,
        quote_24h: null,
        quote_rate: null,
        contract_ticker_symbol: "",
        supports_erc: null,
        quote_rate_24h: null,
        last_transferred_at: null,
      } as CovalentTokenBalance;
    });
  }
  private async _fetchAlchemy<Data = unknown>(
    networkId: keyof typeof this.SUPPORTED_ALCHEMY_NETWORKS,
    method: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: any,
  ) {
    const alchemy_key_list = EnvHelper.getAlchemyAPIKeyList(parseInt(String(networkId)));
    const url = alchemy_key_list[0];
    const options = {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ jsonrpc: "2.0", method, params }),
    };

    const response = await fetch(url, options);

    return this._validateAlchemyResponse<Data>(response);
  }

  public isSupportedNetwork(networkId: NetworkId) {
    return this.SUPPORTED_NETWORKS.hasOwnProperty(networkId);
  }

  public balances = {
    /**
     * Returns the balance of every token owned by an address.
     */
    getAllTokens: async (address: string, networkId: keyof typeof this.SUPPORTED_NETWORKS) => {
      if (this.SUPPORTED_COVALENT_NETWORKS.hasOwnProperty(networkId)) {
        const url = `/${networkId}/address/${address}/balances_v2/`;
        return this._fetchCovalent<CovalentTokenBalance[]>(url);
      } else if (this.SUPPORTED_ALCHEMY_NETWORKS.hasOwnProperty(networkId)) {
        //https://docs.alchemy.com/alchemy/enhanced-apis/token-api#alchemy_gettokenbalances
        const data = await this._fetchAlchemy<AlchemyTokenBalances>(
          networkId as keyof typeof this.SUPPORTED_ALCHEMY_NETWORKS,
          "alchemy_getTokenBalances",
          [address, Object.values(addresses[networkId])],
        );
        return this._convertAlchemyTokenBalances(data);
      }
    },
  };

  public transactions = {
    /**
     * Returns all successful, failed, and pending transactions for an address
     */
    getAllForAddress: async (address: string, networkId: keyof typeof this.SUPPORTED_NETWORKS) => {
      const url = `/${networkId}/address/${address}/transactions_v2/?no-logs=true`;

      return this._fetchCovalent<CovalentTransaction[]>(url);
    },
  };
}

export const covalent = new Covalent();
