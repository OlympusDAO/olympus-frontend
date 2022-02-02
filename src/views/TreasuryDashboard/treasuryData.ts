// TODO: add paramaterization
import { t } from "@lingui/macro";

export const treasuryDataQuery = `
query {
  protocolMetrics(first: 100, orderBy: timestamp, orderDirection: desc) {
    id
    timestamp
    ohmCirculatingSupply
    sOhmCirculatingSupply
    totalSupply
    ohmPrice
    marketCap
    totalValueLocked
    treasuryRiskFreeValue
    treasuryMarketValue
    nextEpochRebase
    nextDistributedOhm
    treasuryDaiRiskFreeValue
    treasuryFraxMarketValue
    treasuryDaiMarketValue
    treasuryFraxRiskFreeValue
    treasuryXsushiMarketValue
    treasuryWETHMarketValue
    treasuryLusdRiskFreeValue
    treasuryLusdMarketValue
    treasuryOtherMarketValue
    treasuryWBTCMarketValue
    treasuryUstMarketValue
    currentAPY
    runway10k
    runway20k
    runway50k
    runway7dot5k
    runway5k
    runway2dot5k
    runwayCurrent
    treasuryOhmDaiPOL
    treasuryOhmFraxPOL
  }
}
`;

export const rebasesDataQuery = `
query {
  rebases(where: {contract: "0xfd31c7d00ca47653c6ce64af53c1571f9c36566a"}, orderBy: timestamp, first: 1000, orderDirection: desc) {
    percentage
    timestamp
  }
}
`;

// export default treasuryData;
export const bulletpoints = {
  tvl: [
    {
      right: 20,
      top: -12,
      background: "linear-gradient(180deg, #768299 -10%, #98B3E9 100%)",
    },
  ],
  coin: [
    {
      right: 15,
      top: -12,
      background: "#F5AC37",
    },
    {
      right: 25,
      top: -12,
      background: "#768299",
    },
    {
      right: 29,
      top: -12,
      background: "#DC30EB",
    },
    {
      right: 29,
      top: -12,
      background: "#4C8C2A",
    },
    {
      right: 29,
      top: -12,
      background: "#c9184a",
    },
    {
      right: 29,
      top: -12,
      background: "#4E1F71",
    },
    {
      right: 29,
      top: -12,
      background: "#8AECCD",
    },
  ],
  rfv: [
    {
      right: 15,
      top: -12,
      background: "#F5AC37",
    },
    {
      right: 25,
      top: -12,
      background: "#768299",
    },
    {
      right: 29,
      top: -12,
      background: "#c9184a",
    },
    {
      right: 29,
      top: -12,
      background: "#4E1F71",
    },
  ],
  holder: [
    {
      right: 40,
      top: -12,
      background: "#A3A3A3",
    },
  ],
  apy: [
    {
      right: 20,
      top: -12,
      background: "#49A1F2",
    },
  ],
  runway: [
    {
      right: 45,
      top: -12,
      background: "#000000",
    },
    {
      right: 48,
      top: -12,
      background: "#2EC608",
    },
    {
      right: 48,
      top: -12,
      background: "#49A1F2",
    },
    {
      right: 48,
      top: -12,
      background: "#c9184a",
    },
  ],
  staked: [
    {
      right: 45,
      top: -11,
      background: "linear-gradient(180deg, #55EBC7 -10%, rgba(71, 172, 235, 0) 100%)",
    },
    {
      right: 68,
      top: -12,
      background: "rgba(151, 196, 224, 0.2)",
      border: "1px solid rgba(54, 56, 64, 0.5)",
    },
  ],
  pol: [
    {
      right: 15,
      top: -12,
      background: "linear-gradient(180deg, rgba(56, 223, 63, 1) -10%, rgba(182, 233, 152, 1) 100%)",
    },
    {
      right: 25,
      top: -12,
      background: "rgba(219, 242, 170, 1)",
      border: "1px solid rgba(118, 130, 153, 1)",
    },
  ],
};

export const tooltipItems = {
  tvl: [t`Total Value Deposited`],
  coin: ["DAI", "FRAX", "ETH", "LUSD", "BTC", "UST", "Other"],
  rfv: ["DAI", "FRAX", "LUSD", "UST"],
  holder: ["OHMies"],
  apy: ["APY"],
  runway: [t`Current`, "7.5K APY", "5K APY", "2.5K APY"],
  pol: [t`SLP Treasury`, t`Market SLP`],
};

export const tooltipInfoMessages = () => {
  return {
    tvl: t`Total Value Deposited, is the dollar amount of all OHM staked in the protocol. This metric is often used as growth or health indicator in DeFi projects.`,
    mvt: t`Market Value of Treasury Assets, is the sum of the value (in dollars) of all assets held by the treasury.`,
    rfv: t`Risk Free Value, is the amount of funds the treasury guarantees to use for backing OHM.`,
    pol: t`Protocol Owned Liquidity, is the amount of LP the treasury owns and controls. The more POL the better for the protocol and its users.`,
    holder: t`Holders, represents the total number of Ohmies (sOHM holders)`,
    staked: t`OHM Staked is the ratio of sOHM to circulating supply of OHM (staked vs total)`,
    apy: t`Annual Percentage Yield, is the normalized representation of an interest rate, based on a compounding period over one year. Note that APYs provided are rather ballpark level indicators and not so much precise future results.`,
    runway: t`Runway, is the number of days sOHM emissions can be sustained at a given rate. Lower APY = longer runway`,
  };
};

export const itemType = {
  dollar: "$",
  percentage: "%",
};
