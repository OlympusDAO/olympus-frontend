import { useQuery } from "@tanstack/react-query";
import { Cooler__factory, CoolerFactory__factory } from "src/typechain";
import { useSigner } from "wagmi";

/**
 * returns a cooler for a collateral & debt address
 * - not actually dependent on a wallet address
 */
export const useGetCoolerForWallet = ({
  walletAddress,
  factoryAddress,
  collateralAddress,
  debtAddress,
}: {
  walletAddress?: string;
  factoryAddress?: string;
  collateralAddress?: string;
  debtAddress?: string;
}) => {
  const { data: signer } = useSigner();

  const { data, isFetched, isLoading } = useQuery(
    ["getCoolerForWallet", factoryAddress, collateralAddress, debtAddress],
    async () => {
      if (!walletAddress || !factoryAddress || !collateralAddress || !debtAddress || !signer) return "";
      try {
        const contract = CoolerFactory__factory.connect(factoryAddress, signer);
        const address = await contract.callStatic.generateCooler(collateralAddress, debtAddress);
        const isCreated = await contract.callStatic.created(address);
        const cooler = Cooler__factory.connect(address, signer);
        const coolerOwner = await cooler.owner();
        const ownerAddress = await signer.getAddress();
        return isCreated && ownerAddress === coolerOwner ? address : "";
      } catch {
        return "";
      }
    },
    { enabled: !!walletAddress && !!factoryAddress && !!collateralAddress && !!debtAddress && !!signer },
  );
  return { data, isFetched, isLoading };
};
