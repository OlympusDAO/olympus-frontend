import { NetworkId } from "src/constants";

export type AddressMap = Partial<Record<NetworkId, string>>;

export const STAKING_ADDRESSES = {
  [NetworkId.TESTNET_GOERLI]: "0x7263372b9ff6E619d8774aEB046cE313677E2Ec7",
  [NetworkId.MAINNET]: "0xB63cac384247597756545b500253ff8E607a8020",
};

export const BOND_DEPOSITORY_ADDRESSES = {
  [NetworkId.TESTNET_GOERLI]: "0xAda3336fcD233Ff0Eb39BeA0b1a7784E43aD4B00",
  [NetworkId.MAINNET]: "0x9025046c6fb25Fb39e720d97a8FD881ED69a1Ef6",
};

export const OP_BOND_DEPOSITORY_ADDRESSES = {
  [NetworkId.TESTNET_GOERLI]: "0x0C9D01FbD07cC2fD3e09bD953bb65698351AF05D",
  [NetworkId.MAINNET]: "0x22AE99D07584A2AE1af748De573c83f1B9Cdb4c0",
};

export const DAO_TREASURY_ADDRESSES = {
  [NetworkId.TESTNET_GOERLI]: "0x6e36b2f9f2BcC273f090ff049952Fa4B5Cc67567",
  [NetworkId.MAINNET]: "0x245cc372C84B3645Bf0Ffe6538620B04a217988B",
};

export const OHM_DAI_LP_ADDRESSES = {
  [NetworkId.MAINNET]: "0x055475920a8c93CfFb64d039A8205F7AcC7722d3",
};

export const OHM_DAI_ETH_LP_ADDRESSES = {
  [NetworkId.MAINNET]: "0xc45D42f801105e861e86658648e3678aD7aa70f9",
  [NetworkId.TESTNET_GOERLI]: "",
};

export const WBTC_ADDRESSES = {
  [NetworkId.MAINNET]: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
};

export const UST_ADDRESSES = {
  [NetworkId.MAINNET]: "0xa693B19d2931d498c5B318dF961919BB4aee87a5",
};

export const FRAX_ADDRESSES = {
  [NetworkId.MAINNET]: "0x853d955aCEf822Db058eb8505911ED77F175b99e",
};

export const LUSD_ADDRESSES = {
  [NetworkId.MAINNET]: "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0",
};

export const DAI_ADDRESSES = {
  [NetworkId.TESTNET_GOERLI]: "0x41e38e70a36150D08A8c97aEC194321b5eB545A5",
  [NetworkId.MAINNET]: "0x6b175474e89094c44da98b954eedeac495271d0f",
};

export const WETH_ADDRESSES = {
  [NetworkId.MAINNET]: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
};

export const GOHM_ADDRESSES = {
  [NetworkId.TESTNET_GOERLI]: "0xC1863141dc1861122d5410fB5973951c82871d98",
  [NetworkId.MAINNET]: "0x0ab87046fBb341D058F17CBC4c1133F25a20a52f",
  [NetworkId.ARBITRUM]: "0x8D9bA570D6cb60C7e3e0F31343Efe75AB8E65FB1",
  [NetworkId.ARBITRUM_TESTNET]: "0x950c3626B9E9798aA1a4832cEee603ECfb7741a8",
  [NetworkId.AVALANCHE]: "0x321e7092a180bb43555132ec53aaa65a5bf84251",
  [NetworkId.AVALANCHE_TESTNET]: "0x115E5979435c89eF38fB87C2D7Fc3BCA09053c54",
  [NetworkId.POLYGON]: "0xd8cA34fd379d9ca3C6Ee3b3905678320F5b45195",
  [NetworkId.FANTOM]: "0x91fa20244fb509e8289ca630e5db3e9166233fdc",
  [NetworkId.OPTIMISM]: "0x0b5740c6b4a97f90eF2F0220651Cca420B868FfB",
  [NetworkId.BOBA]: "0xd22C0a4Af486C7FA08e282E9eB5f30F9AaA62C95",
};

export const WSOHM_ADDRESSES = {
  [NetworkId.TESTNET_GOERLI]: "0x98002335F094340BB8B21c8b7CC35F0792282651",
  [NetworkId.MAINNET]: "0xca76543cf381ebbb277be79574059e32108e3e65",
  [NetworkId.ARBITRUM]: "0x739ca6D71365a08f584c8FC4e1029045Fa8ABC4B",
  [NetworkId.ARBITRUM_TESTNET]: "0x3DE0150338BDeE175a8EAc6fBbBF2c55279454d5",
  [NetworkId.AVALANCHE]: "0x8cd309e14575203535ef120b5b0ab4dded0c2073",
  [NetworkId.AVALANCHE_TESTNET]: "0x8e8ffc8d41Ee4A915A1FB3940b1beAB0c2Cd5bB0",
};

