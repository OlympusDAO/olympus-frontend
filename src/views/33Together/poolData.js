// import apollo from "../../lib/apolloClient";

// TODO: add paramaterization for testnet/mainnet pool ids
// PT_PRIZE_POOL_ADDRESS
// "0x60bc094cb0c966e60ed3be0549e92f3bc572e9f8"
// 0xf9081132864ed5e4980cfae83bdb122d86619281 -> rinkeby
// 0xeab695a8f5a44f583003a8bc97d677880d528248 -> mainnet
export const poolDataQuery = `
query {
  prizePool(id: "0xeab695a8f5a44f583003a8bc97d677880d528248") {
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
