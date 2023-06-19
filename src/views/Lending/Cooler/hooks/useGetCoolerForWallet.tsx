import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { CoolerFactory__factory } from "src/typechain";
import { useQuery, useSigner } from "wagmi";

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
  const networks = useTestableNetworks();
  const { data: signer } = useSigner();

  console.log(walletAddress, factoryAddress, collateralAddress, debtAddress, "cooler test");
  const { data, isFetched, isLoading } = useQuery(
    ["getCoolerForWallet"],
    async () => {
      if (!walletAddress || !factoryAddress || !collateralAddress || !debtAddress || !signer) return "";
      const contract = CoolerFactory__factory.connect(factoryAddress, signer);
      const address = await contract.callStatic.generate(collateralAddress, debtAddress);
      const isCreated = await contract.callStatic.created(address);
      console.log("cooler cooler", address);
      return isCreated ? address : "";
    },
    { enabled: !!walletAddress && !!factoryAddress && !!collateralAddress && !!debtAddress && !!signer },
  );
  return { data, isFetched, isLoading };
};