export const OHM_ADDRESSES = {
  [NetworkId.TESTNET_GOERLI]: "0x0595328847AF962F951a4f8F8eE9A3Bf261e4f6b",
  [NetworkId.MAINNET]: "0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
};

export const V1_OHM_ADDRESSES = {
  [NetworkId.TESTNET_GOERLI]: "0x5f99F707470E81784eA064377b302Ff111b5a95A",
  [NetworkId.MAINNET]: "0x383518188c0c6d7730d91b2c03a03c837814a899",
};

export const SOHM_ADDRESSES = {
  [NetworkId.TESTNET_GOERLI]: "0x4EFe119F4949319f2Acb12efD615a7B63896482B",
  [NetworkId.MAINNET]: "0x04906695D6D12CF5459975d7C3C03356E4Ccd460",
};

export const V1_SOHM_ADDRESSES = {
  [NetworkId.TESTNET_GOERLI]: "0x018C3877ef779fb977E7700BFDF08B6f63BD07B8",
  [NetworkId.MAINNET]: "0x04F2694C8fcee23e8Fd0dfEA1d4f5Bb8c352111F",
};

export const MIGRATOR_ADDRESSES = {
  [NetworkId.TESTNET_GOERLI]: "0x33c7278a7C0Ea98d75B2CCb87506aC3fD494dC83",
  [NetworkId.MAINNET]: "0x184f3FAd8618a6F458C16bae63F70C426fE784B3",
  [NetworkId.ARBITRUM]: "0x1e7902a8b0adbf81042b5e30bdfa281f0b928d6d",
  [NetworkId.ARBITRUM_TESTNET]: "0xde9518c8444Fa436704Fbd9db27B3910bca9F532",
  [NetworkId.AVALANCHE]: "0xB10209BFbb37d38EC1B5F0c964e489564e223ea7",
  [NetworkId.AVALANCHE_TESTNET]: "0x9050D25977F8A19CDD5599A28bC5f55d39fb6105",
};

export const GOHM_TOKEMAK_ADDRESSES = {
  [NetworkId.MAINNET]: "0x41f6a95bacf9bc43704c4a4902ba5473a8b00263",
};

export const FUSE_POOL_6_ADDRESSES = {
  [NetworkId.MAINNET]: "0x59bd6774c22486d9f4fab2d448dce4f892a9ae25",
};

export const FUSE_POOL_18_ADDRESSES = {
  [NetworkId.MAINNET]: "0x6eDa4b59BaC787933A4A21b65672539ceF6ec97b",
};

export const FUSE_POOL_36_ADDRESSES = {
  [NetworkId.MAINNET]: "0x252d447c54F33e033AD04048baEAdE7628cB1274",
};

export const ZAP_ADDRESSES = {
  [NetworkId.MAINNET]: "0x6F5CC3EDEa92AB52b75bad50Bcf4C6daa781B87e",
  [NetworkId.TESTNET_GOERLI]: "",
};

export const PT_PRIZE_POOL_ADDRESSES = {
  [NetworkId.MAINNET]: "0xEaB695A8F5a44f583003A8bC97d677880D528248",
};

export const FIATDAO_WSOHM_ADDRESSES = {
  [NetworkId.MAINNET]: "0xe98ae8cD25CDC06562c29231Db339d17D02Fd486",
};

export const BALANCER_VAULT_ADDRESSSES = {
  [NetworkId.MAINNET]: "0xba12222222228d8ba445958a75a0704d566bf2c8",
};

export const RANGE_OPERATOR_ADDRESSES = {
  [NetworkId.MAINNET]: "",
  [NetworkId.TESTNET_GOERLI]: "0x4099dACb7292138FA7d4C0e07Ff36930593D92a4",
};

export const RANGE_ADDRESSES = {
  [NetworkId.MAINNET]: "",
  [NetworkId.TESTNET_GOERLI]: "0x9ECDA630626a3aa9EF24A53c4Faca1Ce76a1A508",
};

export const RANGE_PRICE_ADDRESSES = {
  [NetworkId.MAINNET]: "",
  [NetworkId.TESTNET_GOERLI]: "0x6d39cDfa180974c5e1ac6FD325A1718F2Fd4412f",
};

export const DEV_FAUCET = {
  [NetworkId.TESTNET_GOERLI]: "0x405940141AeE885347ef4C47d933eF4cA6A674D8",
};

/**
 * now called Parthenon
 */
