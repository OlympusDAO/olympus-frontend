// import apollo from "../../lib/apolloClient";

// Graph Explorer: https://thegraph.com/hosted-service/subgraph/pooltogether/rinkeby-v3_4_3
export const poolDataQuery = (address: string) => {
  return `
  query {
    prizePool(id: "${address.toLowerCase()}") {
      id
      owner
      deactivated
      currentPrizeId
      currentState
      cumulativePrizeGross
      cumulativePrizeNet
      cumulativePrizeReserveFee
      liquidityCap
      prizeStrategy {
        multipleWinners {
          numberOfWinners
          prizePeriodSeconds
          prizePeriodStartedAt
          prizePeriodEndAt
          externalErc20Awards {
            name
            symbol
            decimals
            balanceAwarded
          }
        }
      }
      controlledTokens {
        id
        name
        totalSupply
        numberOfHolders
      }
    }
  }
  `;
};

export const poolTimeQuery = `
query {
  prizeStrategy(id: "0xeeb552c4d5e155e50ee3f7402ed379bf72e36f23") {
    multipleWinners {
      numberOfWinners
      prizePeriodSeconds
      prizePeriodStartedAt
      prizePeriodEndAt
      externalErc20Awards {
        name
        symbol
        decimals
        balanceAwarded
      }
    }
  }
}`;

/**
 * returns a Graph Query string for prizePool Award History for a given user.
 * @param {*} poolAddress
 * @param {*} userAddress
 * @param {*} tokenAddress
 * @returns string
 */
export const yourAwardsQuery = (poolAddress: string, userAddress: string, tokenAddress: string) => {
  let query = `
  query {
      prizePool(id: "${poolAddress.toLowerCase()}") {
        prizes (where:{
          awardedOperator: "${userAddress.toLowerCase()}"
        }){
          id
          awardedOperator
          awardedControlledTokens (where:{
            token: "${tokenAddress.toLowerCase()}"
          }) {
            amount
          }
          prizePeriodStartedTimestamp
          awardedBlock
          awardedTimestamp
        }
    }
  }
  `;
  return query;
};
