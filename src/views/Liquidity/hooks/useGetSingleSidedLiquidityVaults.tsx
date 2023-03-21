import { useQuery } from "@tanstack/react-query";
import { BigNumber, ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { LIQUDITY_REGISTRY_CONTRACT } from "src/constants/contracts";
import { OHM_TOKEN } from "src/constants/tokens";
import { formatNumber, testnetToMainnetContract } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { getCoingeckoPrice } from "src/helpers/pricing/getCoingeckoPrice";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { NetworkId } from "src/networkDetails";
import { BLEVaultManagerLido__factory } from "src/typechain";
import { IERC20__factory } from "src/typechain";
import { useAccount } from "wagmi";

export interface VaultInfo {
  pairTokenName: string;
  pairTokenAddress: string;
  lpTokenBalance: string;
  fee: string;
  limit: string;
  totalLpBalance: string;
  vaultAddress: string;
  ohmMinted: string;
  rewards: {
    tokenName: string;
    apy: string;
    userRewards: string;
  }[];
  pricePerDepositToken: string;
  tvlUsd: string;
  totalApy: string;
  usdPricePerToken: string;
}

export const useGetSingleSidedLiquidityVaults = () => {
  const networks = useTestableNetworks();
  const contract = LIQUDITY_REGISTRY_CONTRACT.getEthersContract(networks.MAINNET);
  const { address: walletAddress = "" } = useAccount();
  const { data, isFetched, isLoading } = useQuery(["getSingleSidedLiquidityVaults", networks.MAINNET], async () => {
    const activeVaultsCount = (await contract.activeVaultCount()).toNumber();
    console.log("activeVaultsCount", activeVaultsCount);
    /* Returns an array of active Single Sided Liquidity Vault Addresses */
    /* we only care about the count, so we can fill an array with 0s and map over it */
    const countArray = Array(activeVaultsCount).fill(0);
    const addresses = await Promise.all(
      countArray.map(async (value, position) => {
        const address = await contract.activeVaults(position);
        return address;
      }),
    );

    const data = await Promise.all(
      addresses.map(async address => {
        const vaultInfo = await getVaultInfo(address, networks.MAINNET, walletAddress);
        return vaultInfo;
      }),
    );

    return data;
  });
  return { data, isFetched, isLoading };
};

/*
    Retrieves all required information for a specific vault
    TODO: Add provider, check decimals, convert lp balance to USD, add rewards
 */
export const getVaultInfo = async (address: string, network: number, walletAddress: string) => {
  const provider = Providers.getStaticProvider(network);
  const contract = BLEVaultManagerLido__factory.connect(address, provider);
  const pairTokenAddress = await contract.pairToken();
  const pairTokenContract = IERC20__factory.connect(pairTokenAddress, provider);
  const pairTokenName = await pairTokenContract.symbol();
  const fee = formatUnits((await contract.currentFee()).mul(100).mul(10000));
  const pricePerDepositToken = await contract.callStatic.getExpectedLpAmount("1000000000000000000"); //price per deposit token

  const lpTokenBalance = formatUnits(await contract.getLpBalance(walletAddress).catch(() => BigNumber.from("0")), 18);

  const limit = formatUnits(await contract.ohmLimit(), 9); //will always be denominated in OHM

  const ohmMinted = formatUnits((await contract.getOhmSupplyChangeData()).deployedOhm, 9);

  const totalLp = await contract.totalLp();

  const rewardTokens = (await contract.getRewardTokens()).filter(token => token !== ethers.constants.AddressZero); //temp filter to remove the current vault

  const outstandingRewards = await contract.getOutstandingRewards(walletAddress).catch(() => []);

  const { tvlUsd, price, ohmPricePerDepositToken } = await getVaultPriceData({
    totalLp,
    pairTokenAddress,
    pricePerDepositToken,
  });
  console.log(tvlUsd, "tvlUsd");
  // Iterate through each reward token to retrieve info
  const rewards = await Promise.all(
    rewardTokens.map(async (token, index) => {
      const tokenContract = IERC20__factory.connect(token, provider);
      const decimals = await tokenContract.decimals();
      console.log(decimals, "decimals");
      const tokenName = await tokenContract.symbol();
      const rewardTokenPrice = await getCoingeckoPrice(network, testnetToMainnetContract(token)).catch(
        () => new DecimalBigNumber("0"),
      );
      console.log(rewardTokenPrice, "rewardTokenPrice");
      const rewardsPerSecond = await contract.getRewardRate(token);
      const rewardPerYear = new DecimalBigNumber(rewardsPerSecond, decimals).mul("31536000");
      const rewardPerYearUsd = rewardPerYear.mul(rewardTokenPrice);
      const apy = rewardPerYearUsd
        .div(new DecimalBigNumber(+tvlUsd > 0 ? tvlUsd : "1"))
        .mul(new DecimalBigNumber("100"))
        .toString();
      const balance =
        outstandingRewards.find(address => address.rewardToken === token)?.outstandingRewards || BigNumber.from("0");

      console.log(balance, "balancer");
      const userRewards = formatUnits(balance, decimals);
      console.log("userRewards", tokenName);
      return { tokenName, apy, userRewards };
    }),
  );

  console.log("test");

  const depositLimit = await contract.getMaxDeposit();

  const apySum = rewards.reduce((a, b) => {
    return a + Number(b.apy);
  }, 0);
  console.log(apySum, "apySum");

  return {
    pairTokenName,
    pairTokenAddress,
    lpTokenBalance,
    fee,
    limit,
    totalLpBalance: formatUnits(totalLp),
    tvlUsd,
    vaultAddress: address,
    ohmMinted,
    rewards,
    pricePerDepositToken: formatUnits(pricePerDepositToken, 18),
    totalApy: formatNumber(apySum, 2),
    usdPricePerToken: price.toString(),
    ohmPricePerDepositToken: ohmPricePerDepositToken,
    depositLimit: formatUnits(depositLimit, 18),
  };
};

/**
 * Calculates the TVL of a vault.
 */
export const getVaultPriceData = async ({
  pricePerDepositToken,
  pairTokenAddress,
  totalLp,
}: {
  pricePerDepositToken: BigNumber;
  pairTokenAddress: string;
  totalLp: BigNumber;
}) => {
  //Price per LP Token is 1 divided by the price per deposit token
  const depositPricePerLpToken = new DecimalBigNumber("1").div(new DecimalBigNumber(pricePerDepositToken, 18));

  //mapping testnet addresses to mainnet so we can display tvl on testnet
  const usdPriceDepositToken = await getCoingeckoPrice(
    NetworkId.MAINNET,
    testnetToMainnetContract(pairTokenAddress),
  ).catch(e => new DecimalBigNumber("0"));
  const usdPricePerDepositToken = usdPriceDepositToken.mul(depositPricePerLpToken);
  const ohmPrice = await OHM_TOKEN.getPrice(NetworkId.MAINNET);
  const ohmPricePerDepositToken = usdPriceDepositToken.div(ohmPrice);
  const usdPricePerOhm = ohmPrice.mul(ohmPricePerDepositToken).mul(depositPricePerLpToken);
  const price = usdPricePerDepositToken.add(usdPricePerOhm);
  const tvlUsd = price.mul(new DecimalBigNumber(totalLp, 18)).toString({ decimals: 2 });
  return { price, tvlUsd, ohmPricePerDepositToken };
};
