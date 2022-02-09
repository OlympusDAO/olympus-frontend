export const goOhmDepositExchangeRate = (gOhmExchangeRate: number, index?: number, ohmPrice?: number) => {
  if (gOhmExchangeRate && index && ohmPrice) {
    return (gOhmExchangeRate * 1e17) / (index * ohmPrice);
  }
  return 0;
};

export const allowRedemtionChoice = (exchangeRateOne: number, exchangeRateTwo: number, depositedBalance?: number) => {
  if (exchangeRateOne > 0 && exchangeRateTwo > 0 && !depositedBalance) {
    return true;
  }
  return false;
};

export const redemptionToken = (check?: number) => {
  return check ? "gOHM" : "DAI";
};

export const disableDepositButton = (
  depositQuantity: number,
  escrowState?: number,
  balance?: number,
  isLoading?: boolean,
) => {
  if (!balance || escrowState === 1 || depositQuantity > balance || !depositQuantity || isLoading) {
    return true;
  }
  return false;
};

export const disableRedeemButton = (
  didRedeem?: boolean,
  escrowState?: number,
  depositedBalance?: number,
  isLoading?: boolean,
) => {
  if (!depositedBalance || escrowState === 0 || didRedeem === true || isLoading) {
    return true;
  }
  return false;
};

export const redeemMessage = (escrowState?: number) => {
  if (escrowState === 1) {
    return "The offer has not been accepted by the founders. Withdraw your tokens below.";
  } else if (escrowState === 2) {
    return "The offer has been accepted by the founders. Redeem your tokens below.";
  }
};
