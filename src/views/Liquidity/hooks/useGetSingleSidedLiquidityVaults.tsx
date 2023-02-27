import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { LIQUDITY_REGISTRY_CONTRACT } from "src/constants/contracts";
import { OHM_TOKEN } from "src/constants/tokens";
import { formatNumber, testnetToMainnetContract } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { getCoingeckoPrice } from "src/helpers/pricing/getCoingeckoPrice";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { NetworkId } from "src/networkDetails";
import { OlympusSingleSidedLiquidityVault__factory } from "src/typechain";
import { IERC20__factory } from "src/typechain";
import { useAccount } from "wagmi";

export interface VaultInfo {
  pairTokenName: string;
  pairTokenAddress: string;
  depositedPairTokenBalance: ethers.BigNumber;
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
  const contract = OlympusSingleSidedLiquidityVault__factory.connect(address, provider);
  const pairTokenAddress = await contract.pairToken();
  const pairTokenContract = IERC20__factory.connect(pairTokenAddress, provider);
  const pairTokenName = await pairTokenContract.symbol();
  const fee = formatUnits((await contract.FEE()).mul(100).div(await contract.PRECISION()));
  const pricePerDepositToken = formatUnits(await contract.callStatic.getExpectedLPAmount("1000000000000000000"), 18); //price per deposit token
  const depositedPairTokenBalance = await contract.pairTokenDeposits(address);
  const lpTokenBalance = formatUnits(await contract.lpPositions(walletAddress), 18);
  const limit = formatUnits(await contract.LIMIT(), 9); //will always be denominated in OHM
  const ohmMinted = formatUnits(await contract.ohmMinted(), 9);
  //TODO: Convert to USD
  const totalLpBalance = formatUnits(await contract.totalLP());
  const lpBigNumber = await contract.totalLP();
  //Price per LP Token is 1 divided by the price per deposit token
  const pricePerLpToken = new DecimalBigNumber("1").div(new DecimalBigNumber(pricePerDepositToken));

  //mapping testnet addresses to mainnet so we can display tvl on testnet
  const usdPricePairToken = await getCoingeckoPrice(NetworkId.MAINNET, testnetToMainnetContract(pairTokenAddress));
  const usdPricePerPairToken = usdPricePairToken.mul(pricePerLpToken);
  const ohmPrice = await OHM_TOKEN.getPrice(NetworkId.MAINNET);
  const usdPricePerOhm = ohmPrice.mul(pricePerLpToken);
  const price = usdPricePerPairToken.add(usdPricePerOhm);
  const tvlUsd = price.mul(new DecimalBigNumber(lpBigNumber, 18)).toString();

  const externalRewardsTokens = await contract.getExternalRewardTokens();
  const externalRewards = await Promise.all(
    externalRewardsTokens.map(async (token, index) => {
      const tokenContract = IERC20__factory.connect(token.token, provider);
      const decimals = await tokenContract.decimals();
      const tokenName = await tokenContract.symbol();

      //TODO: this doesn't have a rewardsPerSecond yet...
      const rewardTokenPrice = await getCoingeckoPrice(network, testnetToMainnetContract(token.token));
      const rewardPerYear = new DecimalBigNumber("0");
      const rewardPerYearUsd = rewardPerYear.mul(rewardTokenPrice);
      const apy = rewardPerYearUsd.div(tvlUsd).mul("100").toString();
      const userRewards = formatUnits(await contract.externalRewardsForToken(index, walletAddress), decimals);
      return { tokenName, apy, userRewards };
    }),
  );
  const internalRewards = await contract.getInternalRewardTokens();
  const internalRewardsTokens = await Promise.all(
    internalRewards.map(async (token, index) => {
      const tokenContract = IERC20__factory.connect(token.token, provider);
      const decimals = await tokenContract.decimals();
      const tokenName = await tokenContract.symbol();
      const rewardTokenPrice = await getCoingeckoPrice(network, testnetToMainnetContract(token.token));
      const rewardPerYear = new DecimalBigNumber(token.rewardsPerSecond, decimals).mul("31536000");
      const rewardPerYearUsd = rewardPerYear.mul(rewardTokenPrice);
      const apy = rewardPerYearUsd.div(tvlUsd).mul("100").toString();
      const userRewards = formatUnits(await contract.internalRewardsForToken(index, walletAddress), decimals);
      return { tokenName, apy, userRewards };
    }),
  );
  const rewards = [...externalRewards, ...internalRewardsTokens];

  const apySum = rewards.reduce((a, b) => {
    return a + Number(b.apy);
  }, 0);

  return {
    pairTokenName,
    pairTokenAddress,
    depositedPairTokenBalance,
    lpTokenBalance,
    fee,
    limit,
    totalLpBalance,
    tvlUsd,
    vaultAddress: address,
    ohmMinted,
    rewards,
    pricePerDepositToken,
    totalApy: formatNumber(apySum, 2),
    usdPricePerToken: price.toString(),
  };
};
