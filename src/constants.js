// export const INFURA_ID = "d9836dbf00c2440d862ab571b462e4a3"; // Girth's fallback
// 5e3c is owned by zeus@oly, 31e6 is owned by unbanksy. Use Girth's fallback if we run out of requests
export const INFURA_ID =
  process.env.NODE_ENV === "development" ? "5e3c4a19b5f64c99bf8cd8089c92b44d" : "31e6d348d16b4a4dacde5f8a47da1971";
export const THE_GRAPH_URL = "https://api.thegraph.com/subgraphs/name/drondin/olympus-graph";

// TODO (appleseed): verify production graph URL
export const POOL_GRAPH_URLS = {
  4: "https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_4_3",
  1: "https://api.thegraph.com/subgraphs/name/pooltogether/pooltogether-v3_4_3",
};

export const EPOCH_INTERVAL = 2200;

// NOTE could get this from an outside source since it changes slightly over time
export const BLOCK_RATE_SECONDS = 13.14;

export const TOKEN_DECIMALS = 9;

export const addresses = {
  4: {
    DAI_ADDRESS: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C", // duplicate
    OHM_ADDRESS: "0xC0b491daBf3709Ee5Eb79E603D73289Ca6060932",
    STAKING_ADDRESS: "0xC5d3318C0d74a72cD7C55bdf844e24516796BaB2",
    STAKING_HELPER_ADDRESS: "0xf73f23Bb0edCf4719b12ccEa8638355BF33604A1",
    OLD_STAKING_ADDRESS: "0xb640AA9082ad720c60102489b806E665d67DCE32",
    SOHM_ADDRESS: "0x1Fecda1dE7b6951B248C0B62CaeBD5BAbedc2084",
    OLD_SOHM_ADDRESS: "0x8Fc4167B0bdA22cb9890af2dB6cB1B818D6068AE",
    MIGRATE_ADDRESS: "0x3BA7C6346b93DA485e97ba55aec28E8eDd3e33E2",
    DISTRIBUTOR_ADDRESS: "0x0626D5aD2a230E05Fb94DF035Abbd97F2f839C3a",
    BONDINGCALC_ADDRESS: "0xaDBE4FA3c2fcf36412D618AfCfC519C869400CEB",
    CIRCULATING_SUPPLY_ADDRESS: "0x5b0AA7903FD2EaA16F1462879B71c3cE2cFfE868",
    TREASURY_ADDRESS: "0x0d722D813601E48b7DAcb2DF9bae282cFd98c6E7",
    // TODO (appleseed), the POOL_ADDRESS & AWARD_ADDRESS are old & can be removed
    POOL_TOGETHER: {
      POOL_ADDRESS: "0xF89e906632b1B1C036A92B56d3409347735C5D4c", // contract to get current prize amount, deposit/withdraw on pool
      POOL_TOKEN_ADDRESS: "0x7e41da986c80eaba53236fab0d3ff407e7440fb3", // 33T token address
      AWARD_ADDRESS: "0x54c18FB75f946424AF15221414B15a814Ca1EFD0", // contract to start/complete award
      PRIZE_POOL_ADDRESS: "0x60Bc094cb0c966E60Ed3bE0549E92f3BC572E9f8", // NEW
      PRIZE_STRATEGY_ADDRESS: "0xeeb552c4D5e155E50EE3f7402ed379bf72e36F23", // NEW
    },
  },
  1: {
    DAI_ADDRESS: "0x6b175474e89094c44da98b954eedeac495271d0f", // duplicate
    OHM_ADDRESS: "0x383518188c0c6d7730d91b2c03a03c837814a899",
    SOHM_ADDRESS: "0x04F2694C8fcee23e8Fd0dfEA1d4f5Bb8c352111F",
    STAKING_ADDRESS: "0xfd31c7d00ca47653c6ce64af53c1571f9c36566a", // lastest staking contract
    STAKING_HELPER_ADDRESS: "0xc8c436271f9a6f10a5b80c8b8ed7d0e8f37a612d",
    OLD_STAKING_ADDRESS: "0x0822F3C03dcc24d200AFF33493Dc08d0e1f274A2",
    OLD_SOHM_ADDRESS: "0x31932E6e45012476ba3A3A4953cbA62AeE77Fbbe",
    // PRESALE_ADDRESS: "0xcBb60264fe0AC96B0EFa0145A9709A825afa17D8", // deprecate?
    // AOHM_ADDRESS: "0x24ecfd535675f36ba1ab9c5d39b50dc097b0792e", // deprecate?
    MIGRATE_ADDRESS: "0xC7f56EC779cB9e60afA116d73F3708761197dB3d",
    DISTRIBUTOR_ADDRESS: "0xbe731507810C8747C3E01E62c676b1cA6F93242f",
    BONDINGCALC_ADDRESS: "0xcaaa6a2d4b26067a391e7b7d65c16bb2d5fa571a",
    CIRCULATING_SUPPLY_ADDRESS: "0x0efff9199aa1ac3c3e34e957567c1be8bf295034",
    TREASURY_ADDRESS: "0x31f8cc382c9898b273eff4e0b7626a6987c846e8",
    // TODO (appleseed): These are currently all rinkeby addresses (change before prod launch)
    POOL_TOGETHER: {
      POOL_ADDRESS: "0xF89e906632b1B1C036A92B56d3409347735C5D4c", // contract to get current prize amount, deposit/withdraw on pool
      POOL_TOKEN_ADDRESS: "0x7e41da986c80eaba53236fab0d3ff407e7440fb3", // 33T token address
      AWARD_ADDRESS: "0x54c18FB75f946424AF15221414B15a814Ca1EFD0", // contract to start/complete award
      PRIZE_POOL_ADDRESS: "0x60Bc094cb0c966E60Ed3bE0549E92f3BC572E9f8", // NEW
      PRIZE_STRATEGY_ADDRESS: "0xeeb552c4D5e155E50EE3f7402ed379bf72e36F23", // NEW
    },
  },
};

