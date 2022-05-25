import { BigNumber } from "ethers";

export const mockLiveMarkets = [36, 37, 38];
export const mockNoLiveMarkets = [];
export const mockInverseLiveMarkets = [8];
export const mockNoInverseLiveMarkets = [];
export const terms = {
  36: {
    fixedTerm: true,
    controlVariable: BigNumber.from("0x05ba293d"),
    vesting: 172800,
    conclusion: 1680760325,
    maxDebt: BigNumber.from("0x1bf2e2bbe400"),
  },
  37: {
    fixedTerm: true,
    controlVariable: BigNumber.from("0x017e0c22"),
    vesting: 172800,
    conclusion: 1680760325,
    maxDebt: BigNumber.from("0x6915b7dddc00"),
  },
  38: {
    fixedTerm: true,
    controlVariable: BigNumber.from("0x05ba293d"),
    vesting: 172800,
    conclusion: 1680760325,
    maxDebt: BigNumber.from("0x1bf2e2bbe400"),
  },
  2: {
    conclusion: BigNumber.from(1642432073),
    controlVariable: BigNumber.from(332362190654560),
    fixedTerm: true,
    maxDebt: BigNumber.from(10366827956988),
    vesting: BigNumber.from(1209600),
  },
};
export const inverseTerms = {
  8: {
    fixedTerm: true,
    controlVariable: BigNumber.from("0x02330ad301ef"),
    vesting: 0,
    conclusion: 1680760325,
    maxDebt: BigNumber.from("0x02544faa778090e00000"),
  },
};

export const markets = {
  37: {
    capacity: BigNumber.from("0x19e4ad0149"),
    quoteToken: "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0",
    capacityInQuote: false,
    totalDebt: BigNumber.from("0x138b12191ba8"),
    maxPayout: BigNumber.from("0x025aa06d9f87"),
    sold: BigNumber.from("0x10b32fed58b7"),
    purchased: BigNumber.from("0x5f17a316c772ee"),
  },
  38: {
    capacity: BigNumber.from("0x062d41b59b57"),
    quoteToken: "0x055475920a8c93CfFb64d039A8205F7AcC7722d3",
    capacityInQuote: false,
    totalDebt: BigNumber.from("0x390ed1c9b240"),
    maxPayout: BigNumber.from("0x03ae860b14e7"),
    sold: BigNumber.from("0x2e5d9a3952a9"),
    purchased: BigNumber.from("0x3cbd1165f356e845"),
  },
  36: {
    capacity: BigNumber.from("0xd53ab28156"),
    quoteToken: "0x853d955aCEf822Db058eb8505911ED77F175b99e",
    capacityInQuote: false,
    totalDebt: BigNumber.from("0x100ec8993e1b"),
    maxPayout: BigNumber.from("0x01f516b5f89f"),
    sold: BigNumber.from("0x0d2436ab70aa"),
    purchased: BigNumber.from("0x1199018c50db36f8"),
  },
  2: {
    capacity: BigNumber.from(0),
    capacityInQuote: true,
    maxPayout: BigNumber.from(373843833260),
    purchased: BigNumber.from(0),
    quoteToken: "0xa693B19d2931d498c5B318dF961919BB4aee87a5",
    sold: BigNumber.from(0),
    totalDebt: BigNumber.from(5183413978494),
  },
};

export const inverseMarkets = {
  8: {
    creator: "0xBA42BE149e5260EbA4B82418A6306f55D532eA47",
    capacity: BigNumber.from("0x021d9f8a5f48f59d8e3b"),
    baseToken: "0x6b175474e89094c44da98b954eedeac495271d0f",
    quoteToken: "0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
    call: false,
    capacityInQuote: false,
    totalDebt: BigNumber.from("0x0212e514449e39f6c6f0"),
    maxPayout: BigNumber.from("0x40ae1437d55e067b"),
    minPrice: BigNumber.from("0x2386f26fc10000"),
    sold: BigNumber.from("0x7a566a71bca271c5"),
    purchased: BigNumber.from("0x0caa4379"),
  },
};

export const marketPrice = {
  36: BigNumber.from("0x058d"),
  37: BigNumber.from("0x014ced"),
  38: BigNumber.from("0x015015"),
};

export const inverseMarketPrice = {
  8: BigNumber.from("0x058d"),
};

export const indexesFor = [2];

export const notes = {
  created: BigNumber.from(1649934593),
  marketID: BigNumber.from(38),
  matured: BigNumber.from(1650107393),
  payout: BigNumber.from("530859472185513724"),
  redeemed: BigNumber.from(0),
};
