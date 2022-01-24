import { ethers } from "ethers";
import { addresses, NetworkId } from "src/constants";
import { EnvHelper } from "src/helpers/Environment";

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

const fetchBalances = (addressOrENS: string, NetworkId: NetworkId, quoteCurrency = "usd") =>
  fetch(
    `${CovalentApi}/${NetworkId}/address/${addressOrENS}/balances_v2/?quote-currency=${quoteCurrency}&key=${COVALENT_KEY}`,
  ).then(d => d.json());

export const balancesOf = async (address: string, NetworkId: NetworkId): Promise<Token[]> => {
  const { data, error_message } = await fetchBalances(address, NetworkId);
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
  NetworkId.MAINNET,
  NetworkId.AVALANCHE,
  NetworkId.ARBITRUM,
  NetworkId.POLYGON,
  // covalent does not support rinkeby
  // ...(process.env.NODE_ENV === "development" ? [NetworkId.AvalancheTestnet, NetworkId.ArbitrumTestnet] : []),
];

const balanceByContractAddress = (balances: Token[], address: string) => {
  if (address) {
    return balances.find(token => token.contractAddress.toLowerCase() === address?.toLowerCase())?.balance;
  } else {
    return;
  }
};

const addressBalancesByNetwork = (Networks: NetworkId[], balances: Token[], contractAddressKey: string) => {
  return Networks.reduce(
    (networksBalances, networkId) => ({
      ...networksBalances,
      [networkId]: balanceByContractAddress(balances, addresses[networkId][contractAddressKey]),
    }),
    {},
  ) as Record<NetworkId, string>;
};

export const fetchCrossChainBalances = async (address: string) => {
  const balances = await Promise.all(
    Networks.map(NetworkId => balancesOf(address, NetworkId)),
    // tokens with same addrs between chains (?)
  ).then(arr => arr.reduce((acc, networkBalances) => [...acc, ...networkBalances], []));

  return {
    gohm: addressBalancesByNetwork(Networks, balances, "GOHM_ADDRESS"),
    wsohm: addressBalancesByNetwork(Networks, balances, "WSOHM_ADDRESS"),
  };
};
