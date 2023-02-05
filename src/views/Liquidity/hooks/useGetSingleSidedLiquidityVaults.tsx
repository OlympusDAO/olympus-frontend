import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { LIQUDITY_REGISTRY_CONTRACT } from "src/constants/contracts";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
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
    accumulatedRewardsPerShare: string;
    userRewards: string;
  }[];
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

  //TODO: Check decimals
  const depositedPairTokenBalance = await contract.pairTokenDeposits(address);
  const lpTokenBalance = formatUnits(await contract.lpPositions(walletAddress), 18);
  console.log(lpTokenBalance, "lpTokenBalance");
  const limit = formatUnits(await contract.LIMIT(), 9); //will always be denominated in OHM
  const ohmMinted = formatUnits(await contract.ohmMinted(), 9);
  //TODO: Convert to USD
  const totalLpBalance = formatUnits(await contract.totalLP());
  const externalRewardsTokens = await contract.getExternalRewardTokens();
  const externalRewards = await Promise.all(
    externalRewardsTokens.map(async (token, index) => {
      const tokenContract = IERC20__factory.connect(token.token, provider);
      const decimals = await tokenContract.decimals();
      const tokenName = await tokenContract.symbol();
      const accumulatedRewardsPerShare = formatUnits(token.accumulatedRewardsPerShare, decimals);
      const userRewards = formatUnits(await contract.externalRewardsForToken(index, walletAddress), decimals);
      return { tokenName, accumulatedRewardsPerShare, userRewards };
    }),
  );
  const internalRewards = await contract.getInternalRewardTokens();
  const internalRewardsTokens = await Promise.all(
    internalRewards.map(async (token, index) => {
      const tokenContract = IERC20__factory.connect(token.token, provider);
      const decimals = await tokenContract.decimals();
      const tokenName = await tokenContract.symbol();
      const accumulatedRewardsPerShare = formatUnits(token.accumulatedRewardsPerShare, decimals);
      const userRewards = formatUnits(await contract.internalRewardsForToken(index, walletAddress), decimals);
      return { tokenName, accumulatedRewardsPerShare, userRewards };
    }),
  );
  const rewards = [...externalRewards, ...internalRewardsTokens];
  return {
    pairTokenName,
    pairTokenAddress,
    depositedPairTokenBalance,
    lpTokenBalance,
    fee,
    limit,
    totalLpBalance,
    vaultAddress: address,
    ohmMinted,
    rewards,
  };
};
