// import apollo from "../../lib/apolloClient";

// TODO: add paramaterization for testnet/mainnet pool ids
export const poolDataQuery = `
query {
  prizePool(id: "0x60bc094cb0c966e60ed3be0549e92f3bc572e9f8") {
    id
    owner
    deactivated
    currentPrizeId
    currentState
    cumulativePrizeGross
    cumulativePrizeNet
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
