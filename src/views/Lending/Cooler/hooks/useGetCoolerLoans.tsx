import { useQuery } from "@tanstack/react-query";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { Cooler__factory, CoolerFactory__factory, IERC20__factory } from "src/typechain";
import { useSigner } from "wagmi";

export const useGetCoolerLoans = ({
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

  const { data, isFetched, isLoading, isFetching } = useQuery(
    ["getCoolerLoans", networks.MAINNET, factoryAddress, collateralAddress, debtAddress, walletAddress],
    async () => {
      try {
        if (!walletAddress || !factoryAddress || !collateralAddress || !debtAddress || !signer) return [];
        const contract = CoolerFactory__factory.connect(factoryAddress, signer);
        const debtContract = IERC20__factory.connect(debtAddress, Providers.getStaticProvider(networks.MAINNET));
        const debtAssetName = await debtContract.symbol();
        const coolerAddress = await contract.callStatic.generateCooler(collateralAddress, debtAddress);
        const coolerContract = Cooler__factory.connect(coolerAddress, Providers.getStaticProvider(networks.MAINNET));

        const loans = [];
        let loanId = 0;
        while (true) {
          try {
            const loanData = await coolerContract.loans(loanId);
            // const newCollateralAmount = await coolerContract.newCollateralFor(loanId);
            loans.push({ ...loanData, loanId, debtAssetName });
            loanId++;
          } catch (e) {
            break;
          }
        }

        return loans.filter(loan => !loan.collateral.isZero() && !loan.principal.isZero());
      } catch (e) {
        return [];
      }
    },
    { enabled: !!walletAddress && !!factoryAddress && !!collateralAddress && !!debtAddress && !!signer },
  );
  return { data, isFetched, isLoading, isFetching };
};
