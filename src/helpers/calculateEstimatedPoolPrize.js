import { ethers } from "ethers";
import { BLOCK_RATE_SECONDS } from "../constants";

const bn = ethers.BigNumber.from;

export function calculateEstimatedPoolPrize({
  awardBalance,
  poolTotalSupply,
  supplyRatePerBlock,
  prizePeriodRemainingSeconds,
}) {
  awardBalance = awardBalance || bn(0);
  poolTotalSupply = poolTotalSupply || bn(0);

  const supplyRatePerBlockBN = supplyRatePerBlock || bn(0);

  const prizePeriodRemainingSecondsBN = bn(prizePeriodRemainingSeconds || 0).div(BLOCK_RATE_SECONDS);

  const additionalYield = poolTotalSupply
    .mul(supplyRatePerBlockBN)
    .mul(prizePeriodRemainingSecondsBN)
    .div(ethers.constants.WeiPerEther);

  const estimatedPrizeBN = additionalYield.add(awardBalance);

  return estimatedPrizeBN;
}
