export enum NetworkId {
  MAINNET = 1,
  TESTNET_GOERLI = 5,

  ARBITRUM = 42161,
  ARBITRUM_TESTNET = 421611,

  AVALANCHE = 43114,
  AVALANCHE_TESTNET = 43113,

  POLYGON = 137,
  POLYGON_TESTNET = 80001,

  FANTOM = 250,
  FANTOM_TESTNET = 4002,

  OPTIMISM = 10,
  OPTIMISM_TESTNET = 69,

  BOBA = 288,
  BOBA_TESTNET = 28,
}

export type EthereumNetwork = NetworkId.MAINNET | NetworkId.TESTNET_GOERLI;

interface IAddresses {
  [key: number]: { [key: string]: string };
}

export const addresses: IAddresses = {
  [NetworkId.TESTNET_GOERLI]: {
    DAI_ADDRESS: "0x41e38e70a36150D08A8c97aEC194321b5eB545A5",
    OHM_ADDRESS: "0x5f99F707470E81784eA064377b302Ff111b5a95A",
    STAKING_ADDRESS: "0x2868546dB0850fE969de651395887F18e66A2d26",
    STAKING_HELPER_ADDRESS: "0xd542f531d8444C35378adCDD1317172B19556cd7",
    SOHM_ADDRESS: "0x018C3877ef779fb977E7700BFDF08B6f63BD07B8",
    WSOHM_ADDRESS: "0x98002335F094340BB8B21c8b7CC35F0792282651",
    OLD_SOHM_ADDRESS: "0x018C3877ef779fb977E7700BFDF08B6f63BD07B8",
    MIGRATE_ADDRESS: "0x33c7278a7C0Ea98d75B2CCb87506aC3fD494dC83",
    DISTRIBUTOR_ADDRESS: "0x2b954551307FB929DF8BB96657DB69fB4d72617c",
    TREASURY_ADDRESS: "0x6Ce41Be5b43139410fb9513A06E77B49fD253d04",
    TREASURY_V2: "0xB3e1dF7951a62fFb5eF7D3b1C9D80CF09325580A",
    BOND_DEPOSITORY: "0xAda3336fcD233Ff0Eb39BeA0b1a7784E43aD4B00",
    INVERSE_BOND_DEPOSITORY: "0x0C9D01FbD07cC2fD3e09bD953bb65698351AF05D",
    DAO_TREASURY: "0x6e36b2f9f2BcC273f090ff049952Fa4B5Cc67567",
  },
  [NetworkId.MAINNET]: {
    DAI_ADDRESS: "0x6b175474e89094c44da98b954eedeac495271d0f", // duplicate
    OHM_ADDRESS: "0x383518188c0c6d7730d91b2c03a03c837814a899",
    STAKING_ADDRESS: "0xfd31c7d00ca47653c6ce64af53c1571f9c36566a", // The new staking contract
    STAKING_HELPER_ADDRESS: "0xc8c436271f9a6f10a5b80c8b8ed7d0e8f37a612d", // Helper contract used for Staking only
    OLD_STAKING_ADDRESS: "0x0822F3C03dcc24d200AFF33493Dc08d0e1f274A2",
    SOHM_ADDRESS: "0x04F2694C8fcee23e8Fd0dfEA1d4f5Bb8c352111F",
    WSOHM_ADDRESS: "0xca76543cf381ebbb277be79574059e32108e3e65",
    OLD_SOHM_ADDRESS: "0x31932E6e45012476ba3A3A4953cbA62AeE77Fbbe",
    PRESALE_ADDRESS: "0xcBb60264fe0AC96B0EFa0145A9709A825afa17D8",
    AOHM_ADDRESS: "0x24ecfd535675f36ba1ab9c5d39b50dc097b0792e",
    MIGRATE_ADDRESS: "0xC7f56EC779cB9e60afA116d73F3708761197dB3d",
    DISTRIBUTOR_ADDRESS: "0xbe731507810C8747C3E01E62c676b1cA6F93242f",
    BONDINGCALC_ADDRESS: "0xcaaa6a2d4b26067a391e7b7d65c16bb2d5fa571a",
    CIRCULATING_SUPPLY_ADDRESS: "0x0efff9199aa1ac3c3e34e957567c1be8bf295034",
    TREASURY_ADDRESS: "0x31f8cc382c9898b273eff4e0b7626a6987c846e8",
    REDEEM_HELPER_ADDRESS: "0xE1e83825613DE12E8F0502Da939523558f0B819E",
    FUSE_6_SOHM: "0x59bd6774c22486d9f4fab2d448dce4f892a9ae25", // Tetranode's Locker
    FUSE_18_SOHM: "0x6eDa4b59BaC787933A4A21b65672539ceF6ec97b", // Olympus Pool Party
    FUSE_36_SOHM: "0x252d447c54F33e033AD04048baEAdE7628cB1274", // Fraximalist Money Market
    PT_PRIZE_POOL_ADDRESS: "0xEaB695A8F5a44f583003A8bC97d677880D528248",
    ZAPPER_POOL_V1: "0x04f2694c8fcee23e8fd0dfea1d4f5bb8c352111f",
    BONDINGCALC_V2: "0x7b1a5649145143F4faD8504712ca9c614c3dA2Ae",
    TREASURY_V2: "0x9a315bdf513367c0377fb36545857d12e85813ef",
    FIATDAO_WSOHM_ADDRESS: "0xe98ae8cD25CDC06562c29231Db339d17D02Fd486",
    BOND_DEPOSITORY: "0x9025046c6fb25Fb39e720d97a8FD881ED69a1Ef6", // updated
    OP_BOND_DEPOSITORY: "0x22AE99D07584A2AE1af748De573c83f1B9Cdb4c0",
    INVERSE_BOND_DEPOSITORY: "0xBA42BE149e5260EbA4B82418A6306f55D532eA47", // OPCreator.sol
    DAO_TREASURY: "0x245cc372C84B3645Bf0Ffe6538620B04a217988B",
    TOKEMAK_GOHM: "0x41f6a95bacf9bc43704c4a4902ba5473a8b00263",
    ZAP: "0x6F5CC3EDEa92AB52b75bad50Bcf4C6daa781B87e",
  },
  [NetworkId.ARBITRUM]: {
    DAI_ADDRESS: "", // duplicate
    OHM_ADDRESS: "",
    STAKING_ADDRESS: "", // The new staking contract
    STAKING_HELPER_ADDRESS: "", // Helper contract used for Staking only
    OLD_STAKING_ADDRESS: "",
    SOHM_ADDRESS: "",
    OLD_SOHM_ADDRESS: "",
    PRESALE_ADDRESS: "",
    AOHM_ADDRESS: "",
    MIGRATE_ADDRESS: "",
    DISTRIBUTOR_ADDRESS: "",
    BONDINGCALC_ADDRESS: "",
    CIRCULATING_SUPPLY_ADDRESS: "",
    TREASURY_ADDRESS: "",
    WSOHM_ADDRESS: "0x739ca6D71365a08f584c8FC4e1029045Fa8ABC4B",
    REDEEM_HELPER_ADDRESS: "",
  }, // TODO: Replace with Arbitrum contract addresses when ready
  [NetworkId.ARBITRUM_TESTNET]: {
    DAI_ADDRESS: "",
    OHM_ADDRESS: "",
    STAKING_ADDRESS: "",
    STAKING_HELPER_ADDRESS: "",
    OLD_STAKING_ADDRESS: "",
    SOHM_ADDRESS: "",
    OLD_SOHM_ADDRESS: "",
    PRESALE_ADDRESS: "",
    AOHM_ADDRESS: "",
    MIGRATE_ADDRESS: "",
    DISTRIBUTOR_ADDRESS: "",
    BONDINGCALC_ADDRESS: "",
    CIRCULATING_SUPPLY_ADDRESS: "",
    TREASURY_ADDRESS: "",
    REDEEM_HELPER_ADDRESS: "",
    WSOHM_ADDRESS: "0x3DE0150338BDeE175a8EAc6fBbBF2c55279454d5",
  },
  [NetworkId.AVALANCHE_TESTNET]: {
    DAI_ADDRESS: "",
    OHM_ADDRESS: "",
    STAKING_ADDRESS: "",
    STAKING_HELPER_ADDRESS: "",
    OLD_STAKING_ADDRESS: "",
    SOHM_ADDRESS: "",
    OLD_SOHM_ADDRESS: "",
    PRESALE_ADDRESS: "",
    AOHM_ADDRESS: "",
    MIGRATE_ADDRESS: "",
    DISTRIBUTOR_ADDRESS: "",
    BONDINGCALC_ADDRESS: "",
    CIRCULATING_SUPPLY_ADDRESS: "",
    TREASURY_ADDRESS: "",
    PICKLE_OHM_LUSD_ADDRESS: "",
    REDEEM_HELPER_ADDRESS: "",
    WSOHM_ADDRESS: "0x8e8ffc8d41Ee4A915A1FB3940b1beAB0c2Cd5bB0",
  },
  [NetworkId.AVALANCHE]: {
    DAI_ADDRESS: "",
    OHM_ADDRESS: "",
    // STAKING_ADDRESS: "", // The new staking contract
    STAKING_HELPER_ADDRESS: "", // Helper contract used for Staking only
    OLD_STAKING_ADDRESS: "",
    SOHM_ADDRESS: "",
    OLD_SOHM_ADDRESS: "",
    PRESALE_ADDRESS: "",
    AOHM_ADDRESS: "",
    MIGRATE_ADDRESS: "",
    DISTRIBUTOR_ADDRESS: "",
    BONDINGCALC_ADDRESS: "",
    CIRCULATING_SUPPLY_ADDRESS: "",
    TREASURY_ADDRESS: "",
    PICKLE_OHM_LUSD_ADDRESS: "",
    REDEEM_HELPER_ADDRESS: "",
    WSOHM_ADDRESS: "0x8cd309e14575203535ef120b5b0ab4dded0c2073",
  }, // TODO: Avalanche Mainnet addresses
};

