import apollo from "../../lib/apolloClient";

// TODO: add paramaterization
export const treasuryDataQuery = `
query {
  protocolMetrics(first: 90, orderBy: timestamp, orderDirection: desc) {
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
    currentAPY
    runway10k
    runway20k
    runway50k
    runway70k
    runway100k
    runwayCurrent
  }
}
`;

export const treasuryData = () => {
  const graphData = apollo(treasuryDataQuery);
  return graphData.data.protocolMetrics;
};

export default treasuryData;
