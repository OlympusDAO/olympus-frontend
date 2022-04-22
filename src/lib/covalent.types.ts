import { NetworkId } from "src/networkDetails";

export type CovalentSupportedNetwork =
  | NetworkId.MAINNET
  | NetworkId.FANTOM
  | NetworkId.POLYGON
  | NetworkId.ARBITRUM
  | NetworkId.AVALANCHE;

export interface CovalentRequestOptions {
  address: string;
  pageSize?: number;
  pageNumber?: number;
  /**
   * Boolean on whether or not to include bloom logs in response
   *
   * @defaults false
   */
  includeLogs?: boolean;
  networkId: CovalentSupportedNetwork;
}

export interface ListAllTransfersOptions extends CovalentRequestOptions {
  contractAddress: string;
}

export interface CovalentErrorResponse {
  data: null;
  error: true;
  error_code: number;
  error_message: string;
}

export interface CovalentSuccessResponse<Data> {
  error: false;
  error_code: null;
  error_message: null;
  data: CovalentResponse<Data>;
}

export interface CovalentResponse<Data> {
  address: string;
  updated_at: string;
  next_update_at: string;
  quote_currency: string;
  chain_id: number;
  items: Data;
  pagination: {
    has_more: boolean;
    page_number: number;
    page_size: number;
    total_count: number;
  };
}

export interface CovalentTransaction extends Transaction {
  log_events?: LogEventItem[];
}

export interface CovalentTransfer extends Transaction {
  transfers?: TokenTransferItem[];
}

interface Transaction {
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
}

interface LogEventItem {
  block_height: number;
  block_signed_at: string;
  decoded: {
    name: string;
    params: { decoded: boolean; indexed: boolean; name: string; type: string; value: string }[];
    signature: string;
  };
  log_offset: number;
  raw_log_data: string;
  raw_log_topics: [];
  sender_address: string;
  sender_address_label: string;
  sender_contract_decimals: number;
  sender_contract_ticker_symbol: string;
  sender_logo_url: string;
  sender_name: string;
  tx_hash: string;
  tx_offset: number;
}

interface TokenTransferItem {
  balance: number;
  balance_quote: number;
  block_signed_at: string;
  contract_address: string;
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  delta: number;
  delta_quote: number;
  from_address: string;
  from_address_label: string;
  logo_url: string;
  method_calls: { method: string; sender_address: string }[];
  quote_rate: number;
  to_address: string;
  to_address_label: string;
  transfer_type: string;
  tx_hash: string;
}
