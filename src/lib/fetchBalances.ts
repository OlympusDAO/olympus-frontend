import { ethers } from "ethers";

import { addresses } from "src/constants";
import { EnvHelper } from "src/helpers/Environment";
import { NetworkID } from "src/lib/Bond";

export type Token = {
  contractAddress: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  balanceUSD?: number;
  priceUSD: number;
  priceUSD24HR?: number;
  image: string;
  error?: string;
};

const CovalentApi = "https://api.covalenthq.com/v1";
const COVALENT_KEY = EnvHelper.getCovalentKey();

const fetchBalances = (addressOrENS: string, networkId: NetworkID, quoteCurrency = "usd") =>
  fetch(
    `${CovalentApi}/${networkId}/address/${addressOrENS}/balances_v2/?quote-currency=${quoteCurrency}&key=${COVALENT_KEY}`,
  ).then(d => d.json());

export const balancesOf = async (address: string, networkId: NetworkID): Promise<Token[]> => {
  const { data, error_message } = await fetchBalances(address, networkId);
  if (error_message) throw new Error(error_message);
  return data.items.map((token: any) => {
    const priceUSD = token.quote_rate;
    const balance = ethers.utils.formatUnits(token.balance, token.contract_decimals);
    return {
      contractAddress: token.contract_address,
      // symbol: token.contract_ticker_symbol,
      // name: token.contract_name,
      // decimals: token.contract_decimals,
      // image: token.logo_url,
      balance,
      priceUSD,
      priceUSD24HR: token.quote_rate_24h,
      balanceUSD: token.quote,
    } as Token;
  });
};

const Networks = [
  NetworkID.Mainnet,
  NetworkID.Avalanche,
  NetworkID.Arbitrum,
  // covalent does not support rinkeby
  // ...(process.env.NODE_ENV === "development" ? [NetworkID.AvalancheTestnet, NetworkID.ArbitrumTestnet] : []),
];

const balanceByContractAddress = (balances: Token[], address: string) => {
  return balances.find(token => token.contractAddress.toLowerCase() === address.toLowerCase())?.balance;
};

const addressBalancesByNetwork = (Networks: NetworkID[], balances: Token[], contractAddressKey: string) => {
  return Networks.reduce(
    (networksBalances, networkId) => ({
      ...networksBalances,
      [networkId]: balanceByContractAddress(balances, addresses[networkId][contractAddressKey]),
    }),
    {},
  ) as Record<NetworkID, string>;
};

export const fetchCrossChainBalances = async (address: string) => {
  const balances = await Promise.all(
    Networks.map(networkId => balancesOf(address, networkId)),
    // tokens with same addrs between chains (?)
  ).then(arr => arr.reduce((acc, networkBalances) => [...acc, ...networkBalances], []));

  return {
    gohm: addressBalancesByNetwork(Networks, balances, "GOHM_ADDRESS"),
    wsohm: addressBalancesByNetwork(Networks, balances, "WSOHM_ADDRESS"),
    // ohmV1: balanceByAddress(balances, addresses[NetworkID.Mainnet].OHM_ADDRESS),
    // sohmV1: balanceByAddress(balances, addresses[NetworkID.Mainnet].SOHM_ADDRESS),
    // pool: balanceByAddress(balances, addresses[NetworkID.Mainnet].PT_TOKEN_ADDRESS),
    // ohm: balanceByAddress(balances, addresses[NetworkID.Mainnet].OHM_V2),
    // sohm: balanceByAddress(balances, addresses[NetworkID.Mainnet].SOHM_V2),
  };
};