// VIEWS FOR NETWORK is used to denote which paths should be viewable on each network
// ... attempting to prevent contract calls that can't complete & prevent user's from getting
// ... stuck on the wrong view

interface IViewsForNetwork {
  dashboard: boolean;
  stake: boolean;
  wrap: boolean;
  zap: boolean;
  threeTogether: boolean;
  bonds: boolean;
  network: boolean;
  bondsV2: boolean;
}

export const VIEWS_FOR_NETWORK: { [key: number]: IViewsForNetwork } = {
  [NetworkId.MAINNET]: {
    dashboard: true,
    stake: true,
    wrap: true,
    zap: true,
    threeTogether: true,
    bonds: true,
    network: true,
    bondsV2: true,
  },
  [NetworkId.TESTNET_GOERLI]: {
    dashboard: true,
    stake: true,
    wrap: true,
    zap: true,
    threeTogether: true,
    bonds: true,
    network: true,
    bondsV2: true,
  },
  [NetworkId.ARBITRUM]: {
    dashboard: true,
    stake: false,
    wrap: true,
    zap: false,
    threeTogether: false,
    bonds: false,
    network: true,
    bondsV2: false,
  },
  [NetworkId.ARBITRUM_TESTNET]: {
    dashboard: true,
    stake: false,
    wrap: true,
    zap: false,
    threeTogether: false,
    bonds: false,
    network: true,
    bondsV2: false,
  },
  [NetworkId.AVALANCHE]: {
    dashboard: true,
    stake: false,
    wrap: true,
    zap: false,
    threeTogether: false,
    bonds: false,
    network: true,
    bondsV2: false,
  },
  [NetworkId.AVALANCHE_TESTNET]: {
    dashboard: true,
    stake: false,
    wrap: true,
    zap: false,
    threeTogether: false,
    bonds: false,
    network: true,
    bondsV2: false,
  },
};
