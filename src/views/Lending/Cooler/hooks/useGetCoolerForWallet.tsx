import { useQuery } from "@tanstack/react-query";
import { CoolerFactory__factory } from "src/typechain";
import { useSigner } from "wagmi";

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
    ["getCoolerForWallet"],
    async () => {
      if (!walletAddress || !factoryAddress || !collateralAddress || !debtAddress || !signer) return "";
      const contract = CoolerFactory__factory.connect(factoryAddress, signer);
      const address = await contract.callStatic.generateCooler(collateralAddress, debtAddress);
      const isCreated = await contract.callStatic.created(address);
      return isCreated ? address : "";
    },
    { enabled: !!walletAddress && !!factoryAddress && !!collateralAddress && !!debtAddress && !!signer },
  );
  return { data, isFetched, isLoading };
};
