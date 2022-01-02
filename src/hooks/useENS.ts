import { ethers } from "ethers";
import { useQuery } from "react-query";
import { queryAssertion } from "src/helpers";
import { useAddress } from "./useAddress";
import { useWeb3Context } from "./useWeb3Context";

export const useENS = () => {
  const { data: address } = useAddress();
  const { provider, isConnected } = useWeb3Context();

  return useQuery<{ name?: string; avatar?: string }, Error>({
    enabled: isConnected && !!address,
    queryKey: [address, "ens"],
    queryFn: async () => {
      queryAssertion(isConnected && address);

      // (sam-potter)
      // @TODO Possibly make this an invariant of the useAddress query
      if (!ethers.utils.isAddress(address)) throw new Error("Invalid address");

      const name = (await provider.lookupAddress(address)) ?? undefined;

      let avatar: string | undefined;
      if (name) avatar = (await provider.getAvatar(name)) ?? undefined;

      return { name, avatar };
    },
    onError: error => {
      console.log("Unable to fetch ENS address");
      console.error(error);
    },
  });
};
