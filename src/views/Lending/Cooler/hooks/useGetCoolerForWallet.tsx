import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { Cooler__factory, CoolerFactory__factory, CoolerFactoryV2__factory } from "src/typechain";
import { useSigner } from "wagmi";

export const useGetCoolerForWallet = ({
  walletAddress,
  factoryAddress,
  collateralAddress,
  debtAddress,
  clearingHouseVersion,
}: {
  walletAddress?: string;
  factoryAddress?: string;
  collateralAddress?: string;
  debtAddress?: string;
  clearingHouseVersion: string;
}) => {
  const { data: signer } = useSigner();

  const { data, isFetched, isLoading } = useQuery(
    ["getCoolerForWallet", factoryAddress, collateralAddress, debtAddress, walletAddress, clearingHouseVersion],
    async () => {
      if (!walletAddress || !factoryAddress || !collateralAddress || !debtAddress || !signer) return "";
      try {
        if (clearingHouseVersion === "clearingHouseV1") {
          const contract = CoolerFactory__factory.connect(factoryAddress, signer);
          const address = await contract.callStatic.generateCooler(collateralAddress, debtAddress);
          const isCreated = await contract.callStatic.created(address);
          const cooler = Cooler__factory.connect(address, signer);
          const coolerOwner = await cooler.owner();
          return isCreated && walletAddress === coolerOwner ? address : "";
        } else {
          const contract = CoolerFactoryV2__factory.connect(factoryAddress, signer);
          const address = await contract.getCoolerFor(walletAddress, collateralAddress, debtAddress);
          const isCreated = await contract.created(address);
          return isCreated && address && address !== ethers.constants.AddressZero ? address : "";
        }
      } catch {
        return "";
      }
    },
    { enabled: !!walletAddress && !!factoryAddress && !!collateralAddress && !!debtAddress && !!signer },
  );
  return { data, isFetched, isLoading };
};
