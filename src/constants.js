export const INFURA_ID = "be29ba1004a14966bee539713c939ca1";

export const EPOCH_INTERVAL = 2200;

// NOTE could get this from an outside source since it changes slightly over time
export const BLOCK_RATE_SECONDS = 13.14;

export const addresses = {
  4: {
    DAI_ADDRESS: '0xda68f3C5F31A289a4d90927aE54d6b4Ae0b7F1F9',
    OHM_ADDRESS: '0x2CF9A1bCfbf78b7CeE14A91008157BeDbBd00A9f',
    STAKING_ADDRESS: '0x84c8cBAFbeFD329F3e55f7cbFFD1D422d77b7c27',
    SOHM_ADDRESS: '0x4D2AbC161Af2aeED1da1CAf768F4475b25e4C1Db',
    PRESALE_ADDRESS: '0x90d1dd1fa2fddd5076850f342f31717a0556fdf7',
    AOHM_ADDRESS: '0x410D96DF0F9e778d0E3a7B93547e40f06e823618',
    MIGRATE_ADDRESS: '0x3BA7C6346b93DA485e97ba55aec28E8eDd3e33E2',
    LPSTAKING_ADDRESS: '0x797C6E26D099b971cc95138D55729a58B34c5e6B',
    LP_ADDRESS: '0x366c22dbb3a69025bc2c6216305f047ed5db9192',
    // BOND_ADDRESS: '0xdc1b5DF37369B2D370f141E48d65a28032Be1c58',
    BOND_ADDRESS: '0x50a9dd1f9a13737376395056e9991d4f51a6e958',
    BONDINGCALC_ADDRESS: '0x6d5de2E6f3437b29f8Ffdb9b3f2BADb81B881dBc',
    DAI_BOND_ADDRESS: '0xf0dc88996d55b89ce7c1701ef906527855664f96',
    CIRCULATING_SUPPLY_ADDRESS: '0x5b0AA7903FD2EaA16F1462879B71c3cE2cFfE868',
  },
  1: {
    DAI_ADDRESS: '0x6b175474e89094c44da98b954eedeac495271d0f',
    OHM_ADDRESS: '0x383518188c0c6d7730d91b2c03a03c837814a899',
    STAKING_ADDRESS: '0x0822F3C03dcc24d200AFF33493Dc08d0e1f274A2',
    SOHM_ADDRESS: '0x31932E6e45012476ba3A3A4953cbA62AeE77Fbbe',
    PRESALE_ADDRESS: '0xcBb60264fe0AC96B0EFa0145A9709A825afa17D8',
    AOHM_ADDRESS: '0x24ecfd535675f36ba1ab9c5d39b50dc097b0792e',
    MIGRATE_ADDRESS: '0xC7f56EC779cB9e60afA116d73F3708761197dB3d',
    LPSTAKING_ADDRESS: '0xF11f0F078BfaF05a28Eac345Bb84fcb2a3722223',
    LP_ADDRESS: '0x34d7d7Aaf50AD4944B70B320aCB24C95fa2def7c',
    DISTRIBUTOR_ADDRESS: '0xbe731507810C8747C3E01E62c676b1cA6F93242f',
    // BOND_ADDRESS: '0xd27001d1aAEd5f002C722Ad729de88a91239fF29',
    BOND_ADDRESS: '0x13E8484a86327f5882d1340ed0D7643a29548536',
    BONDINGCALC_ADDRESS: '0x6a617Fe9163C1499b9D2773fb2d0105a2368Bedc',
    LP_BONDINGCALC_ADDRESS: '0xe2CABE86071f6Ae31e1b4634BAa06522b838a148',
    DAI_BOND_ADDRESS: '0xa64ED1b66Cb2838Ef2A198D8345c0ce6967A2A3c',
    CIRCULATING_SUPPLY_ADDRESS: '0x0efff9199aa1ac3c3e34e957567c1be8bf295034',
  }
};


export const Actions = {
  FETCH_ACCOUNT_SUCCESS: 'account/FETCH_ACCOUNT_SUCCESS',
  FETCH_APP_SUCCESS: 'app/FETCH_APP_SUCCESS',
  FETCH_STAKE_SUCCESS: 'stake/FETCH_STAKE_SUCCESS',
  FETCH_BOND_SUCCESS: 'bond/FETCH_BOND_SUCCESS',
};


// MY ETHERSCAN_ID, SWAP IN YOURS FROM https://etherscan.io/myapikey
export const ETHERSCAN_KEY = "PSW8C433Q667DVEX5BCRMGNAH9FSGFZ7Q8";

// BLOCKNATIVE ID FOR Notify.js:
export const BLOCKNATIVE_DAPPID = "0b58206a-f3c0-4701-a62f-73c7243e8c77";

// EXTERNAL CONTRACTS

export const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

export const DAI_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "chainId_", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "src", type: "address" },
      { indexed: true, internalType: "address", name: "guy", type: "address" },
      { indexed: false, internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: true,
    inputs: [
      { indexed: true, internalType: "bytes4", name: "sig", type: "bytes4" },
      { indexed: true, internalType: "address", name: "usr", type: "address" },
      { indexed: true, internalType: "bytes32", name: "arg1", type: "bytes32" },
      { indexed: true, internalType: "bytes32", name: "arg2", type: "bytes32" },
      { indexed: false, internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "LogNote",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "src", type: "address" },
      { indexed: true, internalType: "address", name: "dst", type: "address" },
      { indexed: false, internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    constant: true,
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "PERMIT_TYPEHASH",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "usr", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "usr", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "burn",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "address", name: "guy", type: "address" }],
    name: "deny",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "usr", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "src", type: "address" },
      { internalType: "address", name: "dst", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "move",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "nonces",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "holder", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "nonce", type: "uint256" },
      { internalType: "uint256", name: "expiry", type: "uint256" },
      { internalType: "bool", name: "allowed", type: "bool" },
      { internalType: "uint8", name: "v", type: "uint8" },
      { internalType: "bytes32", name: "r", type: "bytes32" },
      { internalType: "bytes32", name: "s", type: "bytes32" },
    ],
    name: "permit",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "usr", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "pull",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "usr", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "push",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "address", name: "guy", type: "address" }],
    name: "rely",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "dst", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "src", type: "address" },
      { internalType: "address", name: "dst", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "version",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "wards",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

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
