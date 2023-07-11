import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BigNumber, ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { LIQUDITY_REGISTRY_CONTRACT } from "src/constants/contracts";
import { OHM_TOKEN } from "src/constants/tokens";
import { formatNumber, testnetToMainnetContract } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { getCoingeckoPrice } from "src/helpers/pricing/getCoingeckoPrice";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { defillamaAPI } from "src/hooks/useGetLPStats";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { NetworkId } from "src/networkDetails";
import { BalancerV2Pool__factory, BLEVaultManagerLido__factory } from "src/typechain";
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
  apyBreakdown: {
    baseApy: string;
    rewardApy: string;
  };
}

export const useGetSingleSidedLiquidityVaults = () => {
  const networks = useTestableNetworks();
  const contract = LIQUDITY_REGISTRY_CONTRACT.getEthersContract(networks.MAINNET);
  const { address: walletAddress = "" } = useAccount();
  const { data, isFetched, isLoading } = useQuery(["getSingleSidedLiquidityVaults", networks.MAINNET], async () => {
    const activeVaultsCount = (await contract.activeVaultCount()).toNumber();

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
  const fee = formatUnits((await contract.currentFee()) || "0", 4);
  const pricePerDepositToken = await contract.callStatic.getExpectedLpAmount("1000000000000000000"); //price per deposit token
  const balancerPoolAddress = await contract.balancerData();
  const balancerContract = BalancerV2Pool__factory.connect(balancerPoolAddress.liquidityPool, provider);

  const lpTokenBalance = formatUnits(await contract.getLpBalance(walletAddress).catch(() => BigNumber.from("0")), 18);
  const canWithdraw = await contract.canWithdraw(walletAddress).catch(() => false);

  const limit = formatUnits(await contract.ohmLimit(), 9); //will always be denominated in OHM

  const ohmMinted = formatUnits((await contract.getOhmSupplyChangeData()).mintedOhm, 9);

  const totalLp = await contract.totalLp();
  const totalBalancerLp = await balancerContract.totalSupply();

  const rewardTokens = ((await contract.getRewardTokens()) || []).filter(
    token => token !== ethers.constants.AddressZero,
  ); //temp filter to remove the current vault

  const outstandingRewards = await contract.getOutstandingRewards(walletAddress).catch(() => []);

  const { tvlUsd, price, ohmPricePerDepositToken } = await getVaultPriceData({
    totalLp,
    pairTokenAddress,
    pricePerDepositToken,
  });

  let apySum = 0;
  let rewards: { tokenName: string; apy: string; userRewards: string }[];
  let apyBreakdown = { baseApy: 0, rewardApy: 0 };
  const apyData = await axios.get<defillamaAPI>("https://yields.llama.fi/pools").then(res => {
    return res.data;
  });

  //Need to do this because contract method does not account for stETH rewards.
  if (address.toLowerCase() === "0xafe729d57d2CC58978C2e01b4EC39C47FB7C4b23".toLowerCase()) {
    const pool = apyData.data.find(pool => pool.pool === "10c1698f-bc44-4fbf-8287-2540acf45eff") || {
      apyReward: 0,
      apyBase: 0,
    };
    const { apyReward = 0, apyBase = 0 } = pool;
    apySum = apyReward + apyBase;

    rewards = await Promise.all(
      rewardTokens.map(async (token, index) => {
        const tokenContract = IERC20__factory.connect(token, provider);
        const decimals = await tokenContract.decimals();
        const tokenName = await tokenContract.symbol();
        const balance =
          outstandingRewards.find(address => address.rewardToken === token)?.outstandingRewards || BigNumber.from("0");

        const userRewards = formatUnits(balance, decimals);
        return { tokenName, apy: "0", userRewards };
      }),
    );
    apyBreakdown = { baseApy: apyBase, rewardApy: apyReward };
  } else if (address.toLowerCase() === "0xF451c45C7a26e2248a0EA02382579Eb4858cAdA1".toLowerCase()) {
    const pool = apyData.data.find(pool => pool.pool === "b2ef1e2c-722c-4804-978d-4ce0b7316e8e") || {
      apyReward: 0,
      apyBase: 0,
    };

    const { apyReward = 0, apyBase = 0 } = pool;
    apySum = apyReward + apyBase;

    rewards = await Promise.all(
      rewardTokens.map(async (token, index) => {
        const tokenContract = IERC20__factory.connect(token, provider);
        const decimals = await tokenContract.decimals();
        const tokenName = await tokenContract.symbol();
        const balance =
          outstandingRewards.find(address => address.rewardToken === token)?.outstandingRewards || BigNumber.from("0");

        const userRewards = formatUnits(balance, decimals);
        return { tokenName, apy: "0", userRewards };
      }),
    );
    apyBreakdown = { baseApy: apyBase, rewardApy: apyReward };
  } else {
    const { tvlUsd: balancerTvl } = await getVaultPriceData({
      totalLp: totalBalancerLp,
      pairTokenAddress,
      pricePerDepositToken,
    });
    // Iterate through each reward token to retrieve info
    rewards = await Promise.all(
      rewardTokens.map(async (token, index) => {
        const tokenContract = IERC20__factory.connect(token, provider);
        const decimals = await tokenContract.decimals();
        const tokenName = await tokenContract.symbol();
        const rewardTokenPrice = await getCoingeckoPrice(network, testnetToMainnetContract(token)).catch(
          () => new DecimalBigNumber("0"),
        );
        const rewardsPerSecond = await contract.getRewardRate(token);
        const rewardPerYear = new DecimalBigNumber(rewardsPerSecond, decimals).mul("31536000");
        const rewardPerYearUsd = rewardPerYear.mul(rewardTokenPrice);
        const rewardFee = rewardPerYearUsd.mul(fee);
        const rewardsLessFee = rewardPerYearUsd.sub(rewardFee);
        const apy = rewardsLessFee
          .div(new DecimalBigNumber(+balancerTvl > 0 ? balancerTvl : "1"))
          .mul(new DecimalBigNumber("100"))
          .toString();
        const balance =
          outstandingRewards.find(address => address.rewardToken === token)?.outstandingRewards || BigNumber.from("0");

        const userRewards = formatUnits(balance, decimals);
        return { tokenName, apy, userRewards };
      }),
    );
    apySum = rewards.reduce((a, b) => {
      return a + Number(b.apy);
    }, 0);
    apyBreakdown = { baseApy: 0, rewardApy: apySum };
  }

  const depositLimit = await contract.getMaxDeposit();

  return {
    pairTokenName,
    pairTokenAddress,
    lpTokenBalance,
    canWithdraw,
    fee,
    limit,
    totalLpBalance: formatUnits(totalLp),
    tvlUsd,
    vaultAddress: address,
    ohmMinted,
    rewards,
    pricePerDepositToken: formatUnits(pricePerDepositToken, 18),
    totalApy: formatNumber(apySum, 2),
    apyBreakdown,
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
