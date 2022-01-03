import { useQuery } from "react-query";
import { useWeb3Context } from "./useWeb3Context";

export const useAddressKey = () => ["useAddress"];

export const useAddress = () => {
  const { provider, isConnected } = useWeb3Context();

  return useQuery<string, Error>(
    useAddressKey(),
    () => {
      return provider.getSigner().getAddress();
    },
    { enabled: isConnected },
  );
};
