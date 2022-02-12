export const convertMantissaToAPY = (mantissa: any, dayRange: number) => {
  return (Math.pow((mantissa / 1e18) * 6500 + 1, dayRange) - 1) * 100;
};

export const convertMantissaToAPR = (mantissa: any) => {
  return (mantissa * 2372500) / 1e16;
};

// for supply-side rewards apy:
// export const
// convertMantissaToAPY((rewardSupplySpeed * rewardEthPrice) / (totalSupply * underlyingEthPrice))

//  - CToken
// -

// for borrow-side rewards apy:
// convertMantissaToAPY((rewardBorrowSpeed * rewardEthPrice) / (totalBorrow * underlyingEthPrice))
