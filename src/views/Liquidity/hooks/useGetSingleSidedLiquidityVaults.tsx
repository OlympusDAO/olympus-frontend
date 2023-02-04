import { useQuery } from "@tanstack/react-query";
import { formatUnits } from "ethers/lib/utils";
import { LIQUDITY_REGISTRY_CONTRACT } from "src/constants/contracts";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { OlympusSingleSidedLiquidityVault__factory } from "src/typechain";
import { IERC20__factory } from "src/typechain";

export const useGetSingleSidedLiquidityVaults = () => {
  const networks = useTestableNetworks();
  const contract = LIQUDITY_REGISTRY_CONTRACT.getEthersContract(networks.MAINNET);
  console.log(contract, "contract");
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
        const vaultInfo = await getVaultInfo(address, networks.MAINNET);
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
export const getVaultInfo = async (address: string, network: number) => {
  const provider = Providers.getStaticProvider(network);
  const contract = OlympusSingleSidedLiquidityVault__factory.connect(address, provider);
  const pairTokenAddress = await contract.pairToken();
  const pairTokenContract = IERC20__factory.connect(pairTokenAddress, provider);
  const pairTokenName = await pairTokenContract.symbol();
  const fee = formatUnits((await contract.FEE()).mul(100).div(await contract.PRECISION()));

  //TODO: Check decimals
  const depositedPairTokenBalance = await contract.pairTokenDeposits(address);
  const lpTokenBalance = formatUnits(await contract.lpPositions(address), 18);
  const limit = formatUnits(await contract.LIMIT(), 9); //will always be denominated in OHM
  const ohmMinted = formatUnits(await contract.ohmMinted(), 9);
  //TODO: Convert to USD
  const totalLpBalance = formatUnits(await contract.totalLP());

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
  };
};
