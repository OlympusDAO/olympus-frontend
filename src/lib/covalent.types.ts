export type CovalentResponse<Data = unknown> =
  | {
      error: false;
      data: {
        items: Data;
        address: string;
        chain_id: number;
        pagination?: null;
        updated_at: string;
        next_update_at: string;
        quote_currency: string;
      };
    }
  | {
      error: true;
      error_code: number;
      error_message: string;
    };

export type CovalentTokenBalance = {
  type: string;
  quote: number;
  balance: string;
  nft_data?: null;
  logo_url: string;
  balance_24h: string;
  contract_name: string;
  contract_address: string;
  contract_decimals: number;
  quote_24h?: number | null;
  quote_rate?: number | null;
  contract_ticker_symbol: string;
  supports_erc?: string[] | null;
  quote_rate_24h?: number | null;
  last_transferred_at?: string | null;
};

export type CovalentTransaction = {
  block_signed_at: string;
  block_height: number;
  tx_hash: string;
  tx_offset: number;
  successful: boolean;
  from_address: string;
  from_address_label?: null;
  to_address: string;
  to_address_label?: null;
  value: string;
  value_quote: number;
  gas_offered: number;
  gas_spent: number;
  gas_price: number;
  gas_quote: number;
  gas_quote_rate: number;
};
