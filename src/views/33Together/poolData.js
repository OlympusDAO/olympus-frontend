// import apollo from "../../lib/apolloClient";

import { isAddress } from "@ethersproject/address";

// TODO: add paramaterization for testnet/mainnet pool ids
export const poolDataQuery = address => {
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
      prizes {
        id
        prizePeriodStartedTimestamp
        lockBlock
        awardedBlock
        awardedTimestamp
      }
      tokenCreditBalances {
        id
        balance
        timestamp
        initialized
      }
      controlledTokens {
        id
        name
        totalSupply
        numberOfHolders
      }
    }
    sablierStreams(first: 5) {
      id
      prizePool {
        id
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

// for if we want to have multiple discrete queries
export const otherPoolDataQuery = `
query {
  
}
`;
