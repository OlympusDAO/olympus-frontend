import { addresses } from "src/constants";

export const tokensSelector = state => [
  {
    symbol: "OHM",
    address: addresses[state.network.networkId].OHM_ADDRESS,
    balance: state.account.balances.ohm,
    price: state.app.marketPrice || 0,
    decimals: 9,
  },
  {
    symbol: "sOHM",
    address: addresses[state.network.networkId].SOHM_ADDRESS,
    balance: state.account.balances.sohm,
    price: state.app.marketPrice || 0,
    decimals: 9,
  },
  {
    symbol: "wsOHM",
    address: addresses[state.network.networkId].WSOHM_ADDRESS,
    balance: state.account.balances.wsohm,
    price: (state.app.marketPrice || 0) * Number(state.app.currentIndex),
    decimals: 18,
  },
  {
    symbol: "33T",
    address: addresses[state.network.networkId].PT_TOKEN_ADDRESS,
    balance: state.account.balances.pool,
    price: state.app.marketPrice || 0,
    decimals: 9,
  },
];
