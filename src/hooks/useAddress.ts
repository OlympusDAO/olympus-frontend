import { isAddress } from "@ethersproject/address";
import { useQuery } from "react-query";
import { useWeb3Context } from "./useWeb3Context";

export const useAddressKey = () => ["useAddress"];

export const useAddress = () => {
  const { provider, isConnected } = useWeb3Context();

  return useQuery<string, Error>(
    useAddressKey(),
    async () => {
      const address = await provider.getSigner().getAddress();

      if (!isAddress(address)) throw new Error("Invalid address");

      return address;
    },
    { enabled: isConnected },
  );
};
