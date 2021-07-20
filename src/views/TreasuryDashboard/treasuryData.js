import apollo from "../../lib/apolloClient";

// TODO: add paramaterization
export const treasuryDataQuery = `
query {
  protocolMetrics(first: 90, orderBy: timestamp, orderDirection: desc) {
    id
    timestamp
    ohmCirculatingSupply
    sOhmCirculatingSupply
    totalSupply
    ohmPrice
    marketCap
    totalValueLocked
    totalOHMstaked
    treasuryRiskFreeValue
    treasuryMarketValue
    nextEpochRebase
    nextDistributedOhm
    treasuryDaiRiskFreeValue
    treasuryFraxMarketValue
    treasuryDaiMarketValue
    treasuryFraxMarketValue
    treasuryXsushiMarketValue
    currentAPY
    runway10k
    runway20k
    runway50k
    runwayCurrent
    holders
  }
}
`;

export const treasuryData = () => apollo(treasuryDataQuery).then(r => r.data.protocolMetrics);

// export default treasuryData;