export const GOVERNANCE_ADDRESSES = {
  [NetworkId.MAINNET]: "",
  // [NetworkId.TESTNET_GOERLI]: "0xf1c6848e7b7bc93401262cdeab40dcbaf92e16ac",
  // [NetworkId.TESTNET_GOERLI]: "0x0fa391b3ae3a7fc5fa24a4bc7236db854390b7b4",
  [NetworkId.TESTNET_GOERLI]: "0x904fe39c25f53a00A19Cf155B1B73b1CB67F23F8",
};

export const GOV_INSTRUCTIONS_ADDRESSES = {
  [NetworkId.MAINNET]: "",
  // [NetworkId.TESTNET_GOERLI]: "0xa8810f94ABe49Ffe0AA49a1c30930a40C450f288",
  [NetworkId.TESTNET_GOERLI]: "0x42bb80bad7e1e8bfd59417c5ae49f09e6988a795",
};

export const VOTE_TOKEN_ADDRESSES = {
  [NetworkId.MAINNET]: "",
  // [NetworkId.TESTNET_GOERLI]: "0xad50790dbaf78572019575bc5dce2abff1544fd0",
  // [NetworkId.TESTNET_GOERLI]: "0x7Aef3bDa16bBD12033d93C05df877d0f165F2214",
  [NetworkId.TESTNET_GOERLI]: "0x02741c86c45455c87baa381622f93ebb1141fa63",
};

/**
 * GOVERNANCE -
 * the testing flow should go as follows:
 * 1) Mint OHM from the Mock OHM contract
 * 2) Deposit OHM into the vOHM Vault contract to receive voting tokens ("vOHM")
 * 3) Use vOHM to vote in Parthenon.sol
 */

// export const GOVERNANCE_MOCK_OHM = {
//   [NetworkId.MAINNET]: "",
//   [NetworkId.TESTNET_GOERLI]: "0xcd69d22753dafbf93843c600110e32df046dd165",
// };
export const GOVERNANCE_MOCK_GOHM = {
  [NetworkId.MAINNET]: "",
  [NetworkId.TESTNET_GOERLI]: "0xBF3BaBd7411628788B0f6cd56BC9D6aE1Bfb1F0F",
};

/** governance gohm combines mock gohm on goerli with mainnet gohm */
export const GOVERNANCE_GOHM_ADDRESSES = {
  [NetworkId.MAINNET]: "0x0ab87046fBb341D058F17CBC4c1133F25a20a52f", // this is the same as GOHM on mainnet
  [NetworkId.TESTNET_GOERLI]: "0xBF3BaBd7411628788B0f6cd56BC9D6aE1Bfb1F0F",
};

export const GOVERNANCE_VOHM_VAULT_ADDRESSES = {
  [NetworkId.MAINNET]: "",
  // [NetworkId.TESTNET_GOERLI]: "0x4fd8cc1a43377454ac50f9a312fd4fd7974811cb",
  [NetworkId.TESTNET_GOERLI]: "0x0BF5064643998f3211b4555Ce6855D511D33191a",
};

export const BOND_AGGREGATOR_ADDRESSES = {
  [NetworkId.MAINNET]: "0x007A66B9e719b3aBb2f3917Eb47D4231a17F5a0D",
  [NetworkId.TESTNET_GOERLI]: "0x007A66B9e719b3aBb2f3917Eb47D4231a17F5a0D",
};

export const BOND_FIXED_EXPIRY_TELLER_ADDRESSES = {
  [NetworkId.MAINNET]: "0x007FE7c498A2Cf30971ad8f2cbC36bd14Ac51156",
  [NetworkId.TESTNET_GOERLI]: "0x007FE7c498A2Cf30971ad8f2cbC36bd14Ac51156",
};

export const BOND_FIXED_TERM_TELLER_ADDRESSES = {
  [NetworkId.MAINNET]: "0x007F77B53ed0F058616335bc040cD326E125daE0",
  [NetworkId.TESTNET_GOERLI]: "0x007F77B53ed0F058616335bc040cD326E125daE0",
};

export const DISTRIBUTOR_ADDRESSES = {
  [NetworkId.MAINNET]: "0x5206d13F625320Cb73CcD222518ee0Edb801f78B",
  [NetworkId.TESTNET_GOERLI]: "0x2b954551307FB929DF8BB96657DB69fB4d72617c",
};

export const V1_STAKING_HELPER_ADDRESSES = {
  [NetworkId.MAINNET]: "0xd542f531d8444C35378adCDD1317172B19556cd7",
  [NetworkId.TESTNET_GOERLI]: "",
};

export const V1_STAKING_ADDRESSES = {
  [NetworkId.MAINNET]: "0xfd31c7d00ca47653c6ce64af53c1571f9c36566a",
  [NetworkId.TESTNET_GOERLI]: "0x2868546dB0850fE969de651395887F18e66A2d26",
};
