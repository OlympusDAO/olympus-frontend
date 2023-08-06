import { Providers } from "src/helpers/providers/Providers/Providers";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { Cooler__factory, CoolerFactory__factory } from "src/typechain";
import { useQuery, useSigner } from "wagmi";

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

  const { data, isFetched, isLoading } = useQuery(
    ["getCoolerLoans", networks.MAINNET],
    async () => {
      console.log("get the loan", signer, factoryAddress, walletAddress, collateralAddress, debtAddress);
      if (!walletAddress || !factoryAddress || !collateralAddress || !debtAddress || !signer) return [];
      console.log("ZZZ continue");
      const contract = CoolerFactory__factory.connect(factoryAddress, signer);
      console.log("AAA continue");

      console.log(walletAddress, collateralAddress, debtAddress, "cooler");
      const coolerAddress = await contract.callStatic.generateCooler(collateralAddress, debtAddress);
      console.log("cooler BBB", coolerAddress);
      const coolerContract = Cooler__factory.connect(coolerAddress, Providers.getStaticProvider(networks.MAINNET));
      console.log("cooler CCC", coolerContract);

      const loans = [];
      let loanId = 0;
      while (true) {
        try {
          const loanData = await coolerContract.loans(loanId);
          console.log("cooler DDD", loanId);
          loans.push({ ...loanData, loanId });
          loanId++;
        } catch (e) {
          break;
        }
      }

      return loans;
    },
    { enabled: !!walletAddress && !!factoryAddress && !!collateralAddress && !!debtAddress && !!signer },
  );
  return { data, isFetched, isLoading };
};
