export interface CovalentResponse<Data = unknown> {
  data: Data;
  error: boolean;
  error_message?: null;
  error_code?: null;
}

export interface GetTokenBalancesData {
  address: string;
  updated_at: string;
  next_update_at: string;
  quote_currency: string;
  chain_id: number;
  items: TokenBalance[];
  pagination?: null;
}

export interface TokenBalance {
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_address: string;
  supports_erc?: string[] | null;
  logo_url: string;
  last_transferred_at?: string | null;
  type: string;
  balance: string;
  balance_24h: string;
  quote_rate?: number | null;
  quote_rate_24h?: number | null;
  quote: number;
  quote_24h?: number | null;
  nft_data?: null;
}
