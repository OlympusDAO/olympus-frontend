import { useQuery } from "@tanstack/react-query";
import { GOHM_ADDRESSES } from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { IERC20__factory } from "src/typechain";
import { useProvider } from "wagmi";

export const useGetCoolerBalance = ({ coolerAddress }: { coolerAddress?: string }) => {
  const provider = useProvider();
  const networks = useTestableNetworks();

  const { data, isFetched, isLoading } = useQuery(
    ["useGetCoolerBalance", coolerAddress],
    async () => {
      try {
        console.log("coolerAddress", coolerAddress);
        if (!coolerAddress) return new DecimalBigNumber("0", 18);
        const contract = IERC20__factory.connect(GOHM_ADDRESSES[networks.MAINNET], provider);
        console.log("beforeBalanceOf");
        const balance = await contract.balanceOf(coolerAddress);
        console.log("balance", balance.toString());

        return new DecimalBigNumber(balance, 18);
      } catch {
        return new DecimalBigNumber("0", 18);
      }
    },
    { enabled: !!coolerAddress },
  );
  return { data, isFetched, isLoading };
};
