import { useQuery } from "@tanstack/react-query";
import { LIQUDITY_REGISTRY_CONTRACT } from "src/constants/contracts";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { OlympusSingleSidedLiquidityVault__factory } from "src/typechain";
import { IERC20__factory } from "src/typechain";

export const useGetSingleSidedLiquidityVaults = () => {
  const networks = useTestableNetworks();
  const contract = LIQUDITY_REGISTRY_CONTRACT.getEthersContract(networks.MAINNET);
  const { data, isFetched, isLoading } = useQuery(["getSingleSidedLiquidityVaults", networks.MAINNET], async () => {
    //TODO: confirm decimals
    const activeVaultsCount = await (await contract.activeVaultCount()).toNumber();

    /* Returns an array of active Single Sided Liquidity Vault Addresses */
    const addresses = await Promise.all(
      Array(activeVaultsCount).map(async (value, position) => {
        const address = await contract.activeVaults(position);
        return address;
      }),
    );

    const data = await Promise.all(
      addresses.map(async address => {
        const vaultInfo = await getVaultInfo(address);
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
const getVaultInfo = async (address: string) => {
  //TODO: Add provider
  const contract = OlympusSingleSidedLiquidityVault__factory.connect(address, provider);
  const pairTokenAddress = await contract.pairToken();
  const pairTokenContract = IERC20__factory.connect(pairTokenAddress, provider);
  const pairTokenName = await pairTokenContract.name();
  const fee = await contract.FEE();

  //TODO: Check decimals
  const depositedPairTokenBalance = await contract.pairTokenDeposits(address);
  const lpTokenBalance = await contract.lpPositions(address);
  const limit = await contract.LIMIT();
  const ohmMinted = await contract.ohmMinted();
  //TODO: Convert to USD
  const totalLpBalance = await contract.totalLP();

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