export const BONDS = {
  ohm_dai: "ohm_dai_lp",
  ohm_frax: "ohm_frax_lp",
  dai: "dai",
  frax: "frax",
  eth: "eth",
};

export const Actions = {
  FETCH_ACCOUNT_SUCCESS: "account/FETCH_ACCOUNT_SUCCESS",
  FETCH_APP_INPROGRESS: "app/FETCH_APP_INPROGRESS",
  FETCH_APP_SUCCESS: "app/FETCH_APP_SUCCESS",
  FETCH_BALANCES: "app/FETCH_BALANCES",
  FETCH_STAKE_SUCCESS: "stake/FETCH_STAKE_SUCCESS",
  FETCH_BOND_INPROGRESS: "bond/FETCH_BOND_INPROGRESS",
  FETCH_BOND_SUCCESS: "bond/FETCH_BOND_SUCCESS",
  FETCH_MIGRATE_SUCCESS: "migrate/FETCH_MIGRATE_SUCCESS",
  FETCH_FRAX_SUCCESS: "FETCH_FRAX_SUCCESS",
  // do we need these for the bullet points?
  FETCH_BULLETPOINTS_SUCCESS: "FETCH_BULLETPOINTS_SUCCESS",
  FETCH_TOOLTIP_ITEMS_SUCCESS: "FETCH_TOOLTIP_ITEMS_SUCCESS",
  FETCH_INFO_TOOLTIP_MESSAGES_SUCCESS: "FETCH_INFO_TOOLTIP_MESSAGES_SUCCESS",
  //
  FETCH_PENDING_TXNS: "FETCH_PENDING_TXNS",
  CLEAR_PENDING_TXN: "CLEAR_PENDING_TXN",
};

// MY ETHERSCAN_ID, SWAP IN YOURS FROM https://etherscan.io/myapikey
export const ETHERSCAN_KEY = "";

// BLOCKNATIVE ID FOR Notify.js:
export const BLOCKNATIVE_DAPPID = "";

export const NETWORK = chainId => {
  for (const n in NETWORKS) {
    if (NETWORKS[n].chainId === chainId) {
      return NETWORKS[n];
    }
  }
};

export const NETWORKS = {
  localhost: {
    name: "localhost",
    color: "#666666",
    chainId: 31337,
    blockExplorer: "",
    rpcUrl: "http://" + window.location.hostname + ":8545",
  },
  mainnet: {
    name: "mainnet",
    color: "#ff8b9e",
    chainId: 1,
    rpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
    blockExplorer: "https://etherscan.io/",
  },
  kovan: {
    name: "kovan",
    color: "#7003DD",
    chainId: 42,
    rpcUrl: `https://kovan.infura.io/v3/${INFURA_ID}`,
    blockExplorer: "https://kovan.etherscan.io/",
    faucet: "https://gitter.im/kovan-testnet/faucet", // https://faucet.kovan.network/
  },
  rinkeby: {
    name: "rinkeby",
    color: "#e0d068",
    chainId: 4,
    rpcUrl: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
    faucet: "https://faucet.rinkeby.io/",
    blockExplorer: "https://rinkeby.etherscan.io/",
  },
  ropsten: {
    name: "ropsten",
    color: "#F60D09",
    chainId: 3,
    faucet: "https://faucet.ropsten.be/",
    blockExplorer: "https://ropsten.etherscan.io/",
    rpcUrl: `https://ropsten.infura.io/v3/${INFURA_ID}`,
  },
  goerli: {
    name: "goerli",
    color: "#0975F6",
    chainId: 5,
    faucet: "https://goerli-faucet.slock.it/",
    blockExplorer: "https://goerli.etherscan.io/",
    rpcUrl: `https://goerli.infura.io/v3/${INFURA_ID}`,
  },
  xdai: {
    name: "xdai",
    color: "#48a9a6",
    chainId: 100,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: "https://dai.poa.network",
    faucet: "https://xdai-faucet.top/",
    blockExplorer: "https://blockscout.com/poa/xdai/",
  },
  matic: {
    name: "matic",
    color: "#2bbdf7",
    chainId: 137,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: "https://rpc-mainnet.maticvigil.com",
    faucet: "https://faucet.matic.network/",
    blockExplorer: "https://explorer-mainnet.maticvigil.com//",
  },
  mumbai: {
    name: "mumbai",
    color: "#92D9FA",
    chainId: 80001,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: "https://rpc-mumbai.maticvigil.com",
    faucet: "https://faucet.matic.network/",
    blockExplorer: "https://mumbai-explorer.matic.today/",
  },
};
